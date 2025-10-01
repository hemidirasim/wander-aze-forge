import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  Clock, 
  User, 
  Phone,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';

interface Tour {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  image_url: string;
  highlights: string[];
  included: string[];
  not_included: string[];
}

const BookTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tourDate: '',
    participants: 1,
    specialRequests: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  useEffect(() => {
    // Check authentication
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a tour.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setToken(storedToken);

    // Fetch tour details
    fetchTourDetails();
  }, [id, navigate, toast]);

  const fetchTourDetails = async () => {
    try {
      console.log('Fetching tour details for ID:', id);
      const response = await fetch(`/api/tour-detail-simple?id=${id}`);
      const data = await response.json();
      
      console.log('Tour API response:', data);
      
      if (data.success) {
        console.log('Tour data loaded:', data.data);
        setTour(data.data);
      } else {
        console.error('Tour not found:', data);
        toast({
          title: "Tour Not Found",
          description: "The tour you're looking for doesn't exist.",
          variant: "destructive"
        });
        navigate('/tours');
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
      toast({
        title: "Error",
        description: "Failed to load tour details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'participants' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.tourDate) {
      toast({
        title: "Date Required",
        description: "Please select a tour date.",
        variant: "destructive"
      });
      return;
    }

    if (formData.participants < 1 || formData.participants > 20) {
      toast({
        title: "Invalid Participants",
        description: "Number of participants must be between 1 and 20.",
        variant: "destructive"
      });
      return;
    }

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a tour.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    setBooking(true);

    try {
      console.log('Submitting booking:', {
        tourId: tour?.id,
        tourTitle: tour?.title,
        tourCategory: tour?.category,
        tourDate: formData.tourDate,
        participants: formData.participants,
        totalPrice: tour ? tour.price * formData.participants : 0,
        token: token ? 'present' : 'missing'
      });

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tourId: tour?.id,
          tourTitle: tour?.title,
          tourCategory: tour?.category,
          tourDate: formData.tourDate,
          participants: formData.participants,
          totalPrice: tour ? tour.price * formData.participants : 0,
          specialRequests: formData.specialRequests,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        toast({
          title: "Booking Successful!",
          description: "Your tour has been booked. You will receive a confirmation email shortly.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Booking Failed",
          description: data.error || "Failed to book the tour.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="container mx-auto p-6 pt-24">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="container mx-auto p-6 pt-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Tour Not Found</h1>
          <p className="text-muted-foreground mb-6">The tour you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/tours')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      <div className="container mx-auto p-6 pt-24">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/tours')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tours
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Book Your Tour</h1>
          <p className="text-muted-foreground">Complete your booking for {tour.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tour Details */}
          <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{tour.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tour.category}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tour.image_url && (
                    <img 
                      src={tour.image_url} 
                      alt={tour.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <p className="text-muted-foreground">{tour.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm">{tour.category}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">Price per person:</span>
                        <span className="text-3xl font-bold text-primary">${tour?.price || 0}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Total price will be calculated based on number of participants
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          {/* Booking Form */}
          <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill in your booking information
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="tourDate">Tour Date</Label>
                      <Input
                        id="tourDate"
                        name="tourDate"
                        type="date"
                        value={formData.tourDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="participants">Number of Participants</Label>
                      <Input
                        id="participants"
                        name="participants"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.participants}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requirements or requests..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-foreground mb-3">Emergency Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="emergencyContactName">Contact Name</Label>
                          <Input
                            id="emergencyContactName"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleInputChange}
                            placeholder="Full name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                          <Input
                            id="emergencyContactPhone"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleInputChange}
                            placeholder="+994 50 123 45 67"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="bg-primary/10 p-4 rounded-lg mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">Total Price:</span>
                          <span className="text-3xl font-bold text-primary">
                            ${(tour?.price || 0) * formData.participants}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          ${tour?.price || 0} × {formData.participants} participant{formData.participants > 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            console.log('Test button clicked');
                            alert('Test button works!');
                          }}
                        >
                          Test Button
                        </Button>
                        
                        <Button 
                          type="submit" 
                          className="w-full h-12 text-base"
                          disabled={booking}
                          onClick={(e) => {
                            e.preventDefault();
                            console.log('Button clicked');
                            console.log('Form data:', formData);
                            console.log('Tour data:', tour);
                            console.log('Token:', token ? 'present' : 'missing');
                            handleSubmit(e);
                          }}
                        >
                          {booking ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          {booking ? 'Booking...' : 'Book Tour'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookTour;
