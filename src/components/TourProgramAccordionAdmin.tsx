import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  Clock,
  Utensils,
  Moon,
  Car,
  Star
} from 'lucide-react';

interface TourProgramDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: string[];
  transportation: string;
  highlights: string[];
  difficultyLevel: string;
  durationHours: number;
}

interface TourProgramAccordionAdminProps {
  programs: TourProgramDay[];
  onProgramsChange: (programs: TourProgramDay[]) => void;
}

const TourProgramAccordionAdmin: React.FC<TourProgramAccordionAdminProps> = ({
  programs,
  onProgramsChange
}) => {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const toggleDay = (dayId: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId);
    } else {
      newExpanded.add(dayId);
    }
    setExpandedDays(newExpanded);
  };

  const addDay = () => {
    const newDay: TourProgramDay = {
      id: `day-${Date.now()}`,
      dayNumber: programs.length + 1,
      title: '',
      description: '',
      activities: [],
      accommodation: '',
      meals: [],
      transportation: '',
      highlights: [],
      difficultyLevel: 'Easy',
      durationHours: 8
    };
    onProgramsChange([...programs, newDay]);
  };

  const removeDay = (dayId: string) => {
    const updatedPrograms = programs.filter(program => program.id !== dayId);
    // Reorder day numbers
    const reorderedPrograms = updatedPrograms.map((program, index) => ({
      ...program,
      dayNumber: index + 1
    }));
    onProgramsChange(reorderedPrograms);
  };

  const updateDay = (dayId: string, field: keyof TourProgramDay, value: any) => {
    const updatedPrograms = programs.map(program => 
      program.id === dayId ? { ...program, [field]: value } : program
    );
    onProgramsChange(updatedPrograms);
  };

  const addArrayItem = (dayId: string, field: 'activities' | 'meals' | 'highlights', value: string) => {
    if (!value.trim()) return;
    
    const updatedPrograms = programs.map(program => 
      program.id === dayId 
        ? { ...program, [field]: [...program[field], value] }
        : program
    );
    onProgramsChange(updatedPrograms);
  };

  const removeArrayItem = (dayId: string, field: 'activities' | 'meals' | 'highlights', index: number) => {
    const updatedPrograms = programs.map(program => 
      program.id === dayId 
        ? { ...program, [field]: program[field].filter((_, i) => i !== index) }
        : program
    );
    onProgramsChange(updatedPrograms);
  };

  const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Water'];
  const difficultyLevels = ['Easy', 'Moderate', 'Challenging', 'Expert'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Tour Program Details
          </CardTitle>
          <Button type="button" onClick={addDay} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Day
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Create detailed day-by-day program for your tour
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {programs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No program days added yet</p>
            <p className="text-sm">Click "Add Day" to start creating your tour program</p>
          </div>
        ) : (
          programs.map((program) => (
            <Card key={program.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-sm font-medium">
                      Day {program.dayNumber}
                    </Badge>
                    <h4 className="font-semibold text-lg">
                      {program.title || `Day ${program.dayNumber} - Untitled`}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDay(program.id)}
                    >
                      {expandedDays.has(program.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(program.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedDays.has(program.id) && (
                <CardContent className="pt-0 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${program.id}`}>Day Title</Label>
                      <Input
                        id={`title-${program.id}`}
                        value={program.title}
                        onChange={(e) => updateDay(program.id, 'title', e.target.value)}
                        placeholder="e.g., Arrival and City Tour"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`difficulty-${program.id}`}>Difficulty Level</Label>
                      <Select
                        value={program.difficultyLevel}
                        onValueChange={(value) => updateDay(program.id, 'difficultyLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor={`description-${program.id}`}>Day Description</Label>
                    <Textarea
                      id={`description-${program.id}`}
                      value={program.description}
                      onChange={(e) => updateDay(program.id, 'description', e.target.value)}
                      placeholder="Detailed description of the day's activities and experiences..."
                      rows={4}
                    />
                  </div>

                  {/* Activities */}
                  <div className="space-y-2">
                    <Label>Activities</Label>
                    <div className="space-y-2">
                      {program.activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={activity}
                            onChange={(e) => {
                              const newActivities = [...program.activities];
                              newActivities[index] = e.target.value;
                              updateDay(program.id, 'activities', newActivities);
                            }}
                            placeholder="Activity description"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem(program.id, 'activities', index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newActivities = [...program.activities, ''];
                          updateDay(program.id, 'activities', newActivities);
                        }}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div className="space-y-2">
                    <Label htmlFor={`accommodation-${program.id}`}>Accommodation</Label>
                    <Input
                      id={`accommodation-${program.id}`}
                      value={program.accommodation}
                      onChange={(e) => updateDay(program.id, 'accommodation', e.target.value)}
                      placeholder="e.g., Hotel in city center, Mountain hut, Camping"
                    />
                  </div>

                  {/* Meals */}
                  <div className="space-y-2">
                    <Label>Meals Included</Label>
                    <div className="flex flex-wrap gap-2">
                      {mealOptions.map((meal) => (
                        <Button
                          key={meal}
                          variant={program.meals.includes(meal) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newMeals = program.meals.includes(meal)
                              ? program.meals.filter(m => m !== meal)
                              : [...program.meals, meal];
                            updateDay(program.id, 'meals', newMeals);
                          }}
                        >
                          {meal}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Transportation */}
                  <div className="space-y-2">
                    <Label htmlFor={`transportation-${program.id}`}>Transportation</Label>
                    <Input
                      id={`transportation-${program.id}`}
                      value={program.transportation}
                      onChange={(e) => updateDay(program.id, 'transportation', e.target.value)}
                      placeholder="e.g., Private vehicle, Walking, Cable car"
                    />
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2">
                    <Label>Day Highlights</Label>
                    <div className="space-y-2">
                      {program.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) => {
                              const newHighlights = [...program.highlights];
                              newHighlights[index] = e.target.value;
                              updateDay(program.id, 'highlights', newHighlights);
                            }}
                            placeholder="Highlight description"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem(program.id, 'highlights', index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newHighlights = [...program.highlights, ''];
                          updateDay(program.id, 'highlights', newHighlights);
                        }}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Highlight
                      </Button>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor={`duration-${program.id}`}>Duration (Hours)</Label>
                    <Input
                      id={`duration-${program.id}`}
                      type="number"
                      value={program.durationHours}
                      onChange={(e) => updateDay(program.id, 'durationHours', parseInt(e.target.value) || 8)}
                      placeholder="8"
                      min="1"
                      max="24"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TourProgramAccordionAdmin;
