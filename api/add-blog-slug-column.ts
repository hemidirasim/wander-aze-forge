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

    // Check if slug column exists in blog_posts table
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' AND column_name = 'slug'
    `;
    const columnCheckResult = await client.query(checkColumnQuery);

    if (columnCheckResult.rows.length === 0) {
      // Add slug column
      const addColumnQuery = `
        ALTER TABLE blog_posts 
        ADD COLUMN slug VARCHAR(255) UNIQUE
      `;
      await client.query(addColumnQuery);
      console.log('slug column added to blog_posts table successfully.');
      
      // Generate slugs for existing blog posts
      const postsQuery = 'SELECT id, title FROM blog_posts';
      const postsResult = await client.query(postsQuery);
      
      for (const post of postsResult.rows) {
        const slug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        const updateSlugQuery = 'UPDATE blog_posts SET slug = $1 WHERE id = $2';
        await client.query(updateSlugQuery, [slug, post.id]);
      }
      
      console.log('Generated slugs for existing blog posts.');
    } else {
      console.log('slug column already exists in blog_posts table.');
    }

    client.release();
    return res.status(200).json({ 
      success: true, 
      message: 'Slug column added successfully and existing blog posts updated.' 
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
