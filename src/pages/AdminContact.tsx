import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Edit, Phone, Mail, MapPin, Clock } from 'lucide-react';
import GalleryUpload from '@/components/GalleryUpload';

interface ContactSection {
  id: number;
  section: string;
  title: string;
  content?: string;
  contact_info: any;
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

const AdminContact = () => {
  const navigate = useNavigate();
  const [contactData, setContactData] = useState<ContactSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contact_info: {
      phone: '',
      email: '',
      address: '',
      working_hours: '',
      emergency_phone: '',
      emergency_email: '',
      available: ''
    },
    image_url: '',
    galleryImages: [] as UploadedImage[]
  });

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact-page');
      const data = await response.json();
      
      if (data.success) {
        setContactData(data.data);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: ContactSection) => {
    setEditingSection(section.section);
    const contactInfo = section.contact_info || {};
    setFormData({
      title: section.title,
      content: section.content || '',
      contact_info: {
        phone: contactInfo.phone || '',
        email: contactInfo.email || '',
        address: contactInfo.address || '',
        working_hours: contactInfo.working_hours || '',
        emergency_phone: contactInfo.emergency_phone || '',
        emergency_email: contactInfo.emergency_email || '',
        available: contactInfo.available || ''
      },
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
      
      const response = await fetch('/api/contact-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          title: formData.title,
          content: formData.content,
          contact_info: formData.contact_info,
          image_url: imageUrl,
          _method: 'PUT'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Contact section updated:', result);
        await fetchContactData(); // Refresh data
        setEditingSection(null);
        setFormData({ 
          title: '', 
          content: '', 
          contact_info: {
            phone: '',
            email: '',
            address: '',
            working_hours: '',
            emergency_phone: '',
            emergency_email: '',
            available: ''
          },
          image_url: '', 
          galleryImages: [] 
        });
      } else {
        const errorResult = await response.json();
        console.error('Update error:', errorResult);
        alert('Failed to update section: ' + (errorResult.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating contact section:', error);
      alert('Error updating section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({ 
      title: '', 
      content: '', 
      contact_info: {
        phone: '',
        email: '',
        address: '',
        working_hours: '',
        emergency_phone: '',
        emergency_email: '',
        available: ''
      },
      image_url: '', 
      galleryImages: [] 
    });
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value
      }
    }));
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
          <p className="text-muted-foreground">Loading contact page content...</p>
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
        <h1 className="text-3xl font-bold">Contact Page Management</h1>
      </div>

      <div className="space-y-6">
        {contactData
          .filter(section => ['hero', 'office_info', 'emergency_contact'].includes(section.section))
          .map((section) => (
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
                      rows={4}
                    />
                  </div>

                  {/* Contact Information Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.contact_info.phone}
                        onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={formData.contact_info.email}
                        onChange={(e) => handleContactInfoChange('email', e.target.value)}
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.contact_info.address}
                        onChange={(e) => handleContactInfoChange('address', e.target.value)}
                        placeholder="Physical address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="working_hours">Working Hours</Label>
                      <Input
                        id="working_hours"
                        value={formData.contact_info.working_hours}
                        onChange={(e) => handleContactInfoChange('working_hours', e.target.value)}
                        placeholder="Working hours"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_phone">Emergency Phone</Label>
                      <Input
                        id="emergency_phone"
                        value={formData.contact_info.emergency_phone}
                        onChange={(e) => handleContactInfoChange('emergency_phone', e.target.value)}
                        placeholder="Emergency phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_email">Emergency Email</Label>
                      <Input
                        id="emergency_email"
                        value={formData.contact_info.emergency_email}
                        onChange={(e) => handleContactInfoChange('emergency_email', e.target.value)}
                        placeholder="Emergency email"
                      />
                    </div>
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
                  
                  {/* Display Contact Information */}
                  {section.contact_info && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {section.contact_info.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm">{section.contact_info.phone}</span>
                        </div>
                      )}
                      {section.contact_info.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm">{section.contact_info.email}</span>
                        </div>
                      )}
                      {section.contact_info.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm">{section.contact_info.address}</span>
                        </div>
                      )}
                      {section.contact_info.working_hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">{section.contact_info.working_hours}</span>
                        </div>
                      )}
                      {section.contact_info.emergency_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-red-600">{section.contact_info.emergency_phone}</span>
                        </div>
                      )}
                      {section.contact_info.emergency_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm text-red-600">{section.contact_info.emergency_email}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
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

export default AdminContact;
