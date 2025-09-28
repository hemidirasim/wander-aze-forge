import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useTours, Tour } from '@/hooks/useTours';
import { Send, MapPin, Calendar, Users } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  tourType: z.string().optional(),
  subTour: z.string().optional(),
  groupSize: z.string().optional(),
  dates: z.string().optional(),
  message: z.string().min(10, 'Please tell us more about your travel plans'),
  newsletter: z.boolean().optional()
});

type FormData = z.infer<typeof formSchema>;

const JourneyContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tours, loading: toursLoading } = useTours();
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      tourType: '',
      subTour: '',
      groupSize: '',
      dates: '',
      message: '',
      newsletter: false
    }
  });

  const handleTourChange = (tourId: string) => {
    const tour = tours.find(t => t.id.toString() === tourId);
    setSelectedTour(tour || null);
    form.setValue('subTour', ''); // Reset sub-tour when main tour changes
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Here you would normally send the data to your backend
      console.log('Journey planning form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Request Sent Successfully!",
        description: "We'll contact you within 24 hours to plan your perfect Azerbaijan adventure.",
      });
      
      form.reset();
      setSelectedTour(null);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-gradient-hero">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Plan Your Journey With Us
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Ready to explore Azerbaijan? Tell us your travel dreams and we'll craft the perfect adventure for you
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="Your first name" />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Last Name */}
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="Your last name" />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="your.email@example.com" />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="+1 (555) 123-4567" />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Tour Type */}
                  <FormField
                    control={form.control}
                    name="tourType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Interested Tour</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleTourChange(e.target.value);
                            }}
                            className="w-full p-3 border border-white/30 rounded-md bg-white/20 text-white h-12"
                            disabled={toursLoading}
                          >
                            <option value="" className="bg-gray-800">
                              {toursLoading ? 'Loading tours...' : 'Select a tour'}
                            </option>
                            {tours.map((tour) => (
                              <option key={tour.id} value={tour.id.toString()} className="bg-gray-800">
                                {tour.title} - {tour.duration} - {tour.difficulty}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Sub-Tour Selection (appears when main tour has sub-tours) */}
                  {selectedTour && selectedTour.tour_programs && selectedTour.tour_programs.length > 0 && (
                    <FormField
                      control={form.control}
                      name="subTour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium">Select Sub-Tour</FormLabel>
                          <FormControl>
                            <select 
                              {...field}
                              className="w-full p-3 border border-white/30 rounded-md bg-white/20 text-white h-12"
                            >
                              <option value="" className="bg-gray-800">Select a sub-tour</option>
                              {selectedTour.tour_programs.map((program) => (
                                <option key={program.id} value={program.id.toString()} className="bg-gray-800">
                                  Day {program.day_number}: {program.title}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage className="text-red-200" />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Group Size */}
                  <FormField
                    control={form.control}
                    name="groupSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Group Size</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" max="20" className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="Number of travelers" />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Preferred Dates */}
                  <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Preferred Dates</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="e.g., June 15-20, 2024" />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">Message *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70 min-h-[120px] resize-y" 
                          placeholder="Tell us about your interests, fitness level, special requirements, or any questions you have..."
                        />
                      </FormControl>
                      <FormMessage className="text-red-200" />
                    </FormItem>
                  )}
                />

                {/* Newsletter Checkbox */}
                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input 
                          type="checkbox" 
                          {...field}
                          checked={field.value}
                          className="rounded"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-white/90 cursor-pointer">
                        Subscribe to our newsletter for adventure tips and tour updates
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-white text-primary hover:bg-white/90 text-lg font-semibold px-8 py-4 h-auto"
                    size="lg"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Start Planning My Adventure
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-white/70 text-center mt-4">
                    We respect your privacy. Your information will only be used to respond to your inquiry.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyContactForm;