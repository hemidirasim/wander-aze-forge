import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Users, Target, CheckCircle } from 'lucide-react';

interface Program {
  id: number;
  name: string;
  description?: string;
  type?: string;
  duration?: string;
  target_audience?: string;
  objectives?: string;
  activities?: string[];
  status: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const DatabasePrograms: React.FC = () => {
  const { data: programs, loading, error } = useApi<Program[]>('/programs');

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
        <p className="text-red-500">Error loading programs: {error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure the API server is running on port 3001
        </p>
      </div>
    );
  }

  if (!programs || programs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No programs available</p>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'education':
        return 'bg-blue-100 text-blue-800';
      case 'youth_development':
        return 'bg-yellow-100 text-yellow-800';
      case 'women_empowerment':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Programs from Database
        </h2>
        <p className="text-gray-600">
          Live data from PostgreSQL database via API
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getTypeColor(program.type || '')}>
                  {program.type?.replace('_', ' ') || 'Program'}
                </Badge>
                <Badge variant="outline" className="text-yellow-600">
                  {program.status}
                </Badge>
              </div>
              <CardTitle className="text-xl">{program.name}</CardTitle>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {program.duration || 'Duration not specified'}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {program.description}
              </p>
              
              {program.target_audience && (
                <div className="flex items-start text-sm text-gray-600 mb-3">
                  <Users className="w-4 h-4 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Target Audience:</span>
                    <p className="text-xs">{program.target_audience}</p>
                  </div>
                </div>
              )}
              
              {program.objectives && (
                <div className="flex items-start text-sm text-gray-600 mb-3">
                  <Target className="w-4 h-4 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Objectives:</span>
                    <p className="text-xs">{program.objectives}</p>
                  </div>
                </div>
              )}
              
              {program.activities && program.activities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Activities:</p>
                  <div className="space-y-1">
                    {program.activities.slice(0, 3).map((activity, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 mr-2 text-yellow-500" />
                        {activity}
                      </div>
                    ))}
                    {program.activities.length > 3 && (
                      <p className="text-xs text-gray-500 ml-5">
                        +{program.activities.length - 3} more activities
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  ID: {program.id}
                </span>
                <span className="text-xs text-blue-600">
                  📚 Program
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DatabasePrograms;

