import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Adding image_url column to reviews table...');

    // Check if column already exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'reviews' AND column_name = 'image_url'
    `;
    
    const checkResult = await pool.query(checkColumnQuery);
    
    if (checkResult.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Column image_url already exists in reviews table'
      });
    }

    // Add the image_url column
    const addColumnQuery = `
      ALTER TABLE reviews 
      ADD COLUMN image_url TEXT
    `;

    await pool.query(addColumnQuery);

    console.log('Successfully added image_url column to reviews table');

    return res.status(200).json({
      success: true,
      message: 'Successfully added image_url column to reviews table'
    });

  } catch (error) {
    console.error('Error adding image_url column:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add image_url column',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}


