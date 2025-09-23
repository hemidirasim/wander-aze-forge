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
      await handleGet(req, res);
    } else if (req.method === 'POST') {
      await handlePost(req, res);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Blog API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();
    
    try {
      const { id } = req.query;
      
      if (id) {
        // Get single blog post
        const result = await client.query(
          'SELECT * FROM blog_posts WHERE id = $1 ORDER BY created_at DESC',
          [id]
        );
        
        if (result.rows.length === 0) {
          res.status(404).json({ error: 'Blog post not found' });
          return;
        }
        
        res.status(200).json({
          success: true,
          data: result.rows[0]
        });
      } else {
        // Get all blog posts
        const result = await client.query(
          'SELECT * FROM blog_posts ORDER BY created_at DESC'
        );
        
        res.status(200).json({
          success: true,
          data: result.rows
        });
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blog posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();
    
    try {
      const {
        title,
        content,
        excerpt,
        author,
        category,
        tags,
        featured_image,
        gallery_images,
        status = 'published',
        featured = false,
        id,
        _method
      } = req.body;

      if (!title || !content || !author) {
        res.status(400).json({ error: 'Title, content, and author are required' });
        return;
      }

      // Handle DELETE request
      if (_method === 'DELETE' && id) {
        const deleteResult = await client.query(
          'DELETE FROM blog_posts WHERE id = $1 RETURNING id',
          [id]
        );
        
        if (deleteResult.rows.length === 0) {
          res.status(404).json({ error: 'Blog post not found' });
          return;
        }
        
        res.status(200).json({
          success: true,
          message: 'Blog post deleted successfully'
        });
        return;
      }

      // Handle UPDATE request
      if (_method === 'PUT' && id) {
        const updateResult = await client.query(
          `UPDATE blog_posts SET 
            title = $1, content = $2, excerpt = $3, author = $4, category = $5, 
            tags = $6, featured_image = $7, gallery_images = $8, status = $9, featured = $10,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $11 RETURNING *`,
          [title, content, excerpt, author, category, tags, featured_image, 
           JSON.stringify(gallery_images || []), status, featured, id]
        );
        
        if (updateResult.rows.length === 0) {
          res.status(404).json({ error: 'Blog post not found' });
          return;
        }
        
        res.status(200).json({
          success: true,
          data: updateResult.rows[0]
        });
        return;
      }

      // Handle CREATE request
      const result = await client.query(
        `INSERT INTO blog_posts (
          title, content, excerpt, author, category, tags, featured_image, gallery_images, status, featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [title, content, excerpt, author, category, tags, featured_image, 
         JSON.stringify(gallery_images || []), status, featured]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ 
      error: 'Failed to create blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
