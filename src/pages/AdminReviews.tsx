import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Star, ExternalLink } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  review_text: string;
  source: string;
  source_logo?: string;
  source_url?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    review_text: '',
    source: '',
    source_logo: '',
    source_url: '',
    is_featured: false
  });

  const reviewSources = [
    { name: 'TripAdvisor', logo: 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg' },
    { name: 'Google Reviews', logo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png' },
    { name: 'Booking.com', logo: 'https://cf.bstatic.com/static/img/logo/booking_logo_retina/logo_booking_retina.png' },
    { name: 'GetYourGuide', logo: 'https://cdn.getyourguide.com/img/logo/gyg-logo.svg' },
    { name: 'Viator', logo: 'https://www.viator.com/images/branding/viator-logo.svg' },
    { name: 'Trustpilot', logo: 'https://cdn.trustpilot.net/brand-assets/logos/trustpilot-logo.svg' },
    { name: 'Facebook', logo: 'https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/9rNo3Vzb_oY.png' },
    { name: 'Instagram', logo: 'https://static.cdninstagram.com/rsrc.php/v3/yx/r/9rNo3Vzb_oY.png' }
  ];

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchReviews();
  }, [navigate]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingReview ? `/api/reviews` : '/api/reviews';
      const method = editingReview ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(editingReview && { id: editingReview.id })
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchReviews();
        resetForm();
      } else {
        alert('Error saving review: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Error saving review');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      rating: review.rating,
      review_text: review.review_text,
      source: review.source,
      source_logo: review.source_logo || '',
      source_url: review.source_url || '',
      is_featured: review.is_featured
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchReviews();
      } else {
        alert('Error deleting review: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rating: 5,
      review_text: '',
      source: '',
      source_logo: '',
      source_url: '',
      is_featured: false
    });
    setEditingReview(null);
    setShowForm(false);
  };

  const handleSourceChange = (source: string) => {
    const selectedSource = reviewSources.find(s => s.name === source);
    setFormData(prev => ({
      ...prev,
      source,
      source_logo: selectedSource?.logo || ''
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Reviews</h1>
            <p className="text-muted-foreground">Manage customer reviews and testimonials</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Review
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingReview ? 'Edit Review' : 'Add New Review'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Customer Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Select
                      value={formData.rating.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(rating => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating} Star{rating > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="review_text">Review Text</Label>
                  <Textarea
                    id="review_text"
                    value={formData.review_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="source">Review Source</Label>
                    <Select
                      value={formData.source}
                      onValueChange={handleSourceChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {reviewSources.map(source => (
                          <SelectItem key={source.name} value={source.name}>
                            {source.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="source_url">Source URL (Optional)</Label>
                    <Input
                      id="source_url"
                      value={formData.source_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, source_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                  />
                  <Label htmlFor="is_featured">Featured Review (Show on Homepage)</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingReview ? 'Update Review' : 'Add Review'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{review.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge variant={review.is_featured ? 'default' : 'secondary'}>
                        {review.is_featured ? 'Featured' : 'Regular'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(review)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {review.review_text}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {review.source_logo && (
                      <img
                        src={review.source_logo}
                        alt={review.source}
                        className="h-6 w-auto"
                      />
                    )}
                    <span className="text-sm text-muted-foreground">{review.source}</span>
                  </div>
                  {review.source_url && (
                    <a
                      href={review.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
