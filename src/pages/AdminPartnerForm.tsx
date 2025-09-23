import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import GalleryUpload from '@/components/GalleryUpload';

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  isMain?: boolean;
  description?: string;
  alt?: string;
}

interface PartnerFormData {
  name: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  logo_url: string;
  category: string;
  status: string;
  galleryImages: UploadedImage[];
}

const AdminPartnerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    logo_url: '',
    category: '',
    status: 'active',
    galleryImages: []
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchPartner(parseInt(id));
    }
  }, [id, isEditing]);

  const fetchPartner = async (partnerId: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/partners');
      const result = await response.json();
      
      if (result.success) {
        const partner = result.data.find((p: any) => p.id === partnerId);
        if (partner) {
          // Convert gallery_images to UploadedImage format
          let galleryImages: UploadedImage[] = [];
          if (partner.gallery_images && partner.gallery_images.length > 0) {
            galleryImages = partner.gallery_images;
          } else if (partner.logo_url) {
            // Fallback to logo_url if no gallery_images
            galleryImages = [{
              url: partner.logo_url,
              filename: 'logo-image',
              size: 0,
              uploadedAt: new Date().toISOString(),
              isMain: true
            }];
          }

          setFormData({
            name: partner.name || '',
            description: partner.description || '',
            website: partner.website || '',
            email: partner.email || '',
            phone: partner.phone || '',
            logo_url: partner.logo_url || '',
            category: partner.category || '',
            status: partner.status || 'active',
            galleryImages: galleryImages
          });
        }
      }
    } catch (error) {
      console.error('Error fetching partner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PartnerFormData, value: string | UploadedImage[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Partner name is required');
      return;
    }

    // Validate email format if provided
    if (formData.email && !formData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate website format if provided
    if (formData.website && !formData.website.startsWith('http')) {
      alert('Please enter a valid website URL (starting with http:// or https://)');
      return;
    }

    try {
      setSaving(true);
      
      // Set logo_url from first gallery image if available
      const logoUrl = formData.galleryImages.length > 0 ? formData.galleryImages[0].url : formData.logo_url;
      
      const requestData = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        email: formData.email,
        phone: formData.phone,
        logo_url: logoUrl,
        category: formData.category,
        status: formData.status,
        gallery_images: formData.galleryImages,
        ...(isEditing && { id: parseInt(id!), _method: 'PUT' })
      };

      console.log('Saving partner:', requestData);

      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Partner response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Partner saved successfully:', result);
        navigate('/admin/partners');
      } else {
        const errorResult = await response.json();
        console.error('Partner save error:', errorResult);
        alert('Failed to save partner: ' + (errorResult.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('Error saving partner: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading partner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/partners')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Partners
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Partner' : 'New Partner'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Partner Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter partner name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the partner"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="partner@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+994 50 123 45 67"
                type="tel"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partner Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="guide">Guide Service</SelectItem>
                  <SelectItem value="equipment">Equipment Rental</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Partner Images</Label>
              <GalleryUpload
                initialImages={formData.galleryImages}
                onImagesChange={(images) => handleInputChange('galleryImages', images)}
                maxImages={5}
                allowMultiple={true}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/partners')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : isEditing ? 'Update Partner' : 'Create Partner'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminPartnerForm;
