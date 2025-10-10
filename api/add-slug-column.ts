import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};
const pool = new Pool(dbConfig);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const client = await pool.connect();

    // Check if slug column exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tours' AND column_name = 'slug'
    `;
    const columnCheckResult = await client.query(checkColumnQuery);

    if (columnCheckResult.rows.length === 0) {
      // Add slug column
      const addColumnQuery = `
        ALTER TABLE tours 
        ADD COLUMN slug VARCHAR(255) UNIQUE
      `;
      await client.query(addColumnQuery);
      console.log('slug column added successfully.');
      
      // Generate slugs for existing tours
      const toursQuery = 'SELECT id, title FROM tours';
      const toursResult = await client.query(toursQuery);
      
      for (const tour of toursResult.rows) {
        const slug = tour.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        const updateSlugQuery = 'UPDATE tours SET slug = $1 WHERE id = $2';
        await client.query(updateSlugQuery, [slug, tour.id]);
      }
      
      console.log('Generated slugs for existing tours.');
    } else {
      console.log('slug column already exists.');
    }

    client.release();
    return res.status(200).json({ 
      success: true, 
      message: 'Slug column added successfully and existing tours updated.' 
    });

  } catch (error) {
    console.error('Database migration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database migration failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}


