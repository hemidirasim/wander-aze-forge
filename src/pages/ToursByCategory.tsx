import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import TourCategoryDropdown from '@/components/TourCategoryDropdown';
import TailorMadeForm from '@/components/TailorMadeForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Star, ArrowLeft, Loader2 } from 'lucide-react';

interface TourData {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  difficulty: string;
  rating: number;
  reviews_count: number;
  group_size: string;
  location: string;
  image_url: string;
  category: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  is_active: boolean;
  featured: boolean;
}

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

const ToursByCategory = () => {
  const { category: categoryId } = useParams<{ category: string }>();
  const [tours, setTours] = useState<TourData[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  if (!categoryId) {
    return <div>Category not found</div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch category data
        const categoryResponse = await fetch('/api/tour-categories');
        const categoryResult = await categoryResponse.json();
        
        if (categoryResult.success) {
          const foundCategory = categoryResult.data.find((cat: CategoryData) => cat.slug === categoryId);
          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            setError('Category not found');
            setLoading(false);
            return;
          }
        }

        // Fetch tours data
        const response = await fetch(`/api/test-db`);
        const result = await response.json();

        if (result.success) {
          // Parse JSON fields safely
          const tours = (result.tours || []).map((tour: any) => {
            try {
              return {
                ...tour,
                highlights: tour.highlights ? (typeof tour.highlights === 'string' ? JSON.parse(tour.highlights) : tour.highlights) : [],
                includes: tour.includes ? (typeof tour.includes === 'string' ? JSON.parse(tour.includes) : tour.includes) : [],
                excludes: tour.excludes ? (typeof tour.excludes === 'string' ? JSON.parse(tour.excludes) : tour.excludes) : [],
              };
            } catch (parseError) {
              console.error('Error parsing JSON fields for tour:', tour.id, parseError);
              return {
                ...tour,
                highlights: [],
                includes: [],
                excludes: [],
              };
            }
          });
          
          // Filter by category
          const categoryTours = tours.filter((tour: TourData) => 
            tour.category === categoryId
          );
          
          setTours(categoryTours);
          console.log(`Found ${categoryTours.length} tours for category ${categoryId}`);
        } else {
          setError(result.error || 'Failed to load tours');
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  if (!category) {
    return <div>Category not found</div>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading {category.name} tours...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Error Loading Tours</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button asChild>
              <Link to="/tours">Browse All Tours</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Special handling for tailor-made category
  if (categoryId === 'tailor-made' && category) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
                  {category.name}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Right Side - Image */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={category.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop'}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 px-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-16 z-20">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link to="/tours" className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All Tours
                  </Link>
                </Button>
                <TourCategoryDropdown />
              </div>
            </div>
          </div>
        </section>

        {/* Tailor-Made Form */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <TailorMadeForm />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
                {category.name}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={category.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop'}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation & Filters */}
      <section className="py-8 px-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-16 z-20">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/tours" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Tours
                </Link>
              </Button>
              <TourCategoryDropdown />
            </div>
            
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {tours.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                No tours available in this category yet
              </h3>
              <p className="text-muted-foreground mb-8">
                We're working on adding more amazing {category.name.toLowerCase()} adventures. 
                Check back soon or contact us for custom arrangements!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="adventure" asChild>
                  <Link to="/tours">Browse All Tours</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">Custom Tour Request</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((tour) => (
                  <Card key={tour.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={tour.image_url || '/placeholder-tour.jpg'} 
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-tour.jpg';
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90 text-foreground">
                          {tour.difficulty}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white">
                        <Star className="w-4 h-4 fill-current text-autumn" />
                        <span className="text-sm font-medium">{tour.rating}</span>
                        <span className="text-xs text-white/80">({tour.reviews_count})</span>
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
                        <span>{tour.group_size}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{tour.location || 'Location TBD'}</span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex items-center justify-between pt-6">
                      <div className="text-2xl font-bold text-primary">
                        {tour.price}
                      </div>
                      <Button variant="adventure" asChild>
                        <Link to={`/tours/${categoryId}/${tour.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      
      <Footer />
    </div>
  );
};

export default ToursByCategory;