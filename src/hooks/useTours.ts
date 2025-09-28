import { useState, useEffect } from 'react';

export interface Tour {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  price: string;
  rating: number;
  reviews_count: number;
  group_size: string;
  location: string;
  image_url: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  is_active: boolean;
  featured: boolean;
  tour_programs: TourProgram[];
  overview: string;
  best_season: string;
  meeting_point: string;
  languages: string;
  accommodation_details: string;
  meals_details: string;
  water_snacks_details: string;
  provided_equipment: string[];
  what_to_bring: string[];
  transport_details: string;
  pickup_service: string;
  gallery_images: string[];
  photography_service: string;
  price_includes: string[];
  group_discounts: string;
  early_bird_discount: string;
  contact_phone: string;
  booking_terms: string;
  itinerary: string;
  requirements: string;
  special_fields: any;
  max_participants: number;
  created_at: string;
  updated_at: string;
}

export interface TourProgram {
  id: number;
  tour_id: number;
  day_number: number;
  title: string;
  description: string;
  activities: string;
  meals: string;
  accommodation: string;
  transport: string;
  highlights: string;
  duration: string;
  difficulty_level: string;
  distance: string;
  elevation_gain: string;
}

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tours');
      const data = await response.json();
      
      if (data.success) {
        // Filter only active tours
        const activeTours = data.data.filter((tour: Tour) => tour.is_active);
        setTours(activeTours);
      } else {
        setError(data.error || 'Failed to fetch tours');
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  const getToursByCategory = (category: string) => {
    return tours.filter(tour => tour.category === category);
  };

  const getTourById = (id: number) => {
    return tours.find(tour => tour.id === id);
  };

  return {
    tours,
    loading,
    error,
    refetch: fetchTours,
    getToursByCategory,
    getTourById
  };
}
