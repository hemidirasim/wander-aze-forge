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
    
    // Get user bookings
    const result = await pool.query(`
      SELECT 
        id,
        tour_id,
        tour_title,
        tour_category,
        booking_date,
        tour_date,
        participants,
        total_price,
        status,
        special_requests,
        emergency_contact_name,
        emergency_contact_phone,
        created_at
      FROM bookings 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [decoded.userId]);

    const bookings = result.rows.map(booking => ({
      id: booking.id,
      tourId: booking.tour_id,
      tourTitle: booking.tour_title,
      tourCategory: booking.tour_category,
      bookingDate: booking.booking_date,
      tourDate: booking.tour_date,
      participants: booking.participants,
      totalPrice: parseFloat(booking.total_price),
      status: booking.status,
      specialRequests: booking.special_requests,
      emergencyContactName: booking.emergency_contact_name,
      emergencyContactPhone: booking.emergency_contact_phone,
      createdAt: booking.created_at
    }));

    return res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Bookings fetch error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
