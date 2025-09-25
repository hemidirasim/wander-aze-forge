import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Users, Mountain, Calendar, Globe } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AboutSection {
  id: number;
  section: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const About = () => {
  const [aboutData, setAboutData] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about');
      const data = await response.json();
      
      if (data.success) {
        setAboutData(data.data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionData = (section: string) => {
    return aboutData.find(item => item.section === section);
  };

  const stats = [
    { icon: Calendar, label: "Years of Experience", value: "10+" },
    { icon: Users, label: "Happy Travelers", value: "2,500+" },
    { icon: Mountain, label: "Tours Completed", value: "700+" },
    { icon: Globe, label: "Trails Explored", value: "30+" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <Skeleton className="h-16 w-96 mx-auto mb-6" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const ourStoryData = getSectionData('our_story');
  const ourTeamData = getSectionData('our_team');

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
            Azerbaijan's leading adventure tourism company, creating unforgettable experiences since 2020
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {ourStoryData?.title || 'Our Story'}
            </h2>
            <div className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
              {ourStoryData?.content || 'Loading...'}
            </div>
          </div>

          {ourStoryData?.image_url && (
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <img 
                src={ourStoryData.image_url}
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-mountain">
        <div className="container mx-auto">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-white/90">Years of meaningful adventures</p>
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

      {/* Our Team */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              {ourTeamData?.title || 'Our Team'}
            </h2>
            <div className="text-xl text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">
              {ourTeamData?.content || 'Loading...'}
            </div>
          </div>

          {ourTeamData?.image_url && (
            <div className="relative h-80 rounded-2xl overflow-hidden max-w-4xl mx-auto">
              <img 
                src={ourTeamData.image_url}
                alt="Our Team"
                className="w-full h-full object-cover"
              />
            </div>
          )}
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