import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  adventureTypes: z.array(z.string()).min(1, 'Please select at least one adventure type'),
  destinations: z.string().min(10, 'Please describe your preferred destinations'),
  startDate: z.string().min(1, 'Please select a start date'),
  duration: z.string().min(1, 'Please specify trip duration'),
  dailyKilometers: z.string().min(1, 'Please specify daily hiking distance'),
  numberOfPeople: z.string().min(1, 'Please specify number of people'),
  childrenAges: z.string().optional(),
  accommodationPreferences: z.array(z.string()).min(1, 'Please select accommodation preferences'),
  budget: z.string().min(1, 'Please specify your budget'),
  additionalDetails: z.string().min(10, 'Please tell us more about your ideal trip'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
});

type FormData = z.infer<typeof formSchema>;

const TailorMadeForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      fullName: '',
      adventureTypes: [],
      destinations: '',
      startDate: '',
      duration: '',
      dailyKilometers: '',
      numberOfPeople: '',
      childrenAges: '',
      accommodationPreferences: [],
      budget: '',
      additionalDetails: '',
      agreeToTerms: false
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Here you would normally send the data to your backend
      console.log('Form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Request Submitted Successfully!",
        description: "We'll get back to you within 24 hours with a custom itinerary.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const adventureOptions = [
    { id: 'hiking', label: 'Hiking' },
    { id: 'trekking', label: 'Trekking' },
    { id: 'wildlife', label: 'Wildlife' }
  ];

  const accommodationOptions = [
    { id: 'guesthouse', label: 'Guesthouse in the villages' },
    { id: 'tent', label: 'Overnight at tent' },
    { id: 'hotels', label: '3-4 star hotels' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* Introduction Text */}
      <div className="mb-12">
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-lg leading-relaxed mb-6">
            For those seeking an exclusive experience or with specific requirements not covered in our existing tour proposals, we offer a tailor-made service designed just for you.
          </p>
          
          <p className="text-base leading-relaxed mb-6">
            Let us know what you'd like to do and where you'd like to go in Azerbaijan, and we'll create an itinerary and quote tailored to your preferences.
          </p>
          
          <p className="text-base leading-relaxed mb-6">
            Tailor-made tours provide the flexibility to design your own path. You can choose how and when to travel, the level of the hike, and your preferred destinations. This option is ideal for large families, groups of friends, or celebrating special occasions. Whether you want to pack in as many activities and locations as possible or include time for relaxation and independent exploration, the choice is yours.
          </p>
          
          <p className="text-base leading-relaxed mb-8">
            Simply complete the inquiry form below, and we'll provide a detailed itinerary along with all the support you need to make your journey in Azerbaijan an authentic and unforgettable experience.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">* Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">* Full Name</FormLabel>
                <FormControl>
                  <Input {...field} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Adventure Types */}
          <FormField
            control={form.control}
            name="adventureTypes"
            render={() => (
              <FormItem>
                <FormLabel className="text-base font-medium">* What sort of adventure would suit you?</FormLabel>
                <div className="flex flex-wrap gap-6 mt-3">
                  {adventureOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="adventureTypes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <Label className="text-sm font-normal">
                              {option.label}
                            </Label>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Destinations */}
          <FormField
            control={form.control}
            name="destinations"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  * Which destinations would you like to explore? (<Link to="/tours" className="text-primary hover:underline">See our tour itineraries for ideas</Link>.)
                </FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px] resize-y" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">* When would you like to start your trip?</FormLabel>
                <FormControl>
                  <Input {...field} type="date" className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">* For how long? (number of days)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 5 days" className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Daily Kilometers */}
          <FormField
            control={form.control}
            name="dailyKilometers"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">* How many kilometers do you want to hike/walk per day?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 10-15 km" className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of People */}
          <FormField
            control={form.control}
            name="numberOfPeople"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">* How many people you are?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 4 people" className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Children Ages */}
          <FormField
            control={form.control}
            name="childrenAges"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">If you are with children, please mention their ages.</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="e.g., 8 years old, 12 years old" className="min-h-[80px] resize-y" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Accommodation Preferences */}
          <FormField
            control={form.control}
            name="accommodationPreferences"
            render={() => (
              <FormItem>
                <FormLabel className="text-base font-medium">* Accommodation preferences:</FormLabel>
                <div className="space-y-3 mt-3">
                  {accommodationOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="accommodationPreferences"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <Label className="text-sm font-normal">
                              {option.label}
                            </Label>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Budget */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">* How much would you like to spend per person? (USD or Euro)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., $500 USD or €450 EUR" className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Details */}
          <FormField
            control={form.control}
            name="additionalDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">* Tell us more about your ideal trip.</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[120px] resize-y" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms Agreement */}
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label className="text-sm">
                    * I agree to the{' '}
                    <a href="#" className="text-primary no-underline hover:underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary no-underline hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-medium"
              variant="adventure"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TailorMadeForm;