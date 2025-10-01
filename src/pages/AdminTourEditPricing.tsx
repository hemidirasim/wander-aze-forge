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
  DollarSign,
  Percent,
  Gift
} from 'lucide-react';

interface Tour {
  id: number;
  title: string;
  price_includes?: string[];
  group_discounts?: string;
  early_bird_discount?: string;
}

const AdminTourEditPricing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    priceIncludes: [] as string[],
    groupDiscounts: '',
    earlyBirdDiscount: ''
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
          priceIncludes: tourData.price_includes || [],
          groupDiscounts: tourData.group_discounts || '',
          earlyBirdDiscount: tourData.early_bird_discount || ''
        });
        
        console.log('Loaded pricing data:', {
          priceIncludes: tourData.price_includes,
          groupDiscounts: tourData.group_discounts,
          earlyBirdDiscount: tourData.early_bird_discount
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

  const addPriceInclude = () => {
    setFormData(prev => ({
      ...prev,
      priceIncludes: [...prev.priceIncludes, '']
    }));
  };

  const removePriceInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      priceIncludes: prev.priceIncludes.filter((_, i) => i !== index)
    }));
  };

  const updatePriceInclude = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      priceIncludes: prev.priceIncludes.map((item, i) => i === index ? value : item)
    }));
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

    // Filter out empty strings from price includes
    const cleanedFormData = {
      priceIncludes: formData.priceIncludes.filter(item => item.trim() !== ''),
      groupDiscounts: formData.groupDiscounts,
      earlyBirdDiscount: formData.earlyBirdDiscount
    };

    console.log('Sending pricing data:', cleanedFormData);

    try {
      const response = await fetch(`/api/tours/${id}/update-pricing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Pricing Updated Successfully!",
          description: "Tour pricing information has been updated.",
        });
        
        navigate(`/admin/tours/${id}/manage`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update pricing",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast({
        title: "Error",
        description: "Failed to update pricing",
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
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Pricing Details</h1>
            <p className="text-muted-foreground">Manage pricing information and discounts for {tour.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Price Includes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Price Includes
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  List what is included in the tour price
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.priceIncludes.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updatePriceInclude(index, e.target.value)}
                      placeholder="Enter what's included in the price"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePriceInclude(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPriceInclude}
                  className="w-full"
                >
                  + Add Price Include Item
                </Button>
              </CardContent>
            </Card>

            {/* Group Discounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-primary" />
                  Group Discounts
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe group discount policies
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groupDiscounts">Group Discount Information</Label>
                  <Textarea
                    id="groupDiscounts"
                    value={formData.groupDiscounts}
                    onChange={(e) => handleInputChange('groupDiscounts', e.target.value)}
                    placeholder="Describe group discount rates, minimum group sizes, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Early Bird Discount */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Early Bird Discount
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe early bird discount offers
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="earlyBirdDiscount">Early Bird Discount Information</Label>
                  <Textarea
                    id="earlyBirdDiscount"
                    value={formData.earlyBirdDiscount}
                    onChange={(e) => handleInputChange('earlyBirdDiscount', e.target.value)}
                    placeholder="Describe early bird discount rates, booking deadlines, etc."
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
                {isSubmitting ? 'Updating Pricing...' : 'Update Pricing'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTourEditPricing;
