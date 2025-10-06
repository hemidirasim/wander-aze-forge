import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Mountain, Camera, Utensils, Moon, Sunrise, Coffee, Footprints } from 'lucide-react';
import { DatabaseTourProgram } from '@/hooks/useTourPrograms';

interface DatabaseTourProgramAccordionProps {
  programs: DatabaseTourProgram[];
  category: string;
}

const getActivityIcon = (iconType?: string) => {
  const iconProps = { className: "w-4 h-4" };
  
  switch (iconType) {
    case 'mountain':
      return <Mountain {...iconProps} />;
    case 'camera':
      return <Camera {...iconProps} />;
    case 'food':
      return <Utensils {...iconProps} />;
    case 'sleep':
      return <Moon {...iconProps} />;
    case 'hiking':
      return <Footprints {...iconProps} />;
    case 'sunrise':
      return <Sunrise {...iconProps} />;
    case 'coffee':
      return <Coffee {...iconProps} />;
    default:
      return <Clock {...iconProps} />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-orange-100 text-orange-800';
    case 'Moderate':
      return 'bg-orange-100 text-orange-800';
    case 'Challenging':
      return 'bg-red-100 text-red-800';
    case 'Expert':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DatabaseTourProgramAccordion: React.FC<DatabaseTourProgramAccordionProps> = ({ programs, category }) => {
  if (programs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No detailed program available for this tour.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {programs.map((program, index) => (
            <AccordionItem key={index} value={`day-${index}`} className="border-b border-border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div>
                        <h3 className="text-lg font-semibold text-left">{program.title || `Day ${program.day_number}`}</h3>
                        <p className="text-sm text-muted-foreground text-left">{program.day_number}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {program.difficulty && (
                      <Badge className={getDifficultyColor(program.difficulty)}>
                        {program.difficulty}
                      </Badge>
                    )}
                    {program.distance && (
                      <Badge variant="outline">
                        {program.distance}
                      </Badge>
                    )}
                    {program.elevation && (
                      <Badge variant="outline">
                        {program.elevation}
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  {/* Day Description */}
                  {program.description && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Day Description</h4>
                      <p className="text-muted-foreground">{program.description}</p>
                    </div>
                  )}

                  {/* Day Overview */}
                  {program.day_overview && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Day Overview</h4>
                      <p className="text-muted-foreground">{program.day_overview}</p>
                    </div>
                  )}

                  {/* Activities Timeline */}
                  {program.activities && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Daily Schedule</h4>
                      <div className="space-y-3">
                        {(() => {
                          let activities = program.activities;
                          
                          // Parse activities if it's a string
                          if (typeof activities === 'string') {
                            try {
                              activities = JSON.parse(activities);
                            } catch (e) {
                              console.error('Error parsing activities:', e);
                              activities = [];
                            }
                          }
                          
                          // Handle different data structures
                          if (Array.isArray(activities)) {
                            return activities.map((activity, activityIndex) => {
                              // Handle both object and string activities
                              if (typeof activity === 'object' && activity !== null) {
                                return (
                                  <div key={activityIndex} className="flex items-start space-x-4 p-3 bg-background rounded-lg border">
                                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                      {getActivityIcon(activity.icon)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center justify-between">
                                        <h5 className="font-medium text-foreground">{activity.activity || activity.title || activity}</h5>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                          <Clock className="w-4 h-4" />
                                          <span>{activity.time || activity.duration || ''}</span>
                                          {activity.duration && activity.time && (
                                            <>
                                              <span>•</span>
                                              <span>{activity.duration}</span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-muted-foreground text-sm">{activity.description || activity.details || ''}</p>
                                      {activity.location && (
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                          <MapPin className="w-3 h-3" />
                                          <span>{activity.location}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              } else {
                                // Handle string activities
                                return (
                                  <div key={activityIndex} className="flex items-start space-x-4 p-3 bg-background rounded-lg border">
                                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                      <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-muted-foreground">{activity}</p>
                                    </div>
                                  </div>
                                );
                              }
                            });
                          } else {
                            return (
                              <div className="p-4 bg-muted/30 rounded-lg">
                                <p className="text-muted-foreground">{program.activities}</p>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Day Highlights */}
                  {program.highlights && program.highlights.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Day Highlights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {program.highlights.map((highlight, highlightIndex) => (
                          <div key={highlightIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meals & Accommodation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.meals && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center space-x-2">
                          <Utensils className="w-4 h-4" />
                          <span>Meals</span>
                        </h4>
                        <div className="space-y-1">
                          {(() => {
                            let meals = program.meals;
                            
                            // Parse meals if it's a string
                            if (typeof meals === 'string') {
                              try {
                                meals = JSON.parse(meals);
                              } catch (e) {
                                console.error('Error parsing meals:', e);
                                meals = [program.meals]; // Fallback to original string
                              }
                            }
                            
                            if (Array.isArray(meals)) {
                              return meals.map((meal, mealIndex) => (
                                <div key={mealIndex} className="text-sm text-muted-foreground">
                                  • {meal}
                                </div>
                              ));
                            } else {
                              return (
                                <div className="text-sm text-muted-foreground">
                                  • {program.meals}
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    )}

                    {program.accommodation && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center space-x-2">
                          <Moon className="w-4 h-4" />
                          <span>Accommodation</span>
                        </h4>
                        <p className="text-sm text-muted-foreground">{program.accommodation}</p>
                      </div>
                    )}
                  </div>

                  {/* Category-specific additional info */}
                  {category === 'trekking' && (program.elevation || program.distance) && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Trekking Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {program.elevation && (
                          <div>
                            <span className="font-medium text-blue-800">Elevation:</span>
                            <span className="text-blue-700 ml-1">{program.elevation}</span>
                          </div>
                        )}
                        {program.distance && (
                          <div>
                            <span className="font-medium text-blue-800">Distance:</span>
                            <span className="text-blue-700 ml-1">{program.distance}</span>
                          </div>
                        )}
                        {program.difficulty && (
                          <div>
                            <span className="font-medium text-blue-800">Difficulty:</span>
                            <span className="text-blue-700 ml-1">{program.difficulty}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {category === 'wildlife' && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-900 mb-2">Wildlife Information</h4>
                      <div className="text-sm text-yellow-800">
                        <p>Best viewing times and wildlife spotting opportunities throughout the day.</p>
                        <p className="mt-2">
                          <strong>What to bring:</strong> Binoculars, camera with zoom lens, and comfortable walking shoes.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default DatabaseTourProgramAccordion;
