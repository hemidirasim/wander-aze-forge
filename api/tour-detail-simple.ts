import { Pool } from 'pg';

export async function GET(request: Request) {
  let pool: Pool | null = null;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');

    if (!id && !slug) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Tour ID or slug is required' 
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

    // Ensure booked_seats column exists
    try {
      await pool.query(`
        ALTER TABLE tours 
        ADD COLUMN IF NOT EXISTS booked_seats INTEGER DEFAULT 0
      `);
    } catch (columnError) {
      console.log('Column might already exist:', columnError);
    }

    // Get tour details - simplified query (support both ID and slug)
    const tourQuery = `
      SELECT 
        id, title, slug, description, price, duration, difficulty, rating, 
        reviews_count, group_size, location, image_url, category,
        highlights, includes, excludes, is_active, featured,
        tour_programs, overview, best_season, meeting_point, languages,
        accommodation_details, meals_details, water_snacks_details,
        provided_equipment, what_to_bring, transport_details, pickup_service,
        gallery_images, photography_service, price_includes, group_discounts,
        early_bird_discount, contact_phone, booking_terms, itinerary,
        requirements, special_fields, participant_pricing, max_participants, booked_seats,
        total_hiking_distance, total_elevation_gain, total_elevation_loss,
        start_date, end_date
      FROM tours 
      WHERE ${slug ? 'slug = $1' : 'id = $1'}
    `;
    
    const tourResult = await pool.query(tourQuery, [slug || id]);
    
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
      tour_programs: [], // Daily Schedule excluded
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
      accommodation_details: tour.accommodation_details || null,
      meals_details: tour.meals_details || null,
      water_snacks_details: tour.water_snacks_details || null,
      transport_details: tour.transport_details || null,
      pickup_service: tour.pickup_service || 'Pickup service available',
      photography_service: tour.photography_service || 'Photography service available',
      group_discounts: tour.group_discounts || 'Group discounts available for 6+ people',
      early_bird_discount: tour.early_bird_discount || 'Early bird discounts available',
      contact_phone: tour.contact_phone || '+994 XX XXX XX XX',
      booking_terms: tour.booking_terms || 'Booking terms will be provided',
      itinerary: tour.itinerary || 'Detailed itinerary will be provided',
      requirements: tour.requirements || 'Basic fitness level required',
      special_fields: tour.special_fields || {},
      max_participants: tour.max_participants || null,
      booked_seats: tour.booked_seats || 0,
      total_hiking_distance: tour.total_hiking_distance || null,
      total_elevation_gain: tour.total_elevation_gain || null,
      total_elevation_loss: tour.total_elevation_loss || null
    };

    return new Response(JSON.stringify({
      success: true,
      data: {
        tour: parsedTour
        // Removed programs field - Daily Schedule excluded
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
