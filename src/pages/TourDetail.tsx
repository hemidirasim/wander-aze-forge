import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import DatabaseTourProgramAccordion from '@/components/DatabaseTourProgramAccordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Users, MapPin, Star, CheckCircle, Calendar, Phone, ArrowLeft, ArrowRight, Loader2, Eye, Info, Sparkles, CalendarDays, Bed, Utensils, Shirt, Car, Camera, DollarSign, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Declare Fancybox for TypeScript
declare global {
  interface Window {
    Fancybox: any;
  }
}

interface TourData {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  difficulty: string;
  rating: number;
  reviews_count: number;
  group_size: string;
  max_participants: number;
  booked_seats: number;
  location: string;
  total_hiking_distance: string;
  total_elevation_gain: string;
  total_elevation_loss: string;
  overview: string;
  best_season: string;
  meeting_point: string;
  languages: string;
  accommodation_details: string;
  meals_details: string;
  water_snacks_details: string;
  provided_equipment: string[];
  what_to_bring: string[];
  transport_details: string;
  pickup_service: string;
  gallery_images: string[];
  photography_service: string;
  price_includes: string[];
  group_discounts: string;
  early_bird_discount: string;
  contact_phone: string;
  booking_terms: string;
  is_active: boolean;
  featured: boolean;
  image_url: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: string;
  requirements: string;
  special_fields: any;
  category: string;
  tour_programs: any[];
  participant_pricing: Array<{minParticipants: number, pricePerPerson: number}>;
  available_dates?: string[];
  start_date?: string;
  end_date?: string;
}

interface ProgramData {
  id: number;
  tour_id: number;
  day_number: number;
  title: string;
  description: string;
  activities: string;
  meals: string;
  accommodation: string;
  transport: string;
  highlights: string;
  duration: string;
  difficulty_level: string;
  distance: string;
  elevation_gain: string;
}

// Format price helper
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  return `From $${Math.round(numPrice)}`;
};

