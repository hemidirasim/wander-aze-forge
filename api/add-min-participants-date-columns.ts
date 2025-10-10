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
      { name: 'min_participants', type: 'INTEGER DEFAULT NULL' },
      { name: 'start_date', type: 'DATE DEFAULT NULL' },
      { name: 'end_date', type: 'DATE DEFAULT NULL' }
    ];

    for (const column of columns) {
      const checkColumnQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'tours' AND column_name = $1
      `;
      const columnCheckResult = await client.query(checkColumnQuery, [column.name]);

      if (columnCheckResult.rows.length === 0) {
        // Add column if it doesn't exist
        const addColumnQuery = `
          ALTER TABLE tours 
          ADD COLUMN ${column.name} ${column.type}
        `;
        await client.query(addColumnQuery);
        console.log(`${column.name} column added successfully.`);
      } else {
        console.log(`${column.name} column already exists.`);
      }
    }

    client.release();
    return res.status(200).json({ 
      success: true, 
      message: 'Min participants and date columns added successfully.' 
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


