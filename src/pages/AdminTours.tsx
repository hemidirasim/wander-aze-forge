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
  X
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
    specialFields: {} as any
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
    setIsCreating(true);
    setIsEditing(false);
    setSelectedTour(null);
    setFormData({
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
      highlights: [],
      includes: [],
      excludes: [],
      providedEquipment: [],
      whatToBring: [],
      priceIncludes: [],
      galleryImages: [],
      specialFields: {}
    });
  };

  const handleEdit = (tour: Tour) => {
    setIsEditing(true);
    setIsCreating(false);
    setSelectedTour(tour);
    setFormData({
      title: tour.title,
      description: tour.description,
      duration: tour.duration,
      difficulty: tour.difficulty,
      price: tour.price.toString(),
      maxParticipants: tour.max_participants?.toString() || '',
      rating: tour.rating.toString(),
      reviewsCount: tour.reviews_count?.toString() || '',
      groupSize: tour.group_size || '',
      location: tour.location || '',
      overview: tour.overview || '',
      bestSeason: tour.best_season || '',
      meetingPoint: tour.meeting_point || '',
      languages: tour.languages || '',
      accommodationDetails: tour.accommodation_details || '',
      mealsDetails: tour.meals_details || '',
      waterSnacksDetails: tour.water_snacks_details || '',
      transportDetails: tour.transport_details || '',
      pickupService: tour.pickup_service || '',
      photographyService: tour.photography_service || '',
      groupDiscounts: tour.group_discounts || '',
      earlyBirdDiscount: tour.early_bird_discount || '',
      contactPhone: tour.contact_phone || '',
      bookingTerms: tour.booking_terms || '',
      itinerary: tour.itinerary || '',
      requirements: tour.requirements || '',
      imageUrl: tour.image_url || '',
      category: tour.category,
      isActive: tour.is_active || true,
      featured: tour.featured || false,
      highlights: tour.highlights || [],
      includes: tour.includes || [],
      excludes: tour.excludes || [],
      providedEquipment: tour.provided_equipment || [],
      whatToBring: tour.what_to_bring || [],
      priceIncludes: tour.price_includes || [],
      galleryImages: tour.gallery_images || [],
      specialFields: tour.special_fields || {}
    });
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
    tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                        <img 
                          src={tour.image_url} 
                          alt={tour.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{tour.title}</h3>
                          <p className="text-sm text-gray-500">{tour.location}</p>
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

          {/* Tour Form */}
          <div className="lg:col-span-3">
            {(isCreating || isEditing) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {isCreating ? 'Create New Tour' : 'Edit Tour'}
                    <Button variant="ghost" size="sm" onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                      setSelectedTour(null);
                    }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 max-h-[80vh] overflow-y-auto">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Tour title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hiking">Hiking</SelectItem>
                          <SelectItem value="trekking">Trekking</SelectItem>
                          <SelectItem value="wildlife">Wildlife</SelectItem>
                          <SelectItem value="group-tours">Group Tours</SelectItem>
                          <SelectItem value="tailor-made">Tailor-made</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tour description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 3 days"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty *</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Challenging">Challenging</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants">Max Participants *</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                        placeholder="e.g., 12"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Tour price"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        placeholder="4.5"
                      />
                    </div>
                  </div>

                  {/* Location & Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Tour location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupSize">Group Size</Label>
                      <Input
                        id="groupSize"
                        value={formData.groupSize}
                        onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                        placeholder="e.g., 2-8 people"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      value={formData.overview}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      placeholder="Tour overview"
                      rows={3}
                    />
                  </div>

                  {/* Highlights */}
                  <div>
                    <Label>Highlights</Label>
                    <div className="space-y-2">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) => updateArrayField('highlights', index, e.target.value)}
                            placeholder="Tour highlight"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayField('highlights', index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add highlight"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayField('highlights', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addArrayField('highlights', input.value);
                            input.value = '';
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Includes & Excludes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Includes</Label>
                      <div className="space-y-2">
                        {formData.includes.map((include, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={include}
                              onChange={(e) => updateArrayField('includes', index, e.target.value)}
                              placeholder="What's included"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayField('includes', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add inclusion"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addArrayField('includes', e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addArrayField('includes', input.value);
                              input.value = '';
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Excludes</Label>
                      <div className="space-y-2">
                        {formData.excludes.map((exclude, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={exclude}
                              onChange={(e) => updateArrayField('excludes', index, e.target.value)}
                              placeholder="What's not included"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayField('excludes', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add exclusion"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addArrayField('excludes', e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addArrayField('excludes', input.value);
                              input.value = '';
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Itinerary & Requirements */}
                  <div>
                    <Label htmlFor="itinerary">Itinerary</Label>
                    <Textarea
                      id="itinerary"
                      value={formData.itinerary}
                      onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
                      placeholder="Detailed itinerary"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="What participants need to bring/know"
                      rows={3}
                    />
                  </div>

                  {/* Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="isActive">Active Status</Label>
                      <Select value={formData.isActive ? 'active' : 'inactive'} onValueChange={(value) => setFormData({ ...formData, isActive: value === 'active' })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="featured">Featured</Label>
                      <Select value={formData.featured ? 'yes' : 'no'} onValueChange={(value) => setFormData({ ...formData, featured: value === 'yes' })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Featured?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleSave} className="w-full flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>{isCreating ? 'Create Tour' : 'Update Tour'}</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTours;
