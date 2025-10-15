import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  CheckCircle 
} from 'lucide-react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';

interface Tour {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  duration: string;
  category: string;
  participant_pricing?: Array<{minParticipants: number, pricePerPerson: number}>;
  available_dates?: string[];
  start_date_date?: string;
  end_date_date?: string;
}

const BookTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [pricingData, setPricingData] = useState<Array<{minParticipants: number, pricePerPerson: number}>>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    // Tour Details
    tourName: '',
    groupSize: '1',
    tourPrice: '',
    
    // Additional Services
    hotelBaku: false,
    oneWayTransfer: false,
    roundTripTransfer: false,
    
    // Contact Information
    fullName: '',
    email: '',
    phone: '',
    country: '',
    
    // Booking Details
    preferredDate: '',
    alternativeDate: '',
    pickupLocation: '',
    informLater: false,
    specialRequests: '',
    
    // Agreement
    bookingRequest: false,
    terms: false
  });

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Check if tour data is available in URL parameters (from TourDetail page)
    const title = searchParams.get('title');
    const slug = searchParams.get('slug');
    const price = searchParams.get('price');
    const groupSize = searchParams.get('groupSize');
    const category = searchParams.get('category');
    const pricingParam = searchParams.get('pricing');
    const datesParam = searchParams.get('dates');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    if (title || slug || price || groupSize) {
      console.log('Using URL parameters:', { title, slug, price, groupSize, category, pricingParam, datesParam, startDateParam, endDateParam });
      console.log('Start date from URL:', startDateParam);
      console.log('End date from URL:', endDateParam);
      const priceValue = parseFloat(price?.replace(/[^0-9.]/g, '') || '0');
      const groupSizeValue = groupSize || '1';
      
      // Parse pricing data from URL
      let parsedPricing: Array<{minParticipants: number, pricePerPerson: number}> = [];
      let parsedDates: string[] = [];
      let basePriceForTour = priceValue;
      
      if (pricingParam) {
        try {
          parsedPricing = JSON.parse(decodeURIComponent(pricingParam));
          setPricingData(parsedPricing);
          console.log('Parsed pricing data:', parsedPricing);
          
          // For group tours, use the first pricing entry as base price per person
          if (category === 'group-tours' && parsedPricing.length > 0) {
            basePriceForTour = parsedPricing[0].pricePerPerson;
            console.log('Group tour detected - using base price per person:', basePriceForTour);
          }
        } catch (e) {
          console.error('Error parsing pricing data:', e);
        }
      }
      
      // Parse available dates from URL
      if (datesParam) {
        try {
          parsedDates = JSON.parse(decodeURIComponent(datesParam));
          setAvailableDates(parsedDates);
          console.log('Parsed available dates:', parsedDates);
        } catch (e) {
          console.error('Error parsing dates:', e);
        }
      }
      
      // Calculate initial price based on tour type
      let initialPrice = price || '';
      if (category === 'group-tours') {
        const groupSizeNum = parseInt(groupSizeValue);
        // If pricing data exists, use it; otherwise use the price from URL
        if (parsedPricing.length > 0) {
          const totalPrice = Math.round(basePriceForTour * groupSizeNum);
          initialPrice = `Total $${totalPrice}`;
          console.log('Initial price for group tour (from pricing data):', initialPrice);
        } else if (priceValue > 0) {
          // Use URL price as per-person price for group tours
          const totalPrice = Math.round(priceValue * groupSizeNum);
          initialPrice = `Total $${totalPrice}`;
          basePriceForTour = priceValue; // Set base price for future calculations
          console.log('Initial price for group tour (from URL price):', initialPrice);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        tourName: title || slug || '',
        tourPrice: initialPrice,
        groupSize: groupSizeValue
      }));
      // Set tour data from URL parameters
      setTour({
        id: parseInt(id || '0'),
        title: title || slug || '',
        description: '',
        image_url: '',
        price: basePriceForTour,
        duration: '',
        category: category || '',
        participant_pricing: parsedPricing,
        available_dates: parsedDates,
        start_date_date: startDateParam || '',
        end_date_date: endDateParam || ''
      });
      setLoading(false); // Stop loading when using URL parameters
    } else {
      // Only fetch from API if no URL parameters
      fetchTourDetails();
    }
  }, [id, navigate, toast, token, searchParams]);

  // Debug: Log formData changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const fetchTourDetails = async () => {
    try {
      console.log('Fetching tour details for ID:', id);
      const response = await fetch(`/api/tour-detail-simple?id=${id}`);
      const data = await response.json();
      
      console.log('Tour API response:', data);
      console.log('Tour data structure:', data.data);
      console.log('Tour object:', data.data?.tour);
      console.log('Tour title:', data.data?.tour?.title);
      console.log('Tour price:', data.data?.tour?.price);
      
      if (data.success) {
        const tourData = data.data?.tour;
        console.log('Tour data loaded:', tourData);
        console.log('Start date from API:', tourData?.start_date_date);
        console.log('End date from API:', tourData?.end_date_date);
        setTour(tourData);
        
        // Store pricing data if available
        if (tourData?.participant_pricing) {
          setPricingData(tourData.participant_pricing);
          console.log('Pricing data from API:', tourData.participant_pricing);
        }
        
        // Store available dates if available
        if (tourData?.available_dates) {
          setAvailableDates(tourData.available_dates);
          console.log('Available dates from API:', tourData.available_dates);
        }
        
        // Pre-fill form with tour data
        const tourTitle = tourData?.title || 'Tour Name Not Available';
        const tourPrice = tourData?.price || 0;
        console.log('Pre-filling form with:', {
          tourName: tourTitle,
          tourPrice: `$${tourPrice}`,
          groupSize: '1'
        });
        setFormData(prev => ({
          ...prev,
          tourName: tourTitle,
          tourPrice: `$${tourPrice}`,
          groupSize: '1' // Default group size
        }));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // If group size changes, calculate price based on tour category
    if (name === 'groupSize') {
      const newGroupSize = parseInt(value) || 1;
      
      // Check if this is a group tour
      const isGroupTour = tour?.category === 'group-tours';
      console.log('Group size change:', { 
        newGroupSize, 
        category: tour?.category, 
        isGroupTour, 
        pricingDataLength: pricingData.length,
        pricingData
      });
      
      if (isGroupTour && pricingData.length > 0) {
        // For group tours: multiply per-person price by number of participants
        // Get the base price per person (usually from first pricing entry)
        const basePricePerPerson = pricingData[0]?.pricePerPerson || 0;
        const totalPrice = Math.round(basePricePerPerson * newGroupSize);
        console.log(`Group tour: ${newGroupSize} people × $${basePricePerPerson} = $${totalPrice}`);
        setFormData(prev => ({
          ...prev,
          groupSize: value,
          tourPrice: `Total $${totalPrice}`
        }));
      } else if (pricingData.length > 0) {
        // For private tours: use predefined pricing for each group size
        const pricing = pricingData.find(p => p.minParticipants === newGroupSize);
        
        if (pricing) {
          const totalPrice = Math.round(pricing.pricePerPerson);
          console.log(`Private tour: ${newGroupSize} people = $${totalPrice}`);
          setFormData(prev => ({
            ...prev,
            groupSize: value,
            tourPrice: `Total $${totalPrice}`
          }));
        } else {
          // If no pricing found for this group size, just update group size
          setFormData(prev => ({
            ...prev,
            groupSize: value
          }));
        }
      } else {
        // No pricing data available - try to use tour.price as fallback
        console.log('No pricing data available - using fallback price calculation');
        if (tour?.price && isGroupTour) {
          // If it's a group tour and we have a base price, multiply by group size
          const totalPrice = Math.round(tour.price * newGroupSize);
          console.log(`Fallback group tour: ${newGroupSize} people × $${tour.price} = $${totalPrice}`);
          setFormData(prev => ({
            ...prev,
            groupSize: value,
            tourPrice: `Total $${totalPrice}`
          }));
        } else {
          // Just update group size without changing price
          setFormData(prev => ({
            ...prev,
            groupSize: value
          }));
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);

    if (!formData.preferredDate) {
      toast({
        title: "Date Required",
        description: "Please select a preferred tour date.",
        variant: "destructive"
      });
      setBooking(false);
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Contact Information Required",
        description: "Please fill in all required contact fields.",
        variant: "destructive"
      });
      setBooking(false);
      return;
    }

    if (!formData.bookingRequest || !formData.terms) {
      toast({
        title: "Agreement Required",
        description: "Please accept the booking request and terms & conditions.",
        variant: "destructive"
      });
      setBooking(false);
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

    try {
      console.log('Submitting booking:', {
        tourId: tour?.id,
        tourTitle: tour?.title,
        tourCategory: tour?.category,
        formData: formData
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
          formData: formData
        })
      });

      const data = await response.json();
      console.log('Booking response:', data);

      if (data.success) {
        toast({
          title: "Booking Successful!",
          description: "Your tour has been booked successfully. You will receive a confirmation email shortly.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Booking Failed",
          description: data.error || "Failed to book tour. Please try again.",
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
        <div className="p-6 pt-32">
          <div className="container mx-auto">
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
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="p-6 pt-32">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tour Not Found</h1>
            <p className="text-muted-foreground mb-6">The tour you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/tours')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      <div className="p-6 pt-32">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/tours')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </div>

          {/* Booking Form */}
          <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Request</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below to book your tour
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Tour Details Section */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Tour Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="tourName">Tour Name</Label>
                          <Input
                            id="tourName"
                            name="tourName"
                            value={formData.tourName}
                            readOnly
                            className="mt-1 bg-muted"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="groupSize">Group Size *</Label>
                          <select
                            id="groupSize"
                            name="groupSize"
                            value={formData.groupSize}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-input rounded-md bg-background mt-1"
                          >
                            {tour?.category === 'group-tours' ? (
                              // For group tours, show all options 1-10 since pricing is per person
                              <>
                                <option value="1">1 Person</option>
                                <option value="2">2 People</option>
                                <option value="3">3 People</option>
                                <option value="4">4 People</option>
                                <option value="5">5 People</option>
                                <option value="6">6 People</option>
                                <option value="7">7 People</option>
                                <option value="8">8 People</option>
                                <option value="9">9 People</option>
                                <option value="10">10 People</option>
                              </>
                            ) : pricingData.length > 0 ? (
                              // For private tours, show only available group sizes from pricing data
                              pricingData.map((pricing, index) => (
                                <option key={index} value={pricing.minParticipants.toString()}>
                                  {pricing.minParticipants} {pricing.minParticipants === 1 ? 'Person' : 'People'}
                                </option>
                              ))
                            ) : (
                              // Fallback to default options if no pricing data
                              <>
                                <option value="1">1 Person</option>
                                <option value="2">2 People</option>
                                <option value="3">3 People</option>
                                <option value="4">4 People</option>
                                <option value="5">5 People</option>
                                <option value="6">6 People</option>
                                <option value="7">7 People</option>
                                <option value="8">8 People</option>
                                <option value="9">9 People</option>
                                <option value="10">10 People</option>
                              </>
                            )}
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="tourPrice">Tour Price</Label>
                          <Input
                            id="tourPrice"
                            name="tourPrice"
                            value={formData.tourPrice}
                            readOnly
                            className="mt-1 bg-muted"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Service Requests Section */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Additional Service Requests</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="hotelBaku"
                            name="hotelBaku"
                            checked={formData.hotelBaku}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <Label htmlFor="hotelBaku" className="cursor-pointer">
                            <strong>Hotel in Baku:</strong> 4-star hotel near the city center, $80 per person per night.
                          </Label>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="oneWayTransfer"
                            name="oneWayTransfer"
                            checked={formData.oneWayTransfer}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <Label htmlFor="oneWayTransfer" className="cursor-pointer">
                            <strong>One-way transfer (Airport ↔ Hotel):</strong> $35 to $55 depending on group size and vehicle type.
                          </Label>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="roundTripTransfer"
                            name="roundTripTransfer"
                            checked={formData.roundTripTransfer}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <Label htmlFor="roundTripTransfer" className="cursor-pointer">
                            <strong>Round-trip transfer (Airport ↔ Hotel ↔ Airport):</strong> $70 to $110 depending on group size and vehicle type.
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Contact Information (Primary traveler)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className="mt-1"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            className="mt-1"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">WhatsApp / Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+994 50 123 4567"
                            className="mt-1"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="country">Country of Residence (Optional)</Label>
                          <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Your country"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Booking Details Section */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tour?.category === 'group-tours' ? (
                          // For group tours: show tour dates from database
                          (availableDates.length > 0 || (tour?.start_date_date && tour?.end_date_date)) ? (
                            <div className="md:col-span-2">
                              <Label htmlFor="preferredDate">Select Tour Date *</Label>
                              <select
                                id="preferredDate"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-input rounded-md bg-background mt-1"
                                required
                              >
                                <option value="">Choose a date</option>
                                {availableDates.length > 0 ? (
                                  // Use available_dates if available
                                  availableDates.map((date, index) => (
                                    <option key={index} value={date}>
                                      {new Date(date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </option>
                                  ))
                                ) : (
                                  // Use start_date_date and end_date_date from database
                                  tour.start_date_date && tour.end_date_date && (
                                    <>
                                      <option value={tour.start_date_date}>
                                        {new Date(tour.start_date_date).toLocaleDateString('en-US', { 
                                          weekday: 'long', 
                                          year: 'numeric', 
                                          month: 'long', 
                                          day: 'numeric' 
                                        })} (Start Date)
                                      </option>
                                      <option value={tour.end_date_date}>
                                        {new Date(tour.end_date_date).toLocaleDateString('en-US', { 
                                          weekday: 'long', 
                                          year: 'numeric', 
                                          month: 'long', 
                                          day: 'numeric' 
                                        })} (End Date)
                                      </option>
                                    </>
                                  )
                                )}
                              </select>
                            </div>
                          ) : (
                            <div className="md:col-span-2">
                              <div className="space-y-2">
                                <Label>Tour Dates</Label>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  {tour.start_date_date && (
                                    <p className="text-blue-800 font-medium">
                                      Start Date: {new Date(tour.start_date_date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </p>
                                  )}
                                  {tour.end_date_date && (
                                    <p className="text-blue-800 font-medium">
                                      End Date: {new Date(tour.end_date_date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </p>
                                  )}
                                </div>
                                <Input
                                  id="preferredDate"
                                  name="preferredDate"
                                  type="text"
                                  value={formData.preferredDate}
                                  onChange={handleInputChange}
                                  placeholder="Confirm your participation"
                                  className="mt-2"
                                  required
                                />
                              </div>
                            </div>
                          )
                        ) : (
                          // For private tours: show date input fields
                          <>
                            <div>
                              <Label htmlFor="preferredDate">Preferred Tour Date *</Label>
                              <Input
                                id="preferredDate"
                                name="preferredDate"
                                type="date"
                                value={formData.preferredDate}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="mt-1"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="alternativeDate">Alternative Date (Optional)</Label>
                              <Input
                                id="alternativeDate"
                                name="alternativeDate"
                                type="date"
                                value={formData.alternativeDate}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}
                        
                        <div>
                          <Label htmlFor="pickupLocation">Pickup Location *</Label>
                          <Input
                            id="pickupLocation"
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={handleInputChange}
                            placeholder="Hotel name or address"
                            className="mt-1"
                            required
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-6">
                          <input
                            type="checkbox"
                            id="informLater"
                            name="informLater"
                            checked={formData.informLater}
                            onChange={handleInputChange}
                          />
                          <Label htmlFor="informLater" className="cursor-pointer">
                            I will inform you later
                          </Label>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                        <Textarea
                          id="specialRequests"
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          placeholder="Any dietary restrictions, accessibility needs, etc."
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Agreement Section */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="bookingRequest"
                          name="bookingRequest"
                          checked={formData.bookingRequest}
                          onChange={handleInputChange}
                          className="mt-1"
                          required
                        />
                        <Label htmlFor="bookingRequest" className="cursor-pointer">
                          I understand this is a booking request. Payment will follow after confirmation *
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleInputChange}
                          className="mt-1"
                          required
                        />
                        <Label htmlFor="terms" className="cursor-pointer">
                          I agree to the <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> *
                        </Label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                        disabled={booking}
                      >
                        {booking ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        {booking ? 'Sending...' : 'Send Booking Request'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookTour;