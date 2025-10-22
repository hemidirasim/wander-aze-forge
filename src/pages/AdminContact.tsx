import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Edit, Phone, Mail, MapPin, Clock } from 'lucide-react';

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


const AdminContact = () => {
  const navigate = useNavigate();
  const [contactData, setContactData] = useState<ContactSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>('hero');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    contact_info: {
      phone: '',
      email: '',
      address: '',
      working_hours: ''
    }
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
        
        // Auto-load hero section data into form
        const heroSection = data.data.find((item: any) => item.section === 'hero');
        if (heroSection) {
          setFormData({
            title: heroSection.title || '',
            content: heroSection.content || '',
            image_url: heroSection.image_url || '',
            contact_info: {
              phone: heroSection.contact_info?.phone || '',
              email: heroSection.contact_info?.email || '',
              address: heroSection.contact_info?.address || '',
              working_hours: heroSection.contact_info?.working_hours || '',
              // FAQ fields
              faq_description: '',
              faq_1_question: '',
              faq_1_answer: '',
              faq_2_question: '',
              faq_2_answer: '',
              faq_3_question: '',
              faq_3_answer: '',
              // Social media fields
              facebook: '',
              instagram: '',
              linkedin: '',
              twitter: ''
            }
          });
        }
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
        // FAQ fields
        faq_description: contactInfo.faq_description || '',
        faq_1_question: contactInfo.faq_1_question || '',
        faq_1_answer: contactInfo.faq_1_answer || '',
        faq_2_question: contactInfo.faq_2_question || '',
        faq_2_answer: contactInfo.faq_2_answer || '',
        faq_3_question: contactInfo.faq_3_question || '',
        faq_3_answer: contactInfo.faq_3_answer || '',
        faq_4_question: contactInfo.faq_4_question || '',
        faq_4_answer: contactInfo.faq_4_answer || '',
        // Social media fields
        facebook: contactInfo.facebook || '',
        instagram: contactInfo.instagram || '',
        linkedin: contactInfo.linkedin || '',
        twitter: contactInfo.twitter || ''
      },
      image_url: section.image_url || ''
    });
  };

  const handleSave = async (section: string) => {
    try {
      setSaving(true);
      
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
          image_url: formData.image_url,
          _method: 'PUT'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Contact section updated:', result);
        await fetchContactData(); // Refresh data
        setEditingSection(null);
        resetForm();
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
    resetForm();
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

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image_url: '',
      contact_info: {
        phone: '',
        email: '',
        address: '',
        working_hours: '',
        // FAQ fields
        faq_description: '',
        faq_1_question: '',
        faq_1_answer: '',
        faq_2_question: '',
        faq_2_answer: '',
        faq_3_question: '',
        faq_3_answer: '',
        faq_4_question: '',
        faq_4_answer: '',
        // Social media fields
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: ''
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
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
            .filter(section => ['hero', 'faq_section', 'social_media'].includes(section.section))
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

                  {/* Section-specific Fields */}
                  {section.section === 'hero' && (
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
                    </div>
                  )}

                  {section.section === 'faq_section' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="faq_description">FAQ Description</Label>
                        <Textarea
                          id="faq_description"
                          value={formData.contact_info.faq_description || ''}
                          onChange={(e) => handleContactInfoChange('faq_description', e.target.value)}
                          placeholder="Description for FAQ section"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq_1_question">Question 1</Label>
                        <Input
                          id="faq_1_question"
                          value={formData.contact_info.faq_1_question || ''}
                          onChange={(e) => handleContactInfoChange('faq_1_question', e.target.value)}
                          placeholder="First question"
                        />
                        <Textarea
                          value={formData.contact_info.faq_1_answer || ''}
                          onChange={(e) => handleContactInfoChange('faq_1_answer', e.target.value)}
                          placeholder="Answer to first question"
                          rows={2}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq_2_question">Question 2</Label>
                        <Input
                          id="faq_2_question"
                          value={formData.contact_info.faq_2_question || ''}
                          onChange={(e) => handleContactInfoChange('faq_2_question', e.target.value)}
                          placeholder="Second question"
                        />
                        <Textarea
                          value={formData.contact_info.faq_2_answer || ''}
                          onChange={(e) => handleContactInfoChange('faq_2_answer', e.target.value)}
                          placeholder="Answer to second question"
                          rows={2}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq_3_question">Question 3</Label>
                        <Input
                          id="faq_3_question"
                          value={formData.contact_info.faq_3_question || ''}
                          onChange={(e) => handleContactInfoChange('faq_3_question', e.target.value)}
                          placeholder="Third question"
                        />
                        <Textarea
                          value={formData.contact_info.faq_3_answer || ''}
                          onChange={(e) => handleContactInfoChange('faq_3_answer', e.target.value)}
                          placeholder="Answer to third question"
                          rows={2}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq_4_question">Question 4</Label>
                        <Input
                          id="faq_4_question"
                          value={formData.contact_info.faq_4_question || ''}
                          onChange={(e) => handleContactInfoChange('faq_4_question', e.target.value)}
                          placeholder="Fourth question"
                        />
                        <Textarea
                          value={formData.contact_info.faq_4_answer || ''}
                          onChange={(e) => handleContactInfoChange('faq_4_answer', e.target.value)}
                          placeholder="Answer to fourth question"
                          rows={2}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}

                  {section.section === 'social_media' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facebook">Facebook URL</Label>
                        <Input
                          id="facebook"
                          value={formData.contact_info.facebook || ''}
                          onChange={(e) => handleContactInfoChange('facebook', e.target.value)}
                          placeholder="Facebook page URL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram">Instagram URL</Label>
                        <Input
                          id="instagram"
                          value={formData.contact_info.instagram || ''}
                          onChange={(e) => handleContactInfoChange('instagram', e.target.value)}
                          placeholder="Instagram profile URL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input
                          id="linkedin"
                          value={formData.contact_info.linkedin || ''}
                          onChange={(e) => handleContactInfoChange('linkedin', e.target.value)}
                          placeholder="LinkedIn profile URL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter URL</Label>
                        <Input
                          id="twitter"
                          value={formData.contact_info.twitter || ''}
                          onChange={(e) => handleContactInfoChange('twitter', e.target.value)}
                          placeholder="Twitter profile URL"
                        />
                      </div>
                    </div>
                  )}



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
