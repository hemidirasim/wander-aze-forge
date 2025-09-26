import { Pool } from 'pg';

export async function GET() {
  let pool: Pool | null = null;
  
  try {
    console.log('Check Null Fields API called');
    
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
    console.log('Database connection successful');

    // Check which fields are null in the latest tour
    const result = await pool.query(`
      SELECT 
        id, title, description, price, duration, difficulty, rating, 
        reviews_count, group_size, location, image_url, category,
        highlights, includes, excludes, is_active, featured,
        tour_programs, overview, best_season, meeting_point, languages,
        accommodation_details, meals_details, water_snacks_details,
        provided_equipment, what_to_bring, transport_details, pickup_service,
        gallery_images, photography_service, price_includes, group_discounts,
        early_bird_discount, contact_phone, booking_terms, itinerary,
        requirements, special_fields, max_participants, created_at, updated_at
      FROM tours 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    
    const tour = result.rows[0];
    const nullFields = [];
    const nonNullFields = [];
    
    // Check each field for null values
    Object.keys(tour).forEach(key => {
      if (tour[key] === null || tour[key] === undefined) {
        nullFields.push(key);
      } else {
        nonNullFields.push(key);
      }
    });
    
    console.log('Null fields:', nullFields);
    console.log('Non-null fields:', nonNullFields);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Database connection successful',
      tour: tour,
      nullFields: nullFields,
      nonNullFields: nonNullFields,
      nullCount: nullFields.length,
      totalFields: Object.keys(tour).length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in check null fields API:', error);
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
        console.log('Database connection closed');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}
