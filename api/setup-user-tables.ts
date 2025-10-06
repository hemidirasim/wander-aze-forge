import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

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
    console.log('Setting up user tables...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        country VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tour_id INTEGER NOT NULL,
        tour_title VARCHAR(255) NOT NULL,
        tour_category VARCHAR(100) NOT NULL,
        booking_date DATE NOT NULL,
        tour_date DATE NOT NULL,
        participants INTEGER NOT NULL DEFAULT 1,
        total_price DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        special_requests TEXT,
        emergency_contact_name VARCHAR(100),
        emergency_contact_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        tour_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_favorites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tour_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, tour_id)
      )
    `);

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON bookings(tour_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_reviews_user_id ON user_reviews(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id)');

    console.log('User tables created successfully');

    return res.status(200).json({
      success: true,
      message: 'User tables created successfully',
      tables: [
        'users - User accounts and profiles',
        'bookings - Tour bookings and reservations',
        'user_reviews - User reviews for completed tours',
        'user_favorites - User favorite tours'
      ]
    });

  } catch (error) {
    console.error('Error setting up user tables:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to setup user tables',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

