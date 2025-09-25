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
    console.log('Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('Database connected successfully');
    
    // Test if reviews table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'reviews'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log('Reviews table exists:', tableExists);
    
    if (tableExists) {
      // Try to fetch reviews
      const reviewsResult = await client.query('SELECT * FROM reviews ORDER BY created_at DESC');
      console.log('Found reviews:', reviewsResult.rows.length);
      
      client.release();
      
      res.status(200).json({
        success: true,
        message: 'Database connection successful',
        tableExists: tableExists,
        reviewsCount: reviewsResult.rows.length,
        reviews: reviewsResult.rows
      });
    } else {
      client.release();
      
      res.status(200).json({
        success: true,
        message: 'Database connected but reviews table does not exist',
        tableExists: tableExists,
        reviewsCount: 0,
        reviews: []
      });
    }
    
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
