import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');

    const { 
      tourId, 
      tourTitle, 
      tourCategory, 
      tourDate, 
      participants, 
      totalPrice, 
      specialRequests, 
      emergencyContactName, 
      emergencyContactPhone 
    } = req.body;

    // Validation
    if (!tourId || !tourTitle || !tourCategory || !tourDate || !participants || !totalPrice) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tourId, tourTitle, tourCategory, tourDate, participants, totalPrice'
      });
    }

    if (participants < 1 || participants > 20) {
      return res.status(400).json({
        success: false,
        error: 'Number of participants must be between 1 and 20'
      });
    }

    if (totalPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Total price must be greater than 0'
      });
    }

    // Ensure bookings table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tour_id INTEGER NOT NULL,
        tour_title VARCHAR(255) NOT NULL,
        tour_category VARCHAR(100) NOT NULL,
        tour_date DATE NOT NULL,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        participants INTEGER NOT NULL CHECK (participants > 0 AND participants <= 20),
        total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        special_requests TEXT,
        emergency_contact_name VARCHAR(100),
        emergency_contact_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create booking
    const result = await pool.query(`
      INSERT INTO bookings (
        user_id, tour_id, tour_title, tour_category, tour_date, 
        participants, total_price, special_requests, 
        emergency_contact_name, emergency_contact_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, tour_title, tour_category, tour_date, booking_date, 
                participants, total_price, status, special_requests,
                emergency_contact_name, emergency_contact_phone, created_at
    `, [
      decoded.userId,
      tourId,
      tourTitle,
      tourCategory,
      tourDate,
      participants,
      totalPrice,
      specialRequests || null,
      emergencyContactName || null,
      emergencyContactPhone || null
    ]);

    const booking = result.rows[0];

    console.log('Booking created successfully:', { id: booking.id, userId: decoded.userId });

    return res.status(201).json({
      success: true,
      data: booking,
      message: 'Tour booked successfully! You will receive a confirmation email shortly.'
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    
    if (error instanceof Error && error.message.includes('jwt')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        message: 'Please log in again'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
