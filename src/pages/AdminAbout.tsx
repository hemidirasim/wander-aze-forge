import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Edit } from 'lucide-react';
import GalleryUpload from '@/components/GalleryUpload';

interface AboutSection {
  id: number;
  section: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  isMain?: boolean;
  description?: string;
}

const AdminAbout = () => {
  const navigate = useNavigate();
  const [aboutData, setAboutData] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    galleryImages: [] as UploadedImage[]
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/about');
      const data = await response.json();
      
      if (data.success) {
        setAboutData(data.data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: AboutSection) => {
    setEditingSection(section.section);
    setFormData({
      title: section.title,
      content: section.content,
      image_url: section.image_url || '',
      galleryImages: section.image_url ? [{
        url: section.image_url,
        filename: 'current-image',
        size: 0,
        uploadedAt: new Date().toISOString(),
        isMain: true
      }] : []
    });
  };

  const handleSave = async (section: string) => {
    try {
      setSaving(true);
      
      const imageUrl = formData.galleryImages.length > 0 ? formData.galleryImages[0].url : formData.image_url;
      
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          title: formData.title,
          content: formData.content,
          image_url: imageUrl,
          _method: 'PUT'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('About section updated:', result);
        await fetchAboutData(); // Refresh data
        setEditingSection(null);
        setFormData({ title: '', content: '', image_url: '', galleryImages: [] });
      } else {
        const errorResult = await response.json();
        console.error('Update error:', errorResult);
        alert('Failed to update section: ' + (errorResult.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating about section:', error);
      alert('Error updating section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({ title: '', content: '', image_url: '', galleryImages: [] });
  };

  const handleInputChange = (field: string, value: string | UploadedImage[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading about page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Button>
        <h1 className="text-3xl font-bold">About Page Management</h1>
      </div>

      <div className="space-y-6">
        {aboutData.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(section)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingSection === section.section ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter section title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Enter section content"
                      rows={8}
                    />
                  </div>

                  <div>
                    <Label>Image</Label>
                    <GalleryUpload
                      images={formData.galleryImages}
                      onImagesChange={(images) => handleInputChange('galleryImages', images)}
                      maxImages={1}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave(section.section)}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-muted-foreground">
                      {section.content}
                    </div>
                  </div>
                  
                  {section.image_url && (
                    <div className="mt-4">
                      <img 
                        src={section.image_url} 
                        alt={section.title}
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(section.updated_at).toLocaleDateString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAbout;
