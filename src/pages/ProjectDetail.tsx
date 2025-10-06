import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Users, Calendar, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();

  interface Project {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    start_date: string;
    end_date: string;
    budget: number;
    status: string;
    image_url: string;
    gallery_urls: string[];
    created_at: string;
    updated_at: string;
  }

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject(parseInt(id));
    }
  }, [id]);

  const fetchProject = async (projectId: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      if (result.success) {
        const foundProject = result.data.projects.find((p: Project) => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/projects">Back to Projects</Link>
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
      <section className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/projects" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative h-[50vh] rounded-2xl overflow-hidden">
            <img 
              src={project.image_url || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="flex items-center space-x-4 mb-4">
                <Badge 
                  variant={project.status === 'Completed' ? 'default' : 'secondary'}
                  className={project.status === 'Completed' ? 'bg-primary' : 'bg-autumn'}
                >
                  {project.status}
                </Badge>
                <Badge variant="outline" className="bg-background/90">
                  {project.category}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {project.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12">
            
            {/* Main Content */}
            <div className="space-y-8">
              
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Timeline</div>
                        <div className="text-muted-foreground">
                          {project.start_date ? new Date(project.start_date).getFullYear() : 'N/A'} - 
                          {project.end_date ? new Date(project.end_date).getFullYear() : 'Ongoing'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Location</div>
                        <div className="text-muted-foreground">{project.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Leaf className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Status</div>
                        <div className="text-muted-foreground">{project.status}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gallery */}
              {project.gallery_urls && project.gallery_urls.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Project Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {project.gallery_urls.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;