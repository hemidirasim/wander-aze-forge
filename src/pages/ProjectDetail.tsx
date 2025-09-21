import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Users, Calendar, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();

  // Mock project data - in real app, fetch based on ID
  const project = {
    id: 1,
    title: "Eco-Tourism Trail Development",
    description: "Creating sustainable hiking trails that minimize environmental impact while providing economic opportunities for local communities in the Guba region.",
    category: "Infrastructure", 
    status: "Ongoing",
    location: "Guba Region",
    impact: "500+ visitors/month",
    completedDate: "2024",
    startDate: "2022",
    budget: "$75,000",
    partners: ["Ministry of Tourism", "Local Communities", "Environmental NGOs"],
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=400&h=300&fit=crop", 
      "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400&h=300&fit=crop",
    ],
    objectives: [
      "Develop 5 sustainable hiking trails with minimal environmental impact",
      "Train 20 local guides in sustainable tourism practices", 
      "Create employment opportunities for 50+ local residents",
      "Establish waste management systems along all trails",
      "Implement monitoring system for environmental protection"
    ],
    achievements: [
      "3 trails completed and operational",
      "15 local guides trained and certified",
      "35 jobs created for local community", 
      "Zero waste policy implemented",
      "Monthly environmental monitoring established"
    ],
    timeline: [
      {
        phase: "Phase 1: Planning & Assessment",
        period: "2022 Q1-Q2",
        description: "Environmental impact assessment and community consultations",
        status: "completed"
      },
      {
        phase: "Phase 2: Trail Construction", 
        period: "2022 Q3-2023 Q2",
        description: "Sustainable trail development using eco-friendly materials",
        status: "completed"
      },
      {
        phase: "Phase 3: Guide Training",
        period: "2023 Q3-Q4", 
        description: "Training local guides in sustainable tourism practices",
        status: "completed"
      },
      {
        phase: "Phase 4: Operations & Monitoring",
        period: "2024 Ongoing",
        description: "Full operations with continuous environmental monitoring",
        status: "ongoing"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
              src={project.image} 
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
                        <div className="text-muted-foreground">{project.startDate} - {project.completedDate}</div>
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
                      <Target className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Budget</div>
                        <div className="text-muted-foreground">{project.budget}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Leaf className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold">Impact</div>
                        <div className="text-muted-foreground">{project.impact}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Objectives */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Project Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Key Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Project Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {project.timeline.map((phase, index) => (
                    <div key={index} className="border-l-2 border-primary pl-6 relative">
                      <div className={`absolute w-4 h-4 rounded-full -left-2 top-0 ${
                        phase.status === 'completed' ? 'bg-primary' : 'bg-autumn'
                      }`} />
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {phase.phase}
                        </h3>
                        <Badge 
                          variant={phase.status === 'completed' ? 'default' : 'secondary'}
                          className={phase.status === 'completed' ? 'bg-primary' : 'bg-autumn'}
                        >
                          {phase.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-primary font-medium mb-2">{phase.period}</div>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Project Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {project.gallery.map((image, index) => (
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
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;