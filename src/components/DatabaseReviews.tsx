import React, { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import Fancybox from '@/components/ui/fancybox';

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
    <section className="py-24 px-4 bg-gradient-to-br from-muted/20 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            What People Say About Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it - hear from the adventurers who have experienced Azerbaijan with us
          </p>
        </div>

        {reviews && reviews.length > 0 ? (
          <Fancybox>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <Card key={review.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm hover:scale-105">
                  {review.image_url && (
                    <div className="relative h-48 overflow-hidden cursor-pointer">
                      <a
                        href={review.image_url}
                        data-fancybox="reviews"
                        data-caption={`${review.name} - ${review.source}`}
                      >
                        <img
                          src={review.image_url}
                          alt={review.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {review.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                      "{review.review_text}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {review.source_logo && (
                          <img
                            src={review.source_logo}
                            alt={review.source}
                            className="h-6 w-auto max-w-20 object-contain"
                          />
                        )}
                        <span className="text-sm text-muted-foreground">{review.source}</span>
                      </div>
                      {review.source_url && (
                        <a
                          href={review.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Fancybox>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground text-lg">No reviews available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DatabaseReviews;
