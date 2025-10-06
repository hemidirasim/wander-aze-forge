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
  Star,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';

interface Tour {
  id: number;
  title: string;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
}

const AdminTourEditHighlights: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    highlights: [] as string[],
    includes: [] as string[],
    excludes: [] as string[]
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
          highlights: tourData.highlights || [],
          includes: tourData.includes || [],
          excludes: tourData.excludes || []
        });
        
        console.log('Loaded highlights data:', {
          highlights: tourData.highlights,
          includes: tourData.includes,
          excludes: tourData.excludes
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

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((item, i) => i === index ? value : item)
    }));
  };

  const addInclude = () => {
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }));
  };

  const removeInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const updateInclude = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }));
  };

  const addExclude = () => {
    setFormData(prev => ({
      ...prev,
      excludes: [...prev.excludes, '']
    }));
  };

  const removeExclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index)
    }));
  };

  const updateExclude = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      excludes: prev.excludes.map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Filter out empty strings
    const cleanedFormData = {
      highlights: formData.highlights.filter(item => item.trim() !== ''),
      includes: formData.includes.filter(item => item.trim() !== ''),
      excludes: formData.excludes.filter(item => item.trim() !== '')
    };

    console.log('Sending highlights data:', cleanedFormData);

    try {
      const response = await fetch(`/api/tours/${id}/update-highlights`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Highlights Updated Successfully!",
          description: "Tour highlights and features have been updated.",
        });
        
        navigate(`/admin/tours/${id}/manage`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update highlights",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating highlights:', error);
      toast({
        title: "Error",
        description: "Failed to update highlights",
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
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Highlights & Features</h1>
            <p className="text-muted-foreground">Manage tour highlights, what's included, and what's excluded for {tour.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tour Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Tour Highlights
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add key highlights and features of the tour
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      placeholder="Enter tour highlight"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHighlight(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addHighlight}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Highlight
                </Button>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  What's Included
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  List what is included in the tour price
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.includes.map((include, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={include}
                      onChange={(e) => updateInclude(index, e.target.value)}
                      placeholder="Enter what's included"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeInclude(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInclude}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Included Item
                </Button>
              </CardContent>
            </Card>

            {/* What's Excluded */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  What's Excluded
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  List what is not included in the tour price
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.excludes.map((exclude, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={exclude}
                      onChange={(e) => updateExclude(index, e.target.value)}
                      placeholder="Enter what's excluded"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExclude(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExclude}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Excluded Item
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
                {isSubmitting ? 'Updating Highlights...' : 'Update Highlights'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTourEditHighlights;

