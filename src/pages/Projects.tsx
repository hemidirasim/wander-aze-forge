import React, { useState, useEffect } from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import projectsHero from '@/assets/projects-hero.jpg';

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

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      if (result.success) {
        setProjects(result.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      

      {/* Projects Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16">
              Conservation & Community Projects
            </h2>
            <div className="text-lg text-muted-foreground text-left space-y-4">
              <p>
                Alongside offering community-based tours across Azerbaijan's mountains and villages, Outtour Azerbaijan supports and promotes several long-term initiatives. Some of these began under Camping Azerbaijan in 2016 and have since grown into independent projects.
              </p>
              <p>
                <strong className="text-foreground">Kəndabad</strong>, founded in 2017, supports remote and mountain communities through initiatives such as Santa Claus in Remote Villages and School Bus in Remote Villages.
              </p>
              <p>
                <strong className="text-foreground">Ecofront</strong>, launched in 2018, is an eco-activist group raising awareness about biodiversity and the climate crisis in Azerbaijan, while actively campaigning against illegal deforestation and the destruction of natural habitats.
              </p>
              <p>
                <strong className="text-foreground">Birdwatching Azerbaijan</strong>, created in 2019, focuses on conserving the country's birdlife, fighting illegal hunting, and developing birding tourism to highlight Azerbaijan as a destination for nature enthusiasts.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image_url || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop'} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant={project.status === 'Completed' ? 'default' : 'secondary'}
                      className={project.status === 'Completed' ? 'bg-primary' : 'bg-autumn'}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-background/90">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {project.description && project.description.length > 100 
                      ? `${project.description.substring(0, 100)}...` 
                      : project.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">Location:</span>
                    <span className="text-muted-foreground">{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">Duration:</span>
                    <span className="text-muted-foreground">
                      {project.start_date ? new Date(project.start_date).getFullYear() : 'N/A'} - 
                      {project.end_date ? new Date(project.end_date).getFullYear() : 'Ongoing'}
                    </span>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button variant="ghost" asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    <Link to={`/projects/${project.id}`} className="flex items-center justify-center">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-forest">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Our Conservation Efforts
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Every tour you book contributes to our conservation projects and supports local communities
          </p>
          <Button size="lg" variant="outline" className="bg-white text-forest hover:bg-white/90" asChild>
            <Link to="/contact">Partner With Us</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Projects;