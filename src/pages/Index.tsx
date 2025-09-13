import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Star, Users, Clock, MapPin, Award, Leaf, Heart, ArrowRight } from 'lucide-react';
import { allTours } from '@/data/tourCategories';
import heroImage from '@/assets/hero-mountain.jpg';

const Index = () => {
  const featuredTours = [
    allTours.find(tour => tour.id === 1), // Khinalig-Laza Trek
    allTours.find(tour => tour.id === 203), // Bazarduzu Summit 
    allTours.find(tour => tour.id === 301), // Wildlife Safari
  ].filter(Boolean);

  const heroImages = [
    heroImage,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop'
  ];

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
      
      {/* Hero Section with Background Slider */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images Slider */}
        <div className="absolute inset-0">
          <div className="flex w-[400%] h-full animate-hero-slide">
            {heroImages.map((image, index) => (
              <div 
                key={index}
                className="w-1/4 h-full bg-cover bg-center bg-no-repeat flex-shrink-0"
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
        </div>
        
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
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-foreground text-lg px-8 py-4" asChild>
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

      {/* Featured Tours */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Most Popular Tours
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Handcrafted adventures that showcase the best of Azerbaijan's natural beauty and cultural heritage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <Card key={tour.id} className="group hover:shadow-elevated transition-all duration-500 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tour.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {tour.price}
                    </div>
                  </div>
                  
                  <Button variant="adventure" asChild>
                    <Link to={`/tours/${tour.category}/${tour.id}`} className="flex items-center w-fit">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button size="lg" variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground">
              <Link to="/tours">View All Tours</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-mountain">
        <div className="container mx-auto">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey in Numbers</h2>
            <p className="text-xl text-white/90">A decade of meaningful adventures and lasting impact</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "10+", label: "Years Experience" },
              { number: "700+", label: "Tours Completed" },
              { number: "2,500+", label: "Happy Travelers" },
              { number: "30+", label: "Unique Trails" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-5xl font-bold mb-2 text-autumn">{stat.number}</div>
                <div className="text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold text-foreground mb-6">
                  Small Groups, Big Impact
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  We believe in responsible tourism that creates positive change. Our small group adventures 
                  support local communities while protecting Azerbaijan's pristine wilderness for future generations.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-xl">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">2-8</div>
                  <div className="text-sm text-muted-foreground">People per group</div>
                </div>
                <div className="text-center p-6 bg-primary/5 rounded-xl">
                  <Leaf className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">100%</div>
                  <div className="text-sm text-muted-foreground">Eco-friendly tours</div>
                </div>
              </div>
              
              <Button variant="adventure" size="lg" asChild>
                <Link to="/about">Learn About Us</Link>
              </Button>
            </div>
            
            <div className="relative h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=600&fit=crop"
                alt="Mountain landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-8">
            Ready for Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join us for an unforgettable journey through Azerbaijan's most spectacular landscapes. 
            Every tour supports conservation and local communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4" asChild>
              <Link to="/contact">Plan Your Trip</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4" asChild>
              <Link to="/blog">Read Our Stories</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
