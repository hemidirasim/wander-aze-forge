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
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== ADDING TOUR_PROGRAMS COLUMN ===');
    
    const client = await pool.connect();
    
    // Add tour_programs column
    await client.query(`
      ALTER TABLE tours ADD COLUMN IF NOT EXISTS tour_programs JSONB DEFAULT '[]'
    `);
    
    console.log('tour_programs column added successfully');
    
    // Verify the column exists
    const columnCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tours' AND column_name = 'tour_programs'
    `);
    
    console.log('Column verification:', columnCheck.rows);
    
    client.release();
    
    return res.status(200).json({
      success: true,
      message: 'tour_programs column added successfully',
      columnInfo: columnCheck.rows
    });
    
  } catch (error) {
    console.error('=== ERROR ADDING COLUMN ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to add tour_programs column',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
