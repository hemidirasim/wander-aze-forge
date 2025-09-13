import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Clock, Users, MapPin, Star } from 'lucide-react';
import toursHero from '@/assets/tours-hero.jpg';

const Tours = () => {
  const tours = [
    {
      id: 1,
      title: "Khinalig-Laza Homestay Hike",
      description: "Experience authentic village life while hiking through Azerbaijan's most remote mountain villages.",
      duration: "3 days",
      groupSize: "2-8 people",
      difficulty: "Moderate",
      location: "Khinalig Village",
      price: "$299",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      title: "3 Peaks Gizilgaya Plateau",
      description: "Conquer three magnificent peaks in one of Azerbaijan's most stunning mountain plateaus.",
      duration: "2 days",
      groupSize: "2-6 people", 
      difficulty: "Challenging",
      location: "Gizilgaya Plateau",
      price: "$249",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Caucasus Wildlife Safari",
      description: "Discover the incredible biodiversity of the Caucasus mountains with our expert guides.",
      duration: "4 days",
      groupSize: "2-10 people",
      difficulty: "Easy",
      location: "Caucasus Mountains",
      price: "$399",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${toursHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Adventure Tours</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Explore Azerbaijan's pristine wilderness with expert local guides
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Popular Tours
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From easy nature walks to challenging mountain expeditions, find your perfect adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <Card key={tour.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/90">
                      {tour.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white">
                    <Star className="w-4 h-4 fill-current text-autumn" />
                    <span className="text-sm font-medium">{tour.rating}</span>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {tour.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">{tour.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{tour.groupSize}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{tour.location}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="flex items-center justify-between pt-6">
                  <div className="text-2xl font-bold text-primary">
                    {tour.price}
                  </div>
                  <Button variant="adventure" asChild>
                    <Link to={`/tours/${tour.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tours;