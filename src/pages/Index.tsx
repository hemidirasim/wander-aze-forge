import Navigation from '@/components/Navigation';
import TourCategoryGallery from '@/components/TourCategoryGallery';
import RecommendationsSection from '@/components/RecommendationsSection';
import JourneyContactForm from '@/components/JourneyContactForm';
import BusinessPartners from '@/components/BusinessPartners';
import DatabaseTours from '@/components/DatabaseTours';
import DatabaseProjects from '@/components/DatabaseProjects';
import DatabasePrograms from '@/components/DatabasePrograms';
import DatabasePartners from '@/components/DatabasePartners';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Star, Award, Leaf, Heart, ArrowRight, Clock } from 'lucide-react';
import { allTours } from '@/data/tourCategories';
import heroImage from '@/assets/hero-mountain.jpg';

const Index = () => {
  const featuredTours = [
    allTours.find(tour => tour.id === 1), // Khinalig-Laza Trek
    allTours.find(tour => tour.id === 203), // Bazarduzu Summit 
    allTours.find(tour => tour.id === 301), // Wildlife Safari
  ].filter(Boolean);

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

      {/* Most Popular Tours */}
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

          <div className="text-center mt-16 space-y-4">
            <Button size="lg" variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground">
              <Link to="/tours">View All Tours</Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Experience detailed tour programs with interactive accordions:</p>
              <div className="flex justify-center gap-4 mt-2">
                <Link to="/tours/hiking/101" className="text-primary hover:underline">
                  Shahdag Day Hike
                </Link>
                <Link to="/tours/trekking/203" className="text-primary hover:underline">
                  Bazarduzu Summit
                </Link>
                <Link to="/tours/wildlife/301" className="text-primary hover:underline">
                  Wildlife Safari
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Category Gallery - 5 Photos Layout */}
      <TourCategoryGallery />

      {/* Recommendations */}
      <RecommendationsSection />

      {/* Plan Your Journey Contact Form */}
      <JourneyContactForm />

      {/* Database Tours Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <DatabaseTours />
        </div>
      </section>

      {/* Database Projects Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <DatabaseProjects />
        </div>
      </section>

      {/* Database Programs Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <DatabasePrograms />
        </div>
      </section>

      {/* Database Partners Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <DatabasePartners />
        </div>
      </section>

      {/* Business Partners */}
      <BusinessPartners />
    </div>
  );
};

export default Index;
