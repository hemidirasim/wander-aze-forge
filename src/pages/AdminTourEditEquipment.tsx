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
  Plus,
  X,
  Shield,
  CheckCircle
} from 'lucide-react';

interface Tour {
  id: number;
  title: string;
  provided_equipment?: string[];
  what_to_bring?: string[];
}

const AdminTourEditEquipment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    providedEquipment: [] as string[],
    whatToBring: [] as string[]
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
        
        // Parse JSON strings if they exist
        let providedEquipment = [];
        let whatToBring = [];
        
        if (tourData.provided_equipment) {
          try {
            providedEquipment = typeof tourData.provided_equipment === 'string' 
              ? JSON.parse(tourData.provided_equipment) 
              : tourData.provided_equipment;
          } catch (e) {
            console.log('Error parsing provided_equipment:', e);
            providedEquipment = [];
          }
        }
        
        if (tourData.what_to_bring) {
          try {
            whatToBring = typeof tourData.what_to_bring === 'string' 
              ? JSON.parse(tourData.what_to_bring) 
              : tourData.what_to_bring;
          } catch (e) {
            console.log('Error parsing what_to_bring:', e);
            whatToBring = [];
          }
        }
        
        setFormData({
          providedEquipment: providedEquipment,
          whatToBring: whatToBring
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

  const addArrayItem = (field: 'providedEquipment' | 'whatToBring') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'providedEquipment' | 'whatToBring', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'providedEquipment' | 'whatToBring', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tours/${id}/update-equipment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Equipment Updated Successfully!",
          description: "Tour equipment information has been updated.",
        });
        
        navigate(`/admin/tours/${id}/manage`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update equipment",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Error",
        description: "Failed to update equipment",
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
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Equipment & Gear</h1>
            <p className="text-muted-foreground">Manage equipment and gear information for {tour.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Provided Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Provided Equipment
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  List all equipment that will be provided to participants
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.providedEquipment.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateArrayItem('providedEquipment', index, e.target.value)}
                      placeholder="Enter equipment item"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('providedEquipment', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('providedEquipment')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Equipment Item
                </Button>
              </CardContent>
            </Card>

            {/* What to Bring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  What to Bring
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  List items that participants should bring themselves
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.whatToBring.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateArrayItem('whatToBring', index, e.target.value)}
                      placeholder="Enter item to bring"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('whatToBring', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('whatToBring')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item to Bring
                </Button>
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
                {isSubmitting ? 'Updating Equipment...' : 'Update Equipment'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTourEditEquipment;
