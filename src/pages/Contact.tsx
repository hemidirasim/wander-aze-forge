import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      detail: "(+994) 51 400 90 91",
      description: "Available 9 AM - 6 PM (GMT+4)"
    },
    {
      icon: Mail,
      title: "Email", 
      detail: "campingazerbaijan@gmail.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Location",
      detail: "Baku, Azerbaijan",
      description: "Tours depart from various locations"
    },
    {
      icon: Clock,
      title: "Office Hours",
      detail: "Mon - Sat: 9AM - 6PM",
      description: "Emergency contact available 24/7"
    }
  ];

  const socialLinks = [
    { icon: Facebook, url: "https://www.facebook.com/campingazerbaijan2014", name: "Facebook" },
    { icon: Instagram, url: "https://www.instagram.com/camping_azerbaijan/", name: "Instagram" },
    { icon: Linkedin, url: "https://www.linkedin.com/company/campingazerbaijan/", name: "LinkedIn" },
    { icon: Twitter, url: "https://x.com/CampingAze", name: "Twitter" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=1920&h=1080&fit=crop)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Ready to start your Azerbaijan adventure? Get in touch with our team
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-elevated transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <info.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-foreground mb-2">{info.detail}</div>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
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
                  <CardTitle className="text-xl">Quick Answers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Follow Our Adventures</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Stay updated with our latest tours and tips on social media
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all duration-300 text-primary hover:scale-105"
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 px-4 bg-gradient-mountain">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Emergency Contact
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            For urgent matters during tours or emergencies, our team is available 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-mountain hover:bg-white/90">
              <Phone className="w-5 h-5 mr-2" />
              Emergency: (+994) 51 400 90 91
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;