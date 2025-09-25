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

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const { featured } = req.query;
    
    let query = 'SELECT * FROM reviews';
    const params = [];
    
    if (featured === 'true') {
      query += ' WHERE is_featured = true';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const { name, rating, review_text, source, source_logo, source_url, is_featured } = req.body;
    
    if (!name || !rating || !review_text || !source) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, rating, review_text, source'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO reviews (name, rating, review_text, source, source_logo, source_url, is_featured) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, rating, review_text, source, source_logo || null, source_url || null, is_featured || false]
    );
    
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create review'
    });
  }
}

async function handlePut(req: VercelRequest, res: VercelResponse) {
  try {
    const { id, name, rating, review_text, source, source_logo, source_url, is_featured } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Review ID is required'
      });
    }
    
    const result = await pool.query(
      `UPDATE reviews 
       SET name = $1, rating = $2, review_text = $3, source = $4, source_logo = $5, source_url = $6, is_featured = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [name, rating, review_text, source, source_logo, source_url, is_featured, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update review'
    });
  }
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Review ID is required'
      });
    }
    
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete review'
    });
  }
}