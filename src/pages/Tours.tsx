import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Clock, Users, MapPin, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import toursHero from '@/assets/tours-hero.jpg';

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

// Format price helper
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  return `From $${Math.round(numPrice)}`;
};

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


  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/tours/All%20tours%20cover%202.webp" 
            alt="All Tours"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 45%' }}
          />
        </div>
        <div className="relative z-10 text-center text-white">
        </div>
      </section>

      {/* All Tours */}
      <section className="pt-40 pb-20 px-4">
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
                    <img 
                      src={tour.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'} 
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {tour.category?.toLowerCase() !== 'culture' && 
                     tour.category?.toLowerCase() !== 'cultural' && 
                     tour.category?.toLowerCase() !== 'wildlife' &&
                     tour.category?.toLowerCase() !== 'cultural tours' &&
                     tour.category?.toLowerCase() !== 'wildlife tours' &&
                     tour.category?.toLowerCase() !== 'culture-tours' && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 text-foreground">
                          {tour.difficulty}
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {tour.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {tour.title}
                    </CardTitle>
                    <div 
                      className="text-muted-foreground text-sm leading-relaxed prose prose-sm max-w-none line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: tour.description }}
                    />
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-primary">
                          {tour.category === 'group-tours' ? (
                            <>
                              <span className="text-xl">
                                ${Math.round(typeof tour.price === 'string' ? parseFloat(tour.price.replace(/[^0-9.]/g, '')) : tour.price)}
                              </span>
                              <span className="text-sm"> / per person</span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm">From </span>
                              <span className="text-xl">
                                ${Math.round(typeof tour.price === 'string' ? parseFloat(tour.price.replace(/[^0-9.]/g, '')) : tour.price)}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {tour.category === 'group-tours' ? 'Fixed price per person' : 'Price varies by group size'}
                        </div>
                      </div>
                      <Button variant="adventure" size="sm" asChild>
                        <Link to={`/tours/${tour.category}/${tour.slug || tour.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()}?id=${tour.id}`} className="flex items-center gap-2">
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