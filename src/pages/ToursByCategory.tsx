import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import TourCategoryDropdown from '@/components/TourCategoryDropdown';
import TailorMadeForm from '@/components/TailorMadeForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { getCategoryById } from '@/data/tourCategories';

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

const ToursByCategory = () => {
  const { category: categoryId } = useParams<{ category: string }>();
  const [tours, setTours] = useState<TourData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  if (!categoryId) {
    return <div>Category not found</div>;
  }

  const category = getCategoryById(categoryId);

  useEffect(() => {
    const loadToursByCategory = () => {
      try {
        setLoading(true);
        
        // Static mock data based on category
        const mockTours = {
          hiking: [
            {
              id: 101,
              title: "Shahdag Day Hike",
              description: "Experience the beauty of Shahdag National Park with this guided day hike.",
              price: "$89",
              duration: "1 day",
              difficulty: "Moderate",
              rating: 4.8,
              reviews_count: 127,
              group_size: "6-12 people",
              location: "Shahdag National Park",
              image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
              category: "hiking",
              highlights: ["Breathtaking mountain views", "Professional guide", "All equipment included"],
              includes: ["Professional guide", "Safety equipment", "Transportation"],
              excludes: ["Personal items", "Lunch"],
              is_active: true,
              featured: true
            },
            {
              id: 102,
              title: "Khinalig Village Trek",
              description: "Discover the ancient village of Khinalig on this cultural hiking adventure.",
              price: "$129",
              duration: "2 days",
              difficulty: "Challenging",
              rating: 4.9,
              reviews_count: 89,
              group_size: "4-8 people",
              location: "Khinalig Village",
              image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
              category: "hiking",
              highlights: ["Ancient village", "Cultural experience", "Mountain trekking"],
              includes: ["Professional guide", "Accommodation", "All meals"],
              excludes: ["Personal items"],
              is_active: true,
              featured: false
            },
            {
              id: 103,
              title: "Gobustan Petroglyphs Hike",
              description: "Explore ancient rock art and unique mud volcanoes on this cultural hiking experience.",
              price: "$75",
              duration: "1 day",
              difficulty: "Easy",
              rating: 4.6,
              reviews_count: 124,
              group_size: "2-15 people",
              location: "Gobustan National Park",
              image_url: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
              category: "hiking",
              highlights: ["Ancient rock art", "Mud volcanoes", "Cultural heritage"],
              includes: ["Professional guide", "Transportation", "Entry fees"],
              excludes: ["Personal items", "Lunch"],
              is_active: true,
              featured: false
            }
          ],
          wildlife: [
            {
              id: 301,
              title: "Caucasian Wildlife Safari",
              description: "Explore Azerbaijan's diverse wildlife in their natural habitat.",
              price: "$159",
              duration: "3 days",
              difficulty: "Easy",
              rating: 4.7,
              reviews_count: 156,
              group_size: "8-15 people",
              location: "Goygol National Park",
              image_url: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400&h=300&fit=crop",
              category: "wildlife",
              highlights: ["Wildlife spotting", "Bird watching", "Nature photography"],
              includes: ["Professional guide", "Binoculars", "Transportation", "Accommodation"],
              excludes: ["Camera equipment"],
              is_active: true,
              featured: true
            },
            {
              id: 302,
              title: "Bird Watching Tour",
              description: "Perfect for bird enthusiasts to spot rare species in Azerbaijan.",
              price: "$99",
              duration: "1 day",
              difficulty: "Easy",
              rating: 4.6,
              reviews_count: 78,
              group_size: "6-10 people",
              location: "Shirvan National Park",
              image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
              category: "wildlife",
              highlights: ["Rare bird species", "Expert ornithologist", "Photography opportunities"],
              includes: ["Professional guide", "Binoculars", "Transportation"],
              excludes: ["Camera equipment", "Lunch"],
              is_active: true,
              featured: false
            },
            {
              id: 303,
              title: "Caspian Seal Conservation Tour",
              description: "Learn about marine conservation while observing endangered Caspian seals.",
              price: "$149",
              duration: "1 day",
              difficulty: "Easy",
              rating: 4.8,
              reviews_count: 36,
              group_size: "2-12 people",
              location: "Caspian Sea Coast",
              image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
              category: "wildlife",
              highlights: ["Marine conservation", "Seal observation", "Educational experience"],
              includes: ["Professional guide", "Transportation", "Educational materials"],
              excludes: ["Camera equipment"],
              is_active: true,
              featured: false
            }
          ],
          trekking: [
            {
              id: 201,
              title: "Bazarduzu Summit Trek",
              description: "Challenge yourself with this demanding trek to Azerbaijan's highest peak.",
              price: "$199",
              duration: "4 days",
              difficulty: "Expert",
              rating: 4.9,
              reviews_count: 45,
              group_size: "4-6 people",
              location: "Bazarduzu Peak",
              image_url: "https://images.unsplash.com/photo-1464822759844-d150baec5b2e?w=400&h=300&fit=crop",
              category: "trekking",
              highlights: ["Highest peak in Azerbaijan", "Alpine experience", "Mountain camping"],
              includes: ["Professional guide", "All camping equipment", "All meals"],
              excludes: ["Personal items"],
              is_active: true,
              featured: true
            },
            {
              id: 202,
              title: "Laza to Laza Cross-Caucasus Trek",
              description: "3-day circular trek through pristine Caucasus wilderness visiting remote villages.",
              price: "$399",
              duration: "3 days",
              difficulty: "Challenging",
              rating: 4.9,
              reviews_count: 42,
              group_size: "2-8 people",
              location: "Greater Caucasus",
              image_url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop",
              category: "trekking",
              highlights: ["Remote villages", "Pristine wilderness", "Cultural immersion"],
              includes: ["Professional guide", "All camping equipment", "All meals", "Accommodation"],
              excludes: ["Personal items"],
              is_active: true,
              featured: false
            }
          ],
          "group-tours": [
            {
              id: 401,
              title: "Azerbaijan Adventure Group",
              description: "Perfect for groups wanting to explore Azerbaijan together.",
              price: "$299",
              duration: "5 days",
              difficulty: "Moderate",
              rating: 4.8,
              reviews_count: 203,
              group_size: "12-20 people",
              location: "Multiple locations",
              image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
              category: "group-tours",
              highlights: ["Group bonding", "Multiple destinations", "Cultural experiences"],
              includes: ["Professional guide", "All transportation", "All meals", "Accommodation"],
              excludes: ["Personal items"],
              is_active: true,
              featured: true
            },
            {
              id: 402,
              title: "Weekend Warriors Group Trek",
              description: "Join like-minded adventurers for an action-packed weekend of mountain exploration.",
              price: "$199",
              duration: "2 days",
              difficulty: "Moderate",
              rating: 4.7,
              reviews_count: 89,
              group_size: "6-10 people",
              location: "Guba Region",
              image_url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop",
              category: "group-tours",
              highlights: ["Group adventure", "Mountain exploration", "Weekend getaway"],
              includes: ["Professional guide", "Transportation", "All meals"],
              excludes: ["Personal items"],
              is_active: true,
              featured: false
            }
          ]
        };

        const tours = mockTours[categoryId as keyof typeof mockTours] || [];
        setTours(tours);
        console.log(`Loaded ${tours.length} tours for category ${categoryId}`);
        
      } catch (err) {
        setError('Failed to load tours');
        console.error('Error loading tours by category:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadToursByCategory();
    }
  }, [categoryId]);

  if (!category) {
    return <div>Category not found</div>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
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
        <Navigation />
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
  if (categoryId === 'tailor-made') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${category.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          <div className="relative z-10 text-center text-white max-w-4xl px-4">
            <div className="mb-6">
              <Badge variant="secondary" className="bg-primary text-primary-foreground mb-4">
                {category.name}
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 capitalize">{category.name} Tours</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              {category.description}
            </p>
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
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${category.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <div className="mb-6">
            <Badge variant="secondary" className="bg-primary text-primary-foreground mb-4">
              {category.name}
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 capitalize">{category.name} Tours</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {category.description}
          </p>
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
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{tours.length} tour{tours.length !== 1 ? 's' : ''} available</span>
              {tours.length > 0 && (
                <span className="text-yellow-600 text-xs">
                  📊 Live data from database
                </span>
              )}
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
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4 capitalize">
                  {category.name} Adventures
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Choose from our carefully crafted {category.name.toLowerCase()} experiences
                </p>
              </div>

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
                        <Badge variant="secondary" className="bg-background/90">
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

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready for Your {category.name} Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book your spot today or get in touch to plan a custom {category.name.toLowerCase()} experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/contact">Plan Your Trip</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/about">Why Choose Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToursByCategory;