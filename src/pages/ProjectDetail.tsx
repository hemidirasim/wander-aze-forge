import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Users, Calendar, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Declare Fancybox for TypeScript
declare global {
  interface Window {
    Fancybox: any;
  }
}

const ProjectDetail = () => {
  const { id, slug } = useParams();

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

  // Initialize Fancybox
  useEffect(() => {
    const loadFancybox = async () => {
      try {
        // Load Fancybox CSS
        if (!document.querySelector('link[href*="fancybox"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css';
          document.head.appendChild(link);
        }

        // Load Fancybox JS
        if (!window.Fancybox) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js';
          script.onload = () => {
            if (window.Fancybox) {
              window.Fancybox.bind('[data-fancybox="project-gallery"]', {
                Toolbar: {
                  display: {
                    left: ["infobar"],
                    middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
                    right: ["slideshow", "fullscreen", "thumbs", "close"]
                  }
                }
              });
            }
          };
          document.head.appendChild(script);
        } else {
          window.Fancybox.bind('[data-fancybox="project-gallery"]', {
            Toolbar: {
              display: {
                left: ["infobar"],
                middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
                right: ["slideshow", "fullscreen", "thumbs", "close"]
              }
            }
          });
        }
      } catch (error) {
        console.error('Error loading Fancybox:', error);
      }
    };

    if (project && project.gallery_urls && project.gallery_urls.length > 0) {
      loadFancybox();
    }

    // Cleanup
    return () => {
      if (window.Fancybox) {
        window.Fancybox.destroy();
      }
    };
  }, [project]);

  useEffect(() => {
    console.log('ProjectDetail - URL params:', { id, slug });
    console.log('Current URL:', window.location.href);
    
    // Check if we have both id and slug from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const idFromQuery = urlParams.get('id');
    console.log('ID from query params:', idFromQuery);
    
    if (idFromQuery) {
      console.log('Fetching project by ID from query:', idFromQuery);
      fetchProject(parseInt(idFromQuery));
    } else if (id) {
      console.log('Fetching project by ID from path:', id);
      fetchProject(parseInt(id));
    } else if (slug) {
      console.log('Fetching project by slug:', slug);
      fetchProjectBySlug(slug);
    }
  }, [id, slug]);

  const fetchProject = async (projectId: number) => {
    try {
      setLoading(true);
      console.log('Fetching project with ID:', projectId);
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      console.log('Projects API response:', result);
      
      if (result.success) {
        const foundProject = result.data.projects.find((p: Project) => p.id === projectId);
        console.log('Found project:', foundProject);
        if (foundProject) {
          setProject(foundProject);
        } else {
          console.log('Project not found in list');
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectBySlug = async (projectSlug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects?slug=${projectSlug}`);
      const result = await response.json();
      
      if (result.success) {
        setProject(result.data);
      }
    } catch (error) {
      console.error('Error fetching project by slug:', error);
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
      <section className="pt-40 px-4">
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
                  <div 
                    className="text-lg text-muted-foreground leading-relaxed mb-6 prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                  
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
                      <MapPin className="w-5 h-5 text-primary" />
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
                        <a
                          key={index}
                          href={image}
                          data-fancybox="project-gallery"
                          data-caption={`Project image ${index + 1}`}
                          className="block"
                        >
                          <img
                            src={image}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                          />
                        </a>
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