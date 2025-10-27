import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tourId, reviewerName, rating, comment, photos } = body;

    // Validate required fields
    if (!tourId || !reviewerName || !rating || !comment) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: tourId, reviewerName, rating, comment'
      }, { status: 400 });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    const client = await pool.connect();

    try {
      // Check if tour exists
      const tourCheck = await client.query(
        'SELECT id, title FROM tours WHERE id = $1',
        [tourId]
      );

      if (tourCheck.rows.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Tour not found'
        }, { status: 404 });
      }

      // Insert review into database
      const insertQuery = `
        INSERT INTO tour_reviews (
          tour_id, 
          reviewer_name, 
          rating, 
          comment, 
          photos, 
          created_at, 
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id, created_at
      `;

      const photosJson = photos && photos.length > 0 ? JSON.stringify(photos) : null;

      const result = await client.query(insertQuery, [
        tourId,
        reviewerName,
        rating,
        comment,
        photosJson
      ]);

      const reviewId = result.rows[0].id;
      const createdAt = result.rows[0].created_at;

      return NextResponse.json({
        success: true,
        data: {
          reviewId,
          tourId,
          reviewerName,
          rating,
          comment,
          photos: photos || [],
          createdAt
        },
        message: 'Review submitted successfully'
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tourId = searchParams.get('tourId');

    if (!tourId) {
      return NextResponse.json({
        success: false,
        error: 'Tour ID is required'
      }, { status: 400 });
    }

    const client = await pool.connect();

    try {
      // Get reviews for specific tour
      const query = `
        SELECT 
          id,
          tour_id,
          reviewer_name,
          rating,
          comment,
          photos,
          created_at,
          updated_at
        FROM tour_reviews 
        WHERE tour_id = $1 
        ORDER BY created_at DESC
      `;

      const result = await client.query(query, [tourId]);

      const reviews = result.rows.map(row => ({
        id: row.id,
        tourId: row.tour_id,
        reviewerName: row.reviewer_name,
        rating: row.rating,
        comment: row.comment,
        photos: row.photos ? JSON.parse(row.photos) : [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return NextResponse.json({
        success: true,
        data: reviews
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
