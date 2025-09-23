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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      console.log('Fetching all projects...');
      
      const result = await pool.query(`
        SELECT 
          id, title, description, category, location, 
          start_date, end_date, budget, status, 
          image_url, gallery_urls, created_at, updated_at
        FROM projects 
        ORDER BY created_at DESC
      `);
      
      const projects = result.rows.map(row => ({
        ...row,
        gallery_urls: row.gallery_urls || []
      }));

      return res.status(200).json({
        success: true,
        data: { projects }
      });
    } catch (error: any) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Database error'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      console.log('Processing project request:', req.body);
      
      const { title, description, category, location, start_date, end_date, budget, status, image_url, gallery_urls, id, _method } = req.body;
      
      // Check if this is an update request
      if (_method === 'PUT' && id) {
        console.log('Updating project with ID:', id);
        
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
      } else {
        // Create new project
        console.log('Creating new project');
        
        const result = await pool.query(`
          INSERT INTO projects (
            title, description, category, location, 
            start_date, end_date, budget, status, 
            image_url, gallery_urls
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
        `, [
          title, description, category, location,
          start_date, end_date, budget, status,
          image_url, gallery_urls || []
        ]);

        const project = {
          ...result.rows[0],
          gallery_urls: result.rows[0].gallery_urls || []
        };

        return res.status(201).json({
          success: true,
          data: { project },
          message: 'Project created successfully'
        });
      }
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