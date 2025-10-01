import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  ArrowLeft,
  Save,
  X,
  Upload,
  Image,
  Clock,
  Users,
  Star,
  Utensils,
  Car,
  Camera,
  DollarSign
} from 'lucide-react';

interface Tour {
  id: number;
  title: string;
  description: string;
  duration: string;
  group_size?: string;
  difficulty: string;
  location?: string;
  price: number;
  rating: number;
  image_url?: string;
  category: string;
  is_active?: boolean;
  featured?: boolean;
  max_participants?: number;
  // Extended fields
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
  itinerary?: string;
  requirements?: string;
  reviews_count?: number;
  overview?: string;
  best_season?: string;
  meeting_point?: string;
  languages?: string;
  accommodation_details?: string;
  meals_details?: string;
  water_snacks_details?: string;
  provided_equipment?: string[];
  what_to_bring?: string[];
  transport_details?: string;
  pickup_service?: string;
  gallery_images?: string[];
  photography_service?: string;
  price_includes?: string[];
  group_discounts?: string;
  early_bird_discount?: string;
  contact_phone?: string;
  booking_terms?: string;
  special_fields?: any;
  created_at: string;
  updated_at: string;
}

const AdminTours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    difficulty: '',
    price: '',
    maxParticipants: '',
    rating: '',
    reviewsCount: '',
    groupSize: '',
    location: '',
    overview: '',
    bestSeason: '',
    meetingPoint: '',
    languages: '',
    accommodationDetails: '',
    mealsDetails: '',
    waterSnacksDetails: '',
    transportDetails: '',
    pickupService: '',
    photographyService: '',
    groupDiscounts: '',
    earlyBirdDiscount: '',
    contactPhone: '',
    bookingTerms: '',
    itinerary: '',
    requirements: '',
    imageUrl: '',
    category: '',
    isActive: true,
    featured: false,
    highlights: [] as string[],
    includes: [] as string[],
    excludes: [] as string[],
    providedEquipment: [] as string[],
    whatToBring: [] as string[],
    priceIncludes: [] as string[],
    galleryImages: [] as string[],
    specialFields: {} as any,
    participantPricing: [] as {participants: number, price: number}[]
  });
  const navigate = useNavigate();

  // Helper functions for array fields
  const addArrayField = (fieldName: keyof typeof formData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] as string[]), value.trim()]
      }));
    }
  };

  const removeArrayField = (fieldName: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: (prev[fieldName] as string[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (fieldName: keyof typeof formData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: (prev[fieldName] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  // Helper functions for participant pricing
  const addParticipantPricing = () => {
    setFormData(prev => ({
      ...prev,
      participantPricing: [...prev.participantPricing, { participants: 1, price: 0 }]
    }));
  };

  const removeParticipantPricing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participantPricing: prev.participantPricing.filter((_, i) => i !== index)
    }));
  };

  const updateParticipantPricing = (index: number, field: 'participants' | 'price', value: number) => {
    setFormData(prev => ({
      ...prev,
      participantPricing: prev.participantPricing.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchTours();
  }, [navigate]);

  const fetchTours = async () => {
    try {
      const response = await fetch('/api/tours');
      const result = await response.json();
      if (result.success && result.data) {
        setTours(result.data);
      } else {
        console.error('Failed to fetch tours:', result.error);
        setTours([]);
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate('/admin/tour-form-basic');
  };

  const handleEdit = (tour: Tour) => {
    console.log('Edit button clicked for tour:', tour);
    navigate(`/admin/tours/${tour.id}/manage`);
  };

  const handleSave = async () => {
    try {
      const tourData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration: formData.duration,
        difficulty: formData.difficulty,
        price: parseFloat(formData.price),
        maxParticipants: parseInt(formData.maxParticipants),
        rating: parseFloat(formData.rating),
        reviewsCount: parseInt(formData.reviewsCount) || 0,
        groupSize: formData.groupSize,
        location: formData.location,
        overview: formData.overview,
        bestSeason: formData.bestSeason,
        meetingPoint: formData.meetingPoint,
        languages: formData.languages,
        accommodationDetails: formData.accommodationDetails,
        mealsDetails: formData.mealsDetails,
        waterSnacksDetails: formData.waterSnacksDetails,
        transportDetails: formData.transportDetails,
        pickupService: formData.pickupService,
        photographyService: formData.photographyService,
        groupDiscounts: formData.groupDiscounts,
        earlyBirdDiscount: formData.earlyBirdDiscount,
        contactPhone: formData.contactPhone,
        bookingTerms: formData.bookingTerms,
        highlights: formData.highlights,
        includes: formData.includes,
        excludes: formData.excludes,
        itinerary: formData.itinerary,
        requirements: formData.requirements,
        providedEquipment: formData.providedEquipment,
        whatToBring: formData.whatToBring,
        priceIncludes: formData.priceIncludes,
        galleryImages: formData.galleryImages,
        specialFields: formData.specialFields,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
        featured: formData.featured
      };

      let response;
      if (isCreating) {
        response = await fetch('/api/tours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tourData)
        });
      } else {
        response = await fetch(`/api/tours/${selectedTour?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tourData)
        });
      }

      if (response.ok) {
        await fetchTours();
        setIsCreating(false);
        setIsEditing(false);
        setSelectedTour(null);
      }
    } catch (error) {
      console.error('Failed to save tour:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await fetch(`/api/tours/${id}`, { method: 'DELETE' });
        await fetchTours();
      } catch (error) {
        console.error('Failed to delete tour:', error);
      }
    }
  };

  const filteredTours = tours.filter(tour =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tour.location && tour.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    tour.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manage Tours</h1>
                <p className="text-sm text-gray-500">Add, edit, and manage tour packages</p>
              </div>
            </div>
            <Button onClick={handleCreate} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Tour</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Tours List */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tours ({filteredTours.length})</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search tours..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTours.map((tour) => (
                    <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        {tour.image_url ? (
                          <img 
                            src={tour.image_url} 
                            alt={tour.title}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              // Hide the broken image and show fallback
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center ${tour.image_url ? 'hidden' : ''}`}>
                          <div className="text-center">
                            <Image className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{tour.title}</h3>
                          <p className="text-sm text-gray-500">{tour.location || 'No location specified'}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{tour.category}</Badge>
                            <Badge variant={tour.is_active ? 'default' : 'secondary'}>
                              {tour.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(tour)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(tour.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminTours;
