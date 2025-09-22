import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('id');
    const category = searchParams.get('category');

    if (!tourId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tour ID is required' 
      }, { status: 400 });
    }

    // Fetch tour details
    const tourQuery = `
      SELECT 
        id, title, description, price, duration, difficulty, rating, 
        reviews_count, group_size, location, overview, best_season,
        meeting_point, languages, accommodation_details, meals_details,
        water_snacks_details, provided_equipment, what_to_bring,
        transport_details, pickup_service, gallery_images, 
        photography_service, price_includes, group_discounts,
        early_bird_discount, contact_phone, booking_terms,
        is_active, featured, image_url, category,
        highlights, includes, excludes, itinerary, requirements,
        special_fields, created_at, updated_at
      FROM tours 
      WHERE id = $1 AND is_active = true
    `;
    
    const tourResult = await pool.query(tourQuery, [tourId]);
    
    if (tourResult.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tour not found' 
      }, { status: 404 });
    }

    const tour = tourResult.rows[0];

    // Parse JSON fields
    const parsedTour = {
      ...tour,
      highlights: tour.highlights ? JSON.parse(tour.highlights) : [],
      includes: tour.includes ? JSON.parse(tour.includes) : [],
      excludes: tour.excludes ? JSON.parse(tour.excludes) : [],
      provided_equipment: tour.provided_equipment || [],
      what_to_bring: tour.what_to_bring || [],
      price_includes: tour.price_includes || [],
      gallery_images: tour.gallery_images || [],
      special_fields: tour.special_fields ? JSON.parse(tour.special_fields) : {},
    };

    // Fetch tour programs if available
    let programs = [];
    try {
      const programsQuery = `
        SELECT id, tour_id, day_number, title, description, activities, 
               meals, accommodation, transport, highlights, duration,
               difficulty_level, distance, elevation_gain, created_at
        FROM tour_programs 
        WHERE tour_id = $1 
        ORDER BY day_number ASC
      `;
      const programsResult = await pool.query(programsQuery, [tourId]);
      programs = programsResult.rows;
    } catch (error) {
      console.log('No tour programs found for tour:', tourId);
    }

    return NextResponse.json({
      success: true,
      data: {
        tour: parsedTour,
        programs: programs
      }
    });

  } catch (error) {
    console.error('Error fetching tour detail:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
