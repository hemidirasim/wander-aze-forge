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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== TESTING DATABASE CONNECTION ===');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('Database connection successful');
    
    // Test tours table structure
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'tours' 
      ORDER BY ordinal_position
    `);
    
    console.log('Tours table columns:', tableInfo.rows);
    
    // Test if we can insert a simple record
    const testInsert = await client.query(`
      INSERT INTO tours (title, description, category, duration, difficulty, price, max_participants)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title
    `, [
      'Test Tour',
      'Test Description',
      'test',
      '1 day',
      'Easy',
      100,
      5
    ]);
    
    console.log('Test insert successful:', testInsert.rows[0]);
    
    // Clean up test record
    await client.query('DELETE FROM tours WHERE title = $1', ['Test Tour']);
    console.log('Test record cleaned up');
    
    client.release();
    
    return res.status(200).json({
      success: true,
      message: 'Database connection and operations successful',
      tableColumns: tableInfo.rows,
      testInsert: testInsert.rows[0]
    });
    
  } catch (error) {
    console.error('=== DATABASE TEST ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return res.status(500).json({
      success: false,
      error: 'Database test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : null
    });
  }
}
