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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Adding participant_pricing column to tours table...');

    // Check if column already exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tours' AND column_name = 'participant_pricing'
    `;
    
    const checkResult = await pool.query(checkColumnQuery);
    
    if (checkResult.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Column participant_pricing already exists in tours table'
      });
    }

    // Add the participant_pricing column
    const addColumnQuery = `
      ALTER TABLE tours 
      ADD COLUMN participant_pricing JSONB DEFAULT '[]'::jsonb
    `;

    await pool.query(addColumnQuery);

    console.log('Successfully added participant_pricing column to tours table');

    return res.status(200).json({
      success: true,
      message: 'Successfully added participant_pricing column to tours table'
    });

  } catch (error) {
    console.error('Error adding participant_pricing column:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add participant_pricing column',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

