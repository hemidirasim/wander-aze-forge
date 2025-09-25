import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Upload, Image, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '@/components/FileUpload';

interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  button1_text: string;
  button1_link: string;
  button2_text: string;
  button2_link: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminHero: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroData, setHeroData] = useState<HeroSection | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    button1_text: '',
    button1_link: '',
    button2_text: '',
    button2_link: '',
    is_active: true
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchHeroData();
  }, [navigate]);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hero-section');
      const data = await response.json();
      
      if (data.success) {
        setHeroData(data.data);
        setFormData({
          title: data.data.title || '',
          subtitle: data.data.subtitle || '',
          description: data.data.description || '',
          image_url: data.data.image_url || '',
          button1_text: data.data.button1_text || '',
          button1_link: data.data.button1_link || '',
          button2_text: data.data.button2_text || '',
          button2_link: data.data.button2_link || '',
          is_active: data.data.is_active !== false
        });
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handleImageUploadError = (error: string) => {
    console.error('Image upload error:', error);
    alert(`Image upload failed: ${error}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = heroData ? `/api/hero-section?id=${heroData.id}` : '/api/hero-section';
      const method = heroData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Hero section saved successfully!');
        await fetchHeroData();
      } else {
        alert(`Error saving hero section: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
      alert('Error saving hero section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Section Management</h1>
          <p className="text-gray-600">Manage the homepage hero section content and image</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="w-5 h-5 text-blue-500" />
                <span>Hero Section Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Main Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Discover Azerbaijan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="e.g., Authentic mountain adventures • Sustainable tourism • Cultural immersion"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of your company and services..."
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="image_url">Hero Image</Label>
                
                {/* Image Upload Component */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <FileUpload
                    onUploadComplete={handleImageUpload}
                    onUploadError={handleImageUploadError}
                    type="tour"
                    accept="image/*"
                    maxSizeMB={10}
                    multiple={false}
                    className="w-full"
                  />
                </div>

                {/* Manual URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="image_url">Or enter image URL manually</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="/hero-mountain-custom.jpg"
                  />
                  <p className="text-sm text-gray-500">
                    Use a path to an image in the public folder (e.g., /hero-mountain-custom.jpg) or upload a new image above
                  </p>
                </div>

                {/* Current Image Preview */}
                {formData.image_url && (
                  <div className="space-y-2">
                    <Label>Current Image Preview</Label>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img 
                        src={formData.image_url} 
                        alt="Hero preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500">Image preview</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Save className="w-5 h-5 text-green-500" />
                <span>Call-to-Action Buttons</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Button 1</h4>
                  <div className="space-y-2">
                    <Label htmlFor="button1_text">Button Text</Label>
                    <Input
                      id="button1_text"
                      value={formData.button1_text}
                      onChange={(e) => handleInputChange('button1_text', e.target.value)}
                      placeholder="e.g., Explore Tours"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button1_link">Button Link</Label>
                    <Input
                      id="button1_link"
                      value={formData.button1_link}
                      onChange={(e) => handleInputChange('button1_link', e.target.value)}
                      placeholder="e.g., /tours"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Button 2</h4>
                  <div className="space-y-2">
                    <Label htmlFor="button2_text">Button Text</Label>
                    <Input
                      id="button2_text"
                      value={formData.button2_text}
                      onChange={(e) => handleInputChange('button2_text', e.target.value)}
                      placeholder="e.g., Our Story"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button2_link">Button Link</Label>
                    <Input
                      id="button2_link"
                      value={formData.button2_link}
                      onChange={(e) => handleInputChange('button2_link', e.target.value)}
                      placeholder="e.g., /about"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-purple-500" />
                <span>Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="is_active" className="text-sm font-medium">
                  Active Hero Section
                </Label>
              </div>
              <p className="text-sm text-gray-600">
                Only one hero section can be active at a time. Activating this section will deactivate others.
              </p>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Hero Section'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHero;
