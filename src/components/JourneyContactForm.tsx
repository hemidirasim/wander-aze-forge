import { useState, useMemo, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTourCategories, TourCategory, Tour } from '@/hooks/useTourCategories';
import { Send, MapPin, Calendar, Users, Search } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { categories, tours, loading, getToursByCategory } = useTourCategories();
  const [selectedCategory, setSelectedCategory] = useState<TourCategory | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryList, setShowCountryList] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

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
    setSubmitMessage(null); // Clear previous message
    
    try {
      console.log('=== JOURNEY FORM SUBMIT ===');
      console.log('Form data:', data);
      
      const response = await fetch('/api/contact/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          country: countrySearch || data.country,
          tourCategory: data.tourCategory,
          tourType: selectedTour ? selectedTour.title : (data.tourType || ''),
          groupSize: data.groupSize,
          dates: data.dates,
          message: data.message,
          newsletter: data.newsletter || false,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Response error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: result.message || 'Thank you for contacting us! We will get back to you soon.'
        });
        form.reset();
        setCountrySearch('');
        setSelectedCategory(null);
        setSelectedTour(null);
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting journey form:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="py-24 px-4 bg-gray-100">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Plan Your Journey With Us
              </h2>
              <p className="text-lg md:text-xl text-gray-900 max-w-3xl mx-auto leading-relaxed">
                Ready to explore Azerbaijan? Tell us your travel dreams and we'll craft the perfect adventure for you
              </p>
            </div>

            <div className="rounded-2xl p-8 md:p-12 border border-gray-200 shadow-lg" style={{ background: 'rgb(215 114 61)' }}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" placeholder="Your first name" />
                        </FormControl>
                        <FormMessage className="text-gray-900" />
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
                          <Input {...field} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" placeholder="Your last name" />
                        </FormControl>
                        <FormMessage className="text-gray-900" />
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
                          <Input {...field} type="email" className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" placeholder="your.email@example.com" />
                        </FormControl>
                        <FormMessage className="text-gray-900" />
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
                          <Input {...field} type="tel" className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" placeholder="+1 (555) 123-4567" />
                        </FormControl>
                        <FormMessage className="text-gray-900" />
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
                          <div className="relative" ref={countryDropdownRef}>
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
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
                              name="country-search"
                              id="country-search"
                              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 h-12"
                            />
                            
                            {/* Custom Dropdown */}
                            {showCountryList && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                                {filteredCountries.length > 0 ? (
                                  filteredCountries.map((country) => (
                                    <button
                                      key={country.code}
                                      type="button"
                                      onClick={() => {
                                        setCountrySearch(country.name);
                                        field.onChange(country.name);
                                        setShowCountryList(false);
                                      }}
                                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-900 transition-colors"
                                    >
                                      {country.name}
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-4 py-3 text-gray-500">No countries found</div>
                                )}
                                
                                {/* Other option */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCountrySearch('Other');
                                    field.onChange('Other');
                                    setShowCountryList(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-900 transition-colors border-t border-gray-200"
                                >
                                  Other
                                </button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-gray-900" />
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
                            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 h-12"
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
                        <FormMessage className="text-gray-900" />
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
                              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 h-12"
                            >
                              <option value="" className="bg-gray-800">Select a tour</option>
                              {getToursByCategory(selectedCategory.slug).map((tour) => (
                                <option key={tour.id} value={tour.id.toString()} className="bg-gray-800">
                                  {tour.title} - {tour.duration} - {tour.difficulty}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage className="text-gray-900" />
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
                          <Input {...field} type="number" min="1" max="20" className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" placeholder="Number of travelers" />
                        </FormControl>
                        <FormMessage className="text-gray-900" />
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
                          <Input {...field} className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12" placeholder="e.g., June 15-20, 2024" />
                        </FormControl>
                        <FormMessage className="text-gray-900" />
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
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 min-h-[120px] resize-y" 
                          placeholder="Tell us about your interests, fitness level, special requirements, or any questions you have..."
                        />
                      </FormControl>
                      <FormMessage className="text-gray-900" />
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
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          className="rounded"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-white cursor-pointer">
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
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          className="rounded mt-1"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-white cursor-pointer">
                        I agree to the <a href="/terms" className="text-white font-bold no-underline hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-white font-bold no-underline hover:underline">Privacy Policy</a> *
                      </FormLabel>
                      <FormMessage className="text-gray-900" />
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
                        Plan My Trip
                      </>
                    )}
                  </Button>
                  
                  {/* Submit Message */}
                  {submitMessage && (
                    <p className={`mt-4 text-center text-sm ${
                      submitMessage.type === 'success'
                        ? 'text-green-200'
                        : 'text-red-200'
                    }`}>
                      {submitMessage.text}
                    </p>
                  )}
                  
                  <p className="text-xs text-white text-center mt-4">
                    We respect your privacy. Your information will only be used to respond to your inquiry.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default JourneyContactForm;