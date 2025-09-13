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

              {/* Quick Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tourDetail.includes.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Itinerary</CardTitle>
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

              {/* Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Gallery</CardTitle>
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