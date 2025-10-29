import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, Calendar, Users, MapPin, MessageSquare, Loader2, Trash2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContactMessage {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  tour_category?: string;
  tour_type?: string;
  group_size?: number;
  dates?: string;
  message: string;
  newsletter: boolean;
  created_at: string;
}

const AdminContactMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) {
          setViewDialogOpen(false);
          setSelectedMessage(null);
        }
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } finally {
      setDeleting(null);
    }
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
        <h1 className="text-3xl font-bold">Contact Messages</h1>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No contact messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {message.first_name} {message.last_name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{message.email}</span>
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{message.phone}</span>
                        </div>
                      )}
                      {message.country && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{message.country}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(message.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMessage(message)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMessage(message.id)}
                      disabled={deleting === message.id}
                    >
                      {deleting === message.id ? (
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
                  {message.tour_category && (
                    <div>
                      <span className="font-semibold">Tour Category:</span>{' '}
                      <span className="text-muted-foreground">{message.tour_category}</span>
                    </div>
                  )}
                  {message.tour_type && (
                    <div>
                      <span className="font-semibold">Tour:</span>{' '}
                      <span className="text-muted-foreground">{message.tour_type}</span>
                    </div>
                  )}
                  {message.group_size && (
                    <div>
                      <span className="font-semibold">Group Size:</span>{' '}
                      <span className="text-muted-foreground">{message.group_size} people</span>
                    </div>
                  )}
                  {message.dates && (
                    <div>
                      <span className="font-semibold">Preferred Dates:</span>{' '}
                      <span className="text-muted-foreground">{message.dates}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Message:</span>
                    <p className="text-muted-foreground mt-1 line-clamp-2">{message.message}</p>
                  </div>
                  {message.newsletter && (
                    <div className="text-sm text-primary">
                      ✓ Subscribed to newsletter
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Message from {selectedMessage?.first_name} {selectedMessage?.last_name}
            </DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && formatDate(selectedMessage.created_at)}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Email:</span>
                  <p className="text-muted-foreground">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span className="font-semibold">Phone:</span>
                    <p className="text-muted-foreground">{selectedMessage.phone}</p>
                  </div>
                )}
                {selectedMessage.country && (
                  <div>
                    <span className="font-semibold">Country:</span>
                    <p className="text-muted-foreground">{selectedMessage.country}</p>
                  </div>
                )}
                {selectedMessage.tour_category && (
                  <div>
                    <span className="font-semibold">Tour Category:</span>
                    <p className="text-muted-foreground">{selectedMessage.tour_category}</p>
                  </div>
                )}
                {selectedMessage.tour_type && (
                  <div>
                    <span className="font-semibold">Tour:</span>
                    <p className="text-muted-foreground">{selectedMessage.tour_type}</p>
                  </div>
                )}
                {selectedMessage.group_size && (
                  <div>
                    <span className="font-semibold">Group Size:</span>
                    <p className="text-muted-foreground">{selectedMessage.group_size} people</p>
                  </div>
                )}
                {selectedMessage.dates && (
                  <div>
                    <span className="font-semibold">Preferred Dates:</span>
                    <p className="text-muted-foreground">{selectedMessage.dates}</p>
                  </div>
                )}
              </div>
              <div>
                <span className="font-semibold">Message:</span>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              {selectedMessage.newsletter && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <span className="text-primary font-semibold">
                    ✓ Subscribed to newsletter
                  </span>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  disabled={deleting === selectedMessage.id}
                >
                  {deleting === selectedMessage.id ? (
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

export default AdminContactMessages;

