import React, { useState, useEffect } from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Users, Mail, Phone, Linkedin, Instagram } from 'lucide-react';
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

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  social_links?: any;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const About = () => {
  const [aboutData, setAboutData] = useState<AboutSection[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
    fetchTeamMembers();
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
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team-members');
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionData = (section: string) => {
    return aboutData.find(item => item.section === section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
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
      <DatabaseNavigation />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/about-hero.webp"
            alt="About Outtour Azerbaijan"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 45%' }}
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
        </div>
      </section>

      {/* Our Story */}
      <section className="pt-20 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {ourStoryData?.title || 'Our Story'}
            </h2>
            <div className="text-lg text-muted-foreground leading-relaxed text-left space-y-4">
              <p>
                Outtour Azerbaijan is a community-based eco-tourism initiative dedicated to sustainable and responsible travel in Azerbaijan. Founded in 2014 as Camping Azerbaijan, our mission has always been to connect people with nature, encourage eco-conscious journeys, and support local communities while showcasing the country's cultural richness and natural beauty.
              </p>
              <p>
                Since then, we have organized more than 700 tours for travelers from over 50 countries, exploring remote mountain villages, scenic landscapes, and unique heritage sites. By collaborating with more than 100 local families and drivers, we create meaningful economic opportunities through homestays, traditional food, and cultural experiences. We also design tailored programs for companies, schools, and international groups.
              </p>
              <p>
                Over the years, our work has helped nurture a growing local interest in ecotourism, inspiring Azerbaijanis to explore and protect their own natural and cultural heritage.
              </p>
              <p>
                Beyond tours, outtour.az supports projects that make a difference, such as Kəndabad, Ecofront, and Birdwatching Azerbaijan. Notable initiatives include School Bus in Remote Villages and Santa Claus in Remote Villages, which bring long-term benefits and joy to rural communities.
              </p>
              <p className="font-semibold text-foreground">
                Our vision is to position Azerbaijan as a regional leader in sustainable tourism — offering authentic hiking, birdwatching, cultural, and wildlife experiences while ensuring that local communities thrive alongside conservation.
              </p>
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


      {/* Our Team */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              {ourTeamData?.title || 'Our Team'}
            </h2>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center hover:shadow-elevated transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    {member.photo_url ? (
                      <img 
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-12 h-12 text-primary" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl text-foreground">{member.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {member.position}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  
                  {/* Contact Information */}
                  <div className="space-y-2 text-sm">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {member.social_links && (
                    <div className="flex justify-center gap-3 mt-4">
                      {member.social_links.linkedin && (
                        <a
                          href={member.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Linkedin className="w-4 h-4 text-blue-600" />
                        </a>
                      )}
                      {member.social_links.instagram && (
                        <a
                          href={member.social_links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-pink-100 hover:bg-pink-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Instagram className="w-4 h-4 text-pink-600" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
      <Footer />
    </div>
  );
};

export default About;