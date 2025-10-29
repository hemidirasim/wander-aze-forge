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
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      tourCategory,
      tourType,
      groupSize,
      dates,
      message,
      newsletter
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !country || !tourCategory || !groupSize || !dates || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Ensure contact_messages table exists with all required fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        country VARCHAR(100),
        tour_category VARCHAR(100),
        tour_type VARCHAR(255),
        group_size INTEGER,
        dates VARCHAR(255),
        message TEXT NOT NULL,
        newsletter BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert contact message
    const result = await pool.query(`
      INSERT INTO contact_messages (
        first_name, last_name, email, phone, country, 
        tour_category, tour_type, group_size, dates, 
        message, newsletter
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, first_name, last_name, name, email, phone, country, 
                tour_category, tour_type, group_size, dates, message, 
                newsletter, created_at
    `, [
      firstName,
      lastName,
      email,
      phone || null,
      country,
      tourCategory,
      tourType || null,
      parseInt(groupSize),
      dates,
      message,
      newsletter || false
    ]);

    const contactMessage = result.rows[0];

    console.log('Contact message created successfully:', { id: contactMessage.id, email });

    return res.status(201).json({
      success: true,
      data: contactMessage,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to submit contact form',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

