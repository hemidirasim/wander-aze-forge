import { useState, useEffect } from 'react';
import { apiGet } from './useApi';

export interface TourProgramActivity {
  time: string;
  activity: string;
  description: string;
  location?: string;
  duration?: string;
  icon?: 'mountain' | 'camera' | 'food' | 'sleep' | 'hiking' | 'sunrise' | 'coffee';
}

export interface DatabaseTourProgram {
  id: number;
  tour_id: number;
  day_number: number;
  day_title: string;
  day_overview?: string;
  difficulty?: string;
  elevation?: string;
  distance?: string;
  activities: TourProgramActivity[];
  highlights?: string[];
  meals?: string[];
  accommodation?: string;
  created_at: string;
  updated_at: string;
}

export function useTourPrograms(tourId: number) {
  const [programs, setPrograms] = useState<DatabaseTourProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiGet<DatabaseTourProgram[]>(`/tour-programs/${tourId}`);
        setPrograms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tour programs');
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchPrograms();
    } else {
      setLoading(false);
      setPrograms([]);
    }
  }, [tourId]);

  return { programs, loading, error };
}

export default useTourPrograms;
