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
    basePrice: '',
    participantPricing: [] as Array<{minParticipants: number, pricePerPerson: number}>,
    priceIncludes: [] as string[]
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
          basePrice: tourData.price?.toString() || '',
          participantPricing: tourData.participant_pricing || [],
          priceIncludes: tourData.price_includes || []
        });
        
        console.log('Loaded pricing data:', {
          basePrice: tourData.price,
          participantPricing: tourData.participant_pricing,
          priceIncludes: tourData.price_includes
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

  const addParticipantPricing = () => {
    setFormData(prev => ({
      ...prev,
      participantPricing: [...prev.participantPricing, {minParticipants: 1, pricePerPerson: 0}]
    }));
  };

  const removeParticipantPricing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participantPricing: prev.participantPricing.filter((_, i) => i !== index)
    }));
  };

  const updateParticipantPricing = (index: number, field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      participantPricing: prev.participantPricing.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
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
      basePrice: formData.basePrice,
      participantPricing: formData.participantPricing,
      priceIncludes: formData.priceIncludes.filter(item => item.trim() !== '')
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
            {/* Base Price */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Base Price
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Set the base price for the tour
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price ($)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange('basePrice', e.target.value)}
                    placeholder="Enter base price"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Participant-Based Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-primary" />
                  Participant-Based Pricing
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Set different prices based on number of participants
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.participantPricing.map((pricing, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Min Participants</Label>
                      <Input
                        type="number"
                        value={pricing.minParticipants}
                        onChange={(e) => updateParticipantPricing(index, 'minParticipants', parseInt(e.target.value) || 0)}
                        placeholder="Min participants"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price Per Person ($)</Label>
                      <Input
                        type="number"
                        value={pricing.pricePerPerson}
                        onChange={(e) => updateParticipantPricing(index, 'pricePerPerson', parseInt(e.target.value) || 0)}
                        placeholder="Price per person"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeParticipantPricing(index)}
                        className="text-red-600 hover:text-red-700 w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addParticipantPricing}
                  className="w-full"
                >
                  + Add Participant Pricing Tier
                </Button>
              </CardContent>
            </Card>

            {/* Price Includes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
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
