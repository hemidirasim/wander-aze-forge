import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Star, Upload, X } from 'lucide-react';
import FileUpload from '@/components/FileUpload';

interface Tour {
  id: number;
  title: string;
  category: string;
  price: string | number;
  duration: string;
  difficulty: string;
  max_participants: number;
  booked_seats: number;
  start_date: string;
  end_date: string;
  location: string;
  overview: string;
  included: string;
  not_included: string;
  what_to_bring: string;
  transport_details: string;
  pickup_service: string;
  photography_service: string;
  gallery_images: string[];
  created_at: string;
  updated_at: string;
}

const TourReview = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (id) {
      fetchTour(parseInt(id));
      // Ensure database table exists
      ensureDatabaseTable();
    }
  }, [id]);

  const ensureDatabaseTable = async () => {
    try {
      await fetch('https://outtour.az/api/create-tour-reviews-table');
      console.log('Database table check completed');
    } catch (error) {
      console.log('Database table check failed:', error);
    }
  };

  const fetchTour = async (tourId: number) => {
    try {
      setLoading(true);
      console.log('Fetching tour with ID:', tourId);
      
      // Try different API endpoints
      const endpoints = [
        `https://outtour.az/api/tours?id=${tourId}`,
        `https://outtour.az/api/tours/${tourId}`,
        '/api/tours'
      ];
      
      let tourFound = false;
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);
          const response = await fetch(endpoint);
          
          if (!response.ok) {
            console.log(`Endpoint ${endpoint} failed with status:`, response.status);
            continue;
          }
          
          const result = await response.json();
          console.log('API response:', result);
          
          if (result.success && result.data) {
            // Handle different response structures
            let tours = [];
            if (Array.isArray(result.data)) {
              tours = result.data;
            } else if (result.data.tours) {
              tours = result.data.tours;
            } else if (result.data.tour) {
              tours = [result.data.tour];
            }
            
            const foundTour = tours.find((t: Tour) => t.id === tourId);
            if (foundTour) {
              console.log('Tour found:', foundTour);
              setTour(foundTour);
              tourFound = true;
              break;
            }
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} error:`, endpointError);
          continue;
        }
      }
      
      if (!tourFound) {
        console.log('Tour not found in any endpoint');
      }
      
    } catch (error) {
      console.error('Error fetching tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (url: string) => {
    setUploadedPhotos(prev => [...prev, url]);
  };

  const handlePhotoUploadError = (error: string) => {
    console.error('Photo upload error:', error);
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewerName || rating === 0 || !comment) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      // Prepare photo data from already uploaded photos
      const photoData = uploadedPhotos.map(url => ({
        url: url,
        filename: url.split('/').pop() || 'photo',
        originalName: url.split('/').pop() || 'photo'
      }));

      const reviewData = {
        tourId: parseInt(id!),
        reviewerName,
        rating,
        comment,
        photos: photoData
      };

      console.log('Submitting review:', reviewData);

      // Try multiple API endpoints
      const endpoints = [
        'https://outtour.az/api/tour-reviews',
        '/api/tour-reviews'
      ];

      let response;
      let lastError;

      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData)
          });

          if (response.ok) {
            console.log('Success with endpoint:', endpoint);
            break;
          } else {
            console.log(`Endpoint ${endpoint} failed with status:`, response.status);
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} error:`, endpointError);
          lastError = endpointError;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error(`All endpoints failed. Last error: ${lastError?.message || 'Unknown error'}`);
      }

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let result;
      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (responseText.trim() === '') {
          throw new Error('Empty response from server');
        }
        
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Server response error: ${response.status} ${response.statusText}`);
      }

      if (result.success) {
        alert('Review submitted successfully!');
        
        // Reset form
        setReviewerName('');
        setRating(0);
        setComment('');
        setPhotos([]);
        
        // Redirect back to tour detail
        window.location.href = `/tours/${id}`;
      } else {
        throw new Error(result.error || 'Failed to submit review');
      }
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(`Error submitting review: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tour details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tour Not Found</h1>
            <p className="text-muted-foreground mb-6">The tour you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/tours">Back to Tours</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      
      {/* Back Button */}
      <section className="pt-40 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to={`/tours/${tour.id}`} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tour
            </Link>
          </Button>
        </div>
      </section>

      {/* Review Form */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Write a Review</h1>
            <p className="text-xl text-muted-foreground">Share your experience with others</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Review for: {tour.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tour Name (Auto-filled) */}
                <div className="space-y-2">
                  <Label htmlFor="tourName">Tour Name</Label>
                  <Input
                    id="tourName"
                    value={tour.title}
                    disabled
                    className="bg-muted"
                  />
                </div>

                {/* Reviewer Name */}
                <div className="space-y-2">
                  <Label htmlFor="reviewerName">Your Name *</Label>
                  <Input
                    id="reviewerName"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredStar || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label htmlFor="comment">Your Review *</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={6}
                    required
                  />
                </div>

                {/* Photos */}
                <div className="space-y-2">
                  <Label>Photos (Optional)</Label>
                  <FileUpload
                    onUploadComplete={handlePhotoUpload}
                    onUploadError={handlePhotoUploadError}
                    type="review"
                    accept="image/*"
                    multiple={true}
                    maxSizeMB={5}
                    className="w-full"
                  />
                  
                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {uploadedPhotos.map((photoUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photoUrl}
                            alt={`Uploaded photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitting || !reviewerName || rating === 0 || !comment}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TourReview;
