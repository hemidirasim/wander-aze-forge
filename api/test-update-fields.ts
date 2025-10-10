import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};
const pool = new Pool(dbConfig);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { id, minParticipants, startDate, endDate } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Tour ID is required' });
    }

    const client = await pool.connect();

    try {
      // Test update with only the new fields
      const query = `
        UPDATE tours SET
          min_participants = $1,
          start_date = $2,
          end_date = $3,
          updated_at = NOW()
        WHERE id = $4
        RETURNING id, min_participants, start_date, end_date
      `;

      const values = [
        minParticipants || null,
        startDate || null,
        endDate || null,
        id
      ];

      console.log('Testing update with values:', values);

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Fields updated successfully',
        data: result.rows[0]
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Test update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Update failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}


