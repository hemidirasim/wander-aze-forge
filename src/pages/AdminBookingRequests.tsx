import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Eye, Calendar, Users, MapPin, Phone, Mail, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface BookingRequest {
  id: number;
  user_id?: number;
  tour_id: number;
  tour_title: string;
  tour_category: string;
  group_size: number;
  tour_price?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  country?: string;
  booking_date?: string;
  preferred_date?: string;
  alternative_date?: string;
  pickup_location?: string;
  inform_later: boolean;
  special_requests?: string;
  booking_request: boolean;
  terms_accepted: boolean;
  status: string;
  total_price?: number;
  created_at: string;
  updated_at: string;
}

const AdminBookingRequests = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings/requests');
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch booking requests",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch booking requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking request?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Booking request deleted successfully"
        });
        fetchBookings();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete booking request",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking request",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Booking status updated successfully"
        });
        fetchBookings();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update booking status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading booking requests...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Booking Requests</h1>
          <p className="text-muted-foreground">
            Manage tour booking requests from customers
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No booking requests</h3>
              <p className="text-muted-foreground">
                No booking requests have been submitted yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {booking.tour_title}
                    </CardTitle>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.tour_category}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{booking.customer_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{booking.customer_email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{booking.customer_phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{booking.group_size} people</span>
                  </div>
                  
                  {booking.preferred_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(booking.preferred_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {booking.total_price && (
                    <div className="text-sm font-semibold text-primary">
                      ${booking.total_price}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {formatDate(booking.created_at)}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Dialog open={isDialogOpen && selectedBooking?.id === booking.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Booking Request Details</DialogTitle>
                        </DialogHeader>
                        {selectedBooking && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="font-semibold">Tour:</span>
                                <p className="text-muted-foreground">{selectedBooking.tour_title}</p>
                              </div>
                              <div>
                                <span className="font-semibold">Category:</span>
                                <p className="text-muted-foreground">{selectedBooking.tour_category}</p>
                              </div>
                              <div>
                                <span className="font-semibold">Customer:</span>
                                <p className="text-muted-foreground">{selectedBooking.customer_name}</p>
                              </div>
                              <div>
                                <span className="font-semibold">Email:</span>
                                <p className="text-muted-foreground">{selectedBooking.customer_email}</p>
                              </div>
                              <div>
                                <span className="font-semibold">Phone:</span>
                                <p className="text-muted-foreground">{selectedBooking.customer_phone}</p>
                              </div>
                              <div>
                                <span className="font-semibold">Group Size:</span>
                                <p className="text-muted-foreground">{selectedBooking.group_size} people</p>
                              </div>
                              {selectedBooking.country && (
                                <div>
                                  <span className="font-semibold">Country:</span>
                                  <p className="text-muted-foreground">{selectedBooking.country}</p>
                                </div>
                              )}
                              {selectedBooking.preferred_date && (
                                <div>
                                  <span className="font-semibold">Preferred Date:</span>
                                  <p className="text-muted-foreground">
                                    {new Date(selectedBooking.preferred_date).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {selectedBooking.alternative_date && (
                                <div>
                                  <span className="font-semibold">Alternative Date:</span>
                                  <p className="text-muted-foreground">
                                    {new Date(selectedBooking.alternative_date).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {selectedBooking.pickup_location && (
                                <div>
                                  <span className="font-semibold">Pickup Location:</span>
                                  <p className="text-muted-foreground">{selectedBooking.pickup_location}</p>
                                </div>
                              )}
                              {selectedBooking.total_price && (
                                <div>
                                  <span className="font-semibold">Total Price:</span>
                                  <p className="text-muted-foreground">${selectedBooking.total_price}</p>
                                </div>
                              )}
                            </div>
                            
                            {selectedBooking.special_requests && (
                              <div>
                                <span className="font-semibold">Special Requests:</span>
                                <p className="text-muted-foreground mt-1">{selectedBooking.special_requests}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">Status:</span>
                              <Select
                                value={selectedBooking.status}
                                onValueChange={(value) => handleStatusUpdate(selectedBooking.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              <p>Created: {formatDate(selectedBooking.created_at)}</p>
                              <p>Updated: {formatDate(selectedBooking.updated_at)}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingRequests;
