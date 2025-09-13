export interface Tour {
  id: number;
  title: string;
  description: string;
  duration: string;
  groupSize: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert' | 'Varies';
  location: string;
  price: string;
  rating: number;
  reviews?: number;
  image: string;
  category: string;
  highlights?: string[];
  included?: string[];
  itinerary?: Array<{
    day: string;
    title: string;
    description: string;
  }>;
}

export interface TourCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  tours: Tour[];
}

export const tourCategories: TourCategory[] = [
  {
    id: 'hiking',
    name: 'Hiking',
    description: 'Day hikes and multi-day walking adventures through Azerbaijan\'s beautiful landscapes',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop',
    tours: [
      {
        id: 101,
        title: 'Shahdag Day Hike',
        description: 'Perfect day hike in Shahdag National Park with stunning mountain views and diverse wildlife.',
        duration: '1 day',
        groupSize: '2-12 people',
        difficulty: 'Easy',
        location: 'Shahdag National Park',
        price: '$89',
        rating: 4.7,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=600&h=400&fit=crop',
        category: 'hiking'
      },
      {
        id: 102,
        title: 'Gobustan Petroglyphs Hike',
        description: 'Explore ancient rock art and unique mud volcanoes on this cultural hiking experience.',
        duration: '1 day',
        groupSize: '2-15 people',
        difficulty: 'Easy',
        location: 'Gobustan National Park',
        price: '$75',
        rating: 4.6,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        category: 'hiking'
      },
      {
        id: 103,
        title: 'Khinalig Village Walk',
        description: 'Gentle hike around Europe\'s highest village with breathtaking Caucasus mountain views.',
        duration: '2 days',
        groupSize: '2-8 people',
        difficulty: 'Moderate',
        location: 'Khinalig Village',
        price: '$199',
        rating: 4.9,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
        category: 'hiking'
      }
    ]
  },
  {
    id: 'trekking',
    name: 'Trekking',
    description: 'Multi-day mountain expeditions and challenging cross-country treks',
    image: 'https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=600&h=400&fit=crop',
    tours: [
      {
        id: 201,
        title: 'Laza to Laza Cross-Caucasus Trek',
        description: '3-day circular trek through pristine Caucasus wilderness visiting remote villages and stunning landscapes.',
        duration: '3 days',
        groupSize: '2-8 people',
        difficulty: 'Challenging',
        location: 'Greater Caucasus',
        price: '$399',
        rating: 4.9,
        reviews: 42,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        category: 'trekking'
      },
      {
        id: 202,
        title: 'Haput to Galajig Cross-Caucasus Trek',
        description: '2-day challenging trek crossing the Greater Caucasus Mountains with spectacular alpine scenery.',
        duration: '2 days',
        groupSize: '2-6 people',
        difficulty: 'Challenging',
        location: 'Greater Caucasus',
        price: '$299',
        rating: 4.8,
        reviews: 28,
        image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=400&fit=crop',
        category: 'trekking'
      },
      {
        id: 203,
        title: 'Bazarduzu Summit Trek (4466m)',
        description: 'Conquer Azerbaijan\'s highest peak on this thrilling 3-day summit expedition with expert mountain guides.',
        duration: '3 days',
        groupSize: '2-6 people',
        difficulty: 'Expert',
        location: 'Bazarduzu Peak',
        price: '$599',
        rating: 4.9,
        reviews: 18,
        image: 'https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=600&h=400&fit=crop',
        category: 'trekking'
      },
      {
        id: 1,
        title: 'Khinalig-Laza Homestay Trek',
        description: 'Experience authentic village life while trekking through Azerbaijan\'s most remote mountain villages.',
        duration: '3 days',
        groupSize: '2-8 people',
        difficulty: 'Moderate',
        location: 'Khinalig Village',
        price: '$299',
        rating: 4.9,
        reviews: 127,
        image: 'https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=600&h=400&fit=crop',
        category: 'trekking'
      }
    ]
  },
  {
    id: 'wildlife',
    name: 'Wildlife',
    description: 'Nature tours focused on observing and learning about Azerbaijan\'s diverse wildlife',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    tours: [
      {
        id: 301,
        title: 'Caucasus Wildlife Safari',
        description: 'Discover the incredible biodiversity of the Caucasus mountains with our expert naturalist guides.',
        duration: '4 days',
        groupSize: '2-10 people',
        difficulty: 'Easy',
        location: 'Caucasus Mountains',
        price: '$399',
        rating: 4.9,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
        category: 'wildlife'
      },
      {
        id: 302,
        title: 'Shirvan Bird Watching Tour',
        description: 'Explore Azerbaijan\'s premier birding destination with over 200 species in diverse habitats.',
        duration: '2 days',
        groupSize: '2-8 people',
        difficulty: 'Easy',
        location: 'Shirvan National Park',
        price: '$249',
        rating: 4.7,
        reviews: 54,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        category: 'wildlife'
      },
      {
        id: 303,
        title: 'Caspian Seal Conservation Tour',
        description: 'Learn about marine conservation while observing endangered Caspian seals in their natural habitat.',
        duration: '1 day',
        groupSize: '2-12 people',
        difficulty: 'Easy',
        location: 'Caspian Sea Coast',
        price: '$149',
        rating: 4.8,
        reviews: 36,
        image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=400&fit=crop',
        category: 'wildlife'
      }
    ]
  },
  {
    id: 'group-tours',
    name: 'Group Tours',
    description: 'Scheduled group departures perfect for solo travelers and small groups',
    image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=400&fit=crop',
    tours: [
      {
        id: 401,
        title: 'Classic Azerbaijan Group Adventure',
        description: 'Perfect introduction to Azerbaijan\'s highlights with a friendly group of fellow adventurers.',
        duration: '5 days',
        groupSize: '8-12 people',
        difficulty: 'Moderate',
        location: 'Multiple regions',
        price: '$599',
        rating: 4.8,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=600&h=400&fit=crop',
        category: 'group-tours'
      },
      {
        id: 402,
        title: 'Weekend Warriors Group Trek',
        description: 'Join like-minded adventurers for an action-packed weekend of mountain exploration.',
        duration: '2 days',
        groupSize: '6-10 people',
        difficulty: 'Moderate',
        location: 'Guba Region',
        price: '$199',
        rating: 4.7,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        category: 'group-tours'
      }
    ]
  },
  {
    id: 'tailor-made',
    name: 'Tailor-made',
    description: 'Custom adventures designed specifically for your group\'s interests and abilities',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    tours: [
      {
        id: 501,
        title: 'Custom Mountain Expedition',
        description: 'Design your perfect mountain adventure with our expert guides based on your experience level.',
        duration: 'Flexible',
        groupSize: '1-15 people',
        difficulty: 'Varies',
        location: 'Your choice',
        price: 'From $150/day',
        rating: 4.9,
        reviews: 73,
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
        category: 'tailor-made'
      },
      {
        id: 502,
        title: 'Private Family Adventure',
        description: 'Family-friendly customized tours with activities suitable for all ages and fitness levels.',
        duration: '1-7 days',
        groupSize: '2-8 people',
        difficulty: 'Easy',
        location: 'Multiple options',
        price: 'From $120/day',
        rating: 4.8,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=400&fit=crop',
        category: 'tailor-made'
      },
      {
        id: 503,
        title: 'Photography Expedition',
        description: 'Custom photography tours designed to capture Azerbaijan\'s most stunning landscapes and wildlife.',
        duration: '2-5 days',
        groupSize: '1-6 people',
        difficulty: 'Easy',
        location: 'Best photo spots',
        price: 'From $200/day',
        rating: 4.9,
        reviews: 29,
        image: 'https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=600&h=400&fit=crop',
        category: 'tailor-made'
      }
    ]
  }
];

// Flatten all tours for search/general listing
export const allTours: Tour[] = tourCategories.flatMap(category => category.tours);

// Get tours by category
export const getToursByCategory = (categoryId: string): Tour[] => {
  const category = tourCategories.find(cat => cat.id === categoryId);
  return category ? category.tours : [];
};

// Get single tour by ID
export const getTourById = (id: number): Tour | undefined => {
  return allTours.find(tour => tour.id === id);
};

// Get category info
export const getCategoryById = (categoryId: string): TourCategory | undefined => {
  return tourCategories.find(cat => cat.id === categoryId);
};