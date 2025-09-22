import { NextRequest, NextResponse } from 'next/server';
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

export default async function handler(req: NextRequest) {
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
        gallery_urls: row.gallery_urls ? (typeof row.gallery_urls === 'string' ? JSON.parse(row.gallery_urls) : row.gallery_urls) : []
      }));

      return NextResponse.json({ 
        success: true, 
        data: { projects } 
      });
    } catch (error: any) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Database error' 
      }, { status: 500 });
    }
  } else if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log('Creating new project:', body);
      
      const { title, description, category, location, start_date, end_date, budget, status, image_url, gallery_urls } = body;
      
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
        image_url, JSON.stringify(gallery_urls || [])
      ]);

      const project = {
        ...result.rows[0],
        gallery_urls: result.rows[0].gallery_urls ? JSON.parse(result.rows[0].gallery_urls) : []
      };

      return NextResponse.json({ 
        success: true, 
        data: { project },
        message: 'Project created successfully'
      });
    } catch (error: any) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Database error' 
      }, { status: 500 });
    }
  } else {
    return NextResponse.json({ 
      success: false, 
      error: 'Method not allowed' 
    }, { status: 405 });
  }
}