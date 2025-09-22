import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET(request: NextRequest) {
  try {
    console.log('Tours by category API called');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    console.log('Category parameter:', category);

    if (!category) {
      console.log('No category provided');
      return NextResponse.json({ 
        success: false, 
        error: 'Category is required' 
      }, { status: 400 });
    }

    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('DATABASE_URL not found');
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    console.log('Creating database connection...');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Fetch tours by category
    const toursQuery = `
      SELECT 
        id, title, description, price, duration, difficulty, rating, 
        reviews_count, group_size, location, image_url, category,
        highlights, includes, excludes, is_active, featured,
        created_at, updated_at
      FROM tours 
      WHERE category = $1 AND is_active = true
      ORDER BY featured DESC, created_at DESC
    `;
    
    console.log('Executing query for category:', category);
    const toursResult = await pool.query(toursQuery, [category]);
    console.log('Query executed, found tours:', toursResult.rows.length);
    
    // Parse JSON fields safely
    const tours = toursResult.rows.map(tour => {
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
        category: category,
        tours: tours
      }
    });

  } catch (error) {
    console.error('Error fetching tours by category:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}
