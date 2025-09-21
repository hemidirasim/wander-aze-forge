import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Star, CheckCircle, Calendar, Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTourById } from '@/data/tourCategories';

const TourDetail = () => {
  const { id, category } = useParams();
  const tourId = parseInt(id || '0');
  const tour = getTourById(tourId);

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Tour Not Found</h1>
            <p className="text-muted-foreground mb-8">The tour you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/tours">Browse All Tours</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mock additional data for tour detail
  const tourDetail = {
    ...tour,
    reviews: tour.reviews || 127,
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400&h=300&fit=crop",
    ],
    includes: tour.included || [
      "Professional mountain guide",
      "All necessary safety equipment",
      "Accommodation (where applicable)",
      "Transportation from meeting point",
      "Insurance coverage",
      "Emergency communication device",
    ],
    itinerary: tour.itinerary || [
      {
        day: "Day 1",
        title: "Adventure Begins",
        description: "Meet your guide and begin your incredible journey into Azerbaijan's wilderness."
      },
      {
        day: "Day 2", 
        title: "Mountain Exploration",
        description: "Full day of trekking through pristine landscapes with breathtaking views."
      },
      {
        day: "Day 3",
        title: "Return Journey",
        description: "Complete your adventure and return with unforgettable memories."
      }
    ]
  };

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
          src={tour.image} 
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
                    <span className="text-muted-foreground">({tourDetail.reviews} reviews)</span>
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
                    This {tour.category} adventure offers an incredible opportunity to explore Azerbaijan's stunning landscapes and rich cultural heritage. Perfect for {tour.difficulty.toLowerCase()} level adventurers, this tour combines natural beauty with authentic local experiences.
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
                        <div className="text-muted-foreground">{tour.groupSize}</div>
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

              {/* 2. Tour Program */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Tour Program</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {tourDetail.itinerary.map((day, index) => (
                    <div key={index} className="border-l-2 border-primary pl-6 relative">
                      <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-0" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {day.day}: {day.title}
                      </h3>
                      <p className="text-muted-foreground">{day.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 3. Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Difficulty Level</h4>
                      <p className="text-muted-foreground">{tour.difficulty} - Suitable for participants with appropriate fitness level</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Best Season</h4>
                      <p className="text-muted-foreground">May to October (weather dependent)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Meeting Point</h4>
                      <p className="text-muted-foreground">Baku city center (exact location provided upon booking)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Language</h4>
                      <p className="text-muted-foreground">English, Azerbaijani, Russian</p>
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
                      {tour.duration.includes('day') && !tour.duration.includes('1 day') 
                        ? 'Mountain guesthouses, traditional villages, and camping under the stars (weather permitting). All accommodations are clean, comfortable, and provide authentic local experiences.'
                        : 'Day tour - no overnight accommodation required.'
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Meals</h4>
                    <p className="text-muted-foreground">
                      Traditional Azerbaijani cuisine featuring fresh, local ingredients. Vegetarian and dietary restrictions can be accommodated with advance notice. Includes breakfast, lunch, and dinner for multi-day tours.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Water & Snacks</h4>
                    <p className="text-muted-foreground">
                      Fresh drinking water, energy snacks, and local fruits provided throughout the tour.
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
                      {tourDetail.includes.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What to Bring</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Comfortable hiking boots</li>
                      <li>• Weather-appropriate clothing (layers recommended)</li>
                      <li>• Rain jacket</li>
                      <li>• Hat and sunglasses</li>
                      <li>• Personal water bottle</li>
                      <li>• Camera</li>
                      <li>• Personal medications</li>
                    </ul>
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
                      Comfortable, air-conditioned vehicles from Baku to the tour starting point and return. Professional drivers familiar with mountain roads ensure safe and scenic journeys.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pick-up Service</h4>
                    <p className="text-muted-foreground">
                      Pick-up from central Baku locations or your hotel (within city limits). Exact pick-up time and location will be confirmed 24 hours before departure.
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tourDetail.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mt-4">
                    Professional photography service available upon request. All participants receive digital copies of group photos taken during the tour.
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
                    <div className="text-muted-foreground">per person</div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Price Includes:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Professional guide services</li>
                      <li>• All transportation</li>
                      <li>• Safety equipment</li>
                      <li>• Insurance coverage</li>
                      <li>• Meals (as specified)</li>
                      <li>• Accommodation (multi-day tours)</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Group Discounts:</strong> 10% off for groups of 6+ people. 
                      <strong>Early Bird:</strong> 15% off bookings made 30 days in advance.
                    </p>
                  </div>
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
                      Free cancellation up to 24 hours before departure
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-center space-x-2 text-primary">
                        <Phone className="w-5 h-5" />
                        <span className="font-semibold">+994 51 400 90 91</span>
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
                    <span className="text-lg text-muted-foreground"> / person</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" variant="adventure" className="w-full">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book This Tour
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Free cancellation up to 24 hours before
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-center space-x-2 text-primary">
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">+994 51 400 90 91</span>
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
    </div>
  );
};

export default TourDetail;