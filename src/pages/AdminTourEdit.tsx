import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GalleryUpload from '@/components/GalleryUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  X,
  Save,
  Upload,
  Image,
  MapPin,
  Clock,
  Users,
  Star,
  Utensils,
  Car,
  Camera,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  description?: string;
  alt?: string;
}

interface ExtendedTourForm {
  // Basic Info
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  price: string;
  maxParticipants: string;
  rating: string;
  reviewsCount: string;
  groupSize: string;
  location: string;
  
  // Overview
  overview: string;
  bestSeason: string;
  meetingPoint: string;
  languages: string;
  
  // Accommodation & Food
  accommodationDetails: string;
  mealsDetails: string;
  waterSnacksDetails: string;
  
  // Equipment
  providedEquipment: string[];
  whatToBring: string[];
  
  // Transport
  transportDetails: string;
  pickupService: string;
  
  // Media
  galleryImages: GalleryImage[];
  photographyService: string;
  
  // Price
  priceIncludes: string[];
  groupDiscounts: string;
  earlyBirdDiscount: string;
  
  // Contact & Booking
  contactPhone: string;
  bookingTerms: string;
  
  // Highlights, Includes, Excludes
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: string;
  requirements: string;
  
  // Status
  isActive: boolean;
  featured: boolean;
}

const AdminTourEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ExtendedTourForm>({
    // Basic Info
    title: '',
    description: '',
    category: '',
    duration: '',
    difficulty: '',
    price: '',
    maxParticipants: '',
    rating: '',
    reviewsCount: '',
    groupSize: '',
    location: '',
    
    // Overview
    overview: '',
    bestSeason: '',
    meetingPoint: '',
    languages: '',
    
    // Accommodation & Food
    accommodationDetails: '',
    mealsDetails: '',
    waterSnacksDetails: '',
    
    // Equipment
    providedEquipment: [],
    whatToBring: [],
    
    // Transport
    transportDetails: '',
    pickupService: '',
    
    // Media
    galleryImages: [],
    photographyService: '',
    
    // Price
    priceIncludes: [],
    groupDiscounts: '',
    earlyBirdDiscount: '',
    
    // Contact & Booking
    contactPhone: '',
    bookingTerms: '',
    
    // Highlights, Includes, Excludes
    highlights: [],
    includes: [],
    excludes: [],
    itinerary: '',
    requirements: '',
    
    // Status
    isActive: true,
    featured: false
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (id) {
      fetchTourData();
    }
  }, [id, navigate]);

  const fetchTourData = async () => {
    try {
      const response = await fetch('/api/tours');
      const result = await response.json();
      
      if (result.success && result.data) {
        const tour = result.data.find((t: any) => t.id === parseInt(id!));
        if (tour) {
          setFormData({
            // Basic Info
            title: tour.title || '',
            description: tour.description || '',
            category: tour.category || '',
            duration: tour.duration || '',
            difficulty: tour.difficulty || '',
            price: tour.price?.toString() || '',
            maxParticipants: tour.max_participants?.toString() || '',
            rating: tour.rating?.toString() || '',
            reviewsCount: tour.reviews_count?.toString() || '',
            groupSize: tour.group_size || '',
            location: tour.location || '',
            
            // Overview
            overview: tour.overview || '',
            bestSeason: tour.best_season || '',
            meetingPoint: tour.meeting_point || '',
            languages: tour.languages || '',
            
            // Accommodation & Food
            accommodationDetails: tour.accommodation_details || '',
            mealsDetails: tour.meals_details || '',
            waterSnacksDetails: tour.water_snacks_details || '',
            
            // Equipment
            providedEquipment: tour.provided_equipment || [],
            whatToBring: tour.what_to_bring || [],
            
            // Transport
            transportDetails: tour.transport_details || '',
            pickupService: tour.pickup_service || '',
            
            // Media
            galleryImages: tour.gallery_images ? tour.gallery_images.map((url: string, index: number) => ({
              id: `existing-${index}`,
              url: url,
              filename: url.split('/').pop() || `image-${index}`,
              size: 0,
              uploadedAt: new Date().toISOString()
            })) : [],
            photographyService: tour.photography_service || '',
            
            // Price
            priceIncludes: tour.price_includes || [],
            groupDiscounts: tour.group_discounts || '',
            earlyBirdDiscount: tour.early_bird_discount || '',
            
            // Contact & Booking
            contactPhone: tour.contact_phone || '',
            bookingTerms: tour.booking_terms || '',
            
            // Highlights, Includes, Excludes
            highlights: tour.highlights || [],
            includes: tour.includes || [],
            excludes: tour.excludes || [],
            itinerary: tour.itinerary || '',
            requirements: tour.requirements || '',
            
            // Status
            isActive: tour.is_active !== false,
            featured: tour.featured === true
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch tour data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ExtendedTourForm, value: string | boolean | GalleryImage[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field: 'highlights' | 'includes' | 'excludes' | 'providedEquipment' | 'whatToBring' | 'priceIncludes', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'highlights' | 'includes' | 'excludes' | 'providedEquipment' | 'whatToBring' | 'priceIncludes', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayField = (field: 'highlights' | 'includes' | 'excludes' | 'providedEquipment' | 'whatToBring' | 'priceIncludes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tourData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration: formData.duration,
        difficulty: formData.difficulty,
        price: parseFloat(formData.price),
        maxParticipants: parseInt(formData.maxParticipants),
        rating: parseFloat(formData.rating) || 4.5,
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
        galleryImages: formData.galleryImages.map(img => img.url),
        specialFields: {},
        imageUrl: '',
        isActive: formData.isActive,
        featured: formData.featured
      };

      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Tour updated successfully!');
        navigate('/admin/tours');
      } else {
        alert(`Failed to update tour: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      alert('Failed to update tour. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tour data...</p>
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
              <Button variant="ghost" onClick={() => navigate('/admin/tours')} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Tours</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Tour</h1>
                <p className="text-sm text-gray-500">Update tour information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Basic Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Tour title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tour description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 3 days"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
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
                    onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    placeholder="e.g., 12"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Pricing & Rating */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span>Pricing & Rating</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
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
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    placeholder="4.5"
                  />
                </div>
                <div>
                  <Label htmlFor="reviewsCount">Reviews Count</Label>
                  <Input
                    id="reviewsCount"
                    type="number"
                    value={formData.reviewsCount}
                    onChange={(e) => handleInputChange('reviewsCount', e.target.value)}
                    placeholder="Number of reviews"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="groupDiscounts">Group Discounts</Label>
                  <Input
                    id="groupDiscounts"
                    value={formData.groupDiscounts}
                    onChange={(e) => handleInputChange('groupDiscounts', e.target.value)}
                    placeholder="e.g., 10% off for groups of 6+"
                  />
                </div>
                <div>
                  <Label htmlFor="earlyBirdDiscount">Early Bird Discount</Label>
                  <Input
                    id="earlyBirdDiscount"
                    value={formData.earlyBirdDiscount}
                    onChange={(e) => handleInputChange('earlyBirdDiscount', e.target.value)}
                    placeholder="e.g., 15% off for early booking"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Location & Overview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>Location & Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Tour location"
                  />
                </div>
                <div>
                  <Label htmlFor="groupSize">Group Size</Label>
                  <Input
                    id="groupSize"
                    value={formData.groupSize}
                    onChange={(e) => handleInputChange('groupSize', e.target.value)}
                    placeholder="e.g., 2-8 people"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  value={formData.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                  placeholder="Tour overview"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bestSeason">Best Season</Label>
                  <Input
                    id="bestSeason"
                    value={formData.bestSeason}
                    onChange={(e) => handleInputChange('bestSeason', e.target.value)}
                    placeholder="e.g., May to October"
                  />
                </div>
                <div>
                  <Label htmlFor="meetingPoint">Meeting Point</Label>
                  <Input
                    id="meetingPoint"
                    value={formData.meetingPoint}
                    onChange={(e) => handleInputChange('meetingPoint', e.target.value)}
                    placeholder="Where to meet"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="languages">Languages</Label>
                <Input
                  id="languages"
                  value={formData.languages}
                  onChange={(e) => handleInputChange('languages', e.target.value)}
                  placeholder="e.g., English, Azerbaijani, Russian"
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Highlights, Includes & Excludes */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Highlights, Includes & Excludes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Highlights */}
              <div>
                <Label>Highlights</Label>
                <div className="space-y-2">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={highlight}
                        onChange={(e) => handleArrayFieldChange('highlights', index, e.target.value)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Includes</Label>
                  <div className="space-y-2">
                    {formData.includes.map((include, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={include}
                          onChange={(e) => handleArrayFieldChange('includes', index, e.target.value)}
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
                          onChange={(e) => handleArrayFieldChange('excludes', index, e.target.value)}
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
            </CardContent>
          </Card>

          {/* 5. Itinerary & Requirements */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <span>Itinerary & Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="itinerary">Itinerary</Label>
                <Textarea
                  id="itinerary"
                  value={formData.itinerary}
                  onChange={(e) => handleInputChange('itinerary', e.target.value)}
                  placeholder="Detailed itinerary"
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="What participants need to bring/know"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* 6. Accommodation & Food */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                <span>Accommodation & Food</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="accommodationDetails">Accommodation Details</Label>
                <Textarea
                  id="accommodationDetails"
                  value={formData.accommodationDetails}
                  onChange={(e) => handleInputChange('accommodationDetails', e.target.value)}
                  placeholder="Accommodation information"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="mealsDetails">Meals Details</Label>
                  <Textarea
                    id="mealsDetails"
                    value={formData.mealsDetails}
                    onChange={(e) => handleInputChange('mealsDetails', e.target.value)}
                    placeholder="Meal information"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="waterSnacksDetails">Water & Snacks Details</Label>
                  <Textarea
                    id="waterSnacksDetails"
                    value={formData.waterSnacksDetails}
                    onChange={(e) => handleInputChange('waterSnacksDetails', e.target.value)}
                    placeholder="Water and snacks information"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7. Equipment */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-indigo-500" />
                <span>Equipment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Provided Equipment</Label>
                  <div className="space-y-2">
                    {formData.providedEquipment.map((equipment, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={equipment}
                          onChange={(e) => handleArrayFieldChange('providedEquipment', index, e.target.value)}
                          placeholder="Equipment provided"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField('providedEquipment', index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add equipment"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addArrayField('providedEquipment', e.currentTarget.value);
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
                          addArrayField('providedEquipment', input.value);
                          input.value = '';
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>What to Bring</Label>
                  <div className="space-y-2">
                    {formData.whatToBring.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => handleArrayFieldChange('whatToBring', index, e.target.value)}
                          placeholder="Item to bring"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField('whatToBring', index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add item"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addArrayField('whatToBring', e.currentTarget.value);
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
                          addArrayField('whatToBring', input.value);
                          input.value = '';
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. Transport */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-teal-500" />
                <span>Transport</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="transportDetails">Transport Details</Label>
                <Textarea
                  id="transportDetails"
                  value={formData.transportDetails}
                  onChange={(e) => handleInputChange('transportDetails', e.target.value)}
                  placeholder="Transportation information"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pickupService">Pickup Service</Label>
                <Textarea
                  id="pickupService"
                  value={formData.pickupService}
                  onChange={(e) => handleInputChange('pickupService', e.target.value)}
                  placeholder="Pickup service details"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* 9. Media */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-pink-500" />
                <span>Media</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Gallery Images</Label>
                <p className="text-sm text-gray-500">
                  Upload images directly to Vercel Blob storage or use existing URLs
                </p>
                
                {/* Gallery Upload Component */}
                <GalleryUpload
                  onImagesChange={(images) => handleInputChange('galleryImages', images)}
                  initialImages={formData.galleryImages}
                  maxImages={10}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photographyService">Photography Service</Label>
                <Textarea
                  id="photographyService"
                  value={formData.photographyService}
                  onChange={(e) => handleInputChange('photographyService', e.target.value)}
                  placeholder="Describe photography services..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* 10. Price Includes */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span>Price Includes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Price Includes</Label>
                <div className="space-y-2">
                  {formData.priceIncludes.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayFieldChange('priceIncludes', index, e.target.value)}
                        placeholder="What's included in price"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('priceIncludes', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add price inclusion"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayField('priceIncludes', e.currentTarget.value);
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
                        addArrayField('priceIncludes', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 11. Contact & Booking */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span>Contact & Booking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="Contact phone number"
                />
              </div>

              <div>
                <Label htmlFor="bookingTerms">Booking Terms</Label>
                <Textarea
                  id="bookingTerms"
                  value={formData.bookingTerms}
                  onChange={(e) => handleInputChange('bookingTerms', e.target.value)}
                  placeholder="Booking terms and conditions"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* 12. Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span>Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="isActive">Active Status</Label>
                  <Select value={formData.isActive ? 'active' : 'inactive'} onValueChange={(value) => handleInputChange('isActive', value === 'active')}>
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
                  <Select value={formData.featured ? 'yes' : 'no'} onValueChange={(value) => handleInputChange('featured', value === 'yes')}>
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
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/tours')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Tour
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTourEdit;
