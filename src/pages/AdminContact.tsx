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
      available: '',
      // Social media links
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      // FAQ data
      faq_title: '',
      faqs: [] as Array<{question: string, answer: string}>,
      // Form settings
      form_title: '',
      form_description: '',
      response_time: '',
      privacy_note: '',
      // Map settings
      location_title: '',
      location_description: '',
      map_image: ''
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
        available: contactInfo.available || '',
        // Social media links
        facebook: contactInfo.facebook || '',
        instagram: contactInfo.instagram || '',
        linkedin: contactInfo.linkedin || '',
        twitter: contactInfo.twitter || '',
        // FAQ data
        faq_title: contactInfo.faq_title || '',
        faqs: contactInfo.faqs || [],
        // Form settings
        form_title: contactInfo.form_title || '',
        form_description: contactInfo.form_description || '',
        response_time: contactInfo.response_time || '',
        privacy_note: contactInfo.privacy_note || '',
        // Map settings
        location_title: contactInfo.location_title || '',
        location_description: contactInfo.location_description || '',
        map_image: contactInfo.map_image || ''
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
        available: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        faq_title: '',
        faqs: [],
        form_title: '',
        form_description: '',
        response_time: '',
        privacy_note: '',
        location_title: '',
        location_description: '',
        map_image: ''
      },
      image_url: '', 
      galleryImages: [] 
    });
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        faqs: [...prev.contact_info.faqs, { question: '', answer: '' }]
      }
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        faqs: prev.contact_info.faqs.filter((_, i) => i !== index)
      }
    }));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        faqs: prev.contact_info.faqs.map((faq, i) => 
          i === index ? { ...faq, [field]: value } : faq
        )
      }
    }));
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
        {contactData.map((section) => (
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

                  {/* Social Media Links */}
                  {(section.section === 'social_media' || section.section === 'hero') && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Social Media Links</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="facebook">Facebook URL</Label>
                          <Input
                            id="facebook"
                            value={formData.contact_info.facebook}
                            onChange={(e) => handleContactInfoChange('facebook', e.target.value)}
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="instagram">Instagram URL</Label>
                          <Input
                            id="instagram"
                            value={formData.contact_info.instagram}
                            onChange={(e) => handleContactInfoChange('instagram', e.target.value)}
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn URL</Label>
                          <Input
                            id="linkedin"
                            value={formData.contact_info.linkedin}
                            onChange={(e) => handleContactInfoChange('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="twitter">Twitter URL</Label>
                          <Input
                            id="twitter"
                            value={formData.contact_info.twitter}
                            onChange={(e) => handleContactInfoChange('twitter', e.target.value)}
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FAQ Section */}
                  {section.section === 'faq_section' && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">FAQ Section</h4>
                      <div>
                        <Label htmlFor="faq_title">FAQ Title</Label>
                        <Input
                          id="faq_title"
                          value={formData.contact_info.faq_title}
                          onChange={(e) => handleContactInfoChange('faq_title', e.target.value)}
                          placeholder="Quick Answers"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">FAQ Items</h5>
                          <Button type="button" variant="outline" size="sm" onClick={addFAQ}>
                            Add FAQ
                          </Button>
                        </div>
                        {formData.contact_info.faqs.map((faq, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <h6 className="font-medium">FAQ #{index + 1}</h6>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => removeFAQ(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                            <div>
                              <Label htmlFor={`faq-question-${index}`}>Question</Label>
                              <Input
                                id={`faq-question-${index}`}
                                value={faq.question}
                                onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                placeholder="Enter question"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                              <Textarea
                                id={`faq-answer-${index}`}
                                value={faq.answer}
                                onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                placeholder="Enter answer"
                                rows={3}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Form Settings */}
                  {section.section === 'contact_form' && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Contact Form Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="form_title">Form Title</Label>
                          <Input
                            id="form_title"
                            value={formData.contact_info.form_title}
                            onChange={(e) => handleContactInfoChange('form_title', e.target.value)}
                            placeholder="Send us a Message"
                          />
                        </div>
                        <div>
                          <Label htmlFor="response_time">Response Time</Label>
                          <Input
                            id="response_time"
                            value={formData.contact_info.response_time}
                            onChange={(e) => handleContactInfoChange('response_time', e.target.value)}
                            placeholder="We'll respond within 24 hours"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="form_description">Form Description</Label>
                        <Textarea
                          id="form_description"
                          value={formData.contact_info.form_description}
                          onChange={(e) => handleContactInfoChange('form_description', e.target.value)}
                          placeholder="Planning a custom tour or have questions? We'd love to hear from you."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="privacy_note">Privacy Note</Label>
                        <Textarea
                          id="privacy_note"
                          value={formData.contact_info.privacy_note}
                          onChange={(e) => handleContactInfoChange('privacy_note', e.target.value)}
                          placeholder="We respect your privacy. Your information will only be used to respond to your inquiry."
                          rows={2}
                        />
                      </div>
                    </div>
                  )}

                  {/* Map Section Settings */}
                  {section.section === 'map_section' && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Map Section Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location_title">Location Title</Label>
                          <Input
                            id="location_title"
                            value={formData.contact_info.location_title}
                            onChange={(e) => handleContactInfoChange('location_title', e.target.value)}
                            placeholder="Based in Baku"
                          />
                        </div>
                        <div>
                          <Label htmlFor="map_image">Map Image URL</Label>
                          <Input
                            id="map_image"
                            value={formData.contact_info.map_image}
                            onChange={(e) => handleContactInfoChange('map_image', e.target.value)}
                            placeholder="https://example.com/map-image.jpg"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="location_description">Location Description</Label>
                        <Textarea
                          id="location_description"
                          value={formData.contact_info.location_description}
                          onChange={(e) => handleContactInfoChange('location_description', e.target.value)}
                          placeholder="Tours operate throughout Azerbaijan"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

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
                    <div className="space-y-4 mt-4">
                      {/* Basic Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      {/* Social Media Links */}
                      {(section.contact_info.facebook || section.contact_info.instagram || section.contact_info.linkedin || section.contact_info.twitter) && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Social Media Links</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {section.contact_info.facebook && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Facebook:</span>
                                <a href={section.contact_info.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                  {section.contact_info.facebook}
                                </a>
                              </div>
                            )}
                            {section.contact_info.instagram && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Instagram:</span>
                                <a href={section.contact_info.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                  {section.contact_info.instagram}
                                </a>
                              </div>
                            )}
                            {section.contact_info.linkedin && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">LinkedIn:</span>
                                <a href={section.contact_info.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                  {section.contact_info.linkedin}
                                </a>
                              </div>
                            )}
                            {section.contact_info.twitter && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Twitter:</span>
                                <a href={section.contact_info.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                  {section.contact_info.twitter}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* FAQ Section */}
                      {section.contact_info.faqs && section.contact_info.faqs.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">{section.contact_info.faq_title || 'FAQ'}</h5>
                          <div className="space-y-2">
                            {section.contact_info.faqs.map((faq, index) => (
                              <div key={index} className="border-l-2 border-primary/20 pl-3">
                                <div className="font-medium text-sm">{faq.question}</div>
                                <div className="text-sm text-muted-foreground">{faq.answer}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Form Settings */}
                      {(section.contact_info.form_title || section.contact_info.form_description) && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Contact Form Settings</h5>
                          <div className="space-y-1">
                            {section.contact_info.form_title && (
                              <div className="text-sm"><span className="font-medium">Title:</span> {section.contact_info.form_title}</div>
                            )}
                            {section.contact_info.form_description && (
                              <div className="text-sm"><span className="font-medium">Description:</span> {section.contact_info.form_description}</div>
                            )}
                            {section.contact_info.response_time && (
                              <div className="text-sm"><span className="font-medium">Response Time:</span> {section.contact_info.response_time}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Map Settings */}
                      {(section.contact_info.location_title || section.contact_info.location_description) && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">Map Section</h5>
                          <div className="space-y-1">
                            {section.contact_info.location_title && (
                              <div className="text-sm"><span className="font-medium">Title:</span> {section.contact_info.location_title}</div>
                            )}
                            {section.contact_info.location_description && (
                              <div className="text-sm"><span className="font-medium">Description:</span> {section.contact_info.location_description}</div>
                            )}
                          </div>
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
