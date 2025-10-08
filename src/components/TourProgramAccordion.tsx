import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Mountain, Camera, Utensils, Moon, Sunrise, Coffee, Footprints } from 'lucide-react';

interface DayActivity {
  time: string;
  activity: string;
  description: string;
  location?: string;
  duration?: string;
  icon?: 'mountain' | 'camera' | 'food' | 'sleep' | 'hiking' | 'sunrise' | 'coffee';
}

interface DayProgram {
  day: string;
  title: string;
  overview: string;
  activities: DayActivity[];
  highlights: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  elevation?: string;
  distance?: string;
  meals: string[];
  accommodation?: string;
}

interface TourProgramAccordionProps {
  program: DayProgram[];
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
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TourProgramAccordion: React.FC<TourProgramAccordionProps> = ({ program, category }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {program.map((day, index) => (
            <AccordionItem key={index} value={`day-${index}`} className="border-b border-border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-left">{day.day}</h3>
                        <p className="text-sm text-muted-foreground text-left">{day.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(day.difficulty)}>
                      {day.difficulty}
                    </Badge>
                    {day.distance && (
                      <Badge variant="outline">
                        {day.distance}
                      </Badge>
                    )}
                    {day.elevation && (
                      <Badge variant="outline">
                        {day.elevation}
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  {/* Day Overview */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div 
                      className="text-muted-foreground prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: day.overview }}
                    />
                  </div>

                  {/* Activities Timeline */}
                  {day.activities && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Daily Schedule</h4>
                      <div className="space-y-3">
                        {Array.isArray(day.activities) ? (
                          day.activities.map((activity, activityIndex) => (
                            <div key={activityIndex} className="flex items-start space-x-4 p-3 bg-background rounded-lg border">
                              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                {getActivityIcon(activity.icon)}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-medium text-foreground">{activity.activity}</h5>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>{activity.time}</span>
                                    {activity.duration && (
                                      <>
                                        <span>•</span>
                                        <span>{activity.duration}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <p className="text-muted-foreground text-sm">{activity.description}</p>
                                {activity.location && (
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span>{activity.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">{day.activities}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Day Highlights */}
                  {day.highlights && day.highlights.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Day Highlights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {day.highlights.map((highlight, highlightIndex) => (
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
                    {day.meals && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center space-x-2">
                          <Utensils className="w-4 h-4" />
                          <span>Meals</span>
                        </h4>
                        <div className="space-y-1">
                          {Array.isArray(day.meals) ? (
                            day.meals.map((meal, mealIndex) => (
                              <div key={mealIndex} className="text-sm text-muted-foreground">
                                • {meal}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              • {day.meals}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {day.accommodation && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center space-x-2">
                          <Moon className="w-4 h-4" />
                          <span>Accommodation</span>
                        </h4>
                        <p className="text-sm text-muted-foreground">{day.accommodation}</p>
                      </div>
                    )}
                  </div>

                  {/* Category-specific additional info */}
                  {category === 'trekking' && day.elevation && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Trekking Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {day.elevation && (
                          <div>
                            <span className="font-medium text-blue-800">Elevation:</span>
                            <span className="text-blue-700 ml-1">{day.elevation}</span>
                          </div>
                        )}
                        {day.distance && (
                          <div>
                            <span className="font-medium text-blue-800">Distance:</span>
                            <span className="text-blue-700 ml-1">{day.distance}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-blue-800">Difficulty:</span>
                          <span className="text-blue-700 ml-1">{day.difficulty}</span>
                        </div>
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

export default TourProgramAccordion;
