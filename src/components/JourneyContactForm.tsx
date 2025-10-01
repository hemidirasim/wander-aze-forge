import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useTourCategories, TourCategory, Tour } from '@/hooks/useTourCategories';
import { Send, MapPin, Calendar, Users } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Please select your country'),
  tourCategory: z.string().min(1, 'Please select a tour category'),
  tourType: z.string().optional(),
  groupSize: z.string().min(1, 'Please enter group size'),
  dates: z.string().min(1, 'Please enter your preferred dates'),
  message: z.string().min(10, 'Please tell us more about your travel plans'),
  newsletter: z.boolean().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  })
});

type FormData = z.infer<typeof formSchema>;

const JourneyContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { categories, tours, loading, getToursByCategory } = useTourCategories();
  const [selectedCategory, setSelectedCategory] = useState<TourCategory | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      tourCategory: '',
      tourType: '',
      groupSize: '',
      dates: '',
      message: '',
      newsletter: false,
      terms: false
    }
  });

  const handleCategoryChange = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug);
    setSelectedCategory(category || null);
    setSelectedTour(null); // Reset tour when category changes
    form.setValue('tourType', ''); // Reset tour selection
  };

  const handleTourChange = (tourId: string) => {
    const tour = tours.find(t => t.id.toString() === tourId);
    setSelectedTour(tour || null);
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
      setSelectedCategory(null);
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

                  {/* Country */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Country *</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            className="w-full p-3 border border-white/30 rounded-md bg-white/20 text-white h-12"
                          >
                            <option value="" className="bg-gray-800">Select your country</option>
                            <option value="US" className="bg-gray-800">United States</option>
                            <option value="GB" className="bg-gray-800">United Kingdom</option>
                            <option value="CA" className="bg-gray-800">Canada</option>
                            <option value="AU" className="bg-gray-800">Australia</option>
                            <option value="DE" className="bg-gray-800">Germany</option>
                            <option value="FR" className="bg-gray-800">France</option>
                            <option value="IT" className="bg-gray-800">Italy</option>
                            <option value="ES" className="bg-gray-800">Spain</option>
                            <option value="NL" className="bg-gray-800">Netherlands</option>
                            <option value="BE" className="bg-gray-800">Belgium</option>
                            <option value="CH" className="bg-gray-800">Switzerland</option>
                            <option value="AT" className="bg-gray-800">Austria</option>
                            <option value="SE" className="bg-gray-800">Sweden</option>
                            <option value="NO" className="bg-gray-800">Norway</option>
                            <option value="DK" className="bg-gray-800">Denmark</option>
                            <option value="FI" className="bg-gray-800">Finland</option>
                            <option value="PL" className="bg-gray-800">Poland</option>
                            <option value="CZ" className="bg-gray-800">Czech Republic</option>
                            <option value="RO" className="bg-gray-800">Romania</option>
                            <option value="GR" className="bg-gray-800">Greece</option>
                            <option value="PT" className="bg-gray-800">Portugal</option>
                            <option value="IE" className="bg-gray-800">Ireland</option>
                            <option value="TR" className="bg-gray-800">Turkey</option>
                            <option value="RU" className="bg-gray-800">Russia</option>
                            <option value="UA" className="bg-gray-800">Ukraine</option>
                            <option value="AZ" className="bg-gray-800">Azerbaijan</option>
                            <option value="GE" className="bg-gray-800">Georgia</option>
                            <option value="AM" className="bg-gray-800">Armenia</option>
                            <option value="KZ" className="bg-gray-800">Kazakhstan</option>
                            <option value="UZ" className="bg-gray-800">Uzbekistan</option>
                            <option value="JP" className="bg-gray-800">Japan</option>
                            <option value="CN" className="bg-gray-800">China</option>
                            <option value="KR" className="bg-gray-800">South Korea</option>
                            <option value="IN" className="bg-gray-800">India</option>
                            <option value="SG" className="bg-gray-800">Singapore</option>
                            <option value="AE" className="bg-gray-800">United Arab Emirates</option>
                            <option value="SA" className="bg-gray-800">Saudi Arabia</option>
                            <option value="IL" className="bg-gray-800">Israel</option>
                            <option value="BR" className="bg-gray-800">Brazil</option>
                            <option value="AR" className="bg-gray-800">Argentina</option>
                            <option value="MX" className="bg-gray-800">Mexico</option>
                            <option value="ZA" className="bg-gray-800">South Africa</option>
                            <option value="NZ" className="bg-gray-800">New Zealand</option>
                            <option value="OTHER" className="bg-gray-800">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Tour Category */}
                  <FormField
                    control={form.control}
                    name="tourCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Tour Category *</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleCategoryChange(e.target.value);
                            }}
                            className="w-full p-3 border border-white/30 rounded-md bg-white/20 text-white h-12"
                            disabled={loading}
                          >
                            <option value="" className="bg-gray-800">
                              {loading ? 'Loading categories...' : 'Select a category'}
                            </option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.slug} className="bg-gray-800">
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Tour Selection (appears when category is selected AND has tours) */}
                  {selectedCategory && getToursByCategory(selectedCategory.slug).length > 0 && (
                    <FormField
                      control={form.control}
                      name="tourType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium">Select Tour</FormLabel>
                          <FormControl>
                            <select 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleTourChange(e.target.value);
                              }}
                              className="w-full p-3 border border-white/30 rounded-md bg-white/20 text-white h-12"
                            >
                              <option value="" className="bg-gray-800">Select a tour</option>
                              {getToursByCategory(selectedCategory.slug).map((tour) => (
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
                  )}



                  {/* Group Size */}
                  <FormField
                    control={form.control}
                    name="groupSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Group Size *</FormLabel>
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
                        <FormLabel className="text-white font-medium">Preferred Dates *</FormLabel>
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

                {/* Terms & Conditions Checkbox */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2">
                      <FormControl>
                        <input 
                          type="checkbox" 
                          {...field}
                          checked={field.value}
                          className="rounded mt-1"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-white/90 cursor-pointer">
                        I agree to the <a href="/terms" className="text-white hover:underline font-semibold">Terms & Conditions</a> and <a href="/privacy" className="text-white hover:underline font-semibold">Privacy Policy</a> *
                      </FormLabel>
                      <FormMessage className="text-red-200" />
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