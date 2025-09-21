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
    console.error('Programs API error:', error);
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
        // Get single program
        const result = await client.query(
          'SELECT * FROM programs WHERE id = $1 AND status = \'active\'',
          [id]
        );
        
        if (result.rows.length === 0) {
          res.status(404).json({ error: 'Program not found' });
          return;
        }
        
        res.status(200).json({
          success: true,
          data: result.rows[0]
        });
      } else {
        // Get all programs
        const result = await client.query(
          'SELECT * FROM programs WHERE status = \'active\' ORDER BY created_at DESC'
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
    console.error('Error fetching programs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch programs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();
    
    try {
      const {
        name,
        description,
        duration_weeks,
        target_audience,
        objectives,
        curriculum,
        status = 'active',
        image_url,
        category
      } = req.body;

      if (!name || !description) {
        res.status(400).json({ error: 'Name and description are required' });
        return;
      }

      const result = await client.query(
        `INSERT INTO programs (
          name, description, duration_weeks, target_audience, objectives, curriculum, status, image_url, category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [name, description, duration_weeks, target_audience, objectives, curriculum, status, image_url, category]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ 
      error: 'Failed to create program',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
