import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category is required' 
      }, { status: 400 });
    }

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
    
    const toursResult = await pool.query(toursQuery, [category]);
    
    // Parse JSON fields
    const tours = toursResult.rows.map(tour => ({
      ...tour,
      highlights: tour.highlights ? JSON.parse(tour.highlights) : [],
      includes: tour.includes ? JSON.parse(tour.includes) : [],
      excludes: tour.excludes ? JSON.parse(tour.excludes) : [],
    }));

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
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
