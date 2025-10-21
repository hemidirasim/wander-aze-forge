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
      // Ensure columns exist
      await client.query(`
        ALTER TABLE blog_posts 
        ADD COLUMN IF NOT EXISTS published_date DATE DEFAULT CURRENT_DATE,
        ADD COLUMN IF NOT EXISTS author_bio TEXT,
        ADD COLUMN IF NOT EXISTS author_avatar TEXT,
        ADD COLUMN IF NOT EXISTS author_twitter TEXT,
        ADD COLUMN IF NOT EXISTS author_linkedin TEXT,
        ADD COLUMN IF NOT EXISTS author_instagram TEXT
      `);

      const { id } = req.query;
      
      if (id) {
        // Get single blog post
        const result = await client.query(
          'SELECT * FROM blog_posts WHERE id = $1',
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
        // Get all blog posts - Order by published_date first, then created_at
        const result = await client.query(
          'SELECT * FROM blog_posts ORDER BY COALESCE(published_date, created_at::date) DESC, created_at DESC'
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
        author_bio,
        author_avatar,
        author_twitter,
        author_linkedin,
        author_instagram,
        category,
        tags,
        featured_image,
        gallery_images,
        status = 'published',
        featured = false,
        published_date,
        id,
        _method
      } = req.body;

      // Handle DELETE request
      if (_method === 'DELETE' && id) {
        console.log('Deleting blog post with ID:', id);
        
        const deleteResult = await client.query(
          'DELETE FROM blog_posts WHERE id = $1 RETURNING id',
          [id]
        );
        
        if (deleteResult.rows.length === 0) {
          console.log('Blog post not found for deletion');
          res.status(404).json({ error: 'Blog post not found' });
          return;
        }
        
        console.log('Blog post deleted successfully');
        res.status(200).json({
          success: true,
          message: 'Blog post deleted successfully'
        });
        return;
      }

      // Validate required fields for CREATE and UPDATE operations
      if (_method !== 'DELETE' && (!title || !content || !author)) {
        res.status(400).json({ error: 'Title, content, and author are required' });
        return;
      }

      // Handle UPDATE request
      if (_method === 'PUT' && id) {
        const updateResult = await client.query(
          `UPDATE blog_posts SET 
            title = $1, content = $2, excerpt = $3, author = $4, author_bio = $5, 
            author_avatar = $6, author_twitter = $7, author_linkedin = $8, author_instagram = $9,
            category = $10, tags = $11, featured_image = $12, gallery_images = $13, 
            status = $14, featured = $15, published_date = $16, updated_at = CURRENT_TIMESTAMP
          WHERE id = $17 RETURNING *`,
          [title, content, excerpt, author, author_bio, author_avatar, author_twitter, 
           author_linkedin, author_instagram, category, tags, featured_image, 
           JSON.stringify(gallery_images || []), status, featured, published_date, id]
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
          title, content, excerpt, author, author_bio, author_avatar, author_twitter, 
          author_linkedin, author_instagram, category, tags, featured_image, 
          gallery_images, status, featured, published_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *`,
        [title, content, excerpt, author, author_bio, author_avatar, author_twitter, 
         author_linkedin, author_instagram, category, tags, featured_image, 
         JSON.stringify(gallery_images || []), status, featured, published_date]
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
