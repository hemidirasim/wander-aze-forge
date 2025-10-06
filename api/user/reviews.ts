import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    
    // Get user reviews
    const result = await pool.query(`
      SELECT 
        ur.id,
        ur.tour_id,
        ur.rating,
        ur.review_text,
        ur.is_public,
        ur.created_at,
        b.tour_title
      FROM user_reviews ur
      JOIN bookings b ON ur.booking_id = b.id
      WHERE ur.user_id = $1
      ORDER BY ur.created_at DESC
    `, [decoded.userId]);

    const reviews = result.rows.map(review => ({
      id: review.id,
      tourId: review.tour_id,
      tourTitle: review.tour_title,
      rating: review.rating,
      reviewText: review.review_text,
      isPublic: review.is_public,
      createdAt: review.created_at
    }));

    return res.status(200).json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error('Reviews fetch error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

