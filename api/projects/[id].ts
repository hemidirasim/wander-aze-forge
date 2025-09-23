import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid project ID'
    });
  }

  if (req.method === 'GET') {
    try {
      console.log('Fetching project with ID:', id);
      
      const result = await pool.query(`
        SELECT 
          id, title, description, category, location, 
          start_date, end_date, budget, status, 
          image_url, gallery_urls, created_at, updated_at
        FROM projects 
        WHERE id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      const project = {
        ...result.rows[0],
        gallery_urls: result.rows[0].gallery_urls || []
      };

      return res.status(200).json({
        success: true,
        data: { project }
      });
    } catch (error: any) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Database error'
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      console.log('Updating project with ID:', id);
      
      const { title, description, category, location, start_date, end_date, budget, status, image_url, gallery_urls } = req.body;
      
      const result = await pool.query(`
        UPDATE projects SET
          title = $1, description = $2, category = $3, location = $4,
          start_date = $5, end_date = $6, budget = $7, status = $8,
          image_url = $9, gallery_urls = $10, updated_at = NOW()
        WHERE id = $11
        RETURNING *
      `, [
        title, description, category, location,
        start_date, end_date, budget, status,
        image_url, gallery_urls || [], id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      const project = {
        ...result.rows[0],
        gallery_urls: result.rows[0].gallery_urls || []
      };

      return res.status(200).json({
        success: true,
        data: { project },
        message: 'Project updated successfully'
      });
    } catch (error: any) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Database error'
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      console.log('Deleting project with ID:', id);
      
      const result = await pool.query(`
        DELETE FROM projects 
        WHERE id = $1
        RETURNING id
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error: any) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Database error'
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}
