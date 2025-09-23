import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const projectId = req.query.id;

  if (req.method === 'GET') {
    try {
      console.log(`Fetching project with ID: ${projectId}`);
      
      const result = await pool.query(`
        SELECT 
          id, title, description, category, location, 
          start_date, end_date, budget, status, 
          image_url, gallery_urls, created_at, updated_at
        FROM projects 
        WHERE id = $1
      `, [projectId]);
      
      if (result.rows.length === 0) {
        return res.status(200).json({ 
          success: false, 
          error: 'Project not found' 
        }, { status: 404 });
      }

      const project = {
        ...result.rows[0],
        gallery_urls: result.rows[0].gallery_urls ? (typeof result.rows[0].gallery_urls === 'string' ? JSON.parse(result.rows[0].gallery_urls) : result.rows[0].gallery_urls) : []
      };

      return res.status(200).json({ 
        success: true, 
        data: { project } 
      });
    } catch (error: any) {
      console.error('Database error:', error);
      return res.status(200).json({ 
        success: false, 
        error: error.message || 'Database error' 
      }, { status: 500 });
    }
  } else if (req.method === 'PUT') {
    try {
      const body = await req.json();
      console.log(`Updating project ${projectId}:`, body);
      
      const { title, description, category, location, start_date, end_date, budget, status, image_url, gallery_urls } = body;
      
      const result = await pool.query(`
        UPDATE projects SET
          title = $1, description = $2, category = $3, location = $4,
          start_date = $5, end_date = $6, budget = $7, status = $8,
          image_url = $9, gallery_urls = $10, updated_at = CURRENT_TIMESTAMP
        WHERE id = $11
        RETURNING *
      `, [
        title, description, category, location,
        start_date, end_date, budget, status,
        image_url, JSON.stringify(gallery_urls || []), projectId
      ]);

      if (result.rows.length === 0) {
        return res.status(200).json({ 
          success: false, 
          error: 'Project not found' 
        }, { status: 404 });
      }

      const project = {
        ...result.rows[0],
        gallery_urls: result.rows[0].gallery_urls ? JSON.parse(result.rows[0].gallery_urls) : []
      };

      return res.status(200).json({ 
        success: true, 
        data: { project },
        message: 'Project updated successfully'
      });
    } catch (error: any) {
      console.error('Database error:', error);
      return res.status(200).json({ 
        success: false, 
        error: error.message || 'Database error' 
      }, { status: 500 });
    }
  } else if (req.method === 'DELETE') {
    try {
      console.log(`Deleting project with ID: ${projectId}`);
      
      const result = await pool.query(`
        DELETE FROM projects WHERE id = $1 RETURNING *
      `, [projectId]);

      if (result.rows.length === 0) {
        return res.status(200).json({ 
          success: false, 
          error: 'Project not found' 
        }, { status: 404 });
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Project deleted successfully'
      });
    } catch (error: any) {
      console.error('Database error:', error);
      return res.status(200).json({ 
        success: false, 
        error: error.message || 'Database error' 
      }, { status: 500 });
    }
  } else {
    return res.status(200).json({ 
      success: false, 
      error: 'Method not allowed' 
    }, { status: 405 });
  }
}
