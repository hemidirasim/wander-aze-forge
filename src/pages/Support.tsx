import React from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      <div className="p-6 pt-32">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold text-foreground mb-8">Support</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Phone Support</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Call us for immediate assistance with your booking or tour questions.
                </p>
                <a 
                  href="tel:+994514009091" 
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  +994 51 400 90 91
                </a>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Email Support</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <a 
                  href="mailto:info@outtour.az" 
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  info@outtour.az
                </a>
              </div>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Contact Form</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Use our contact form for detailed inquiries or special requests.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-semibold"
              >
                Go to Contact Form
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
