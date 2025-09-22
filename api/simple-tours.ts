export async function GET() {
  try {
    console.log('Simple tours API called');
    
    // Hardcoded mock data for testing
    const mockTours = [
      {
        id: 101,
        title: "Shahdag Day Hike",
        description: "Experience the beauty of Shahdag National Park with this guided day hike.",
        price: "$89",
        duration: "1 day",
        difficulty: "Moderate",
        rating: 4.8,
        reviews_count: 127,
        group_size: "6-12 people",
        location: "Shahdag National Park",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        category: "hiking",
        highlights: ["Breathtaking mountain views", "Professional guide", "All equipment included"],
        includes: ["Professional guide", "Safety equipment", "Transportation"],
        excludes: ["Personal items", "Lunch"],
        is_active: true,
        featured: true
      },
      {
        id: 102,
        title: "Khinalig Village Trek",
        description: "Discover the ancient village of Khinalig on this cultural hiking adventure.",
        price: "$129",
        duration: "2 days",
        difficulty: "Challenging",
        rating: 4.9,
        reviews_count: 89,
        group_size: "4-8 people",
        location: "Khinalig Village",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        category: "hiking",
        highlights: ["Ancient village", "Cultural experience", "Mountain trekking"],
        includes: ["Professional guide", "Accommodation", "All meals"],
        excludes: ["Personal items"],
        is_active: true,
        featured: false
      },
      {
        id: 103,
        title: "Gobustan Petroglyphs Hike",
        description: "Explore ancient rock art and unique mud volcanoes on this cultural hiking experience.",
        price: "$75",
        duration: "1 day",
        difficulty: "Easy",
        rating: 4.6,
        reviews_count: 124,
        group_size: "2-15 people",
        location: "Gobustan National Park",
        image_url: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
        category: "hiking",
        highlights: ["Ancient rock art", "Mud volcanoes", "Cultural heritage"],
        includes: ["Professional guide", "Transportation", "Entry fees"],
        excludes: ["Personal items", "Lunch"],
        is_active: true,
        featured: false
      },
      {
        id: 201,
        title: "Caucasian Wildlife Safari",
        description: "Explore Azerbaijan's diverse wildlife in their natural habitat.",
        price: "$159",
        duration: "3 days",
        difficulty: "Easy",
        rating: 4.7,
        reviews_count: 156,
        group_size: "8-15 people",
        location: "Goygol National Park",
        image_url: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400&h=300&fit=crop",
        category: "wildlife",
        highlights: ["Wildlife spotting", "Bird watching", "Nature photography"],
        includes: ["Professional guide", "Binoculars", "Transportation", "Accommodation"],
        excludes: ["Camera equipment"],
        is_active: true,
        featured: true
      },
      {
        id: 202,
        title: "Bird Watching Tour",
        description: "Perfect for bird enthusiasts to spot rare species in Azerbaijan.",
        price: "$99",
        duration: "1 day",
        difficulty: "Easy",
        rating: 4.6,
        reviews_count: 78,
        group_size: "6-10 people",
        location: "Shirvan National Park",
        image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
        category: "wildlife",
        highlights: ["Rare bird species", "Expert ornithologist", "Photography opportunities"],
        includes: ["Professional guide", "Binoculars", "Transportation"],
        excludes: ["Camera equipment", "Lunch"],
        is_active: true,
        featured: false
      },
      {
        id: 203,
        title: "Caspian Seal Conservation Tour",
        description: "Learn about marine conservation while observing endangered Caspian seals.",
        price: "$149",
        duration: "1 day",
        difficulty: "Easy",
        rating: 4.8,
        reviews_count: 36,
        group_size: "2-12 people",
        location: "Caspian Sea Coast",
        image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
        category: "wildlife",
        highlights: ["Marine conservation", "Seal observation", "Educational experience"],
        includes: ["Professional guide", "Transportation", "Educational materials"],
        excludes: ["Camera equipment"],
        is_active: true,
        featured: false
      }
    ];
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        total_tours: mockTours.length,
        active_tours: mockTours.filter(t => t.is_active).length,
        tours: mockTours
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in simple tours API:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}