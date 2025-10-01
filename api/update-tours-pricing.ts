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
    // Add pricing policy columns to tours table
    await pool.query(`
      ALTER TABLE tours 
      ADD COLUMN IF NOT EXISTS pricing_policy VARCHAR(20) DEFAULT 'fixed' CHECK (pricing_policy IN ('fixed', 'bulk_discount', 'group_required')),
      ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
      ADD COLUMN IF NOT EXISTS min_participants INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 20,
      ADD COLUMN IF NOT EXISTS bulk_discount_threshold INTEGER DEFAULT 5,
      ADD COLUMN IF NOT EXISTS bulk_discount_percentage DECIMAL(5,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS group_required_min INTEGER DEFAULT 5,
      ADD COLUMN IF NOT EXISTS group_required_max INTEGER DEFAULT 10
    `);

    // Update existing tours with default pricing
    await pool.query(`
      UPDATE tours 
      SET 
        base_price = price,
        pricing_policy = 'fixed'
      WHERE base_price IS NULL
    `);

    return res.status(200).json({
      success: true,
      message: 'Tours pricing system updated successfully',
      data: {
        pricing_policy: 'Added pricing policy columns',
        base_price: 'Added base price column',
        min_participants: 'Added minimum participants',
        max_participants: 'Added maximum participants',
        bulk_discount: 'Added bulk discount settings',
        group_required: 'Added group requirements'
      }
    });

  } catch (error) {
    console.error('Update pricing system error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update pricing system',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
