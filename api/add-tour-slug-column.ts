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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if slug column exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tours' AND column_name = 'slug'
    `;
    
    const columnExists = await pool.query(checkColumnQuery);
    
    if (columnExists.rows.length === 0) {
      // Add slug column
      await pool.query('ALTER TABLE tours ADD COLUMN slug VARCHAR(255)');
      console.log('Added slug column to tours table');
    }

    // Get all tours and generate slugs
    const toursResult = await pool.query('SELECT id, title FROM tours WHERE slug IS NULL OR slug = \'\'');
    
    for (const tour of toursResult.rows) {
      const slug = tour.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      
      await pool.query('UPDATE tours SET slug = $1 WHERE id = $2', [slug, tour.id]);
      console.log(`Updated tour ${tour.id} with slug: ${slug}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Tour slugs generated successfully',
      updated: toursResult.rows.length
    });

  } catch (error) {
    console.error('Error adding tour slug column:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add tour slug column',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
