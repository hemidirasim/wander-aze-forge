import Navigation from '@/components/Navigation';
import TourCategoryGallery from '@/components/TourCategoryGallery';
import RecommendationsSection from '@/components/RecommendationsSection';
import JourneyContactForm from '@/components/JourneyContactForm';
import DatabasePartners from '@/components/DatabasePartners';
import DatabaseBlog from '@/components/DatabaseBlog';
import DatabaseReviews from '@/components/DatabaseReviews';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Leaf, Heart, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import heroImage from '@/assets/hero-mountain.jpg';

const Index = () => {
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedTours();
  }, []);

  const fetchFeaturedTours = async () => {
    try {
      const response = await fetch('/api/tours');
      const data = await response.json();
      
      if (data.success) {
        // Filter tours that are marked as featured
        const featured = data.data.filter(tour => tour.featured === true).slice(0, 6);
        setFeaturedTours(featured);
      }
    } catch (error) {
      console.error('Error fetching featured tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    {
      icon: Award,
      title: "10 Years of Excellence", 
      description: "Azerbaijan's first ecotour company with over 700 successful tours since 2014"
    },
    {
      icon: Leaf,
      title: "Sustainable Tourism",
      description: "Eco-friendly practices that protect nature and support local communities"
    },
    {
      icon: Heart,
      title: "Authentic Experiences",
      description: "Small group adventures with genuine cultural immersion and homestays"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-5xl px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            Discover
            <span className="block text-transparent bg-gradient-sunset bg-clip-text">
              Azerbaijan
            </span>
          </h1>
          <p className="text-xl md:text-3xl mb-12 text-white/90 leading-relaxed">
            Authentic mountain adventures • Sustainable tourism • Cultural immersion
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="adventure" asChild className="text-lg px-8 py-4">
              <Link to="/tours">Explore Tours</Link>
            </Button>
            <Button size="lg" variant="hero-outline" asChild className="text-lg px-8 py-4">
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              What Makes Us Special
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Since 2014, we've been Azerbaijan's pioneer in sustainable ecotourism, 
              organizing over 700 tours and exploring more than 30 unique trails
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="group text-center hover:shadow-elevated transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-hero rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300">
                    <highlight.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                    {highlight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Most Popular Tours */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Most Popular Tours
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our featured adventures that showcase the best of Azerbaijan's natural beauty
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
          ) : featuredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map((tour) => (
                <Card key={tour.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm hover:scale-105 cursor-pointer" onClick={() => navigate(`/tours/${tour.category}/${tour.id}`)}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={tour.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'} 
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                        {tour.difficulty}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-background/90 text-foreground text-sm font-medium rounded-full">
                        {tour.duration}
                      </span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {tour.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">
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
              <p className="text-muted-foreground text-lg">No featured tours available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Tour Category Gallery - 5 Photos Layout */}
      <TourCategoryGallery />

      {/* Recommendations */}
      <RecommendationsSection />

      {/* Plan Your Journey Contact Form */}
      <JourneyContactForm />

      {/* Latest Blog Stories */}
      <DatabaseBlog />

      {/* Customer Reviews */}
      <DatabaseReviews />

      {/* Business Partners */}
      <DatabasePartners />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
