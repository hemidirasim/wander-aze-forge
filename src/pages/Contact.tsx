import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactSection {
  id: number;
  section: string;
  title: string;
  content?: string;
  contact_info: any;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const Contact = () => {
  const [contactData, setContactData] = useState<ContactSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/contact-page');
      const data = await response.json();
      
      if (data.success) {
        setContactData(data.data);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionData = (section: string) => {
    return contactData.find(item => item.section === section);
  };

  const heroData = getSectionData('hero');
  const faqData = getSectionData('faq_section');
  const socialData = getSectionData('social_media');

  const socialLinks = [
    { icon: Facebook, url: "https://www.facebook.com/campingazerbaijan2014", name: "Facebook" },
    { icon: Instagram, url: "https://www.instagram.com/camping_azerbaijan/", name: "Instagram" },
    { icon: Linkedin, url: "https://www.linkedin.com/company/campingazerbaijan/", name: "LinkedIn" },
    { icon: Twitter, url: "https://x.com/CampingAze", name: "Twitter" }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="text-center">
                  <CardHeader>
                    <Skeleton className="w-16 h-16 mx-auto mb-4" />
                    <Skeleton className="h-6 w-24 mx-auto" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section from Database */}
      <section className="pt-32 pb-8 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {heroData?.title || 'Contact Us'}
          </h1>
          {heroData?.content && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {heroData.content}
            </p>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Phone */}
            <Card className="text-center hover:shadow-elevated transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {heroData?.contact_info?.phone || '(+994) 50 123 45 67'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {heroData?.contact_info?.working_hours || 'Available 9 AM - 6 PM (GMT+4)'}
                </p>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="text-center hover:shadow-elevated transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {heroData?.contact_info?.email || 'info@outtour.az'}
                </div>
                <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="text-center hover:shadow-elevated transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {heroData?.contact_info?.address || 'Baku, Azerbaijan'}
                </div>
                <p className="text-sm text-muted-foreground">Tours depart from various locations</p>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="text-center hover:shadow-elevated transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {heroData?.contact_info?.working_hours || 'Mon - Sat: 9AM - 6PM'}
                </div>
                <p className="text-sm text-muted-foreground">Emergency contact available 24/7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Planning a custom tour or have questions? We'd love to hear from you.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Your first name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Your last name" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tourType">Interested Tour</Label>
                  <select 
                    id="tourType" 
                    className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Select a tour type</option>
                    <option value="khinalig-laza">Khinalig-Laza Homestay Hike</option>
                    <option value="gizilgaya">3 Peaks Gizilgaya Plateau</option>
                    <option value="wildlife">Caucasus Wildlife Safari</option>
                    <option value="custom">Custom Tour</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="groupSize">Group Size</Label>
                  <Input id="groupSize" type="number" min="1" max="20" placeholder="Number of travelers" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dates">Preferred Dates</Label>
                  <Input id="dates" placeholder="e.g., June 15-20, 2024" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your interests, fitness level, special requirements, or any questions you have..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="newsletter" className="rounded" />
                  <Label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer">
                    Subscribe to our newsletter for adventure tips and tour updates
                  </Label>
                </div>
                
                <Button size="lg" variant="adventure" className="w-full">
                  Send Message
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  We respect your privacy. Your information will only be used to respond to your inquiry.
                </p>
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              
              {/* Map Placeholder */}
              <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
                      alt="Azerbaijan landscape"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <MapPin className="w-12 h-12 mx-auto mb-4" />
                        <div className="text-lg font-semibold">Based in Baku</div>
                        <div className="text-sm">Tours operate throughout Azerbaijan</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Answers */}
              <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{faqData?.title || 'Quick Answers'}</CardTitle>
                  {faqData?.content && (
                    <p className="text-muted-foreground text-sm">{faqData.content}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqData?.contact_info?.faqs ? (
                    faqData.contact_info.faqs.map((faq: any, index: number) => (
                      <div key={index}>
                        <h4 className="font-semibold text-foreground mb-2">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">How far in advance should I book?</h4>
                        <p className="text-sm text-muted-foreground">We recommend booking 2-4 weeks in advance, especially for popular tours during peak season (June-September).</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">What's included in the price?</h4>
                        <p className="text-sm text-muted-foreground">All tours include professional guides, safety equipment, accommodation (where applicable), and transportation from designated meeting points.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Do you offer private tours?</h4>
                        <p className="text-sm text-muted-foreground">Yes! We can customize any tour for private groups. Contact us for personalized itineraries and pricing.</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{socialData?.title || 'Follow Our Adventures'}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {socialData?.content || 'Stay updated with our latest tours and tips on social media'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    {socialData?.contact_info ? (
                      <>
                        {socialData.contact_info.facebook && (
                          <a
                            href={socialData.contact_info.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all duration-300 text-primary hover:scale-105"
                          >
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {socialData.contact_info.instagram && (
                          <a
                            href={socialData.contact_info.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all duration-300 text-primary hover:scale-105"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {socialData.contact_info.linkedin && (
                          <a
                            href={socialData.contact_info.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all duration-300 text-primary hover:scale-105"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {socialData.contact_info.twitter && (
                          <a
                            href={socialData.contact_info.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all duration-300 text-primary hover:scale-105"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                      </>
                    ) : (
                      socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all duration-300 text-primary hover:scale-105"
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      
      <Footer />
    </div>
  );
};

export default Contact;