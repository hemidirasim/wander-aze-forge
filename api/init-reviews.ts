import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_cuU7z3plExsy@ep-winter-shadow-ad30554v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(dbConfig);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Create reviews table if it doesn't exist
    await pool.query(`
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
    await pool.query(`
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
      ),
      (
        'Emma Wilson',
        5,
        'Best adventure tour company in Azerbaijan! Professional guides, stunning locations, and excellent value for money. Will definitely book again on my next visit.',
        'Booking.com',
        'https://cf.bstatic.com/static/img/logo/booking_logo_retina/logo_booking_retina.png',
        'https://www.booking.com/attractions/az/outtour-az.html',
        true
      ),
      (
        'David Rodriguez',
        5,
        'Exceptional experience from start to finish. The guides were professional, the equipment was top-quality, and the locations were absolutely stunning. Highly recommended!',
        'GetYourGuide',
        'https://cdn.getyourguide.com/img/logo/gyg-logo.svg',
        'https://www.getyourguide.com/outtour-az',
        true
      ),
      (
        'Lisa Anderson',
        5,
        'Amazing tour company! The guides were incredibly knowledgeable about the local area and made sure we felt safe throughout the entire adventure. The views were absolutely breathtaking.',
        'Viator',
        'https://www.viator.com/images/branding/viator-logo.svg',
        'https://www.viator.com/outtour-az',
        true
      ),
      (
        'James Thompson',
        5,
        'Outstanding service and incredible adventures! The team is professional, knowledgeable, and passionate about what they do. The Caucasus region is absolutely beautiful.',
        'Trustpilot',
        'https://cdn.trustpilot.net/brand-assets/logos/trustpilot-logo.svg',
        'https://www.trustpilot.com/review/outtour.az',
        true
      )
      ON CONFLICT DO NOTHING
    `);

    // Fetch all reviews to return
    const result = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
    
    return res.status(200).json({
      success: true,
      message: 'Reviews table created and populated successfully',
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error initializing reviews:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initialize reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
