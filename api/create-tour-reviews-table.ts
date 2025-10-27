import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();

    try {
      // Create tour_reviews table
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

      // Create index for better performance
      const createIndexQuery = `
        CREATE INDEX IF NOT EXISTS idx_tour_reviews_tour_id 
        ON tour_reviews(tour_id);
      `;

      await client.query(createIndexQuery);

      // Create index for rating
      const createRatingIndexQuery = `
        CREATE INDEX IF NOT EXISTS idx_tour_reviews_rating 
        ON tour_reviews(rating);
      `;

      await client.query(createRatingIndexQuery);

      return new Response(JSON.stringify({
        success: true,
        message: 'Tour reviews table created successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error creating tour_reviews table:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create tour_reviews table'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
