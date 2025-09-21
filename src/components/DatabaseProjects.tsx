import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Calendar, DollarSign, Users } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description?: string;
  category?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status: string;
  image_url?: string;
  gallery_urls?: string[];
  created_at: string;
  updated_at: string;
}

const DatabaseProjects: React.FC = () => {
  const { data: projects, loading, error } = useApi<Project[]>('/projects');

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
        <p className="text-red-500">Error loading projects: {error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure the API server is running on port 3001
        </p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No projects available</p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'community_development':
        return 'bg-blue-100 text-blue-800';
      case 'conservation':
        return 'bg-yellow-100 text-yellow-800';
      case 'research':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(budget);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Projects from Database
        </h2>
        <p className="text-gray-600">
          Live data from PostgreSQL database via API
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getCategoryColor(project.category || '')}>
                  {project.category?.replace('_', ' ') || 'Project'}
                </Badge>
                <Badge variant="outline" className="text-yellow-600">
                  {project.status}
                </Badge>
              </div>
              <CardTitle className="text-xl">{project.title}</CardTitle>
              {project.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {project.location}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>
              
              <div className="space-y-2 text-sm">
                {project.start_date && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'Ongoing'}
                    </span>
                  </div>
                )}
                
                {project.budget && (
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Budget: {formatBudget(project.budget)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  ID: {project.id}
                </span>
                {project.gallery_urls && project.gallery_urls.length > 0 && (
                  <span className="text-xs text-blue-600">
                    📷 {project.gallery_urls.length} photos
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DatabaseProjects;

