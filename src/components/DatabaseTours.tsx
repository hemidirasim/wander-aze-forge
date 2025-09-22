import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Tour {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  price: number;
  max_participants: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const DatabaseTours: React.FC = () => {
  const { data: tours, loading, error } = useApi<Tour[]>('/tours');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Tours will be available soon</p>
        <p className="text-sm text-muted-foreground mt-2">
          We're working on bringing you the best tour experiences
        </p>
      </div>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tours available</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'challenging':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'trekking':
        return 'bg-blue-100 text-blue-800';
      case 'mountaineering':
        return 'bg-purple-100 text-purple-800';
      case 'wildlife':
        return 'bg-yellow-100 text-yellow-800';
      case 'cultural':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tours from Database
        </h2>
        <p className="text-gray-600">
          Live data from PostgreSQL database via API
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <Card key={tour.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getCategoryColor(tour.category)}>
                  {tour.category}
                </Badge>
                <Badge className={getDifficultyColor(tour.difficulty)}>
                  {tour.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl">{tour.title}</CardTitle>
              <div className="flex justify-between text-sm text-gray-500">
                <span>⏱️ {tour.duration}</span>
                <span>👥 Max {tour.max_participants}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {tour.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-yellow-600">
                  ${tour.price}
                </span>
                <span className="text-xs text-gray-400">
                  ID: {tour.id}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DatabaseTours;

