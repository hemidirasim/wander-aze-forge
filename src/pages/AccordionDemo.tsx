import React from 'react';
import Navigation from '@/components/Navigation';
import TourProgramAccordion from '@/components/TourProgramAccordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mountain, Binoculars, Hiking, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hikingPrograms, trekkingPrograms, wildlifePrograms } from '@/data/tourPrograms';

const AccordionDemo: React.FC = () => {
  const demoPrograms = [
    {
      id: 'hiking',
      title: 'Hiking Tours',
      description: 'Day hikes and multi-day walking adventures',
      icon: Hiking,
      color: 'bg-green-100 text-green-800',
      programs: hikingPrograms
    },
    {
      id: 'trekking',
      title: 'Trekking Tours',
      description: 'Multi-day mountain expeditions and challenging treks',
      icon: Mountain,
      color: 'bg-blue-100 text-blue-800',
      programs: trekkingPrograms
    },
    {
      id: 'wildlife',
      title: 'Wildlife Tours',
      description: 'Nature tours focused on wildlife observation',
      icon: Binoculars,
      color: 'bg-orange-100 text-orange-800',
      programs: wildlifePrograms
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Back Button */}
      <section className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Interactive Tour Program Accordions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore detailed daily schedules for hiking, trekking, and wildlife tours
            </p>
            <div className="flex justify-center gap-4">
              {demoPrograms.map((category) => (
                <Badge key={category.id} className={category.color}>
                  {category.title}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            {demoPrograms.map((category) => (
              <section key={category.id} className="space-y-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <category.icon className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold text-foreground">{category.title}</h2>
                  </div>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>

                <div className="space-y-8">
                  {Object.entries(category.programs).map(([tourId, program]) => (
                    <Card key={tourId} className="overflow-hidden">
                      <CardHeader className="bg-muted/30">
                        <CardTitle className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl">Tour ID: {tourId}</h3>
                            <p className="text-muted-foreground text-base font-normal">
                              {program[0]?.title || 'Tour Program'}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {program.length} day{program.length !== 1 ? 's' : ''}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <TourProgramAccordion 
                          program={program} 
                          category={category.id}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Features Section */}
          <section className="mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Accordion Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Detailed Timings</h3>
                    <p className="text-sm text-muted-foreground">
                      Precise activity schedules with duration and location information
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Mountain className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Activity Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive descriptions of each activity with difficulty levels
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Visual Icons</h3>
                    <p className="text-sm text-muted-foreground">
                      Intuitive icons for different activity types and experiences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* How to Use Section */}
          <section className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">How to Use the Accordions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">For Tourists</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Click on any day to expand and see detailed activities</li>
                      <li>• View precise timings for each activity</li>
                      <li>• Check difficulty levels and distances</li>
                      <li>• See what meals and accommodation are included</li>
                      <li>• Read highlights and special features for each day</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">For Tour Operators</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Easy to update and modify tour programs</li>
                      <li>• Clear structure for activity planning</li>
                      <li>• Professional presentation for customers</li>
                      <li>• Mobile-responsive design</li>
                      <li>• Category-specific information display</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccordionDemo;
