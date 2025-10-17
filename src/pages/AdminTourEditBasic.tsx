import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Save,
  ArrowLeft,
  Edit,
  MapPin,
  Clock,
  Users,
  Star,
  DollarSign
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TourCategory {
  id: number;
  name: string;
  slug: string;
  icon_url?: string;
}

interface Tour {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  price: number;
  max_participants: number;
  booked_seats: number;
  min_participants: number;
  rating: number;
  reviews_count: number;
  group_size: string;
  location: string;
  total_hiking_distance: string;
  total_elevation_gain: string;
  total_elevation_loss: string;
  overview: string;
  best_season: string;
  meeting_point: string;
  languages: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  featured: boolean;
}

const AdminTourEditBasic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    difficulty: '',
    price: '',
    maxParticipants: '',
    bookedSeats: '0',
    minParticipants: '',
    rating: '4.5',
    reviewsCount: '0',
    groupSize: '',
    location: '',
    totalHikingDistance: '',
    totalElevationGain: '',
    totalElevationLoss: '',
    overview: '',
    bestSeason: 'May to October',
    meetingPoint: '',
    languages: 'English, Azerbaijani, Russian',
    startDate: '',
    endDate: '',
    isActive: true,
    featured: false
  });

  useEffect(() => {
    if (id) {
      fetchTour();
      fetchCategories();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tours/${id}`);
      const data = await response.json();

      if (data.success) {
        const tourData = data.data;
        console.log('Tour data from API:', tourData);
        console.log('Start date from API:', tourData.start_date);
        console.log('End date from API:', tourData.end_date);
        setTour(tourData);
        setFormData({
          title: tourData.title || '',
          description: tourData.description || '',
          category: tourData.category || '',
          duration: tourData.duration || '',
          difficulty: tourData.difficulty || '',
          price: tourData.price?.toString() || '',
          maxParticipants: tourData.max_participants?.toString() || '',
          bookedSeats: tourData.booked_seats?.toString() || '0',
          minParticipants: tourData.min_participants?.toString() || '',
          rating: tourData.rating?.toString() || '4.5',
          reviewsCount: tourData.reviews_count?.toString() || '0',
          groupSize: tourData.group_size || '',
          location: tourData.location || '',
          totalHikingDistance: tourData.total_hiking_distance || '',
          totalElevationGain: tourData.total_elevation_gain || '',
          totalElevationLoss: tourData.total_elevation_loss || '',
          overview: tourData.overview || '',
          bestSeason: tourData.best_season || 'May to October',
          meetingPoint: tourData.meeting_point || '',
          languages: tourData.languages || 'English, Azerbaijani, Russian',
          startDate: tourData.start_date ? new Date(tourData.start_date).toISOString().split('T')[0] : '',
          endDate: tourData.end_date ? new Date(tourData.end_date).toISOString().split('T')[0] : '',
          isActive: tourData.is_active !== false,
          featured: tourData.featured === true
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

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/tour-categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load tour categories",
        variant: "destructive"
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting form data:', formData);
      console.log('Start Date:', formData.startDate);
      console.log('End Date:', formData.endDate);
      
      const response = await fetch(`/api/tours/${id}/update-basic`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Tour Updated Successfully!",
          description: `Tour "${formData.title}" has been updated.`,
        });
        
        // Redirect back to tour management
        navigate(`/admin/tours/${id}/manage`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update tour",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      toast({
        title: "Error",
        description: "Failed to update tour",
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
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Edit Basic Information</h1>
            <p className="text-muted-foreground">Update the basic details of your tour.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tour Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter tour title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) => handleInputChange('description', value)}
                    placeholder="Enter tour description"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                    style={{ height: '200px', marginBottom: '50px' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="e.g., 3 days"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select 
                      value={formData.difficulty} 
                      onValueChange={(value) => handleInputChange('difficulty', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Difficult">Difficult</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants *</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                      placeholder="Enter max participants"
                      required
                    />
                  </div>
                  {formData.category === 'group-tours' && (
                    <div className="space-y-2">
                      <Label htmlFor="bookedSeats">Booked Seats</Label>
                      <Input
                        id="bookedSeats"
                        type="number"
                        min="0"
                        value={formData.bookedSeats}
                        onChange={(e) => handleInputChange('bookedSeats', e.target.value)}
                        placeholder="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Available: {parseInt(formData.maxParticipants || '0') - parseInt(formData.bookedSeats || '0')} seats
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="minParticipants">Min Participants</Label>
                    <Input
                      id="minParticipants"
                      type="number"
                      value={formData.minParticipants}
                      onChange={(e) => handleInputChange('minParticipants', e.target.value)}
                      placeholder="Enter min participants"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter location"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalHikingDistance">Total Hiking Distance</Label>
                    <Input
                      id="totalHikingDistance"
                      value={formData.totalHikingDistance}
                      onChange={(e) => handleInputChange('totalHikingDistance', e.target.value)}
                      placeholder="e.g., 15 km, 25 miles"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalElevationGain">Total Elevation Gain</Label>
                    <Input
                      id="totalElevationGain"
                      value={formData.totalElevationGain}
                      onChange={(e) => handleInputChange('totalElevationGain', e.target.value)}
                      placeholder="e.g., 1200m, 4000ft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalElevationLoss">Total Elevation Loss</Label>
                    <Input
                      id="totalElevationLoss"
                      value={formData.totalElevationLoss}
                      onChange={(e) => handleInputChange('totalElevationLoss', e.target.value)}
                      placeholder="e.g., 800m, 2600ft"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="overview">Overview</Label>
                  <ReactQuill
                    theme="snow"
                    value={formData.overview}
                    onChange={(value) => handleInputChange('overview', value)}
                    placeholder="Enter tour overview"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                    style={{ height: '150px', marginBottom: '50px' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bestSeason">Best Season</Label>
                    <Input
                      id="bestSeason"
                      value={formData.bestSeason}
                      onChange={(e) => handleInputChange('bestSeason', e.target.value)}
                      placeholder="e.g., May to October"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meetingPoint">Meeting Point</Label>
                    <Input
                      id="meetingPoint"
                      value={formData.meetingPoint}
                      onChange={(e) => handleInputChange('meetingPoint', e.target.value)}
                      placeholder="Enter meeting point"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">Languages</Label>
                  <Input
                    id="languages"
                    value={formData.languages}
                    onChange={(e) => handleInputChange('languages', e.target.value)}
                    placeholder="e.g., English, Azerbaijani, Russian"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Status & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="isActive" className="text-sm font-medium">
                      Active Tour
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <Label htmlFor="featured" className="text-sm font-medium">
                      Featured Tour
                    </Label>
                  </div>
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
                {isSubmitting ? 'Updating Tour...' : 'Update Tour'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTourEditBasic;
