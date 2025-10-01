import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  Camera,
  Car,
  Utensils,
  Shield,
  Image,
  Settings
} from 'lucide-react';

interface Tour {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  price: number;
  max_participants: number;
  rating: number;
  reviews_count: number;
  group_size: string;
  location: string;
  overview: string;
  best_season: string;
  meeting_point: string;
  languages: string;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface TourSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  route: string;
}

const AdminTourManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  const tourSections: TourSection[] = [
    {
      id: 'equipment',
      title: 'Equipment & Gear',
      description: 'Add provided equipment and what to bring',
      icon: <Shield className="w-5 h-5" />,
      completed: false,
      route: `/admin/tours/${id}/equipment`
    },
    {
      id: 'transport',
      title: 'Transport & Logistics',
      description: 'Add transport details and pickup service',
      icon: <Car className="w-5 h-5" />,
      completed: false,
      route: `/admin/tours/${id}/transport`
    },
    {
      id: 'media',
      title: 'Media & Photography',
      description: 'Add gallery images and photography service',
      icon: <Camera className="w-5 h-5" />,
      completed: false,
      route: `/admin/tours/${id}/media`
    },
    {
      id: 'pricing',
      title: 'Pricing Details',
      description: 'Add pricing information and discounts',
      icon: <DollarSign className="w-5 h-5" />,
      completed: false,
      route: `/admin/tours/${id}/pricing`
    },
    {
      id: 'highlights',
      title: 'Highlights & Features',
      description: 'Add tour highlights and what\'s included/excluded',
      icon: <Star className="w-5 h-5" />,
      completed: false,
      route: `/admin/tours/${id}/highlights`
    },
    {
      id: 'programs',
      title: 'Tour Programs',
      description: 'Add detailed day-by-day tour programs',
      icon: <Clock className="w-5 h-5" />,
      completed: false,
      route: `/admin/tours/${id}/programs`
    },
    {
      id: 'accommodation',
      title: 'Accommodation & Meals',
      description: 'Add accommodation and meal details',
      icon: <Utensils className="w-5 h-5" />,
      completed: false,
      route: `/admin/tours/${id}/accommodation`
    },
  ];

  useEffect(() => {
    if (id) {
      fetchTour();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tours/${id}`);
      const data = await response.json();

      if (data.success) {
        setTour(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load tour details",
          variant: "destructive"
        });
        navigate('/admin/tours');
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
      toast({
        title: "Error",
        description: "Failed to load tour details",
        variant: "destructive"
      });
      navigate('/admin/tours');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (section: TourSection) => {
    navigate(section.route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tour Not Found</h1>
            <p className="text-muted-foreground mb-6">The tour you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/admin/tours')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/tours')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tours
              </Button>
              <Badge variant={tour.is_active ? "default" : "secondary"}>
                {tour.is_active ? "Active" : "Inactive"}
              </Badge>
              {tour.featured && (
                <Badge variant="outline" className="text-yellow-600">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">{tour.title}</h1>
            <p className="text-muted-foreground mb-4">{tour.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {tour.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {tour.duration}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {tour.max_participants} max
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                ${tour.price}
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                {tour.rating} ({tour.reviews_count} reviews)
              </div>
            </div>
          </div>

          {/* Tour Sections */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Tour Sections</h2>
            <p className="text-muted-foreground mb-6">
              Complete each section to add detailed information to your tour.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tourSections.map((section) => (
                <Card 
                  key={section.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSectionClick(section)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {section.title}
                          {section.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {section.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSectionClick(section);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {section.completed ? 'Edit' : 'Add'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tour Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Category:</strong> {tour.category}</div>
                    <div><strong>Difficulty:</strong> {tour.difficulty}</div>
                    <div><strong>Best Season:</strong> {tour.best_season}</div>
                    <div><strong>Languages:</strong> {tour.languages}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Meeting Point</h4>
                  <p className="text-sm text-muted-foreground">
                    {tour.meeting_point || 'Not specified'}
                  </p>
                </div>
              </div>
              
              {tour.overview && (
                <div className="mt-6">
                  <h4 className="font-medium text-foreground mb-2">Overview</h4>
                  <p className="text-sm text-muted-foreground">{tour.overview}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTourManage;
