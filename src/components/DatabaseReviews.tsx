import React, { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Quote, Star } from 'lucide-react';

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
      <section className="py-24 px-4 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <Card key={review.id} className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-primary/20 group-hover:text-primary/40 transition-colors">
                    <Quote className="w-8 h-8" />
                  </div>
                  
                  {/* Image Section */}
                  {review.image_url && (
                    <div className="relative h-56 overflow-hidden">
                      <a
                        href={review.image_url}
                        data-fancybox="reviews"
                        data-caption={`${review.name} - ${review.source}`}
                        className="block"
                      >
                        <img
                          src={review.image_url}
                          alt={review.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 dark:bg-slate-800/90 rounded-full p-4 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    {/* Review Text */}
                    <blockquote className="text-foreground leading-relaxed mb-6 text-lg italic">
                      "{review.review_text}"
                    </blockquote>
                    
                    {/* Author Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-lg">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{review.name}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {review.source_logo && (
                              <img
                                src={review.source_logo}
                                alt={review.source}
                                className="h-4 w-auto max-w-16 object-contain"
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
                          className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-full"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                  
                  {/* Decorative Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              ))}
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
