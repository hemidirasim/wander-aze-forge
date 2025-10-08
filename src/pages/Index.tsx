import DatabaseNavigation from '@/components/DatabaseNavigation';
import DatabaseTourCategoryGallery from '@/components/DatabaseTourCategoryGallery';
import JourneyContactForm from '@/components/JourneyContactForm';
import DatabasePartners from '@/components/DatabasePartners';
import DatabaseBlog from '@/components/DatabaseBlog';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Leaf, Heart, ArrowRight, Quote, Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';

// Declare Fancybox for TypeScript
declare global {
  interface Window {
    Fancybox: any;
  }
}

// Using public folder image
const heroImage = '/hero-mountain-custom.jpg';

const Index = () => {
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [heroLoading, setHeroLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Fetch reviews data
  const { data: reviews, loading: reviewsLoading } = useApi('/reviews?featured=true');

  useEffect(() => {
    fetchFeaturedTours();
    fetchHeroData();
  }, []);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextReviewSlide = () => {
    if (reviews && reviews.length > 0) {
      setCurrentReviewIndex((prev) => (prev + 1) % Math.max(1, reviews.length - itemsPerView + 1));
    }
  };

  const prevReviewSlide = () => {
    if (reviews && reviews.length > 0) {
      setCurrentReviewIndex((prev) => (prev - 1 + Math.max(1, reviews.length - itemsPerView + 1)) % Math.max(1, reviews.length - itemsPerView + 1));
    }
  };

  // Auto-rotate carousel (pause on hover)
  useEffect(() => {
    if (reviews && reviews.length > 0 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % Math.max(1, reviews.length - itemsPerView + 1));
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval);
    }
  }, [reviews, itemsPerView, isHovered]);

  // Initialize Fancybox for review images
  useEffect(() => {
    if (window.Fancybox && reviews && reviews.length > 0) {
      window.Fancybox.bind('[data-fancybox="reviews"]', {
        Thumbs: {
          autoStart: false,
        },
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: ["zoomIn", "zoomOut", "rotateCCW", "rotateCW"],
            right: ["slideshow", "fullscreen", "thumbs", "close"]
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
  }, [reviews]);

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

  const fetchHeroData = async () => {
    try {
      setHeroLoading(true);
      const response = await fetch('/api/hero-section');
      const data = await response.json();
      
      if (data.success) {
        setHeroData(data.data);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    } finally {
      setHeroLoading(false);
    }
  };

  const highlights = [
    {
      icon: Award,
      title: "10+ Years of Excellence", 
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
      <DatabaseNavigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroData?.image_url || heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-5xl px-4">
          {heroLoading ? (
            // Loading state
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="h-16 bg-white/20 rounded-lg animate-pulse"></div>
                <div className="h-16 bg-white/20 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-8 bg-white/20 rounded-lg animate-pulse w-3/4 mx-auto"></div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <div className="h-12 bg-white/20 rounded-lg animate-pulse w-32"></div>
                <div className="h-12 bg-white/20 rounded-lg animate-pulse w-32"></div>
              </div>
            </div>
          ) : (
            // Actual content
            <>
              <h1 className="font-bold mb-8 leading-tight">
                <span 
                  style={{ 
                    color: heroData?.title_color || '#ffffff',
                    fontSize: `${heroData?.title_size || '48'}px`
                  }}
                >
                  {heroData?.title || 'Discover'}
                </span>
                <span 
                  className="block"
                  style={{ 
                    color: heroData?.subtitle_color || '#d46e39',
                    fontSize: `${heroData?.subtitle_size || '32'}px`
                  }}
                >
                  {heroData?.subtitle || 'Azerbaijan'}
                </span>
              </h1>
              <p 
                className="mb-12 leading-relaxed"
                style={{ 
                  color: heroData?.description_color || '#ffffff',
                  fontSize: `${heroData?.description_size || '20'}px`
                }}
              >
                {heroData?.description || 'Authentic mountain adventures • Sustainable tourism • Cultural immersion'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto sm:max-w-none">
                <Button size="lg" variant="hero-outline" asChild className="text-base sm:text-lg px-8 py-3 sm:py-4">
                  <Link to={heroData?.button1_link || '/tours'}>{heroData?.button1_text || 'Explore Tours'}</Link>
                </Button>
                <Button size="lg" variant="hero-outline" asChild className="text-base sm:text-lg px-8 py-3 sm:py-4">
                  <Link to={heroData?.button2_link || '/about'}>{heroData?.button2_text || 'Our Story'}</Link>
                </Button>
              </div>
            </>
          )}
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
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              What Makes Us Special
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Since 2014, we've been Azerbaijan's pioneer in sustainable ecotourism, 
              organizing over 700 tours and exploring more than 30 unique trails
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="text-center border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-hero rounded-2xl flex items-center justify-center mb-6">
                    <highlight.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">
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
                <Card key={tour.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm hover:scale-105 cursor-pointer" onClick={() => navigate(`/tours/${tour.category}/${tour.slug || tour.id}`)}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={tour.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'} 
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white text-black text-sm font-medium rounded-full">
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
                        <Link to={`/tours/${tour.category}/${tour.slug || tour.id}`} className="flex items-center gap-2">
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

      {/* Customer Reviews - Carousel */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto">
          {/* Modern Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              <span>Trusted by Adventurers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              What People Say About Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Real stories from real adventurers who discovered Azerbaijan's hidden gems with us
            </p>
          </div>

          {reviewsLoading ? (
            <div className="relative">
              <div className="flex gap-6 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 overflow-hidden border-0 backdrop-blur-sm" style={{ background: 'rgb(215 114 61)' }}>
                    <CardContent className="p-8">
                      <Skeleton className="h-20 w-full mb-4" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-6" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="relative">
              {/* Carousel Container */}
              <div 
                className="overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentReviewIndex * (100 / itemsPerView)}%)` }}
                >
                  {reviews.map((review, index) => (
                    <div 
                      key={review.id} 
                      className="flex-shrink-0 px-3"
                      style={{ width: `${100 / itemsPerView}%` }}
                    >
                      <Card className="relative overflow-hidden border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 h-full" style={{ background: 'rgb(215 114 61)' }}>
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-6 text-white/60">
                          <Quote className="w-8 h-8" />
                        </div>
                        
                        {/* Image Section - Circular */}
                        {review.image_url && (
                          <div className="flex justify-center my-4">
                            <div className="relative w-24 h-24 overflow-hidden rounded-full border border-white">
                              <a
                                href={review.image_url}
                                data-fancybox="reviews"
                                data-caption={`${review.name} - ${review.source}`}
                                className="block"
                              >
                                <img
                                  src={review.image_url}
                                  alt={review.name}
                                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
                                  style={{ minHeight: '120px' }}
                                />
                              </a>
                            </div>
                          </div>
                        )}
                        
                        <CardContent className="p-6">
                          {/* Review Text */}
                          <blockquote className="text-white leading-relaxed mb-6 text-base italic line-clamp-4">
                            "{review.review_text}"
                          </blockquote>
                          
                          {/* Author Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-semibold text-white text-sm">{review.name}</div>
                                <div className="flex items-center gap-2 text-xs text-white/80">
                                  {review.source_logo && (
                                    <img
                                      src={review.source_logo}
                                      alt={review.source}
                                      className="h-3 w-auto max-w-12 object-contain"
                                    />
                                  )}
                                  <span>{review.source}</span>
                                </div>
                              </div>
                            </div>
                            
                            {review.source_url && (
                              <a
                                href={review.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-white/80 transition-colors p-1.5 hover:bg-white/20 rounded-full"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons - Below carousel */}
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevReviewSlide}
                  disabled={currentReviewIndex === 0}
                  className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.max(1, reviews.length - itemsPerView + 1) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReviewIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentReviewIndex 
                          ? 'bg-primary scale-125' 
                          : 'bg-primary/30 hover:bg-primary/50'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextReviewSlide}
                  disabled={currentReviewIndex >= Math.max(0, reviews.length - itemsPerView)}
                  className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No reviews available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Tour Category Gallery - Database Categories */}
      <DatabaseTourCategoryGallery />

      {/* Latest Blog Stories */}
      <DatabaseBlog />

      {/* Plan Your Journey Contact Form */}
      <JourneyContactForm />

      {/* Business Partners */}
      <DatabasePartners />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
