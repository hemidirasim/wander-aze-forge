import { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../src/config/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    
    console.log('Database connection successful:', result.rows[0]);

    // Check if tour_categories table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tour_categories'
      );
    `);

    const tableExists = tableCheck.rows[0].exists;
    console.log('tour_categories table exists:', tableExists);

    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      current_time: result.rows[0].current_time,
      tour_categories_table_exists: tableExists,
      database_url: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      database_url: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  }
}
