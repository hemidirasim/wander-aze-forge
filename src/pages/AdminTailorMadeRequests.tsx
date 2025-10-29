import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Calendar, Users, MapPin, MessageSquare, Loader2, Trash2, Eye, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TailorMadeRequest {
  id: number;
  email: string;
  full_name: string;
  adventure_types: string[];
  destinations: string;
  start_date: string;
  duration: string;
  daily_kilometers: string;
  number_of_people: string;
  children_ages?: string;
  accommodation_preferences: string[];
  budget: string;
  additional_details: string;
  agree_to_terms: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminTailorMadeRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<TailorMadeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TailorMadeRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tailor-made/requests');
      console.log('Fetch requests response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched requests:', data);
        setRequests(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch requests:', errorData);
        alert('Failed to load requests: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('Error loading requests: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (request: TailorMadeRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleDeleteRequest = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/tailor-made/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRequests(requests.filter(req => req.id !== id));
        if (selectedRequest?.id === id) {
          setViewDialogOpen(false);
          setSelectedRequest(null);
        }
      } else {
        alert('Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request');
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      setUpdating(id);
      const response = await fetch(`/api/tailor-made/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequests(requests.map(req => 
          req.id === id ? { ...req, status: newStatus } : req
        ));
        if (selectedRequest?.id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      in_progress: { variant: 'default' as const, label: 'In Progress' },
      completed: { variant: 'default' as const, label: 'Completed' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
        <h1 className="text-3xl font-bold">Tailor-Made Requests</h1>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No tailor-made requests yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{request.full_name}</CardTitle>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{request.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Start: {new Date(request.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{request.number_of_people}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{request.destinations.substring(0, 50)}...</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRequest(request.id)}
                      disabled={deleting === request.id}
                    >
                      {deleting === request.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Adventure Types:</span>{' '}
                    <span className="text-muted-foreground">
                      {request.adventure_types.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span>{' '}
                    <span className="text-muted-foreground">{request.duration}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Daily Distance:</span>{' '}
                    <span className="text-muted-foreground">{request.daily_kilometers}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Budget:</span>{' '}
                    <span className="text-muted-foreground">{request.budget}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Accommodation:</span>{' '}
                    <span className="text-muted-foreground">
                      {request.accommodation_preferences.join(', ')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Tailor-Made Request from {selectedRequest?.full_name}
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedRequest && formatDate(selectedRequest.created_at)}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Status Update */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <span className="font-semibold">Status:</span>
                {getStatusBadge(selectedRequest.status)}
                <Select
                  value={selectedRequest.status}
                  onValueChange={(value) => handleStatusUpdate(selectedRequest.id, value)}
                  disabled={updating === selectedRequest.id}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {updating === selectedRequest.id && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <div>
                    <span className="font-semibold">Full Name:</span>
                    <p className="text-muted-foreground">{selectedRequest.full_name}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>
                    <p className="text-muted-foreground">{selectedRequest.email}</p>
                  </div>
                  {selectedRequest.children_ages && (
                    <div>
                      <span className="font-semibold">Children Ages:</span>
                      <p className="text-muted-foreground">{selectedRequest.children_ages}</p>
                    </div>
                  )}
                </div>

                {/* Trip Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Trip Details</h3>
                  <div>
                    <span className="font-semibold">Start Date:</span>
                    <p className="text-muted-foreground">
                      {new Date(selectedRequest.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span>
                    <p className="text-muted-foreground">{selectedRequest.duration}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Number of People:</span>
                    <p className="text-muted-foreground">{selectedRequest.number_of_people}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Daily Distance:</span>
                    <p className="text-muted-foreground">{selectedRequest.daily_kilometers}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Budget:</span>
                    <p className="text-muted-foreground">{selectedRequest.budget}</p>
                  </div>
                </div>
              </div>

              {/* Adventure Types */}
              <div>
                <span className="font-semibold">Adventure Types:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRequest.adventure_types.map((type) => (
                    <Badge key={type} variant="outline">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Destinations */}
              <div>
                <span className="font-semibold">Destinations:</span>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                  {selectedRequest.destinations}
                </p>
              </div>

              {/* Accommodation Preferences */}
              <div>
                <span className="font-semibold">Accommodation Preferences:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRequest.accommodation_preferences.map((pref) => (
                    <Badge key={pref} variant="secondary">
                      {pref.charAt(0).toUpperCase() + pref.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <span className="font-semibold">Additional Details:</span>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                  {selectedRequest.additional_details}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteRequest(selectedRequest.id)}
                  disabled={deleting === selectedRequest.id}
                >
                  {deleting === selectedRequest.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </Button>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTailorMadeRequests;
