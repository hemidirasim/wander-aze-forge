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
    console.error('Tour Programs API error:', error);
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
      const { tour_id } = req.query;
      
      if (tour_id) {
        // Get tour programs for specific tour
        const result = await client.query(
          'SELECT * FROM tour_programs WHERE tour_id = $1 ORDER BY day_number ASC',
          [tour_id]
        );
        
        res.status(200).json({
          success: true,
          data: result.rows
        });
      } else {
        // Get all tour programs
        const result = await client.query(
          'SELECT * FROM tour_programs ORDER BY tour_id, day_number ASC'
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
    console.error('Error fetching tour programs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tour programs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();
    
    try {
      const {
        tour_id,
        day_number,
        title,
        description,
        activities,
        meals,
        accommodation,
        highlights,
        difficulty_level,
        duration_hours
      } = req.body;

      if (!tour_id || !day_number || !title) {
        res.status(400).json({ error: 'tour_id, day_number, and title are required' });
        return;
      }

      const result = await client.query(
        `INSERT INTO tour_programs (
          tour_id, day_number, title, description, activities, meals, accommodation, highlights, difficulty_level, duration_hours
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [tour_id, day_number, title, description, activities, meals, accommodation, highlights, difficulty_level, duration_hours]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating tour program:', error);
    res.status(500).json({ 
      error: 'Failed to create tour program',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
