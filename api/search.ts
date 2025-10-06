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
    if (req.method === 'GET') {
      await handleSearch(req, res);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleSearch(req: VercelRequest, res: VercelResponse) {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string' || q.length < 2) {
      res.status(400).json({ 
        error: 'Search query must be at least 2 characters long' 
      });
      return;
    }

    const client = await pool.connect();
    
    try {
      const searchTerm = `%${q.toLowerCase()}%`;
      
      // Search blogs
      const blogsResult = await client.query(
        `SELECT id, title, excerpt, image_url, created_at, 'blog' as type
         FROM blog_posts 
         WHERE LOWER(title) LIKE $1 OR LOWER(excerpt) LIKE $1 OR LOWER(content) LIKE $1
         AND published = true
         ORDER BY created_at DESC
         LIMIT 5`,
        [searchTerm]
      );

      // Search projects
      const projectsResult = await client.query(
        `SELECT id, title, description, image_url, created_at, 'project' as type
         FROM projects 
         WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1
         ORDER BY created_at DESC
         LIMIT 5`,
        [searchTerm]
      );

      // Search tours
      const toursResult = await client.query(
        `SELECT id, title, description, image_url, created_at, 'tour' as type, category
         FROM tours 
         WHERE LOWER(title) LIKE $1 OR LOWER(description) LIKE $1
         ORDER BY created_at DESC
         LIMIT 5`,
        [searchTerm]
      );

      // Combine all results
      const allResults = [
        ...blogsResult.rows.map(row => ({ ...row, section: 'blog' })),
        ...projectsResult.rows.map(row => ({ ...row, section: 'project' })),
        ...toursResult.rows.map(row => ({ ...row, section: 'tour' }))
      ];

      // Sort by relevance (title matches first, then description matches)
      allResults.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(q.toLowerCase());
        const bTitleMatch = b.title.toLowerCase().includes(q.toLowerCase());
        
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      res.status(200).json({
        success: true,
        data: allResults,
        query: q,
        total: allResults.length
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ 
      error: 'Failed to search',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
