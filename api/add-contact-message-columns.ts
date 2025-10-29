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
    console.log('Adding columns to contact_messages table...');

    // Check if table exists first
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'contact_messages'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Create table if it doesn't exist
      await pool.query(`
        CREATE TABLE contact_messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          country VARCHAR(100),
          tour_category VARCHAR(100),
          tour_type VARCHAR(255),
          group_size INTEGER,
          dates VARCHAR(255),
          message TEXT NOT NULL,
          newsletter BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('contact_messages table created successfully');
    }

    // Add columns if they don't exist (one by one)
    const columnsToAdd = [
      { name: 'first_name', type: 'VARCHAR(255)' },
      { name: 'last_name', type: 'VARCHAR(255)' },
      { name: 'country', type: 'VARCHAR(100)' },
      { name: 'tour_category', type: 'VARCHAR(100)' },
      { name: 'tour_type', type: 'VARCHAR(255)' },
      { name: 'group_size', type: 'INTEGER' },
      { name: 'dates', type: 'VARCHAR(255)' },
      { name: 'newsletter', type: 'BOOLEAN DEFAULT false' },
    ];

    for (const column of columnsToAdd) {
      try {
        // Check if column exists
        const columnCheck = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'contact_messages' 
            AND column_name = $1
          );
        `, [column.name]);

        if (!columnCheck.rows[0].exists) {
          await pool.query(`
            ALTER TABLE contact_messages 
            ADD COLUMN ${column.name} ${column.type}
          `);
          console.log(`Column ${column.name} added successfully`);
        } else {
          console.log(`Column ${column.name} already exists`);
        }
      } catch (columnError: any) {
        console.error(`Error adding column ${column.name}:`, columnError.message);
        // Continue with other columns even if one fails
      }
    }

    // Verify all columns exist
    const verifyResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'contact_messages'
      ORDER BY column_name
    `);

    console.log('Current columns in contact_messages table:', verifyResult.rows.map(r => r.column_name));

    return res.status(200).json({
      success: true,
      message: 'Contact message columns added successfully',
      columns: verifyResult.rows.map(r => ({ name: r.column_name, type: r.data_type }))
    });

  } catch (error: any) {
    console.error('Error adding contact message columns:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add contact message columns',
      details: error.message,
      stack: error.stack
    });
  }
}

