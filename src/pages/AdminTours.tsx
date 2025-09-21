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
  group_size: string;
  difficulty: string;
  location: string;
  price: number;
  rating: number;
  image_url: string;
  category: string;
  status: string;
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
    group_size: '',
    difficulty: '',
    location: '',
    price: '',
    rating: '',
    image_url: '',
    category: '',
    status: 'active'
  });
  const navigate = useNavigate();

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
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
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
      group_size: '',
      difficulty: '',
      location: '',
      price: '',
      rating: '',
      image_url: '',
      category: '',
      status: 'active'
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
      group_size: tour.group_size,
      difficulty: tour.difficulty,
      location: tour.location,
      price: tour.price.toString(),
      rating: tour.rating.toString(),
      image_url: tour.image_url,
      category: tour.category,
      status: tour.status
    });
  };

  const handleSave = async () => {
    try {
      const tourData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating)
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tours List */}
          <div className="lg:col-span-2">
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
                            <Badge variant={tour.status === 'active' ? 'default' : 'secondary'}>
                              {tour.status}
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
          <div className="lg:col-span-1">
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
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Tour title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tour description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 3 days"
                      />
                    </div>
                    <div>
                      <Label htmlFor="group_size">Group Size</Label>
                      <Input
                        id="group_size"
                        value={formData.group_size}
                        onChange={(e) => setFormData({ ...formData, group_size: e.target.value })}
                        placeholder="e.g., 2-8 people"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Tour location"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Tour price"
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

                  <div>
                    <Label htmlFor="category">Category</Label>
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

                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
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
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
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
