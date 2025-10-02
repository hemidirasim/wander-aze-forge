import React, { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ExternalLink, Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Declare Fancybox for TypeScript
declare global {
  interface Window {
    Fancybox: any;
  }
}

interface Review {
  id: number;
  name: string;
  rating: number;
  review_text: string;
  source: string;
  source_logo?: string;
  source_url?: string;
  image_url?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const DatabaseReviews = () => {
  const { data: reviews, loading, error } = useApi<Review[]>('/reviews?featured=true');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    if (reviews && reviews.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, reviews.length - itemsPerView + 1));
    }
  };

  const prevSlide = () => {
    if (reviews && reviews.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + Math.max(1, reviews.length - itemsPerView + 1)) % Math.max(1, reviews.length - itemsPerView + 1));
    }
  };

  // Initialize Fancybox for review images
  useEffect(() => {
    if (window.Fancybox && reviews && reviews.length > 0) {
      window.Fancybox.bind('[data-fancybox="reviews"]', {
        Thumbs: {
          autoStart: false,
        },
      });
    }

    // Cleanup Fancybox when component unmounts
    return () => {
      if (window.Fancybox) {
        window.Fancybox.destroy();
      }
    };
  }, [reviews]);

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="relative">
            <div className="flex gap-6 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <Skeleton className="h-20 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Always show the section, even if no reviews

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Trusted by Adventurers</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            What People Say About Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real stories from real adventurers who discovered Azerbaijan's hidden gems with us
          </p>
        </div>

        {reviews && reviews.length > 0 ? (
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mb-8">
              <Button
                variant="outline"
                size="lg"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.max(1, reviews.length - itemsPerView + 1) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary scale-125' 
                        : 'bg-primary/30 hover:bg-primary/50'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={nextSlide}
                disabled={currentIndex >= Math.max(0, reviews.length - itemsPerView)}
                className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              >
                {reviews.map((review, index) => (
                  <div 
                    key={review.id} 
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <Card className="relative overflow-hidden border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                      {/* Quote Icon */}
                      <div className="absolute top-6 right-6 text-primary/20">
                        <Quote className="w-8 h-8" />
                      </div>
                      
                      {/* Image Section */}
                      {review.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <a
                            href={review.image_url}
                            data-fancybox="reviews"
                            data-caption={`${review.name} - ${review.source}`}
                            className="block"
                          >
                            <img
                              src={review.image_url}
                              alt={review.name}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          </a>
                        </div>
                      )}
                      
                      <CardContent className="p-6">
                        {/* Review Text */}
                        <blockquote className="text-foreground leading-relaxed mb-6 text-base italic line-clamp-4">
                          "{review.review_text}"
                        </blockquote>
                        
                        {/* Author Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-bold text-sm">
                                {review.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-foreground text-sm">{review.name}</div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {review.source_logo && (
                                  <img
                                    src={review.source_logo}
                                    alt={review.source}
                                    className="h-3 w-auto max-w-12 object-contain"
                                  />
                                )}
                                <span>{review.source}</span>
                              </div>
                            </div>
                          </div>
                          
                          {review.source_url && (
                            <a
                              href={review.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors p-1.5 hover:bg-primary/10 rounded-full"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Quote className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">No reviews available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DatabaseReviews;
