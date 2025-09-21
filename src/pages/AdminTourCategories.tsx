import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Mountain, 
  Camera, 
  Users, 
  Heart,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Plus,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';

interface TourForm {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  price: string;
  maxParticipants: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: string;
  requirements: string;
  category: string;
}

const AdminTourCategories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<TourForm>({
    title: '',
    description: '',
    duration: '',
    difficulty: '',
    price: '',
    maxParticipants: '',
    highlights: [''],
    includes: [''],
    excludes: [''],
    itinerary: '',
    requirements: '',
    category: ''
  });


  const tourCategories = [
    {
      id: 'hiking',
      title: 'Hiking Tours',
      icon: Mountain,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      description: 'Nature hiking adventures',
      count: 8,
      difficultyOptions: ['Easy', 'Moderate', 'Challenging'],
      durationOptions: ['Half Day', 'Full Day', '2 Days', '3 Days'],
      specialFields: {
        terrain: 'Forest trails, mountain paths',
        equipment: 'Hiking boots, backpack, water bottle'
      }
    },
    {
      id: 'trekking',
      title: 'Trekking Tours',
      icon: Mountain,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      description: 'Mountain trekking experiences',
      count: 6,
      difficultyOptions: ['Moderate', 'Challenging', 'Extreme'],
      durationOptions: ['2 Days', '3 Days', '5 Days', '7 Days', '10 Days'],
      specialFields: {
        altitude: 'High altitude trekking',
        equipment: 'Trekking poles, warm clothing, sleeping bag'
      }
    },
    {
      id: 'wildlife',
      title: 'Wildlife Tours',
      icon: Camera,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      description: 'Wildlife photography tours',
      count: 5,
      difficultyOptions: ['Easy', 'Moderate'],
      durationOptions: ['Half Day', 'Full Day', '2 Days', '3 Days'],
      specialFields: {
        bestSeason: 'Best viewing seasons',
        equipment: 'Camera, binoculars, camouflage clothing'
      }
    },
    {
      id: 'group-tours',
      title: 'Group Tours',
      icon: Users,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      description: 'Group adventure packages',
      count: 7,
      difficultyOptions: ['Easy', 'Moderate', 'Challenging'],
      durationOptions: ['1 Day', '2 Days', '3 Days', '5 Days', '7 Days'],
      specialFields: {
        groupSize: 'Minimum and maximum group size',
        equipment: 'Group equipment provided'
      }
    },
    {
      id: 'tailor-made',
      title: 'Tailor Made Tours',
      icon: Heart,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      description: 'Custom tour packages',
      count: 6,
      difficultyOptions: ['Any Level'],
      durationOptions: ['Flexible'],
      specialFields: {
        customization: 'Fully customizable itinerary',
        equipment: 'Based on selected activities'
      }
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFormData(prev => ({ ...prev, category: categoryId }));
  };

  const handleInputChange = (field: keyof TourForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field: 'highlights' | 'includes' | 'excludes', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'highlights' | 'includes' | 'excludes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'highlights' | 'includes' | 'excludes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        includes: formData.includes.filter(i => i.trim() !== ''),
        excludes: formData.excludes.filter(e => e.trim() !== ''),
        itinerary: formData.itinerary.trim(),
        requirements: formData.requirements.trim(),
        specialFields: selectedCategoryData?.specialFields || {}
      };

      // Send to API
      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Tour added successfully!');
        setShowAddForm(false);
        setFormData({
          title: '',
          description: '',
          duration: '',
          difficulty: '',
          price: '',
          maxParticipants: '',
          highlights: [''],
          includes: [''],
          excludes: [''],
          itinerary: '',
          requirements: '',
          category: ''
        });
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

  const selectedCategoryData = tourCategories.find(cat => cat.id === selectedCategory);

  if (showAddForm && selectedCategoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className={`w-12 h-12 ${selectedCategoryData.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <selectedCategoryData.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New {selectedCategoryData.title}</h1>
                <p className="text-gray-600">{selectedCategoryData.description}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-500" />
                <span>Tour Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tour Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter tour title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategoryData.durationOptions.map((duration) => (
                          <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategoryData.difficultyOptions.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
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
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                      placeholder="Enter max participants"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter tour description"
                    rows={4}
                    required
                  />
                </div>

                {/* Special Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(selectedCategoryData.specialFields).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                      <Input
                        id={key}
                        placeholder={value}
                        className="bg-gray-50"
                      />
                    </div>
                  ))}
                </div>

                {/* Highlights */}
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

                {/* Includes */}
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

                {/* Excludes */}
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

                {/* Itinerary */}
                <div className="space-y-2">
                  <Label htmlFor="itinerary">Detailed Itinerary</Label>
                  <Textarea
                    id="itinerary"
                    value={formData.itinerary}
                    onChange={(e) => handleInputChange('itinerary', e.target.value)}
                    placeholder="Enter detailed itinerary"
                    rows={6}
                    required
                  />
                </div>

                {/* Requirements */}
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

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Tour'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tour Categories</h1>
            <p className="text-gray-600">Select a category to add new tours</p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tourCategories.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 shadow-lg"
              onClick={() => {
                handleCategorySelect(category.id);
                setShowAddForm(true);
              }}
            >
              <CardContent className="p-8">
                <div className="text-center">
                  <div className={`w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <category.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="outline" className="bg-gray-50">
                      {category.count} tours
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{category.durationOptions.length} durations</span>
                    </div>
                  </div>
                  <Button
                    className={`w-full ${category.color} hover:opacity-90 text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategorySelect(category.id);
                      setShowAddForm(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTourCategories;
