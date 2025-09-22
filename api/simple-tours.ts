import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Simple tours API called');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    console.log('Category parameter:', category);

    if (!category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category is required' 
      }, { status: 400 });
    }

    // Return mock data based on category
    const mockTours = {
      hiking: [
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
        }
      ],
      wildlife: [
        {
          id: 301,
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
          id: 302,
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
        }
      ],
      trekking: [
        {
          id: 201,
          title: "Bazarduzu Summit Trek",
          description: "Challenge yourself with this demanding trek to Azerbaijan's highest peak.",
          price: "$199",
          duration: "4 days",
          difficulty: "Expert",
          rating: 4.9,
          reviews_count: 45,
          group_size: "4-6 people",
          location: "Bazarduzu Peak",
          image_url: "https://images.unsplash.com/photo-1464822759844-d150baec5b2e?w=400&h=300&fit=crop",
          category: "trekking",
          highlights: ["Highest peak in Azerbaijan", "Alpine experience", "Mountain camping"],
          includes: ["Professional guide", "All camping equipment", "All meals"],
          excludes: ["Personal items"],
          is_active: true,
          featured: true
        }
      ],
      "group-tours": [
        {
          id: 401,
          title: "Azerbaijan Adventure Group",
          description: "Perfect for groups wanting to explore Azerbaijan together.",
          price: "$299",
          duration: "5 days",
          difficulty: "Moderate",
          rating: 4.8,
          reviews_count: 203,
          group_size: "12-20 people",
          location: "Multiple locations",
          image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          category: "group-tours",
          highlights: ["Group bonding", "Multiple destinations", "Cultural experiences"],
          includes: ["Professional guide", "All transportation", "All meals", "Accommodation"],
          excludes: ["Personal items"],
          is_active: true,
          featured: true
        }
      ]
    };

    const tours = mockTours[category as keyof typeof mockTours] || [];

    console.log('Returning tours for category:', category, 'Count:', tours.length);
    return NextResponse.json({
      success: true,
      data: {
        category: category,
        tours: tours
      }
    });

  } catch (error) {
    console.error('Error in simple tours API:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}
