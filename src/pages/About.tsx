import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Award, Users, Globe, Heart, Target, Leaf, Mountain, Calendar } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Calendar, label: "Years of Experience", value: "10+" },
    { icon: Users, label: "Happy Travelers", value: "2,500+" },
    { icon: Mountain, label: "Tours Completed", value: "700+" },
    { icon: Globe, label: "Trails Explored", value: "30+" },
  ];

  const values = [
    {
      icon: Leaf,
      title: "Environmental Responsibility",
      description: "We are committed to sustainable tourism practices that protect Azerbaijan's pristine wilderness for future generations."
    },
    {
      icon: Heart,
      title: "Community Support",
      description: "Our tours provide sustainable income to local communities, preserving traditional lifestyles and cultural heritage."
    },
    {
      icon: Target,
      title: "Authentic Experiences",
      description: "We offer genuine, immersive experiences that showcase the true beauty and culture of Azerbaijan's mountain regions."
    },
    {
      icon: Award,
      title: "Expert Guidance",
      description: "Our certified local guides provide safe, educational, and memorable adventures backed by years of experience."
    }
  ];

  const team = [
    {
      name: "Rashad Mammadov",
      role: "Founder & Lead Guide",
      bio: "With over 10 years of experience exploring Azerbaijan's wilderness, Rashad founded Camping Azerbaijan to share his passion for the country's natural beauty.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
    },
    {
      name: "Leyla Gasimova", 
      role: "Cultural & Environmental Specialist",
      bio: "Leyla ensures our tours respect local traditions while promoting environmental conservation in the communities we visit.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop"
    },
    {
      name: "Elvin Huseynov",
      role: "Mountain Safety Expert",
      bio: "Elvin brings extensive mountaineering experience and ensures the highest safety standards on all our adventures.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=1920&h=1080&fit=crop)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">About Us</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Azerbaijan's first ecotour company, pioneering sustainable adventure tourism since 2014
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Founded in 2014, Camping Azerbaijan began as a passion project to showcase the incredible natural beauty 
              and rich cultural heritage of our homeland. We started with a simple mission: to create authentic, 
              responsible travel experiences that benefit both visitors and local communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe that tourism should be a force for good. Every tour we organize supports local 
                communities, preserves traditional cultures, and promotes environmental conservation. 
                We're not just showing you Azerbaijan – we're helping to protect it.
              </p>
              
              <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading sustainable tourism company in the Caucasus region, setting the standard 
                for responsible travel that creates lasting positive impact on communities and environments.
              </p>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
                alt="Mountain landscape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-mountain">
        <div className="container mx-auto">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-white/90">A decade of meaningful adventures</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-white/80" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do, from planning tours to building relationships with communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-elevated transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <value.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate locals dedicated to sharing the beauty of Azerbaijan with the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-elevated transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <CardTitle className="text-xl text-foreground">{member.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Partners */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12">Certifications & Recognition</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              "Certified Ecotourism Operator",
              "Ministry of Tourism Licensed",
              "International Mountain Guide Certified", 
              "Sustainable Tourism Award 2023"
            ].map((cert, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-elevated transition-all duration-300">
                <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-foreground">{cert}</h3>
              </Card>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-6">Our Partners</h3>
            <p className="text-muted-foreground mb-8">
              We work closely with government agencies, environmental organizations, and local communities 
              to ensure our tours meet the highest standards of safety and sustainability.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">Ministry of Tourism</Badge>
              <Badge variant="outline">Environmental Protection Agency</Badge>
              <Badge variant="outline">Local Village Councils</Badge>
              <Badge variant="outline">Mountain Rescue Service</Badge>
              <Badge variant="outline">Cultural Heritage Foundation</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Azerbaijan?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join us for an unforgettable adventure that supports local communities and protects our natural heritage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/tours">View Our Tours</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;