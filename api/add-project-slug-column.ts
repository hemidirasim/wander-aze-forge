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

  try {
    const client = await pool.connect();
    
    try {
      // Add slug column if it doesn't exist
      await client.query(`
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS slug TEXT
      `);

      // Get all projects without slugs
      const result = await client.query(`
        SELECT id, title FROM projects WHERE slug IS NULL OR slug = ''
      `);

      // Generate slugs for existing projects
      for (const project of result.rows) {
        const slug = project.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim();

        await client.query(
          'UPDATE projects SET slug = $1 WHERE id = $2',
          [slug, project.id]
        );
      }

      res.status(200).json({
        success: true,
        message: 'Slug column added and populated for all projects',
        updated: result.rows.length
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error adding project slugs:', error);
    res.status(500).json({ 
      error: 'Failed to add project slugs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}