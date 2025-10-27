import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  console.log('POST /api/tour-reviews called');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON in request body'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { tourId, reviewerName, rating, comment, photos } = body;

    // Validate required fields
    if (!tourId || !reviewerName || !rating || !comment) {
      console.log('Missing required fields:', { tourId, reviewerName, rating, comment });
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: tourId, reviewerName, rating, comment'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      console.log('Invalid rating:', rating);
      return new Response(JSON.stringify({
        success: false,
        error: 'Rating must be between 1 and 5'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Database connected successfully');

    try {
      // First, ensure table exists
      console.log('Ensuring tour_reviews table exists...');
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tour_reviews (
          id SERIAL PRIMARY KEY,
          tour_id INTEGER NOT NULL,
          reviewer_name VARCHAR(255) NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT NOT NULL,
          photos JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      await client.query(createTableQuery);
      console.log('Table creation/check completed');

      // Check if tour exists
      console.log('Checking if tour exists:', tourId);
      const tourCheck = await client.query(
        'SELECT id, title FROM tours WHERE id = $1',
        [tourId]
      );

      if (tourCheck.rows.length === 0) {
        console.log('Tour not found:', tourId);
        return new Response(JSON.stringify({
          success: false,
          error: 'Tour not found'
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log('Tour found:', tourCheck.rows[0]);

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
      console.log('Inserting review with data:', { tourId, reviewerName, rating, comment, photosJson });

      const result = await client.query(insertQuery, [
        tourId,
        reviewerName,
        rating,
        comment,
        photosJson
      ]);

      const reviewId = result.rows[0].id;
      const createdAt = result.rows[0].created_at;
      console.log('Review inserted successfully:', { reviewId, createdAt });

      return new Response(JSON.stringify({
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
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({
        success: false,
        error: `Database error: ${dbError.message}`
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } finally {
      client.release();
      console.log('Database connection released');
    }

  } catch (error) {
    console.error('General error submitting review:', error);
    return new Response(JSON.stringify({
      success: false,
      error: `Internal server error: ${error.message}`
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request: Request) {
  console.log('GET /api/tour-reviews called');
  
  try {
    const url = new URL(request.url);
    const tourId = url.searchParams.get('tourId');
    console.log('Tour ID from params:', tourId);

    if (!tourId) {
      console.log('No tour ID provided');
      return new Response(JSON.stringify({
        success: false,
        error: 'Tour ID is required'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Database connected successfully');

    try {
      // First, ensure table exists
      console.log('Ensuring tour_reviews table exists...');
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tour_reviews (
          id SERIAL PRIMARY KEY,
          tour_id INTEGER NOT NULL,
          reviewer_name VARCHAR(255) NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT NOT NULL,
          photos JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      await client.query(createTableQuery);
      console.log('Table creation/check completed');

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

      console.log('Executing query for tour ID:', tourId);
      const result = await client.query(query, [tourId]);
      console.log('Query result:', result.rows.length, 'reviews found');

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

      console.log('Processed reviews:', reviews);

      return new Response(JSON.stringify({
        success: true,
        data: reviews
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({
        success: false,
        error: `Database error: ${dbError.message}`
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } finally {
      client.release();
      console.log('Database connection released');
    }

  } catch (error) {
    console.error('General error fetching reviews:', error);
    return new Response(JSON.stringify({
      success: false,
      error: `Internal server error: ${error.message}`
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
