import React, { useState } from 'react';
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

const AdminTourFormExtended: React.FC = () => {
  const [formData, setFormData] = useState<ExtendedTourForm>({
    // Basic Info
    title: '',
    description: '',
    category: '',
    duration: '',
    difficulty: '',
    price: '',
    maxParticipants: '',
    rating: '4.5',
    reviewsCount: '0',
    groupSize: '',
    location: '',
    
    // Overview
    overview: '',
    bestSeason: 'May to October',
    meetingPoint: '',
    languages: 'English, Azerbaijani, Russian',
    
    // Accommodation & Food
    accommodationDetails: '',
    mealsDetails: '',
    waterSnacksDetails: '',
    
    // Equipment
    providedEquipment: [''],
    whatToBring: [''],
    
    // Transport
    transportDetails: '',
    pickupService: '',
    
    // Media
    galleryImages: [],
    photographyService: '',
    
    // Price
    priceIncludes: [''],
    groupDiscounts: '',
    earlyBirdDiscount: '',
    
    // Contact & Booking
    contactPhone: '+994 51 400 90 91',
    bookingTerms: '',
    
    // Highlights, Includes, Excludes
    highlights: [''],
    includes: [''],
    excludes: [''],
    itinerary: '',
    requirements: '',
    
    // Tour Programs
    tourPrograms: [],
    
    // Status
    isActive: true,
    featured: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        featured: formData.featured
      };

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
                      <SelectItem value="hiking">Hiking</SelectItem>
                      <SelectItem value="trekking">Trekking</SelectItem>
                      <SelectItem value="wildlife">Wildlife</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
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
                      <SelectItem value="Challenging">Challenging</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price"
                    required
                  />
                </div>
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
