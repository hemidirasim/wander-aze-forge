import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Edit, Plus, Trash2, Users } from 'lucide-react';
import GalleryUpload from '@/components/GalleryUpload';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  social_links?: any;
  order_index: number;
  is_active: boolean;
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

const AdminTeamMembers = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    email: '',
    phone: '',
    social_links: {
      linkedin: '',
      instagram: '',
      twitter: ''
    },
    order_index: 0,
    is_active: true,
    photo_url: '',
    galleryImages: [] as UploadedImage[]
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team-members');
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      bio: '',
      email: '',
      phone: '',
      social_links: {
        linkedin: '',
        instagram: '',
        twitter: ''
      },
      order_index: teamMembers.length + 1,
      is_active: true,
      photo_url: '',
      galleryImages: []
    });
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member.id);
    setIsCreating(false);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      email: member.email || '',
      phone: member.phone || '',
      social_links: member.social_links || {
        linkedin: '',
        instagram: '',
        twitter: ''
      },
      order_index: member.order_index,
      is_active: member.is_active,
      photo_url: member.photo_url || '',
      galleryImages: member.photo_url ? [{
        url: member.photo_url,
        filename: 'current-photo',
        size: 0,
        uploadedAt: new Date().toISOString(),
        isMain: true
      }] : []
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const imageUrl = formData.galleryImages.length > 0 ? formData.galleryImages[0].url : formData.photo_url;
      
      const requestData = {
        name: formData.name,
        position: formData.position,
        bio: formData.bio,
        email: formData.email,
        phone: formData.phone,
        social_links: formData.social_links,
        order_index: formData.order_index,
        is_active: formData.is_active,
        photo_url: imageUrl,
        ...(editingMember && { id: editingMember, _method: 'PUT' })
      };

      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Team member saved:', result);
        await fetchTeamMembers();
        setEditingMember(null);
        setIsCreating(false);
        setFormData({
          name: '',
          position: '',
          bio: '',
          email: '',
          phone: '',
          social_links: { linkedin: '', instagram: '', twitter: '' },
          order_index: 0,
          is_active: true,
          photo_url: '',
          galleryImages: []
        });
      } else {
        const errorResult = await response.json();
        console.error('Save error:', errorResult);
        alert('Failed to save team member: ' + (errorResult.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Error saving team member: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        const response = await fetch('/api/team-members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            _method: 'DELETE'
          })
        });

        if (response.ok) {
          await fetchTeamMembers();
        } else {
          const errorResult = await response.json();
          alert('Failed to delete team member: ' + (errorResult.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
        alert('Error deleting team member: ' + error.message);
      }
    }
  };

  const handleCancel = () => {
    setEditingMember(null);
    setIsCreating(false);
    setFormData({
      name: '',
      position: '',
      bio: '',
      email: '',
      phone: '',
      social_links: { linkedin: '', instagram: '', twitter: '' },
      order_index: 0,
      is_active: true,
      photo_url: '',
      galleryImages: []
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team members...</p>
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
        <h1 className="text-3xl font-bold">Team Members Management</h1>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 ml-auto"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingMember) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Add New Team Member' : 'Edit Team Member'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Job title/position"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Brief biography"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+994 50 123 45 67"
                />
              </div>
            </div>

            <div>
              <Label>Social Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.social_links.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.social_links.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.social_links.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                  placeholder="Display order"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <div>
              <Label>Photo</Label>
              <GalleryUpload
                images={formData.galleryImages}
                onImagesChange={(images) => handleInputChange('galleryImages', images)}
                maxImages={1}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {member.photo_url ? (
                      <img 
                        src={member.photo_url} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {member.bio}
              </p>
              <div className="space-y-1 text-sm">
                {member.email && (
                  <div className="text-muted-foreground">📧 {member.email}</div>
                )}
                {member.phone && (
                  <div className="text-muted-foreground">📞 {member.phone}</div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Order: {member.order_index} | {member.is_active ? 'Active' : 'Inactive'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No team members found</p>
            <Button onClick={handleCreate} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add First Team Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTeamMembers;
