import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Eye } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  description: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/partners');
      const result = await response.json();
      
      console.log('Partners API Response:', result);
      
      if (result.success) {
        setPartners(result.data || []);
        console.log('Partners loaded:', result.data?.length || 0);
      } else {
        console.error('API Error:', result.error);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate('/admin/partner-form');
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/partner-form/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        console.log('Deleting partner with ID:', id);
        
        const response = await fetch('/api/partners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _method: 'DELETE',
            id: id
          })
        });

        console.log('Delete response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Delete response:', result);
          setPartners(partners.filter(partner => partner.id !== id));
        } else {
          const errorResult = await response.json();
          console.error('Delete error:', errorResult);
          alert('Failed to delete partner: ' + (errorResult.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting partner:', error);
        alert('Error deleting partner: ' + error.message);
      }
    }
  };

  const handleView = (id: number) => {
    window.open(`/partners/${id}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">All Partners</h1>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Partner
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Partners</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Partner
        </Button>
      </div>

      {partners.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No partners found</p>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create First Partner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {partners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{partner.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>{partner.type}</span>
                      <span>•</span>
                      <span>{formatDate(partner.created_at)}</span>
                      {partner.website_url && (
                        <>
                          <span>•</span>
                          <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Website
                          </a>
                        </>
                      )}
                    </div>
                    {partner.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {partner.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                      {partner.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(partner.id)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(partner.id)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(partner.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPartners;
