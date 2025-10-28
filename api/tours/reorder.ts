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
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    
    // Verify admin token (you might want to use JWT verification here)
    // For now, we'll just check if it exists
    if (!token) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { tourIds } = req.body;

    if (!Array.isArray(tourIds) || tourIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid tour IDs' });
    }

    // Update the order of tours
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update each tour with its new order
      for (let i = 0; i < tourIds.length; i++) {
        await client.query(
          'UPDATE tours SET display_order = $1, updated_at = NOW() WHERE id = $2',
          [i + 1, tourIds[i]]
        );
      }
      
      await client.query('COMMIT');
      
      return res.status(200).json({ 
        success: true, 
        message: 'Tour order updated successfully' 
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error reordering tours:', error);
    return res.status(500).json(
      { success: false, error: 'Failed to reorder tours' }
    );
  }
}
