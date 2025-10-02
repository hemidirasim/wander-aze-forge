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
    console.log('=== UPDATE PRICING API CALLED ===');
    console.log('Tour ID:', id);
    console.log('Request body:', req.body);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Tour ID is required'
      });
    }

    // Test database connection
    try {
      await pool.query('SELECT 1');
      console.log('Database connection test successful');
    } catch (connError) {
      console.error('Database connection test failed:', connError);
      return res.status(500).json({
        success: false,
        error: 'Database connection failed',
        message: connError instanceof Error ? connError.message : 'Unknown connection error'
      });
    }

    // Ensure pricing columns exist and convert types if needed
    try {
      // Check if price_includes column exists and its type
      const columnCheck = await pool.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'tours' AND column_name = 'price_includes'
      `);
      
      if (columnCheck.rows.length > 0) {
        const currentType = columnCheck.rows[0].data_type;
        console.log('Current price_includes column type:', currentType);
        
        if (currentType === 'ARRAY' || currentType.includes('text')) {
          // Convert text[] to JSONB
          await pool.query(`ALTER TABLE tours ALTER COLUMN price_includes TYPE JSONB USING price_includes::jsonb`);
          console.log('price_includes column converted to JSONB');
        }
      } else {
        // Create new JSONB column
        await pool.query(`ALTER TABLE tours ADD COLUMN price_includes JSONB DEFAULT '[]'::jsonb`);
        console.log('price_includes column created as JSONB');
      }
    } catch (columnError) {
      console.log('Error handling price_includes column:', columnError);
    }
    
    try {
      await pool.query(`ALTER TABLE tours ADD COLUMN IF NOT EXISTS participant_pricing JSONB DEFAULT '[]'::jsonb`);
      console.log('participant_pricing column ensured');
    } catch (columnError) {
      console.log('Error ensuring participant_pricing column:', columnError);
    }

    // Extract pricing data
    const basePrice = req.body.basePrice || '';
    const participantPricing = req.body.participantPricing || [];
    const priceIncludes = req.body.priceIncludes || [];

    console.log('Processed pricing data:', {
      basePrice,
      participantPricing,
      priceIncludes
    });

    // Ensure participantPricing is a valid array
    const validParticipantPricing = Array.isArray(participantPricing) ? participantPricing : [];
    const validPriceIncludes = Array.isArray(priceIncludes) ? priceIncludes : [];

    console.log('Validated data:', {
      basePrice,
      validParticipantPricing,
      validPriceIncludes
    });

    // Update tour pricing in database
    const query = `
      UPDATE tours SET
        price = $1,
        participant_pricing = $2::jsonb,
        price_includes = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const values = [
      basePrice,
      JSON.stringify(validParticipantPricing),
      validPriceIncludes, // Send as array for text[] column
      id
    ];

    console.log('Executing database query with', values.length, 'parameters');
    console.log('Query values:', values);

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    console.log('Pricing updated successfully:', result.rows[0]);

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Pricing information updated successfully'
    });

  } catch (error) {
    console.error('=== ERROR UPDATING PRICING ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : null);
    
    // Check if it's a database error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Database error code:', (error as any).code);
      console.error('Database error detail:', (error as any).detail);
      console.error('Database error hint:', (error as any).hint);
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to update pricing information',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : null,
      errorCode: error && typeof error === 'object' && 'code' in error ? (error as any).code : null
    });
  }
}
