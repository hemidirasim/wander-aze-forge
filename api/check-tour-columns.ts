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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('=== CHECKING TOUR TABLE COLUMNS ===');
    
    // Check if tours table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tours'
      );
    `);
    
    console.log('Tours table exists:', tableCheck.rows[0].exists);
    
    if (!tableCheck.rows[0].exists) {
      return res.status(404).json({
        success: false,
        error: 'Tours table does not exist'
      });
    }
    
    // Get all columns from tours table
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'tours' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.log('Tours table columns:', columns.rows);
    
    // Check specific columns we need
    const equipmentColumns = columns.rows.filter(col => 
      col.column_name === 'provided_equipment' || col.column_name === 'what_to_bring'
    );
    
    console.log('Equipment columns found:', equipmentColumns);
    
    // Check if tour with ID 106 exists
    const tourCheck = await pool.query('SELECT id, title FROM tours WHERE id = $1', [106]);
    console.log('Tour 106 exists:', tourCheck.rows.length > 0);
    if (tourCheck.rows.length > 0) {
      console.log('Tour 106 details:', tourCheck.rows[0]);
    }
    
    return res.status(200).json({
      success: true,
      data: {
        tableExists: tableCheck.rows[0].exists,
        columns: columns.rows,
        equipmentColumns: equipmentColumns,
        tour106Exists: tourCheck.rows.length > 0,
        tour106Details: tourCheck.rows.length > 0 ? tourCheck.rows[0] : null
      }
    });
    
  } catch (error) {
    console.error('Error checking tour columns:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check tour columns',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

