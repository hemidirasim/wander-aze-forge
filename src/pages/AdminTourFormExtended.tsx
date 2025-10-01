import React, { useState, useEffect } from 'react';
import GalleryUpload from '@/components/GalleryUpload';
import TourProgramAccordionAdmin from '@/components/TourProgramAccordionAdmin';
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
  DollarSign
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

interface TourProgramDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: string[];
  transportation: string;
  highlights: string[];
  difficultyLevel: string;
  durationHours: number;
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
  
  // Participant Pricing
  pricing_type: string;
  participant_pricing: { participants: number; price: number }[];
  
  // Contact & Booking
  contactPhone: string;
  bookingTerms: string;
  
  // Highlights, Includes, Excludes
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: string;
  requirements: string;
  
  // Tour Programs
  tourPrograms: TourProgramDay[];
  
  // Status
  isActive: boolean;
  featured: boolean;
}

interface TourCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const AdminTourFormExtended: React.FC = () => {
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState<ExtendedTourForm>({
    // Basic Info
    title: 'Göygöl Milli Parkı və Qafqaz Dağları Ekspedisiyası',
    description: 'Göygöl Milli Parkının gözəl təbiətini kəşf edin və Qafqaz dağlarının möhtəşəm mənzərələrini görün. Bu 3 günlük ekspedisiya sizə unudulmaz təcrübə bəxş edəcək.',
    category: 'trekking',
    duration: '3 days',
    difficulty: 'Medium',
    price: '250',
    maxParticipants: '12',
    rating: '4.8',
    reviewsCount: '47',
    groupSize: '6-12 people',
    location: 'Göygöl, Qafqaz Dağları, Azərbaycan',
    
    
    // Overview
    overview: 'Göygöl Milli Parkında 3 günlük möhtəşəm ekspedisiya. Qafqaz dağlarının ən gözəl yerlərini kəşf edin, təbiətin sirlərini öyrənin və unudulmaz xatirələr yaradın. Professional bələdçi ilə təhlükəsiz və rahat səyahət.',
    bestSeason: 'Aprel - Oktyabr',
    meetingPoint: 'Bakı şəhər mərkəzi, Fəvvarələr meydanı',
    languages: 'Azərbaycan, İngilis, Rus',
    
    // Accommodation & Food
    accommodationDetails: 'Göygöl Milli Parkında rahat otel yerləşdirməsi. Bütün rahatlıq şəraitləri mövcuddur.',
    mealsDetails: 'Bütün yeməklər daxildir: səhər yeməyi, nahar və axşam yeməyi. Azərbaycan milli mətbəxi.',
    waterSnacksDetails: 'Tur boyunca su və qəlyanaltılar təmin edilir.',
    
    // Equipment
    providedEquipment: ['Dağ ayaqqabıları', 'Təhlükəsizlik avadanlığı', 'İlk yardım dəsti', 'GPS cihazı', 'Teleskop'],
    whatToBring: ['İsti paltar', 'Şəxsi əşyalar', 'Fotoaparat', 'Günəş eynəyi', 'Su butulka'],
    
    // Transport
    transportDetails: 'Şəxsi nəqliyyat vasitəsi daxildir. Rahat və təhlükəsiz səyahət.',
    pickupService: 'Bakı otellərindən pulsuz götürmə xidməti',
    
    // Media
    galleryImages: [],
    photographyService: 'Professional fotoqraf xidməti təmin edilir. Bütün fotolar pulsuz.',
    
    // Price
    priceIncludes: ['Nəqliyyat', 'Yeməklər', 'Bələdçi', 'Avadanlıq', 'Otel', 'Fotoqraf'],
    groupDiscounts: '6+ nəfər üçün 10% endirim',
    earlyBirdDiscount: 'Erkən rezervasiya üçün 15% endirim',
    
    // Participant Pricing
    pricing_type: 'participant_based',
    participant_pricing: [
      { participants: 1, price: 300 },
      { participants: 2, price: 280 },
      { participants: 4, price: 250 },
      { participants: 6, price: 220 },
      { participants: 8, price: 200 }
    ],
    
    // Contact & Booking
    contactPhone: '+994 50 123 45 67',
    bookingTerms: 'Tur başlamazdan əvvəl tam ödəniş tələb olunur. 48 saat əvvəl ləğv etmək mümkündür.',
    
    // Highlights, Includes, Excludes
    highlights: ['Göygöl gölünün möhtəşəm mənzərəsi', 'Qafqaz dağlarının zirvələri', 'Təbiətin sirləri', 'Professional fotoqrafiya', 'Azərbaycan milli mətbəxi'],
    includes: ['Professional bələdçi', 'Nəqliyyat', 'Yeməklər', 'Avadanlıq', 'Otel yerləşdirməsi', 'Fotoqraf xidməti'],
    excludes: ['Şəxsi əşyalar', 'Sığorta', 'Bəxşiş', 'Alkoqol içkiləri'],
    itinerary: 'Gün 1: Bakıdan Göygölə gediş, qısa gəzinti. Gün 2: Əsas dağ yürüşü və Göygöl gölü. Gün 3: Qafqaz zirvələri və Bakıya qayıdış.',
    requirements: 'Orta fiziki hazırlıq tələb olunur. 12+ yaş. Sağlamlıq vəsiqəsi tələb olunur.',
    specialFields: 'Göygöl Milli Parkı xüsusi icazəsi tələb olunur. Hava şəraitinə görə dəyişiklik mümkündür.',
    
    // Tour Programs
    tourPrograms: [
      {
        id: 'goygol-day-1',
        dayNumber: 1,
        title: 'Bakıdan Göygölə Gediş və Qısa Gəzinti',
        description: 'Bakıdan Göygöl Milli Parkına gediş. Göygöl gölünün ətrafında qısa gəzinti və təbiəti kəşf etmə.',
        activities: ['Bakıdan yola çıxış', 'Göygöl Milli Parkına gediş', 'Qısa gəzinti', 'Axşam yeməyi'],
        accommodation: 'Göygöl oteli',
        meals: ['Nahar', 'Axşam yeməyi'],
        transportation: 'Avtobus',
        highlights: ['Göygöl gölü', 'Qafqaz mənzərəsi', 'Qrup tanışlığı'],
        difficultyLevel: 'Easy',
        durationHours: 6
      },
      {
        id: 'goygol-day-2',
        dayNumber: 2,
        title: 'Əsas Dağ Yürüşü və Göygöl Gölü',
        description: 'Göygöl Milli Parkının ən gözəl yerlərini kəşf edin. Qafqaz dağlarının zirvələrinə çıxış.',
        activities: ['Səhər yeməyi', 'Dağ yürüşü', 'Göygöl gölü', 'Nahar fasiləsi', 'Zirvəyə çıxış'],
        accommodation: 'Göygöl oteli',
        meals: ['Səhər yeməyi', 'Nahar', 'Axşam yeməyi'],
        transportation: 'Yürüyüş',
        highlights: ['Göygöl gölü', 'Qafqaz zirvələri', 'Təbiət fotoları', 'Panoramik mənzərə'],
        difficultyLevel: 'Moderate',
        durationHours: 8
      },
      {
        id: 'goygol-day-3',
        dayNumber: 3,
        title: 'Qafqaz Zirvələri və Bakıya Qayıdış',
        description: 'Qafqaz dağlarının ən yüksək zirvələrinə çıxış və Bakıya qayıdış.',
        activities: ['Səhər yeməyi', 'Zirvəyə çıxış', 'Fəaliyyət fotoları', 'Bakıya qayıdış'],
        accommodation: 'Bakı oteli',
        meals: ['Səhər yeməyi', 'Nahar'],
        transportation: 'Avtobus',
        highlights: ['Qafqaz zirvələri', 'Yaddaş fotoları', 'Bakıya qayıdış'],
        difficultyLevel: 'Moderate',
        durationHours: 6
      }
    ],
    
    // Status
    isActive: true,
    featured: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/tour-categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      } else {
        console.error('Failed to fetch categories:', data.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (field: keyof ExtendedTourForm, value: string | boolean | GalleryImage[] | TourProgramDay[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update main image when gallery changes
  React.useEffect(() => {
    const mainImage = formData.galleryImages.find(img => img.isMain);
    if (mainImage) {
      setFormData(prev => ({ ...prev, imageUrl: mainImage.url }));
    } else if (formData.galleryImages.length > 0) {
      // If no main image is set, use the first one
      const firstImageUrl = formData.galleryImages[0].url;
      setFormData(prev => ({ ...prev, imageUrl: firstImageUrl }));
    }
  }, [formData.galleryImages]);

  const handleArrayFieldChange = (field: 'highlights' | 'includes' | 'excludes' | 'providedEquipment' | 'whatToBring' | 'priceIncludes', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'highlights' | 'includes' | 'excludes' | 'providedEquipment' | 'whatToBring' | 'priceIncludes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };


  const removeArrayField = (field: 'highlights' | 'includes' | 'excludes' | 'providedEquipment' | 'whatToBring' | 'priceIncludes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Participant Pricing Functions
  const addParticipantPricing = () => {
    setFormData(prev => ({
      ...prev,
      participant_pricing: [...prev.participant_pricing, { participants: 1, price: 0 }]
    }));
  };

  const removeParticipantPricing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participant_pricing: prev.participant_pricing.filter((_, i) => i !== index)
    }));
  };

  const updateParticipantPricing = (index: number, field: 'participants' | 'price', value: number) => {
    setFormData(prev => ({
      ...prev,
      participant_pricing: prev.participant_pricing.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare form data
      const tourData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        duration: formData.duration,
        difficulty: formData.difficulty,
        price: parseFloat(formData.price),
        maxParticipants: parseInt(formData.maxParticipants),
        
        // Extended fields
        rating: parseFloat(formData.rating),
        reviewsCount: parseInt(formData.reviewsCount),
        groupSize: formData.groupSize.trim(),
        location: formData.location.trim(),
        
        overview: formData.overview.trim(),
        bestSeason: formData.bestSeason.trim(),
        meetingPoint: formData.meetingPoint.trim(),
        languages: formData.languages.trim(),
        
        accommodationDetails: formData.accommodationDetails.trim(),
        mealsDetails: formData.mealsDetails.trim(),
        waterSnacksDetails: formData.waterSnacksDetails.trim(),
        
        providedEquipment: formData.providedEquipment.filter(item => item.trim() !== ''),
        whatToBring: formData.whatToBring.filter(item => item.trim() !== ''),
        
        transportDetails: formData.transportDetails.trim(),
        pickupService: formData.pickupService.trim(),
        
        galleryImages: formData.galleryImages.map(img => img.url),
        photographyService: formData.photographyService.trim(),
        
        priceIncludes: formData.priceIncludes.filter(item => item.trim() !== ''),
        groupDiscounts: formData.groupDiscounts.trim(),
        earlyBirdDiscount: formData.earlyBirdDiscount.trim(),
        
        contactPhone: formData.contactPhone.trim(),
        bookingTerms: formData.bookingTerms.trim(),
        
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        includes: formData.includes.filter(i => i.trim() !== ''),
        excludes: formData.excludes.filter(e => e.trim() !== ''),
        itinerary: formData.itinerary.trim(),
        requirements: formData.requirements.trim(),
        
        isActive: formData.isActive,
        featured: formData.featured,
        tour_programs: formData.tourPrograms
      };

      console.log('Sending tour data:', JSON.stringify(tourData, null, 2));
      console.log('tour_programs being sent:', formData.tourPrograms);

      // Send to API
      const response = await fetch('/api/create-tour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Tour created successfully with all details!');
        // Reset form or redirect
      } else {
        throw new Error(result.error || 'Failed to create tour');
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      alert(`Error creating tour: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Comprehensive Tour</h1>
          <p className="text-gray-600">Fill in all sections to create a complete tour with detailed information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Basic Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tour Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter tour title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 3 days, 1 day, 5 days"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Difficult">Difficult</SelectItem>
                      <SelectItem value="Challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing_type">Pricing Type</Label>
                  <Select 
                    value={formData.pricing_type} 
                    onValueChange={(value) => handleInputChange('pricing_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price (Same price for all)</SelectItem>
                      <SelectItem value="participant_based">Participant-Based Pricing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Base Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter base price"
                    required
                  />
                </div>

                {formData.pricing_type === 'participant_based' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Participant-Based Pricing</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addParticipantPricing}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Pricing Tier
                      </Button>
                    </div>
                    
                    {formData.participant_pricing.map((pricing, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <Label className="text-sm font-medium">Participants</Label>
                          <Input
                            type="number"
                            value={pricing.participants}
                            onChange={(e) => updateParticipantPricing(index, 'participants', parseInt(e.target.value) || 0)}
                            placeholder="Number of participants"
                            min="1"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-sm font-medium">Price (USD)</Label>
                          <Input
                            type="number"
                            value={pricing.price}
                            onChange={(e) => updateParticipantPricing(index, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="Price for this group size"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeParticipantPricing(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {formData.participant_pricing.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No participant pricing set</p>
                        <p className="text-sm">Click "Add Pricing Tier" to set different prices for different group sizes</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants *</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    placeholder="Enter max participants"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    placeholder="4.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewsCount">Reviews Count</Label>
                  <Input
                    id="reviewsCount"
                    type="number"
                    value={formData.reviewsCount}
                    onChange={(e) => handleInputChange('reviewsCount', e.target.value)}
                    placeholder="127"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupSize">Group Size</Label>
                  <Input
                    id="groupSize"
                    value={formData.groupSize}
                    onChange={(e) => handleInputChange('groupSize', e.target.value)}
                    placeholder="e.g., 8-12 people"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Greater Caucasus Mountains"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter detailed tour description"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Overview Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span>Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="overview">Overview Description</Label>
                <Textarea
                  id="overview"
                  value={formData.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                  placeholder="Describe what makes this tour special and what participants can expect..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bestSeason">Best Season</Label>
                  <Input
                    id="bestSeason"
                    value={formData.bestSeason}
                    onChange={(e) => handleInputChange('bestSeason', e.target.value)}
                    placeholder="May to October"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages</Label>
                  <Input
                    id="languages"
                    value={formData.languages}
                    onChange={(e) => handleInputChange('languages', e.target.value)}
                    placeholder="English, Azerbaijani, Russian"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meetingPoint">Meeting Point</Label>
                <Textarea
                  id="meetingPoint"
                  value={formData.meetingPoint}
                  onChange={(e) => handleInputChange('meetingPoint', e.target.value)}
                  placeholder="Describe where participants should meet..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. Accommodation and Food */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                <span>Accommodation and Food</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accommodationDetails">Accommodation Details</Label>
                <Textarea
                  id="accommodationDetails"
                  value={formData.accommodationDetails}
                  onChange={(e) => handleInputChange('accommodationDetails', e.target.value)}
                  placeholder="Describe accommodation options..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mealsDetails">Meals Details</Label>
                <Textarea
                  id="mealsDetails"
                  value={formData.mealsDetails}
                  onChange={(e) => handleInputChange('mealsDetails', e.target.value)}
                  placeholder="Describe meal arrangements..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterSnacksDetails">Water & Snacks Details</Label>
                <Textarea
                  id="waterSnacksDetails"
                  value={formData.waterSnacksDetails}
                  onChange={(e) => handleInputChange('waterSnacksDetails', e.target.value)}
                  placeholder="Describe water and snack provisions..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Equipment */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span>Equipment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Provided Equipment</Label>
                {formData.providedEquipment.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayFieldChange('providedEquipment', index, e.target.value)}
                      placeholder="Enter provided equipment"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayField('providedEquipment')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Provided Equipment
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>What to Bring</Label>
                {formData.whatToBring.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayFieldChange('whatToBring', index, e.target.value)}
                      placeholder="Enter required items"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayField('whatToBring')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Required Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 5. Transport */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-indigo-500" />
                <span>Transport</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="transportDetails">Transport Details</Label>
                <Textarea
                  id="transportDetails"
                  value={formData.transportDetails}
                  onChange={(e) => handleInputChange('transportDetails', e.target.value)}
                  placeholder="Describe transportation arrangements..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupService">Pickup Service</Label>
                <Textarea
                  id="pickupService"
                  value={formData.pickupService}
                  onChange={(e) => handleInputChange('pickupService', e.target.value)}
                  placeholder="Describe pickup service details..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* 6. Media */}
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

          {/* 7. Price Details */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                <span>Price Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Price Includes</Label>
                {formData.priceIncludes.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayFieldChange('priceIncludes', index, e.target.value)}
                      placeholder="Enter what's included"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayField('priceIncludes')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Included Item
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="groupDiscounts">Group Discounts</Label>
                  <Input
                    id="groupDiscounts"
                    value={formData.groupDiscounts}
                    onChange={(e) => handleInputChange('groupDiscounts', e.target.value)}
                    placeholder="e.g., 10% off for groups of 6+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="earlyBirdDiscount">Early Bird Discount</Label>
                  <Input
                    id="earlyBirdDiscount"
                    value={formData.earlyBirdDiscount}
                    onChange={(e) => handleInputChange('earlyBirdDiscount', e.target.value)}
                    placeholder="e.g., 15% off 30 days advance"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. Contact & Booking */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Contact & Booking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+994 51 400 90 91"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingTerms">Booking Terms</Label>
                <Textarea
                  id="bookingTerms"
                  value={formData.bookingTerms}
                  onChange={(e) => handleInputChange('bookingTerms', e.target.value)}
                  placeholder="Describe booking terms and conditions..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* 9. Highlights, Includes, Excludes */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span>Highlights, Includes & Excludes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Highlights</Label>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={highlight}
                      onChange={(e) => handleArrayFieldChange('highlights', index, e.target.value)}
                      placeholder="Enter highlight"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayField('highlights')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Highlight
                </Button>
              </div>

              <div className="space-y-2">
                <Label>What's Included</Label>
                {formData.includes.map((include, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={include}
                      onChange={(e) => handleArrayFieldChange('includes', index, e.target.value)}
                      placeholder="Enter inclusion"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayField('includes')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Inclusion
                </Button>
              </div>

              <div className="space-y-2">
                <Label>What's Not Included</Label>
                {formData.excludes.map((exclude, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={exclude}
                      onChange={(e) => handleArrayFieldChange('excludes', index, e.target.value)}
                      placeholder="Enter exclusion"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayField('excludes')}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exclusion
                </Button>
              </div>

              {/* Tour Program Accordion */}
              <TourProgramAccordionAdmin
                programs={formData.tourPrograms}
                onProgramsChange={(programs) => handleInputChange('tourPrograms', programs)}
              />

              <div className="space-y-2">
                <Label htmlFor="itinerary">Detailed Itinerary</Label>
                <Textarea
                  id="itinerary"
                  value={formData.itinerary}
                  onChange={(e) => handleInputChange('itinerary', e.target.value)}
                  placeholder="Enter detailed itinerary"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements & Recommendations</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Enter requirements and recommendations"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>


          {/* Status & Featured */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Status & Featured</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Active Tour
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Featured Tour (Show on Homepage)
                  </Label>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Featured tours will be displayed in the "Our Most Popular Tours" section on the homepage.
              </p>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating Tour...' : 'Create Complete Tour'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTourFormExtended;
