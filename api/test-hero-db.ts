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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test database connection
    const client = await pool.connect();
    
    // Check if hero_section table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hero_section'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    
    if (!tableExists) {
      // Create hero_section table
      await client.query(`
        CREATE TABLE IF NOT EXISTS hero_section (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          subtitle VARCHAR(500),
          description TEXT,
          image_url VARCHAR(500),
          button1_text VARCHAR(100),
          button1_link VARCHAR(255),
          button2_text VARCHAR(100),
          button2_link VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert default data
      await client.query(`
        INSERT INTO hero_section (title, subtitle, description, image_url, button1_text, button1_link, button2_text, button2_link, is_active) VALUES 
        (
          'Discover Azerbaijan',
          'Authentic mountain adventures • Sustainable tourism • Cultural immersion',
          'Experience the breathtaking beauty of Azerbaijan through our carefully crafted adventure tours. From the majestic Caucasus Mountains to ancient cultural sites, discover the hidden gems of this incredible country.',
          '/hero-mountain-custom.jpg',
          'Explore Tours',
          '/tours',
          'Our Story',
          '/about',
          true
        )
        ON CONFLICT DO NOTHING
      `);
    }
    
    // Test insert
    const testResult = await client.query(`
      INSERT INTO hero_section (title, subtitle, description, image_url, button1_text, button1_link, button2_text, button2_link, is_active) VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      'Test Hero',
      'Test Subtitle',
      'Test Description',
      '/test-image.jpg',
      'Test Button 1',
      '/test-link-1',
      'Test Button 2',
      '/test-link-2',
      false
    ]);
    
    client.release();
    
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      tableExists,
      testInsert: testResult.rows[0]
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
