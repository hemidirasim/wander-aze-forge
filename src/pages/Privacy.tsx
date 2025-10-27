import React from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Privacy = () => {
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
            <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
            
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-muted-foreground text-center">
                Privacy Policy content will be provided here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
