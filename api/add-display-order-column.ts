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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    console.log('Adding display_order column to tours table...');

    // Add display_order column
    await pool.query(`
      ALTER TABLE tours 
      ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0
    `);

    console.log('Display order column added successfully');

    // Update existing tours with display_order based on created_at
    await pool.query(`
      UPDATE tours 
      SET display_order = subquery.row_number
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_number
        FROM tours
      ) AS subquery
      WHERE tours.id = subquery.id
    `);

    console.log('Display order values set for existing tours');

    return res.status(200).json({
      success: true,
      message: 'Display order column added and populated successfully'
    });

  } catch (error) {
    console.error('Error adding display_order column:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add display_order column',
      details: error.message
    });
  }
}
