import Navigation from '@/components/Navigation';
import TourCategoryDropdown from '@/components/TourCategoryDropdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Clock, Users, MapPin, Star, ArrowRight } from 'lucide-react';
import { tourCategories, allTours } from '@/data/tourCategories';
import toursHero from '@/assets/tours-hero.jpg';

const Tours = () => {
  // Show featured tours from different categories
  const featuredTours = [
    allTours.find(tour => tour.id === 1), // Khinalig-Laza Trek
    allTours.find(tour => tour.id === 203), // Bazarduzu Summit 
    allTours.find(tour => tour.id === 301), // Wildlife Safari
    allTours.find(tour => tour.id === 401), // Group Adventure
  ].filter(Boolean);

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
          <TourCategoryDropdown />
        </div>
      </section>

      {/* Tour Categories */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tour Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the type of adventure that matches your interests and experience level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tourCategories.map((category) => (
              <Card key={category.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-background/90">
                      {category.tours.length} tours
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </CardHeader>
                
                <CardFooter>
                  <Button variant="adventure" asChild className="w-full">
                    <Link to={`/tours/${category.id}`} className="flex items-center justify-center">
                      Explore {category.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Adventures
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our most popular tours across different categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTours.map((tour) => (
              <Card key={tour.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative h-48 overflow-hidden">
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
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {tour.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-2 pb-2">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{tour.location}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="flex items-center justify-between pt-2">
                  <div className="text-lg font-bold text-primary">
                    {tour.price}
                  </div>
                  <Button size="sm" variant="adventure" asChild>
                    <Link to={`/tours/${tour.category}/${tour.id}`}>
                      View
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Looking for something specific? Browse by category or contact us for custom adventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TourCategoryDropdown />
              <Button variant="outline" asChild>
                <Link to="/contact">Custom Tour Request</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tours;