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
  Clock,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react';

interface TourProgram {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string;
  accommodation: string;
}

interface Tour {
  id: number;
  title: string;
  tour_programs?: TourProgram[];
}

const AdminTourEditPrograms: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tourPrograms: [] as TourProgram[]
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
        
        console.log('Full tour data:', tourData);
        console.log('Tour programs raw:', tourData.tour_programs);
        console.log('Tour programs type:', typeof tourData.tour_programs);
        
        // Parse tour_programs if it's a string
        let parsedPrograms = tourData.tour_programs || [];
        if (typeof tourData.tour_programs === 'string') {
          try {
            parsedPrograms = JSON.parse(tourData.tour_programs);
          } catch (e) {
            console.error('Error parsing tour_programs:', e);
            parsedPrograms = [];
          }
        }
        
        console.log('Parsed programs:', parsedPrograms);
        
        setFormData({
          tourPrograms: parsedPrograms
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

  const addProgram = () => {
    const newDay = formData.tourPrograms.length + 1;
    setFormData(prev => ({
      ...prev,
      tourPrograms: [...prev.tourPrograms, {
        day: newDay,
        title: '',
        description: '',
        activities: [],
        meals: '',
        accommodation: ''
      }]
    }));
  };

  const removeProgram = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tourPrograms: prev.tourPrograms.filter((_, i) => i !== index).map((program, i) => ({
        ...program,
        day: i + 1
      }))
    }));
  };

  const updateProgram = (index: number, field: keyof TourProgram, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      tourPrograms: prev.tourPrograms.map((program, i) => 
        i === index ? { ...program, [field]: value } : program
      )
    }));
  };

  const addActivity = (programIndex: number) => {
    setFormData(prev => ({
      ...prev,
      tourPrograms: prev.tourPrograms.map((program, i) => 
        i === programIndex 
          ? { ...program, activities: [...program.activities, ''] }
          : program
      )
    }));
  };

  const removeActivity = (programIndex: number, activityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      tourPrograms: prev.tourPrograms.map((program, i) => 
        i === programIndex 
          ? { 
              ...program, 
              activities: program.activities.filter((_, j) => j !== activityIndex) 
            }
          : program
      )
    }));
  };

  const updateActivity = (programIndex: number, activityIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tourPrograms: prev.tourPrograms.map((program, i) => 
        i === programIndex 
          ? { 
              ...program, 
              activities: program.activities.map((activity, j) => 
                j === activityIndex ? value : activity
              )
            }
          : program
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Filter out empty activities and clean data
    const cleanedPrograms = formData.tourPrograms.map(program => ({
      ...program,
      activities: program.activities.filter(activity => activity.trim() !== '')
    }));

    console.log('Sending tour programs data:', cleanedPrograms);

    try {
      const response = await fetch(`/api/tours/${id}/update-programs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tourPrograms: cleanedPrograms })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Tour Programs Updated Successfully!",
          description: "Tour programs have been updated.",
        });
        
        navigate(`/admin/tours/${id}/manage`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update tour programs",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating tour programs:', error);
      toast({
        title: "Error",
        description: "Failed to update tour programs",
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
        <div className="max-w-6xl mx-auto">
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
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Tour Programs</h1>
            <p className="text-muted-foreground">Manage detailed day-by-day tour programs for {tour.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tour Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Day-by-Day Tour Programs
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add detailed programs for each day of the tour
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {console.log('Rendering programs:', formData.tourPrograms)}
                {formData.tourPrograms.map((program, index) => (
                  <div key={index} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Day {program.day}</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProgram(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Day
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${index}`}>Day Title</Label>
                        <Input
                          id={`title-${index}`}
                          value={program.title}
                          onChange={(e) => updateProgram(index, 'title', e.target.value)}
                          placeholder="Enter day title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`meals-${index}`}>Meals</Label>
                        <Input
                          id={`meals-${index}`}
                          value={program.meals}
                          onChange={(e) => updateProgram(index, 'meals', e.target.value)}
                          placeholder="Breakfast, Lunch, Dinner"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`description-${index}`}>Day Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={program.description}
                        onChange={(e) => updateProgram(index, 'description', e.target.value)}
                        placeholder="Describe the day's activities and highlights"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Activities</Label>
                      {program.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <Input
                            value={activity}
                            onChange={(e) => updateActivity(index, activityIndex, e.target.value)}
                            placeholder="Enter activity"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeActivity(index, activityIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addActivity(index)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`accommodation-${index}`}>Accommodation</Label>
                      <Input
                        id={`accommodation-${index}`}
                        value={program.accommodation}
                        onChange={(e) => updateProgram(index, 'accommodation', e.target.value)}
                        placeholder="Hotel name or accommodation type"
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProgram}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Day
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
                {isSubmitting ? 'Updating Programs...' : 'Update Programs'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTourEditPrograms;
