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

    // Check if columns exist and add them if they don't
    const columns = [
      'total_hiking_distance',
      'total_elevation_gain', 
      'total_elevation_loss'
    ];

    for (const column of columns) {
      const checkColumnQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'tours' AND column_name = $1
      `;
      const columnCheckResult = await client.query(checkColumnQuery, [column]);

      if (columnCheckResult.rows.length === 0) {
        // Add column if it doesn't exist
        const addColumnQuery = `
          ALTER TABLE tours 
          ADD COLUMN ${column} VARCHAR(255) DEFAULT NULL
        `;
        await client.query(addColumnQuery);
        console.log(`${column} column added successfully.`);
      } else {
        console.log(`${column} column already exists.`);
      }
    }

    client.release();
    return res.status(200).json({ 
      success: true, 
      message: 'Hiking columns added successfully.' 
    });

  } catch (error) {
    console.error('Database migration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database migration failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
