import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('=== FETCHING BOOKING REQUESTS ===');
    
    const result = await pool.query(`
      SELECT 
        id, user_id, tour_id, tour_title, tour_category, group_size, tour_price,
        customer_name, customer_email, customer_phone, country,
        booking_date, preferred_date, alternative_date, pickup_location, inform_later,
        special_requests, booking_request, terms_accepted, status, total_price,
        created_at, updated_at
      FROM bookings 
      ORDER BY created_at DESC
    `);

    console.log(`Found ${result.rows.length} booking requests`);

    return res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching booking requests:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch booking requests',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

