import React, { useState, useEffect, useMemo, useRef } from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter, Youtube, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTourCategories, TourCategory, Tour } from '@/hooks/useTourCategories';
import { useToast } from '@/hooks/use-toast';

interface ContactSection {
  id: number;
  section: string;
  title: string;
  content?: string;
  contact_info: any;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const Contact = () => {
  const [contactData, setContactData] = useState<ContactSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { categories, tours, loading: dataLoading, getToursByCategory } = useTourCategories();
  const [selectedCategory, setSelectedCategory] = useState<TourCategory | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryList, setShowCountryList] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/contact-page');
      const data = await response.json();
      
      if (data.success) {
        setContactData(data.data);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionData = (section: string) => {
    return contactData.find(item => item.section === section);
  };

  const handleCategoryChange = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug);
    setSelectedCategory(category || null);
    setSelectedTour(null); // Reset tour when category changes
  };

  const handleTourChange = (tourId: string) => {
    const tour = tours.find(t => t.id.toString() === tourId);
    setSelectedTour(tour || null);
  };

  const handleFormSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    console.log('=== FORM SUBMIT HANDLER CALLED ===');
    console.log('submitting state:', submitting);
    
    if (submitting) {
      console.log('Already submitting, returning...');
      return;
    }

    // Get form element by ID
    const form = document.getElementById('contact-form') as HTMLFormElement;
    if (!form) {
      console.error('Form not found!');
      return;
    }
    
    const formData = new FormData(form);
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const country = countrySearch || formData.get('country') as string;
    const tourCategory = formData.get('tourCategory') as string;
    const tourType = selectedTour ? selectedTour.title : (formData.get('tourType') as string);
    const groupSize = formData.get('groupSize') as string;
    const dates = formData.get('dates') as string;
    const message = formData.get('message') as string;
    const newsletter = formData.get('newsletter') === 'on';

    console.log('Form submission data:', {
      firstName,
      lastName,
      email,
      phone,
      country,
      tourCategory,
      tourType,
      groupSize,
      dates,
      message,
      newsletter
    });

    // Validation
    if (!firstName || !lastName || !email || !country || !tourCategory || !groupSize || !dates || !message) {
      console.log('Validation failed - missing fields');
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      console.log('Sending request to /api/contact/create');

      const response = await fetch('/api/contact/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          country,
          tourCategory,
          tourType: selectedTour ? selectedTour.title : tourType,
          groupSize,
          dates,
          message,
          newsletter,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        toast({
          title: 'Success!',
          description: 'Thank you for contacting us! We will get back to you soon.',
        });
        form.reset();
        setCountrySearch('');
        setSelectedCategory(null);
        setSelectedTour(null);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const heroData = getSectionData('hero');
  const faqData = getSectionData('faq_section');
  const socialData = getSectionData('social_media');

  const socialLinks = [
    { icon: Facebook, url: "https://www.facebook.com/campingazerbaijan2014", name: "Facebook" },
    { icon: Instagram, url: "https://www.instagram.com/camping_azerbaijan/", name: "Instagram" },
    { icon: Linkedin, url: "https://www.linkedin.com/company/campingazerbaijan/", name: "LinkedIn" },
    { icon: Twitter, url: "https://x.com/CampingAze", name: "Twitter" },
    { icon: Youtube, url: "https://www.youtube.com/@campingazerbaijan", name: "YouTube" }
  ];

  // Country list with search and sorting
  const countries = [
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BR', name: 'Brazil' },
    { code: 'BN', name: 'Brunei' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'CV', name: 'Cabo Verde' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CA', name: 'Canada' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' },
    { code: 'CL', name: 'Chile' },
    { code: 'CN', name: 'China' },
    { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' },
    { code: 'CG', name: 'Congo' },
    { code: 'CD', name: 'Democratic Republic of the Congo' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GR', name: 'Greece' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'KP', name: 'North Korea' },
    { code: 'KR', name: 'South Korea' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'LA', name: 'Laos' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia' },
    { code: 'MD', name: 'Moldova' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'QA', name: 'Qatar' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russia' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'São Tomé and Príncipe' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'ES', name: 'Spain' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SY', name: 'Syria' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Turkey' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VA', name: 'Vatican City' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' }
  ];

  const filteredCountries = useMemo(() => {
    return countries
      .filter(country => 
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countrySearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryList(false);
      }
    };

    if (showCountryList) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryList]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <Skeleton className="h-16 w-96 mx-auto mb-6" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="text-center">
                  <CardHeader>
                    <Skeleton className="w-16 h-16 mx-auto mb-4" />
                    <Skeleton className="h-6 w-24 mx-auto" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      
      {/* Hero Section from Database */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {heroData?.title || 'Contact Us'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            If you've got any questions about your adventure or need some travel advice, we'd love to help. Submit your query below and we'll get back to you soon.
          </p>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Planning a custom tour or have questions? We'd love to hear from you.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form id="contact-form" onSubmit={handleFormSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" name="firstName" placeholder="Your first name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" name="lastName" placeholder="Your last name" required />
                      </div>
                    </div>
                
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
                    </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <div className="relative" ref={countryDropdownRef}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search and select your country..."
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setShowCountryList(true);
                      }}
                      onFocus={() => setShowCountryList(true)}
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      name="country"
                      id="country-search"
                      className="w-full pl-10 pr-3 py-3 border border-input rounded-md bg-background text-foreground h-12"
                      required
                    />
                    
                    {/* Custom Dropdown */}
                    {showCountryList && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setCountrySearch(country.name);
                                setShowCountryList(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground text-foreground transition-colors"
                            >
                              {country.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-muted-foreground">No countries found</div>
                        )}
                        
                        {/* Other option */}
                        <button
                          type="button"
                          onClick={() => {
                            setCountrySearch('Other');
                            setShowCountryList(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground text-foreground transition-colors border-t border-input"
                        >
                          Other
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                    <div className="space-y-2">
                      <Label htmlFor="tourCategory">Tour Category *</Label>
                      <select 
                        id="tourCategory" 
                        name="tourCategory"
                        className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        disabled={dataLoading}
                        required
                      >
                    <option value="">
                      {dataLoading ? 'Loading categories...' : 'Select a category'}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                    {/* Tour Selection (appears when category is selected AND has tours) */}
                    {selectedCategory && getToursByCategory(selectedCategory.slug).length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="tourType">Select Tour</Label>
                        <select 
                          id="tourType" 
                          name="tourType"
                          className="w-full p-3 border border-input rounded-md bg-background text-foreground"
                          onChange={(e) => handleTourChange(e.target.value)}
                        >
                      <option value="">Select a tour</option>
                      {getToursByCategory(selectedCategory.slug).map((tour) => (
                        <option key={tour.id} value={tour.id.toString()}>
                          {tour.title} - {tour.duration} - {tour.difficulty}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                    
                    <div className="space-y-2">
                      <Label htmlFor="groupSize">Group Size *</Label>
                      <Input id="groupSize" name="groupSize" type="number" min="1" max="20" placeholder="Number of travelers" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dates">Preferred Dates *</Label>
                      <Input id="dates" name="dates" placeholder="e.g., June 15-20, 2024" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        name="message"
                        placeholder="Tell us about your interests, fitness level, special requirements, or any questions you have..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="newsletter" name="newsletter" className="rounded" />
                      <Label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer">
                        Subscribe to our newsletter for adventure tips and tour updates
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input type="checkbox" id="terms" name="terms" className="rounded mt-1" required />
                      <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                        I agree to the <a href="/terms" className="text-primary no-underline hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-primary no-underline hover:underline">Privacy Policy</a> *
                      </Label>
                    </div>
                    
                    <Button 
                      type="button" 
                      size="lg" 
                      variant="adventure" 
                      className="w-full" 
                      disabled={submitting}
                      onClick={() => {
                        console.log('=== BUTTON CLICKED ===');
                        console.log('submitting state:', submitting);
                        handleFormSubmit();
                      }}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      We respect your privacy. Your information will only be used to respond to your inquiry.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="space-y-8">
              
              {/* Contact Hero Image */}
              <Card className="border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-96 overflow-hidden">
                    <img 
                      src="/contact-hero.jpg"
                      alt="Contact Us - Adventure Tours"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Answers */}
              <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{faqData?.title || 'Quick Answers'}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {faqData?.contact_info?.faq_description || faqData?.content || 'Find quick answers to common questions about our tours, booking process, and what to expect.'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqData?.contact_info ? (
                    <>
                      {faqData.contact_info.faq_1_question && faqData.contact_info.faq_1_answer && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{faqData.contact_info.faq_1_question}</h4>
                          <p className="text-sm text-muted-foreground">{faqData.contact_info.faq_1_answer}</p>
                        </div>
                      )}
                      {faqData.contact_info.faq_2_question && faqData.contact_info.faq_2_answer && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{faqData.contact_info.faq_2_question}</h4>
                          <p className="text-sm text-muted-foreground">{faqData.contact_info.faq_2_answer}</p>
                        </div>
                      )}
                      {faqData.contact_info.faq_3_question && faqData.contact_info.faq_3_answer && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{faqData.contact_info.faq_3_question}</h4>
                          <p className="text-sm text-muted-foreground">{faqData.contact_info.faq_3_answer}</p>
                        </div>
                      )}
                      {faqData.contact_info.faq_4_question && faqData.contact_info.faq_4_answer && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{faqData.contact_info.faq_4_question}</h4>
                          <p className="text-sm text-muted-foreground">{faqData.contact_info.faq_4_answer}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">How far in advance should I book?</h4>
                        <p className="text-sm text-muted-foreground">We recommend booking 2-4 weeks in advance, especially for popular tours during peak season (June-September).</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">What's included in the price?</h4>
                        <p className="text-sm text-muted-foreground">All tours include professional guides, safety equipment, accommodation (where applicable), and transportation from designated meeting points.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Do you offer private tours?</h4>
                        <p className="text-sm text-muted-foreground">Yes! We can customize any tour for private groups. Contact us for personalized itineraries and pricing.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">What should I bring on the tour?</h4>
                        <p className="text-sm text-muted-foreground">We'll provide a detailed packing list, but essentials include comfortable hiking boots, weather-appropriate clothing, and a sense of adventure!</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Get in touch with us for tour bookings and inquiries
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-foreground mb-1">
                        {heroData?.contact_info?.phone || '(+994) 50 123 45 67'}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {heroData?.contact_info?.working_hours || 'Available 9 AM - 6 PM (GMT+4)'}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-foreground mb-1">
                        {heroData?.contact_info?.email || 'info@outtour.az'}
                      </div>
                      <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      
      <Footer />
    </div>
  );
};

export default Contact;