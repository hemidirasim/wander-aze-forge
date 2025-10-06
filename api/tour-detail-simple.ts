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
        highlights, includes, excludes, is_active, featured,
        tour_programs, overview, best_season, meeting_point, languages,
        accommodation_details, meals_details, water_snacks_details,
        provided_equipment, what_to_bring, transport_details, pickup_service,
        gallery_images, photography_service, price_includes, group_discounts,
        early_bird_discount, contact_phone, booking_terms, itinerary,
        requirements, special_fields, participant_pricing, max_participants,
        total_hiking_distance, total_elevation_gain, total_elevation_loss
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
      tour_programs: tour.tour_programs ? (typeof tour.tour_programs === 'string' ? JSON.parse(tour.tour_programs) : tour.tour_programs) : [],
      provided_equipment: tour.provided_equipment ? (typeof tour.provided_equipment === 'string' ? JSON.parse(tour.provided_equipment) : tour.provided_equipment) : [],
      what_to_bring: tour.what_to_bring ? (typeof tour.what_to_bring === 'string' ? JSON.parse(tour.what_to_bring) : tour.what_to_bring) : [],
      gallery_images: tour.gallery_images ? (typeof tour.gallery_images === 'string' ? JSON.parse(tour.gallery_images) : tour.gallery_images) : [tour.image_url || '/placeholder-tour.jpg'],
      price_includes: tour.price_includes ? (typeof tour.price_includes === 'string' ? JSON.parse(tour.price_includes) : tour.price_includes) : [],
      participant_pricing: tour.participant_pricing ? (typeof tour.participant_pricing === 'string' ? JSON.parse(tour.participant_pricing) : tour.participant_pricing) : [],
      // Use actual database values or defaults
      overview: tour.overview || tour.description,
      best_season: tour.best_season || 'All year round',
      meeting_point: tour.meeting_point || 'TBD',
      languages: tour.languages || 'English, Azerbaijani',
      accommodation_details: tour.accommodation_details || 'Accommodation details will be provided',
      meals_details: tour.meals_details || 'Meal details will be provided',
      water_snacks_details: tour.water_snacks_details || 'Water and snacks provided',
      transport_details: tour.transport_details || 'Transportation details will be provided',
      pickup_service: tour.pickup_service || 'Pickup service available',
      photography_service: tour.photography_service || 'Photography service available',
      group_discounts: tour.group_discounts || 'Group discounts available for 6+ people',
      early_bird_discount: tour.early_bird_discount || 'Early bird discounts available',
      contact_phone: tour.contact_phone || '+994 XX XXX XX XX',
      booking_terms: tour.booking_terms || 'Booking terms will be provided',
      itinerary: tour.itinerary || 'Detailed itinerary will be provided',
      requirements: tour.requirements || 'Basic fitness level required',
      special_fields: tour.special_fields || {}
    };

    return new Response(JSON.stringify({
      success: true,
      data: {
        tour: parsedTour,
        programs: parsedTour.tour_programs || [] // Use tour_programs from database
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
