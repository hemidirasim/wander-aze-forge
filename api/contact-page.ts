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
    console.error('Contact Page API error:', error);
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
      const result = await client.query(
        'SELECT * FROM contact_page ORDER BY section'
      );
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching contact page:', error);
    res.status(500).json({ 
      error: 'Failed to fetch contact page',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();
    
    try {
      const {
        section,
        title,
        content,
        contact_info,
        image_url,
        _method
      } = req.body;

      // Handle UPDATE request
      if (_method === 'PUT' && section) {
        const updateResult = await client.query(
          `UPDATE contact_page SET 
            title = $1, content = $2, contact_info = $3, image_url = $4,
            updated_at = CURRENT_TIMESTAMP
          WHERE section = $5 RETURNING *`,
          [title, content, JSON.stringify(contact_info), image_url, section]
        );
        
        if (updateResult.rows.length === 0) {
          res.status(404).json({ error: 'Contact section not found' });
          return;
        }
        
        res.status(200).json({
          success: true,
          data: updateResult.rows[0]
        });
        return;
      }

      // Validate required fields for CREATE and UPDATE operations
      if (_method !== 'DELETE' && (!section || !title)) {
        res.status(400).json({ error: 'Section and title are required' });
        return;
      }

      // Handle CREATE request
      const result = await client.query(
        `INSERT INTO contact_page (section, title, content, contact_info, image_url)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (section) DO UPDATE SET
           title = EXCLUDED.title,
           content = EXCLUDED.content,
           contact_info = EXCLUDED.contact_info,
           image_url = EXCLUDED.image_url,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [section, title, content, JSON.stringify(contact_info), image_url]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating contact page:', error);
    res.status(500).json({ 
      error: 'Failed to update contact page',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
