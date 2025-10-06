import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};
const pool = new Pool(dbConfig);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const client = await pool.connect();

    // Check if columns exist
    const checkColumnsQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'tours' 
      AND column_name IN ('min_participants', 'start_date', 'end_date')
      ORDER BY column_name
    `;

    const result = await client.query(checkColumnsQuery);
    
    client.release();

    return res.status(200).json({
      success: true,
      message: 'Column check completed',
      columns: result.rows,
      totalFound: result.rows.length
    });

  } catch (error) {
    console.error('Column check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Column check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}