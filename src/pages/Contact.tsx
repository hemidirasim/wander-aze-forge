import React, { useState, useEffect } from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTourCategories, TourCategory, Tour } from '@/hooks/useTourCategories';

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
  const { categories, tours, loading: dataLoading, getToursByCategory } = useTourCategories();
  const [selectedCategory, setSelectedCategory] = useState<TourCategory | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

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

  const handleCategoryChange = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug);
    setSelectedCategory(category || null);
    setSelectedTour(null); // Reset tour when category changes
  };

  const handleTourChange = (tourId: string) => {
    const tour = tours.find(t => t.id.toString() === tourId);
    setSelectedTour(tour || null);
  };

  const heroData = getSectionData('hero');
  const faqData = getSectionData('faq_section');
  const socialData = getSectionData('social_media');

  const socialLinks = [
    { icon: Facebook, url: "https://www.facebook.com/campingazerbaijan2014", name: "Facebook" },
    { icon: Instagram, url: "https://www.instagram.com/camping_azerbaijan/", name: "Instagram" },
    { icon: Linkedin, url: "https://www.linkedin.com/company/campingazerbaijan/", name: "LinkedIn" },
    { icon: Twitter, url: "https://x.com/CampingAze", name: "Twitter" },
    { icon: Youtube, url: "https://www.youtube.com/@campingazerbaijan", name: "YouTube" }
  ];

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
      <DatabaseNavigation />
      
      {/* Hero Section from Database */}
      <section className="pt-32 pb-8 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {heroData?.title || 'Contact Us'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            If you've got any questions about your adventure or need some travel advice, we'd love to help. Submit your query below and we'll get back to you soon.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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
                  <Label htmlFor="country">Country *</Label>
                  <select 
                    id="country" 
                    className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="">Select your country</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="BE">Belgium</option>
                    <option value="CH">Switzerland</option>
                    <option value="AT">Austria</option>
                    <option value="SE">Sweden</option>
                    <option value="NO">Norway</option>
                    <option value="DK">Denmark</option>
                    <option value="FI">Finland</option>
                    <option value="PL">Poland</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="RO">Romania</option>
                    <option value="GR">Greece</option>
                    <option value="PT">Portugal</option>
                    <option value="IE">Ireland</option>
                    <option value="TR">Turkey</option>
                    <option value="RU">Russia</option>
                    <option value="UA">Ukraine</option>
                    <option value="AZ">Azerbaijan</option>
                    <option value="GE">Georgia</option>
                    <option value="AM">Armenia</option>
                    <option value="KZ">Kazakhstan</option>
                    <option value="UZ">Uzbekistan</option>
                    <option value="JP">Japan</option>
                    <option value="CN">China</option>
                    <option value="KR">South Korea</option>
                    <option value="IN">India</option>
                    <option value="SG">Singapore</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="IL">Israel</option>
                    <option value="BR">Brazil</option>
                    <option value="AR">Argentina</option>
                    <option value="MX">Mexico</option>
                    <option value="ZA">South Africa</option>
                    <option value="NZ">New Zealand</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tourCategory">Tour Category *</Label>
                  <select 
                    id="tourCategory" 
                    className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    disabled={dataLoading}
                    required
                  >
                    <option value="">
                      {dataLoading ? 'Loading categories...' : 'Select a category'}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tour Selection (appears when category is selected AND has tours) */}
                {selectedCategory && getToursByCategory(selectedCategory.slug).length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="tourType">Select Tour</Label>
                    <select 
                      id="tourType" 
                      className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                      onChange={(e) => handleTourChange(e.target.value)}
                    >
                      <option value="">Select a tour</option>
                      {getToursByCategory(selectedCategory.slug).map((tour) => (
                        <option key={tour.id} value={tour.id.toString()}>
                          {tour.title} - {tour.duration} - {tour.difficulty}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                
                <div className="space-y-2">
                  <Label htmlFor="groupSize">Group Size *</Label>
                  <Input id="groupSize" type="number" min="1" max="20" placeholder="Number of travelers" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dates">Preferred Dates *</Label>
                  <Input id="dates" placeholder="e.g., June 15-20, 2024" required />
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

                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="terms" className="rounded mt-1" required />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to the <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> *
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

            {/* Additional Info */}
            <div className="space-y-8">
              
              {/* Hiking Group Image */}
              <Card className="border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-96 overflow-hidden">
                    <img 
                      src="/hiking-group.jpg"
                      alt="Adventure Group Hiking"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">Join Our Adventure Community</h3>
                      <p className="text-white/90">Experience unforgettable journeys with fellow explorers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Answers */}
              <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{faqData?.title || 'Quick Answers'}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {faqData?.contact_info?.faq_description || faqData?.content || 'Find quick answers to common questions about our tours, booking process, and what to expect.'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqData?.contact_info ? (
                    <>
                      {faqData.contact_info.faq_1_question && faqData.contact_info.faq_1_answer && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{faqData.contact_info.faq_1_question}</h4>
                          <p className="text-sm text-muted-foreground">{faqData.contact_info.faq_1_answer}</p>
                        </div>
                      )}
                      {faqData.contact_info.faq_2_question && faqData.contact_info.faq_2_answer && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{faqData.contact_info.faq_2_question}</h4>
                          <p className="text-sm text-muted-foreground">{faqData.contact_info.faq_2_answer}</p>
                        </div>
                      )}
                      {faqData.contact_info.faq_3_question && faqData.contact_info.faq_3_answer && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{faqData.contact_info.faq_3_question}</h4>
                          <p className="text-sm text-muted-foreground">{faqData.contact_info.faq_3_answer}</p>
                        </div>
                      )}
                    </>
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
                        {socialData.contact_info.youtube && (
                          <a
                            href={socialData.contact_info.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all duration-300 text-primary hover:scale-105"
                          >
                            <Youtube className="w-5 h-5" />
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