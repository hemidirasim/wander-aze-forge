import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import GalleryUpload from '@/components/GalleryUpload';
import { 
  ArrowLeft,
  Save,
  Upload,
  Image,
  Calendar,
  MapPin,
  DollarSign,
  Target,
  Users,
  FolderOpen,
  Plus,
  X
} from 'lucide-react';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  description?: string;
  alt?: string;
  isMain?: boolean;
}

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
  budget: string;
  status: string;
  image_url: string;
  gallery_urls: string[];
  galleryImages: UploadedImage[];
}

const AdminProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    start_date: '',
    end_date: '',
    budget: '',
    status: 'active',
    image_url: '',
    gallery_urls: [],
    galleryImages: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchProject(parseInt(id));
    }
  }, [id, isEditing]);

  const fetchProject = async (projectId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      const result = await response.json();
      
      if (result.success) {
        const project = result.data.project;
        setFormData({
          title: project.title || '',
          description: project.description || '',
          category: project.category || '',
          location: project.location || '',
          start_date: project.start_date || '',
          end_date: project.end_date || '',
          budget: project.budget?.toString() || '',
          status: project.status || 'active',
          image_url: project.image_url || '',
          gallery_urls: project.gallery_urls || [],
          galleryImages: project.gallery_urls?.map((url: string, index: number) => ({
            id: `existing-${index}`,
            url: url,
            filename: `image-${index + 1}.jpg`,
            size: 0,
            uploadedAt: new Date().toISOString(),
            isMain: index === 0
          })) || []
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string | string[] | UploadedImage[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEditing ? `/api/projects/${id}` : '/api/projects';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Prepare project data with gallery images
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        image_url: formData.galleryImages.length > 0 ? formData.galleryImages[0].url : formData.image_url,
        gallery_urls: formData.galleryImages.map(img => img.url)
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        navigate('/admin/projects');
      } else {
        console.error('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </h1>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          {isEditing ? 'Editing' : 'Creating'}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <FolderOpen className="w-6 h-6 text-blue-500" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the project goals, activities, and expected outcomes"
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community_development">Community Development</SelectItem>
                    <SelectItem value="conservation">Conservation</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Project location"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Timeline & Budget */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Calendar className="w-6 h-6 text-green-500" />
              <span>Timeline & Budget</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Image className="w-6 h-6 text-purple-500" />
              <span>Media</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Project Images</Label>
              <GalleryUpload
                onImagesChange={(images) => handleInputChange('galleryImages', images)}
                initialImages={formData.galleryImages}
                maxImages={10}
                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                maxSize={5}
              />
            </div>

          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectForm;
