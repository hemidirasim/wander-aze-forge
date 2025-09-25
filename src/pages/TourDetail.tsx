import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DatabaseTourProgramAccordion from '@/components/DatabaseTourProgramAccordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Star, CheckCircle, Calendar, Phone, ArrowLeft, Loader2 } from 'lucide-react';
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
  location: string;
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

const TourDetail = () => {
  const { id, category } = useParams();
  const [tour, setTour] = useState<TourData | null>(null);
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tour-detail-simple?id=${id}&category=${category}`);
        const result = await response.json();

        if (result.success) {
          setTour(result.data.tour);
          setPrograms(result.data.programs || []);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 px-4">
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
        <Navigation />
        <div className="pt-24 px-4">
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
      <Navigation />
      
      {/* Back Button */}
      <section className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to={category ? `/tours/${category}` : '/tours'} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {category ? `${category} tours` : 'tours'}
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative h-[60vh]">
        <img 
          src={mainImage} 
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </section>

      {/* Tour Details */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Header */}
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="secondary">{tour.difficulty}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-current text-autumn" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-muted-foreground">({tour.reviews_count} reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {tour.title}
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {tour.description}
                </p>
              </div>

              {/* 1. Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {tour.overview || `This ${tour.category} adventure offers an incredible opportunity to explore Azerbaijan's stunning landscapes and rich cultural heritage. Perfect for ${tour.difficulty.toLowerCase()} level adventurers, this tour combines natural beauty with authentic local experiences.`}
                  </p>
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
                        <div className="text-muted-foreground">{tour.group_size}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Location</div>
                        <div className="text-muted-foreground">{tour.location}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Detailed Tour Program */}
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Detailed Tour Program</h2>
                  <p className="text-muted-foreground">
                    Comprehensive daily schedule with activities, timings, and highlights
                    {programs.length > 0 && (
                      <span className="block mt-2 text-sm text-yellow-600">
                        📊 Live data from database
                      </span>
                    )}
                  </p>
                </div>

                {programs.length > 0 ? (
                  <DatabaseTourProgramAccordion 
                    programs={programs} 
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

              {/* 3. Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Difficulty Level</h4>
                      <p className="text-muted-foreground">{tour.difficulty} - {tour.requirements || 'Suitable for participants with appropriate fitness level'}</p>
                    </div>
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

              {/* 4. Accommodation and Food */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Accommodation and Food</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Accommodation</h4>
                    <p className="text-muted-foreground">
                      {tour.accommodation_details || (tour.duration.includes('day') && !tour.duration.includes('1 day') 
                        ? 'Mountain guesthouses, traditional villages, and camping under the stars (weather permitting). All accommodations are clean, comfortable, and provide authentic local experiences.'
                        : 'Day tour - no overnight accommodation required.'
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Meals</h4>
                    <p className="text-muted-foreground">
                      {tour.meals_details || 'Traditional Azerbaijani cuisine featuring fresh, local ingredients. Vegetarian and dietary restrictions can be accommodated with advance notice. Includes breakfast, lunch, and dinner for multi-day tours.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Water & Snacks</h4>
                    <p className="text-muted-foreground">
                      {tour.water_snacks_details || 'Fresh drinking water, energy snacks, and local fruits provided throughout the tour.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 5. Clothing / Equipment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Clothing / Equipment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Provided Equipment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tour.provided_equipment && tour.provided_equipment.length > 0 ? (
                        tour.provided_equipment.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground">Equipment details will be provided upon booking.</div>
                      )}
                    </div>
                  </div>
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

              {/* 6. Transport */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Transport</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Included Transportation</h4>
                    <p className="text-muted-foreground">
                      {tour.transport_details || 'Comfortable, air-conditioned vehicles from Baku to the tour starting point and return. Professional drivers familiar with mountain roads ensure safe and scenic journeys.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pick-up Service</h4>
                    <p className="text-muted-foreground">
                      {tour.pickup_service || 'Pick-up from central Baku locations or your hotel (within city limits). Exact pick-up time and location will be confirmed 24 hours before departure.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 7. Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Media</CardTitle>
                </CardHeader>
                <CardContent>
                  {tour && tour.gallery_images && tour.gallery_images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* 8. Tour Price */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Tour Price</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{tour.price}</div>
                    <div className="text-muted-foreground">
                      {category === 'group-tours' ? 'per group' : 'per person'}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Price Includes:</h4>
                    {tour.price_includes && tour.price_includes.length > 0 ? (
                      <ul className="text-muted-foreground space-y-1">
                        {tour.price_includes.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Professional guide services</li>
                        <li>• All transportation</li>
                        <li>• Safety equipment</li>
                        <li>• Insurance coverage</li>
                        <li>• Meals (as specified)</li>
                        <li>• Accommodation (multi-day tours)</li>
                      </ul>
                    )}
                  </div>
                  {(tour.group_discounts || tour.early_bird_discount) && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {tour.group_discounts && <><strong>Group Discounts:</strong> {tour.group_discounts}</>}
                        {tour.group_discounts && tour.early_bird_discount && <><br /></>}
                        {tour.early_bird_discount && <><strong>Early Bird:</strong> {tour.early_bird_discount}</>}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 9. Book Now */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Book Now</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-4">
                    <Button size="lg" variant="adventure" className="w-full">
                      <Calendar className="w-5 h-5 mr-2" />
                      Reserve Your Spot
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      {tour.booking_terms || 'Free cancellation up to 24 hours before departure'}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-center space-x-2 text-primary">
                        <Phone className="w-5 h-5" />
                        <span className="font-semibold">{tour.contact_phone || '+994 51 400 90 91'}</span>
                      </div>
                      <div className="text-center text-sm text-muted-foreground mt-1">
                        Call for custom arrangements or questions
                      </div>
                    </div>
                    
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm text-center">
                        <strong>Secure Booking:</strong> Pay securely online or reserve now and pay on arrival. 
                        All bookings are protected by our satisfaction guarantee.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-3xl text-center">
                    <span className="text-primary">{tour.price}</span>
                    <span className="text-lg text-muted-foreground">
                      {category === 'group-tours' ? ' / group' : ' / person'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" variant="adventure" className="w-full">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book This Tour
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    {tour.booking_terms || 'Free cancellation up to 24 hours before'}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-center space-x-2 text-primary">
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">{tour.contact_phone || '+994 51 400 90 91'}</span>
                    </div>
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
      
      <Footer />
    </div>
  );
};

export default TourDetail;