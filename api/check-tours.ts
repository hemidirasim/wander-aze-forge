import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET(request: NextRequest) {
  let pool: Pool | null = null;
  
  try {
    console.log('Check tours API called');
    
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('DATABASE_URL not found');
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection not configured' 
      }, { status: 500 });
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

    // Get all tours
    const allToursQuery = `
      SELECT 
        id, title, description, price, duration, difficulty, rating, 
        reviews_count, group_size, location, image_url, category,
        highlights, includes, excludes, is_active, featured,
        created_at, updated_at
      FROM tours 
      ORDER BY created_at DESC
    `;
    
    console.log('Executing query for all tours...');
    const allToursResult = await pool.query(allToursQuery);
    console.log('Query executed, found tours:', allToursResult.rows.length);
    
    // Get tours by category
    const categoryQuery = `
      SELECT 
        category, COUNT(*) as count
      FROM tours 
      WHERE is_active = true
      GROUP BY category
      ORDER BY category
    `;
    
    const categoryResult = await pool.query(categoryQuery);
    console.log('Categories found:', categoryResult.rows);
    
    // Parse JSON fields safely
    const tours = allToursResult.rows.map(tour => {
      try {
        return {
          ...tour,
          highlights: tour.highlights ? (typeof tour.highlights === 'string' ? JSON.parse(tour.highlights) : tour.highlights) : [],
          includes: tour.includes ? (typeof tour.includes === 'string' ? JSON.parse(tour.includes) : tour.includes) : [],
          excludes: tour.excludes ? (typeof tour.excludes === 'string' ? JSON.parse(tour.excludes) : tour.excludes) : [],
        };
      } catch (parseError) {
        console.error('Error parsing JSON fields for tour:', tour.id, parseError);
        return {
          ...tour,
          highlights: [],
          includes: [],
          excludes: [],
        };
      }
    });

    console.log('Returning tours:', tours.length);
    return NextResponse.json({
      success: true,
      data: {
        total_tours: tours.length,
        active_tours: tours.filter(t => t.is_active).length,
        categories: categoryResult.rows,
        tours: tours
      }
    });

  } catch (error) {
    console.error('Error checking tours:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
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
