import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Clock, Users, MapPin, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import toursHero from '@/assets/tours-hero.jpg';

// Declare Fancybox for TypeScript
declare global {
  interface Window {
    Fancybox: any;
  }
}

interface Tour {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: string;
  duration: string;
  difficulty: string;
  location: string;
  category: string;
  featured: boolean;
}

const Tours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tours');
        const data = await response.json();
        
        if (data.success) {
          setTours(data.data);
        } else {
          setError('Failed to fetch tours');
        }
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Failed to fetch tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Initialize Fancybox when component mounts
  useEffect(() => {
    if (window.Fancybox) {
      window.Fancybox.bind('[data-fancybox="tours-gallery"]', {
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
  }, [tours]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={toursHero} 
            alt="Adventure Tours"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            All Tours
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover all our adventure tours across different categories and difficulty levels
          </p>
        </div>
      </section>

      {/* All Tours */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              All Tours
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse through all our adventure tours and find the perfect one for you
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{error}</p>
            </div>
          ) : tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <Card key={tour.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm hover:scale-105 cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <a
                      href={tour.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'}
                      data-fancybox="tours-gallery"
                      data-caption={tour.title}
                      className="block w-full h-full"
                    >
                      <img 
                        src={tour.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'} 
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      />
                    </a>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <Badge variant="secondary" className="bg-background/90">
                        {tour.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 pointer-events-none">
                      <Badge variant="secondary" className="bg-background/90">
                        {tour.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {tour.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {tour.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{tour.price}</span>
                      <Button variant="adventure" size="sm" asChild>
                        <Link to={`/tours/${tour.category}/${tour.id}`} className="flex items-center gap-2">
                          Learn More
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No tours available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Tours;