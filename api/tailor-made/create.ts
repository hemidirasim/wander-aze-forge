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
      email,
      fullName,
      adventureTypes,
      destinations,
      startDate,
      duration,
      dailyKilometers,
      numberOfPeople,
      childrenAges,
      accommodationPreferences,
      budget,
      additionalDetails,
      agreeToTerms
    } = req.body;

    // Validation
    if (!email || !fullName || !adventureTypes || !destinations || !startDate || 
        !duration || !dailyKilometers || !numberOfPeople || !accommodationPreferences || 
        !budget || !additionalDetails || !agreeToTerms) {
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

    // Validate terms agreement
    if (!agreeToTerms) {
      return res.status(400).json({
        success: false,
        error: 'You must agree to the terms and conditions'
      });
    }

    // Ensure tailor_made_requests table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tailor_made_requests'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Create table if it doesn't exist
      await pool.query(`
        CREATE TABLE tailor_made_requests (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          adventure_types TEXT[] NOT NULL,
          destinations TEXT NOT NULL,
          start_date DATE NOT NULL,
          duration VARCHAR(100) NOT NULL,
          daily_kilometers VARCHAR(100) NOT NULL,
          number_of_people VARCHAR(100) NOT NULL,
          children_ages TEXT,
          accommodation_preferences TEXT[] NOT NULL,
          budget VARCHAR(255) NOT NULL,
          additional_details TEXT NOT NULL,
          agree_to_terms BOOLEAN NOT NULL DEFAULT false,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('tailor_made_requests table created successfully');
    }

    // Insert the tailor-made request
    const result = await pool.query(`
      INSERT INTO tailor_made_requests (
        email, full_name, adventure_types, destinations, start_date,
        duration, daily_kilometers, number_of_people, children_ages,
        accommodation_preferences, budget, additional_details, agree_to_terms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, email, full_name, adventure_types, destinations, start_date,
                duration, daily_kilometers, number_of_people, children_ages,
                accommodation_preferences, budget, additional_details, agree_to_terms,
                status, created_at
    `, [
      email,
      fullName,
      adventureTypes, // Array
      destinations,
      startDate,
      duration,
      dailyKilometers,
      numberOfPeople,
      childrenAges || null,
      accommodationPreferences, // Array
      budget,
      additionalDetails,
      agreeToTerms
    ]);

    const tailorMadeRequest = result.rows[0];
    console.log('Tailor-made request created successfully:', { id: tailorMadeRequest.id, email });

    return res.status(201).json({
      success: true,
      data: tailorMadeRequest,
      message: 'Your tailor-made request has been submitted successfully! We will get back to you within 24 hours with a custom itinerary.'
    });

  } catch (error) {
    console.error('Tailor-made request submission error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to submit tailor-made request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
