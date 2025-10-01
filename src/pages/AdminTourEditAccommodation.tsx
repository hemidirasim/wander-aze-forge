import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Save,
  ArrowLeft,
  Bed,
  Utensils
} from 'lucide-react';

interface Tour {
  id: number;
  title: string;
  accommodation_details?: string;
  meals_details?: string;
  water_snacks_details?: string;
}

const AdminTourEditAccommodation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    accommodationDetails: '',
    mealsDetails: '',
    waterSnacksDetails: ''
  });

  useEffect(() => {
    if (id) {
      fetchTour();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tours/${id}`);
      const data = await response.json();

      if (data.success) {
        const tourData = data.data;
        setTour(tourData);
        setFormData({
          accommodationDetails: tourData.accommodation_details || '',
          mealsDetails: tourData.meals_details || '',
          waterSnacksDetails: tourData.water_snacks_details || ''
        });
        
        console.log('Loaded accommodation data:', {
          accommodationDetails: tourData.accommodation_details,
          mealsDetails: tourData.meals_details,
          waterSnacksDetails: tourData.water_snacks_details
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load tour details",
          variant: "destructive"
        });
        navigate(`/admin/tours/${id}/manage`);
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
      toast({
        title: "Error",
        description: "Failed to load tour details",
        variant: "destructive"
      });
      navigate(`/admin/tours/${id}/manage`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tours/${id}/update-accommodation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Accommodation Updated Successfully!",
          description: "Tour accommodation information has been updated.",
        });
        
        navigate(`/admin/tours/${id}/manage`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update accommodation",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating accommodation:', error);
      toast({
        title: "Error",
        description: "Failed to update accommodation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tour Not Found</h1>
            <p className="text-muted-foreground mb-6">The tour you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/admin/tours')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/tours/${id}/manage`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tour Management
              </Button>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Accommodation & Meals</h1>
            <p className="text-muted-foreground">Manage accommodation and meal details for {tour.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Accommodation Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-primary" />
                  Accommodation Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe accommodation arrangements for the tour
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accommodationDetails">Accommodation Information</Label>
                  <Textarea
                    id="accommodationDetails"
                    value={formData.accommodationDetails}
                    onChange={(e) => handleInputChange('accommodationDetails', e.target.value)}
                    placeholder="Describe accommodation type, location, facilities, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Meals Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  Meals Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe meal arrangements and dining options
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mealsDetails">Meal Information</Label>
                  <Textarea
                    id="mealsDetails"
                    value={formData.mealsDetails}
                    onChange={(e) => handleInputChange('mealsDetails', e.target.value)}
                    placeholder="Describe meal types, dining arrangements, special dietary options, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Water & Snacks Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  Water & Snacks
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe water and snack provisions during the tour
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="waterSnacksDetails">Water & Snacks Information</Label>
                  <Textarea
                    id="waterSnacksDetails"
                    value={formData.waterSnacksDetails}
                    onChange={(e) => handleInputChange('waterSnacksDetails', e.target.value)}
                    placeholder="Describe water provisions, snacks provided, refreshment stops, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/admin/tours/${id}/manage`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Updating Accommodation...' : 'Update Accommodation'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTourEditAccommodation;
