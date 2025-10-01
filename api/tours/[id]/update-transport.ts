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

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    console.log('=== UPDATE TRANSPORT API CALLED ===');
    console.log('Tour ID:', id);
    console.log('Request body:', req.body);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Tour ID is required'
      });
    }

    // Ensure transport columns exist
    try {
      await pool.query(`
        ALTER TABLE tours 
        ADD COLUMN IF NOT EXISTS transport_details TEXT,
        ADD COLUMN IF NOT EXISTS pickup_service TEXT
      `);
      console.log('Transport columns ensured');
    } catch (columnError) {
      console.log('Error ensuring transport columns (might already exist):', columnError);
    }

    // Extract transport data
    const transportData = {
      transportDetails: req.body.transportDetails || '',
      pickupService: req.body.pickupService || ''
    };

    console.log('Processed transport data:', transportData);

    // Update tour transport in database
    const query = `
      UPDATE tours SET
        transport_details = $1,
        pickup_service = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const values = [
      transportData.transportDetails,
      transportData.pickupService,
      id
    ];

    console.log('Executing database query with', values.length, 'parameters');

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    console.log('Transport updated successfully:', result.rows[0]);

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Transport information updated successfully'
    });

  } catch (error) {
    console.error('=== ERROR UPDATING TRANSPORT ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to update transport information',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : null
    });
  }
}
