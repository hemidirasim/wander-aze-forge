import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Test tours API called');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    console.log('Category parameter:', category);

    // Return mock data for testing
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
        category: category || "hiking",
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
        category: category || "hiking",
        highlights: ["Ancient village", "Cultural experience", "Mountain trekking"],
        includes: ["Professional guide", "Accommodation", "All meals"],
        excludes: ["Personal items"],
        is_active: true,
        featured: false
      }
    ];

    console.log('Returning mock tours:', mockTours.length);
    return NextResponse.json({
      success: true,
      data: {
        category: category || "hiking",
        tours: mockTours
      }
    });

  } catch (error) {
    console.error('Error in test tours API:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}
