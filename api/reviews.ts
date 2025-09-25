import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/config/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { featured } = req.query;
      
      let query = 'SELECT * FROM reviews';
      const params = [];
      
      if (featured === 'true') {
        query += ' WHERE is_featured = true';
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, params);
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } 
    else if (req.method === 'POST') {
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
      
      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    }
    else if (req.method === 'PUT') {
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
      
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    }
    else if (req.method === 'DELETE') {
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
      
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    }
    else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
