import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import { sendEmail, tailorMadeConfirmationTemplate } from '../_lib/email.js';

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
    console.log('=== TAILOR-MADE REQUEST RECEIVED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

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

    console.log('Extracted fields:', {
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
    });

    // Validation
    if (!email || !fullName || !adventureTypes || !destinations || !startDate || 
        !duration || !dailyKilometers || !numberOfPeople || !accommodationPreferences || 
        !budget || !additionalDetails || agreeToTerms === undefined) {
      console.error('Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        received: {
          email: !!email,
          fullName: !!fullName,
          adventureTypes: !!adventureTypes,
          destinations: !!destinations,
          startDate: !!startDate,
          duration: !!duration,
          dailyKilometers: !!dailyKilometers,
          numberOfPeople: !!numberOfPeople,
          accommodationPreferences: !!accommodationPreferences,
          budget: !!budget,
          additionalDetails: !!additionalDetails,
          agreeToTerms: agreeToTerms
        }
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
    console.log('Checking if tailor_made_requests table exists...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tailor_made_requests'
      );
    `);

    console.log('Table exists:', tableCheck.rows[0].exists);

    if (!tableCheck.rows[0].exists) {
      console.log('Creating tailor_made_requests table...');
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

    // Validate arrays are actually arrays
    const adventureTypesArray = Array.isArray(adventureTypes) ? adventureTypes : [adventureTypes];
    const accommodationPrefsArray = Array.isArray(accommodationPreferences) 
      ? accommodationPreferences 
      : [accommodationPreferences];

    console.log('Prepared data for insert:', {
      email,
      fullName,
      adventureTypesArray,
      destinations,
      startDate,
      duration,
      dailyKilometers,
      numberOfPeople,
      childrenAges: childrenAges || null,
      accommodationPrefsArray,
      budget,
      additionalDetails,
      agreeToTerms
    });

    // Insert the tailor-made request
    console.log('Inserting into database...');
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
      adventureTypesArray, // Array
      destinations,
      startDate,
      duration,
      dailyKilometers,
      numberOfPeople,
      childrenAges || null,
      accommodationPrefsArray, // Array
      budget,
      additionalDetails,
      agreeToTerms
    ]);

    const tailorMadeRequest = result.rows[0];
    console.log('Tailor-made request created successfully:', { id: tailorMadeRequest.id, email });

    // Send confirmation email (non-blocking)
    try {
      await sendEmail({
        to: email,
        cc: 'info@outtour.az',
        subject: 'We received your tailor-made request - Outtour Azerbaijan',
        html: tailorMadeConfirmationTemplate({
          fullName,
          startDate,
          numberOfPeople,
          destinations,
        })
      });
    } catch (e) {
      console.error('Tailor-made confirmation email error:', e);
    }

    return res.status(201).json({
      success: true,
      data: tailorMadeRequest,
      message: 'Your tailor-made request has been submitted successfully! We will get back to you within 24 hours with a custom itinerary.'
    });

  } catch (error: any) {
    console.error('=== TAILOR-MADE REQUEST ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error detail:', error?.detail);
    console.error('Error stack:', error?.stack);
    
    // Check if it's a database error
    if (error?.code === '42P01') {
      return res.status(500).json({
        success: false,
        error: 'Database table does not exist',
        message: 'The tailor_made_requests table does not exist. Please run the migration SQL script first.',
        details: error.message
      });
    }
    
    if (error?.code === '23502') {
      return res.status(400).json({
        success: false,
        error: 'Database constraint violation',
        message: 'Some required fields are missing or null.',
        details: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to submit tailor-made request',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error?.detail || error?.message,
      code: error?.code
    });
  }
}
