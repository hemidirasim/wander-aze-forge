import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Add participant pricing columns to tours table
    await pool.query(`
      ALTER TABLE tours 
      ADD COLUMN IF NOT EXISTS participant_pricing JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS pricing_type VARCHAR(20) DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'participant_based'))
    `);

    return res.status(200).json({
      success: true,
      message: 'Participant pricing system updated successfully',
      data: {
        participant_pricing: 'Added participant pricing JSONB column',
        pricing_type: 'Added pricing type column'
      }
    });

  } catch (error) {
    console.error('Update participant pricing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update participant pricing system',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
