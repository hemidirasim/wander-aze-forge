import { useState, useEffect } from 'react';

export interface TourCategory {
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

export function useTourCategories() {
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories and tours in parallel
      const [categoriesResponse, toursResponse] = await Promise.all([
        fetch('/api/tour-categories'),
        fetch('/api/tours')
      ]);
      
      const categoriesData = await categoriesResponse.json();
      const toursData = await toursResponse.json();
      
      if (categoriesData.success) {
        // Filter only active categories
        const activeCategories = categoriesData.data.filter((cat: TourCategory) => cat.is_active);
        setCategories(activeCategories);
      } else {
        setError(categoriesData.error || 'Failed to fetch categories');
      }
      
      if (toursData.success) {
        // Filter only active tours
        const activeTours = toursData.data.filter((tour: Tour) => tour.is_active);
        setTours(activeTours);
      } else {
        setError(toursData.error || 'Failed to fetch tours');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getToursByCategory = (categorySlug: string) => {
    return tours.filter(tour => tour.category === categorySlug);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find(cat => cat.slug === slug);
  };

  const getTourById = (id: number) => {
    return tours.find(tour => tour.id === id);
  };

  return {
    categories,
    tours,
    loading,
    error,
    refetch: fetchData,
    getToursByCategory,
    getCategoryBySlug,
    getTourById
  };
}

