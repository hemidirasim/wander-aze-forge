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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    console.log('Adding max_participants column to tours table...');

    // Check if column already exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tours' AND column_name = 'max_participants'
    `;
    
    const columnExists = await pool.query(checkColumnQuery);
    
    if (columnExists.rows.length > 0) {
      console.log('max_participants column already exists');
      return res.status(200).json({
        success: true,
        message: 'max_participants column already exists',
        columnExists: true
      });
    }

    // Add max_participants column
    const addColumnQuery = `
      ALTER TABLE tours 
      ADD COLUMN max_participants INTEGER DEFAULT 0
    `;
    
    await pool.query(addColumnQuery);
    console.log('max_participants column added successfully');

    // Update existing tours with default max_participants value
    const updateQuery = `
      UPDATE tours 
      SET max_participants = 12 
      WHERE max_participants IS NULL OR max_participants = 0
    `;
    
    const updateResult = await pool.query(updateQuery);
    console.log(`Updated ${updateResult.rowCount} tours with default max_participants value`);

    return res.status(200).json({
      success: true,
      message: 'max_participants column added successfully',
      updatedTours: updateResult.rowCount,
      columnExists: false
    });

  } catch (error) {
    console.error('Error adding max_participants column:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add max_participants column',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
