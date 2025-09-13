import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Leaf, Users, Calendar, ArrowRight } from 'lucide-react';
import projectsHero from '@/assets/projects-hero.jpg';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Eco-Tourism Trail Development", 
      description: "Creating sustainable hiking trails that minimize environmental impact while providing economic opportunities for local communities.",
      category: "Infrastructure",
      status: "Ongoing",
      location: "Guba Region",
      impact: "500+ visitors/month",
      completedDate: "2024",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Village Homestay Network",
      description: "Establishing a network of authentic homestays in remote mountain villages, providing income for families while preserving culture.",
      category: "Community",
      status: "Completed", 
      location: "Khinalig & Laza",
      impact: "25 families supported",
      completedDate: "2023",
      image: "https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Wildlife Conservation Initiative",
      description: "Protecting endangered species through research, education, and sustainable tourism practices in the Caucasus region.",
      category: "Conservation",
      status: "Ongoing",
      location: "Caucasus Mountains",
      impact: "3 species protected",
      completedDate: "2025",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    },
    {
      id: 4,
      title: "Clean Mountain Initiative",
      description: "Regular cleanup campaigns and waste management systems for popular hiking destinations, keeping Azerbaijan's nature pristine.",
      category: "Environmental",
      status: "Completed",
      location: "Multiple Regions",
      impact: "50+ tons waste removed",
      completedDate: "2023",
      image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=400&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${projectsHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Building sustainable tourism that benefits communities and protects nature
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Conservation & Community Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Since 2014, we've been working to create positive impact through responsible tourism
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
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
                  <p className="text-muted-foreground text-sm">{project.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span className="font-medium">Impact:</span>
                    <span className="text-muted-foreground">{project.impact}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">Location:</span>
                    <span className="text-muted-foreground">{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">Year:</span>
                    <span className="text-muted-foreground">{project.completedDate}</span>
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
    </div>
  );
};

export default Projects;