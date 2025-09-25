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
    // Ensure reviews table exists
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
    }
    
    client.release();
    if (req.method === 'GET') {
      const { featured } = req.query;
      
      let query = 'SELECT * FROM reviews';
      const params = [];
      
      if (featured === 'true') {
        query += ' WHERE is_featured = true';
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, params);
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } 
    else if (req.method === 'POST') {
      const { name, rating, review_text, source, source_logo, source_url, is_featured } = req.body;
      
      if (!name || !rating || !review_text || !source) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, rating, review_text, source'
        });
      }
      
      const result = await pool.query(
        `INSERT INTO reviews (name, rating, review_text, source, source_logo, source_url, is_featured) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [name, rating, review_text, source, source_logo || null, source_url || null, is_featured || false]
      );
      
      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    }
    else if (req.method === 'PUT') {
      const { id, name, rating, review_text, source, source_logo, source_url, is_featured } = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Review ID is required'
        });
      }
      
      const result = await pool.query(
        `UPDATE reviews 
         SET name = $1, rating = $2, review_text = $3, source = $4, source_logo = $5, source_url = $6, is_featured = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8 
         RETURNING *`,
        [name, rating, review_text, source, source_logo, source_url, is_featured, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    }
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Review ID is required'
        });
      }
      
      const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    }
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
