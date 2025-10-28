import { Pool } from 'pg';

export async function GET() {
  let pool: Pool | null = null;
  
  try {
    console.log('Test DB API called');
    
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('DATABASE_URL not found');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Database connection not configured' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Creating database connection...');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log('Database connection successful');

    // Ensure display_order column exists
    try {
      await pool.query(`
        ALTER TABLE tours 
        ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0
      `);
    } catch (columnError) {
      console.log('Column might already exist or error adding:', columnError);
    }

    // Get all tour data
    const result = await pool.query(`
      SELECT 
        id, title, description, price, duration, difficulty, rating, 
        reviews_count, group_size, max_participants, location, image_url, category,
        total_hiking_distance, total_elevation_gain, total_elevation_loss,
        highlights, includes, excludes, is_active, featured,
        COALESCE(display_order, 0) as display_order
      FROM tours 
      WHERE is_active = true
      ORDER BY display_order ASC, created_at DESC
    `);
    console.log('Query result:', result.rows);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Database connection successful',
      tours: result.rows
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in test DB API:', error);
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