const TourDetail = () => {
  const { id, category } = useParams();
  const [tour, setTour] = useState<TourData | null>(null);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');
  const [isGroupSelected, setIsGroupSelected] = useState(false);
  const [similarTours, setSimilarTours] = useState<TourData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset pricing state when tour changes
    setSelectedParticipants('');
    setSelectedPrice('');
    setIsGroupSelected(false);
    
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        // Check if id is numeric (ID) or string (slug)
        const isNumericId = !isNaN(Number(id));
        const param = isNumericId ? `id=${id}` : `slug=${id}`;
        const response = await fetch(`/api/tour-detail-simple?${param}&category=${category}`);
        const result = await response.json();

        if (result.success) {
          setTour(result.data.tour);
          
          console.log('Full API response:', result);
          console.log('Tour data:', result.data.tour);
          console.log('Tour programs from API:', result.data.programs);
          console.log('Tour programs from tour:', result.data.tour.tour_programs);
          
          // Parse tour_programs if it's a string
          let tourPrograms = result.data.programs || result.data.tour.tour_programs || [];
          if (typeof tourPrograms === 'string') {
            try {
              tourPrograms = JSON.parse(tourPrograms);
            } catch (e) {
              console.error('Error parsing tour_programs:', e);
              tourPrograms = [];
            }
          }
          
          console.log('Final tour programs:', tourPrograms);
          setPrograms(tourPrograms);
        } else {
          setError(result.error || 'Failed to load tour');
        }
      } catch (err) {
        setError('Failed to load tour details');
        console.error('Error fetching tour detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTourDetail();
    }
  }, [id, category]);

  // Fetch similar tours
  useEffect(() => {
    const fetchSimilarTours = async () => {
      if (!tour || !category) return;
      
      try {
        const response = await fetch(`/api/tours?category=${category}`);
        const result = await response.json();
        
        if (result.success) {
          // Filter out current tour and limit to 3
          const filtered = result.data
            .filter((t: TourData) => t.id !== tour.id)
            .slice(0, 3);
          setSimilarTours(filtered);
        }
      } catch (error) {
        console.error('Error fetching similar tours:', error);
      }
    };
    
    fetchSimilarTours();
  }, [tour, category]);

  // Initialize Fancybox for gallery images
  useEffect(() => {
    if (window.Fancybox && tour && tour.gallery_images && tour.gallery_images.length > 0) {
      window.Fancybox.bind('[data-fancybox="tour-gallery"]', {
        Thumbs: {
          autoStart: false,
        },
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
            right: ["slideshow", "thumbs", "close"]
          }
        }
      });
    }

    // Cleanup Fancybox when component unmounts
    return () => {
      if (window.Fancybox) {
        window.Fancybox.destroy();
      }
    };
  }, [tour?.gallery_images]);

  // Handle gallery scroll for mobile carousel
  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        const scrollLeft = galleryRef.current.scrollLeft;
        const width = galleryRef.current.offsetWidth;
        const newIndex = Math.round(scrollLeft / width);
        setCurrentImageIndex(newIndex);
      }
    };

    const gallery = galleryRef.current;
    if (gallery) {
      gallery.addEventListener('scroll', handleScroll);
      return () => gallery.removeEventListener('scroll', handleScroll);
    }
  }, [tour?.gallery_images]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="pt-32 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading tour details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="pt-32 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Tour Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The tour you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link to="/tours">Browse All Tours</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get main image from gallery or use image_url
  const mainImage = tour.gallery_images && tour.gallery_images.length > 0 
    ? tour.gallery_images[0] 
    : tour.image_url || '/placeholder-tour.jpg';

  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      
      {/* Back Button */}
      <section className="pt-40 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to={category ? `/tours/${category}` : '/tours'} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {category ? `${category} tours` : 'tours'}
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Section - Split Layout */}
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Title and Details */}
            <div className="space-y-6">
              <div className="flex items-center flex-wrap gap-3">
                {tour.category?.toLowerCase() !== 'culture' && tour.category?.toLowerCase() !== 'cultural' && (
                  <Badge variant="secondary" className="bg-white/90 text-foreground">{tour.difficulty}</Badge>
                )}
                <Badge variant="secondary" className="bg-white/90 text-foreground">{tour.duration}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-current text-autumn" />
                  <span className="font-semibold">{tour.reviews_count === 0 ? 5 : tour.rating}</span>
                  <span className="text-muted-foreground text-sm">({tour.reviews_count} reviews)</span>
                </div>
              </div>
              
              {/* Hiking Details */}
              {(tour.total_hiking_distance || tour.total_elevation_gain || tour.total_elevation_loss) && (
                <div className="flex flex-wrap gap-4">
                  {tour.total_hiking_distance && (
                    <div className="flex items-center space-x-2 bg-primary/10 text-foreground px-3 py-2 rounded-lg">
                      <span className="font-semibold">Distance:</span>
                      <span>{tour.total_hiking_distance}</span>
                    </div>
                  )}
                  {tour.total_elevation_gain && (
                    <div className="flex items-center space-x-2 bg-primary/10 text-foreground px-3 py-2 rounded-lg">
                      <span className="font-semibold">↑ Gain:</span>
                      <span>{tour.total_elevation_gain}</span>
                    </div>
                  )}
                  {tour.total_elevation_loss && (
                    <div className="flex items-center space-x-2 bg-primary/10 text-foreground px-3 py-2 rounded-lg">
                      <span className="font-semibold">↓ Loss:</span>
                      <span>{tour.total_elevation_loss}</span>
                    </div>
                  )}
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                {tour.title}
              </h1>
              
              {/* Tour Dates */}
              {(tour.start_date || tour.end_date) && (
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {tour.start_date && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">Start:</span>
                      <span>{new Date(tour.start_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  )}
                  {tour.end_date && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">End:</span>
                      <span>{new Date(tour.end_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            </div>

            {/* Right Side - Main Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={mainImage} 
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Tour Details */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* 1. Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Eye className="w-6 h-6 text-primary" />
                    Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="text-muted-foreground prose max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: tour.overview || `This ${tour.category} adventure offers an incredible opportunity to explore Azerbaijan's stunning landscapes and rich cultural heritage. Perfect for ${tour.difficulty.toLowerCase()} level adventurers, this tour combines natural beauty with authentic local experiences.`
                    }}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Duration</div>
                        <div className="text-muted-foreground">{tour.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Group Size</div>
                        <div className="text-muted-foreground">
                          {tour.max_participants ? `max ${tour.max_participants} participants` : 
                           tour.group_size || 'Small group (4-8 people)'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Location</div>
                        <div className="text-muted-foreground">{tour.location}</div>
                      </div>
                    </div>
                    {tour.category === 'group-tours' && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-semibold">Availability</div>
                          <div className="text-muted-foreground">
                            {tour.booked_seats !== undefined && tour.max_participants ? (
                              <>
                                <span className="font-bold">{tour.max_participants - tour.booked_seats} spots</span>
                                {' available ('}
                                <span className="font-bold">{tour.booked_seats} booked</span>
                                {')'}
                              </>
                            ) : (
                              'Spots available'
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 1.5. Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Info className="w-6 h-6 text-primary" />
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tour.category?.toLowerCase() !== 'culture' && tour.category?.toLowerCase() !== 'cultural' && (
                      <div>
                        <h4 className="font-semibold mb-2">Difficulty Level</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{tour.difficulty} - {tour.requirements || 'Suitable for participants with appropriate fitness level'}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-2">Best Season</h4>
                      <p className="text-muted-foreground">{tour.best_season || 'May to October (weather dependent)'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Meeting Point</h4>
                      <p className="text-muted-foreground">{tour.meeting_point || 'Baku city center (exact location provided upon booking)'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Language</h4>
                      <p className="text-muted-foreground">{tour.languages || 'English, Azerbaijani, Russian'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 1.6. Highlights & Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Highlights & Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tour Highlights */}
                  {tour.highlights && tour.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Tour Highlights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tour.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What's Included */}
                  {tour.includes && tour.includes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">What's Included</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tour.includes.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What's Excluded */}
                  {tour.excludes && tour.excludes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">What's Excluded</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tour.excludes.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-5 h-5 border-2 border-red-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                              <X className="w-3 h-3 text-red-500" />
                            </div>
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 2. Tour Program */}
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <CalendarDays className="w-6 h-6 text-primary" />
                    Tour Program
                  </h2>
                </div>

                {console.log('Rendering tour programs - programs:', programs)}
                {console.log('Rendering tour programs - tour.tour_programs:', tour.tour_programs)}
                {programs.length > 0 ? (
                  <DatabaseTourProgramAccordion 
                    programs={programs} 
                    category={tour.category}
                  />
                ) : tour.tour_programs && tour.tour_programs.length > 0 ? (
                  <DatabaseTourProgramAccordion 
                    programs={tour.tour_programs} 
                    category={tour.category}
                  />
                ) : tour.itinerary ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Tour Program</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: tour.itinerary }} />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">Tour program details will be available soon.</p>
                    </CardContent>
                  </Card>
                )}
              </div>


              {/* 3. Accommodation and Food */}
              {(tour.accommodation_details || tour.meals_details || tour.water_snacks_details) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Bed className="w-6 h-6 text-primary" />
                      Accommodation and Food
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tour.accommodation_details && (
                      <div>
                        <h4 className="font-semibold mb-2">Accommodation</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {tour.accommodation_details}
                        </p>
                      </div>
                    )}
                    {tour.meals_details && (
                      <div>
                        <h4 className="font-semibold mb-2">Meals</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {tour.meals_details}
                        </p>
                      </div>
                    )}
                    {tour.water_snacks_details && (
                      <div>
                        <h4 className="font-semibold mb-2">Water & Snacks</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {tour.water_snacks_details}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 4. Clothing / Equipment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Shirt className="w-6 h-6 text-primary" />
                    Clothing / Equipment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tour.provided_equipment && tour.provided_equipment.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Provided Equipment</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tour.provided_equipment.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold mb-2">What to Bring</h4>
                    {tour.what_to_bring && tour.what_to_bring.length > 0 ? (
                      <ul className="text-muted-foreground space-y-1">
                        {tour.what_to_bring.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Comfortable hiking boots</li>
                        <li>• Weather-appropriate clothing (layers recommended)</li>
                        <li>• Rain jacket</li>
                        <li>• Hat and sunglasses</li>
                        <li>• Personal water bottle</li>
                        <li>• Camera</li>
                        <li>• Personal medications</li>
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 5. Transport */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Car className="w-6 h-6 text-primary" />
                    Transport
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Included Transportation</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {tour.transport_details || 'Comfortable, air-conditioned vehicles from Baku to the tour starting point and return. Professional drivers familiar with mountain roads ensure safe and scenic journeys.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pick-up Service</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {tour.pickup_service || 'Pick-up from central Baku locations or your hotel (within city limits). Exact pick-up time and location will be confirmed 24 hours before departure.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 6. Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Camera className="w-6 h-6 text-primary" />
                    Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tour && tour.gallery_images && tour.gallery_images.length > 0 ? (
                    <>
                      {/* Mobile Carousel */}
                      <div className="md:hidden relative">
                        <div 
                          ref={galleryRef}
                          className="overflow-x-auto snap-x snap-mandatory flex gap-2 scrollbar-hide"
                          style={{ scrollBehavior: 'smooth' }}
                        >
                          {tour.gallery_images.map((image, index) => (
                            <a
                              key={index}
                              href={image}
                              data-fancybox="tour-gallery"
                              data-caption={`${tour.title} - Image ${index + 1}`}
                              className="flex-shrink-0 w-full snap-start"
                            >
                              <img
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-64 object-cover rounded-lg cursor-pointer"
                              />
                            </a>
                          ))}
                        </div>
                        
                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-2 mt-4">
                          {tour.gallery_images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                if (galleryRef.current) {
                                  const scrollLeft = index * galleryRef.current.offsetWidth;
                                  galleryRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                                  setCurrentImageIndex(index);
                                }
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                currentImageIndex === index ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Desktop Grid */}
                      <div className="hidden md:grid grid-cols-3 gap-4">
                        {tour.gallery_images.map((image, index) => (
                          <a
                            key={index}
                            href={image}
                            data-fancybox="tour-gallery"
                            data-caption={`${tour.title} - Image ${index + 1}`}
                            className="block"
                          >
                            <img
                              src={image}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                            />
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Gallery images will be available soon.</p>
                    </div>
                  )}
                  <p className="text-muted-foreground mt-4">
                    {tour.photography_service || 'Professional photography service available upon request. All participants receive digital copies of group photos taken during the tour.'}
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-32">
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-primary" style={{ fontSize: '1.4rem' }}>
                        {selectedPrice ? (
                          selectedPrice
                        ) : (
                          <>
                            {category !== 'group-tours' && 'From '}
                            ${Math.round(typeof tour.price === 'string' ? parseFloat(tour.price.replace(/[^0-9.]/g, '')) : tour.price)}
                          </>
                        )}
                      </span>
                      {!isGroupSelected && (
                        <span className="text-xs text-muted-foreground">
                          {category === 'group-tours' ? '/ per person' : '/ per person'}
                        </span>
                      )}
                    </div>
                    {category !== 'group-tours' && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Price varies by group size
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Group Size Selector */}
                  {tour.participant_pricing && tour.participant_pricing.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Select Group Size:</label>
                      <Select 
                        value={selectedParticipants} 
                        onValueChange={(value) => {
                          setSelectedParticipants(value);
                          setIsGroupSelected(true);
                          const pricing = tour.participant_pricing.find(p => p.minParticipants.toString() === value);
                          if (pricing) {
                            const totalPrice = Math.round(pricing.pricePerPerson);
                            setSelectedPrice(
                              `Total $${totalPrice}`
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose number of participants" />
                        </SelectTrigger>
                        <SelectContent>
                          {tour.participant_pricing.map((pricing, index) => (
                            <SelectItem key={index} value={pricing.minParticipants.toString()}>
                              {pricing.minParticipants} {pricing.minParticipants === 1 ? 'participant' : 'participants'} - total ${Math.round(pricing.pricePerPerson)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Button size="lg" variant="adventure" className="w-full" asChild>
                    <Link to={`/book-tour/${tour.id}?title=${encodeURIComponent(tour.title)}&slug=${encodeURIComponent(tour.slug || tour.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))}&price=${encodeURIComponent(selectedPrice || tour.price)}&groupSize=${encodeURIComponent(selectedParticipants || '1')}&category=${encodeURIComponent(tour.category)}&pricing=${encodeURIComponent(JSON.stringify(tour.participant_pricing || []))}&dates=${encodeURIComponent(JSON.stringify(tour.available_dates || []))}&startDate=${encodeURIComponent(tour.start_date || '')}&endDate=${encodeURIComponent(tour.end_date || '')}`}>
                      <Calendar className="w-5 h-5 mr-2" />
                      Book This Tour
                    </Link>
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground whitespace-pre-wrap">
                    {tour.booking_terms || 'Free cancellation up to 24 hours before'}
                  </div>
                  
                  <div className="border-t pt-4">
                    <a 
                      href="tel:+994514009091" 
                      className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">+994 51 400 90 91</span>
                    </a>
                    <div className="text-center text-sm text-muted-foreground mt-1">
                      Call for custom arrangements
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Tours Section */}
      {similarTours.length > 0 && (
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground">Similar Tours</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarTours.map((similarTour) => (
                <Card key={similarTour.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={similarTour.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'} 
                      alt={similarTour.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90">
                        {similarTour.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {similarTour.title}
                    </CardTitle>
                    <div 
                      className="text-muted-foreground text-sm leading-relaxed prose prose-sm max-w-none line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: similarTour.description }}
                    />
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{similarTour.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Max {similarTour.max_participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{similarTour.location || 'Location TBD'}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex items-center justify-between pt-6">
                    <div>
                      <div className="font-bold text-primary">
                        {category === 'group-tours' ? (
                          <>
                            <span className="text-xl">
                              ${Math.round(typeof similarTour.price === 'string' ? parseFloat(similarTour.price.replace(/[^0-9.]/g, '')) : similarTour.price)}
                            </span>
                            <span className="text-sm"> / per person</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm">From </span>
                            <span className="text-xl">
                              ${Math.round(typeof similarTour.price === 'string' ? parseFloat(similarTour.price.replace(/[^0-9.]/g, '')) : similarTour.price)}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {category === 'group-tours' ? 'Fixed price per person' : 'Price varies by group size'}
                      </div>
                    </div>
                    <Button variant="adventure" asChild>
                      <Link to={`/tours/${category}/${similarTour.slug || similarTour.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Explore More Button */}
            <div className="flex justify-center mt-12">
              <Button variant="ghost" asChild className="text-foreground hover:bg-primary hover:text-white transition-all duration-300">
                <Link to={`/tours/${category}`} className="inline-flex items-center gap-2">
                  Explore More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default TourDetail;