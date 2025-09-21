import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Send, MapPin, Calendar, Users } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  destination: z.string().min(2, 'Please specify your preferred destination'),
  travelDate: z.string().min(1, 'Please select your travel date'),
  groupSize: z.string().min(1, 'Please specify group size'),
  message: z.string().min(10, 'Please tell us more about your travel plans')
});

type FormData = z.infer<typeof formSchema>;

const JourneyContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      destination: '',
      travelDate: '',
      groupSize: '',
      message: ''
    }
  });

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
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="Enter your name" />
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
                        <FormLabel className="text-white font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="Enter your email" />
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
                          <Input {...field} type="tel" className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="Enter your phone" />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Destination */}
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Preferred Destination
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="e.g., Khinalig, Shahdag" />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Travel Date */}
                  <FormField
                    control={form.control}
                    name="travelDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Travel Date
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="bg-white/20 border-white/30 text-white h-12" />
                        </FormControl>
                        <FormMessage className="text-red-200" />
                      </FormItem>
                    )}
                  />

                  {/* Group Size */}
                  <FormField
                    control={form.control}
                    name="groupSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Group Size
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12" placeholder="e.g., 4 people" />
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
                      <FormLabel className="text-white font-medium">Tell us about your travel dreams</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70 min-h-[120px] resize-y" 
                          placeholder="What type of adventure are you looking for? Any specific interests or requirements?"
                        />
                      </FormControl>
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