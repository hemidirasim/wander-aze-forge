import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/config/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test database connection
    const client = await pool.connect();
    
    // Check if reviews table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'reviews'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    
    if (!tableExists) {
      // Create reviews table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT NOT NULL,
          source VARCHAR(100) NOT NULL,
          source_logo VARCHAR(500),
          source_url VARCHAR(500),
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert default reviews
      await client.query(`
        INSERT INTO reviews (name, rating, review_text, source, source_logo, source_url, is_featured) VALUES 
        (
          'Sarah Johnson',
          5,
          'Absolutely incredible experience! The guides were knowledgeable, the scenery was breathtaking, and everything was perfectly organized. Highly recommend Outtour.az for anyone looking to explore Azerbaijan''s natural beauty.',
          'TripAdvisor',
          'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg',
          'https://www.tripadvisor.com/Attraction_Review-g293934-d12345678-Reviews-Outtour_Azerbaijan-Baku_Absheron_Region.html',
          true
        ),
        (
          'Michael Chen',
          5,
          'Outstanding service and amazing adventures! The team went above and beyond to ensure we had an unforgettable experience. The Caucasus mountains are truly spectacular.',
          'Google Reviews',
          'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
          'https://www.google.com/maps/place/Outtour.az',
          true
        )
        ON CONFLICT DO NOTHING
      `);
    }
    
    client.release();
    
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      tableExists: tableExists,
      tableCreated: !tableExists
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
