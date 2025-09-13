import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Star, CheckCircle, Calendar, Phone } from 'lucide-react';

const TourDetail = () => {
  const { id } = useParams();

  // Mock tour data - in real app, fetch based on ID
  const tour = {
    id: 1,
    title: "Khinalig-Laza Homestay Hike",
    description: "Experience authentic village life while hiking through Azerbaijan's most remote mountain villages. This unique tour combines adventure with cultural immersion.",
    duration: "3 days",
    groupSize: "2-8 people",
    difficulty: "Moderate",
    location: "Khinalig Village",
    price: "$299",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400&h=300&fit=crop",
    ],
    includes: [
      "Professional mountain guide",
      "Homestay accommodation",
      "All meals during the tour",
      "Transportation to/from Baku",
      "Safety equipment",
      "Cultural activities",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Journey to Khinalig",
        description: "Depart from Baku, drive through mountain roads to reach the ancient village of Khinalig. Check into local homestay and explore the village."
      },
      {
        day: "Day 2", 
        title: "Khinalig to Laza Trek",
        description: "Full day hiking through pristine mountain landscapes, crossing rivers and enjoying panoramic views. Arrive in Laza village for overnight."
      },
      {
        day: "Day 3",
        title: "Return to Baku",
        description: "Morning exploration of Laza, visit local crafts workshops, then return journey to Baku with stops at scenic viewpoints."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Image */}
      <section className="relative h-[60vh] mt-16">
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
                    <span className="text-muted-foreground">({tour.reviews} reviews)</span>
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
                    {tour.includes.map((item, index) => (
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
                  {tour.itinerary.map((day, index) => (
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
                    {tour.gallery.map((image, index) => (
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