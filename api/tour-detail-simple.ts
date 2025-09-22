import { Pool } from 'pg';

export async function GET(request: Request) {
  let pool: Pool | null = null;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Tour ID is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!process.env.DATABASE_URL) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Database connection not configured' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await pool.query('SELECT 1');

    // Get tour details - simplified query
    const tourQuery = `
      SELECT 
        id, title, description, price, duration, difficulty, rating, 
        reviews_count, group_size, location, image_url, category,
        highlights, includes, excludes, is_active, featured
      FROM tours 
      WHERE id = $1
    `;
    
    const tourResult = await pool.query(tourQuery, [id]);
    
    if (tourResult.rows.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Tour not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tour = tourResult.rows[0];

    // Parse JSON fields safely
    const parsedTour = {
      ...tour,
      highlights: tour.highlights ? (typeof tour.highlights === 'string' ? JSON.parse(tour.highlights) : tour.highlights) : [],
      includes: tour.includes ? (typeof tour.includes === 'string' ? JSON.parse(tour.includes) : tour.includes) : [],
      excludes: tour.excludes ? (typeof tour.excludes === 'string' ? JSON.parse(tour.excludes) : tour.excludes) : [],
      // Add default values for missing fields
      overview: tour.description,
      best_season: 'All year round',
      meeting_point: 'TBD',
      languages: 'English, Azerbaijani',
      accommodation_details: 'Accommodation details will be provided',
      meals_details: 'Meal details will be provided',
      water_snacks_details: 'Water and snacks provided',
      provided_equipment: ['All necessary equipment provided'],
      what_to_bring: ['Personal items', 'Comfortable clothing'],
      transport_details: 'Transportation details will be provided',
      pickup_service: 'Pickup service available',
      gallery_images: [tour.image_url || '/placeholder-tour.jpg'],
      photography_service: 'Photography service available',
      price_includes: tour.includes || ['Professional guide', 'All equipment'],
      group_discounts: 'Group discounts available for 6+ people',
      early_bird_discount: 'Early bird discounts available',
      contact_phone: '+994 XX XXX XX XX',
      booking_terms: 'Booking terms will be provided',
      itinerary: 'Detailed itinerary will be provided',
      requirements: 'Basic fitness level required',
      special_fields: {}
    };

    return new Response(JSON.stringify({
      success: true,
      data: {
        tour: parsedTour,
        programs: [] // Empty programs array for now
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching tour detail:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    if (pool) {
      try {
        await pool.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}
