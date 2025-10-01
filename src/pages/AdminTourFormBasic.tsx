import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Save,
  Plus,
  MapPin,
  Clock,
  Users,
  Star,
  DollarSign
} from 'lucide-react';

interface TourCategory {
  id: number;
  name: string;
  slug: string;
  icon_url?: string;
}

interface BasicTourForm {
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  price: string;
  maxParticipants: string;
  rating: string;
  reviewsCount: string;
  groupSize: string;
  location: string;
  overview: string;
  bestSeason: string;
  meetingPoint: string;
  languages: string;
  isActive: boolean;
  featured: boolean;
}

const AdminTourFormBasic: React.FC = () => {
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<BasicTourForm>({
    title: '',
    description: '',
    category: '',
    duration: '',
    difficulty: '',
    price: '',
    maxParticipants: '',
    rating: '4.5',
    reviewsCount: '0',
    groupSize: '',
    location: '',
    overview: '',
    bestSeason: 'May to October',
    meetingPoint: '',
    languages: 'English, Azerbaijani, Russian',
    isActive: true,
    featured: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleInputChange = (field: keyof BasicTourForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/create-tour-basic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Tour Created Successfully!",
          description: `Tour "${formData.title}" has been created. You can now add detailed sections.`,
        });
        
        // Redirect to tour management page
        window.location.href = `/admin/tours/${data.data.id}/manage`;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create tour",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      toast({
        title: "Error",
        description: "Failed to create tour",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Basic Tour</h1>
            <p className="text-muted-foreground">
              Create a basic tour first, then add detailed sections later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
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
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter tour description"
                    rows={4}
                    required
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
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Textarea
                    id="overview"
                    value={formData.overview}
                    onChange={(e) => handleInputChange('overview', e.target.value)}
                    placeholder="Enter tour overview"
                    rows={3}
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
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Creating Tour...' : 'Create Basic Tour'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTourFormBasic;
