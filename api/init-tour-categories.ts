import { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../src/config/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Initializing tour_categories table...');

    // Create tour_categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tour_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Table created successfully');

    // Check if table has any data
    const countResult = await pool.query('SELECT COUNT(*) FROM tour_categories');
    const count = parseInt(countResult.rows[0].count);

    console.log(`Current categories count: ${count}`);

    if (count === 0) {
      console.log('Inserting default categories...');
      
      // Insert default categories
      await pool.query(`
        INSERT INTO tour_categories (name, slug, description, image_url, is_active, sort_order) VALUES 
        ('Trekking', 'trekking', 'Multi-day hiking adventures through Azerbaijan''s stunning mountain landscapes', '/tours-hero.jpg', true, 1),
        ('Hiking', 'hiking', 'Day hikes and short trails perfect for all skill levels', '/tours-hero.jpg', true, 2),
        ('Cultural Tours', 'cultural', 'Explore Azerbaijan''s rich history, traditions, and cultural heritage', '/tours-hero.jpg', true, 3),
        ('Adventure Tours', 'adventure', 'Thrilling outdoor activities and extreme sports experiences', '/tours-hero.jpg', true, 4),
        ('Tailor-Made', 'tailor-made', 'Custom tours designed specifically for your interests and schedule', '/tours-hero.jpg', true, 5)
      `);

      console.log('Default categories inserted successfully');
    }

    // Fetch all categories to verify
    const result = await pool.query('SELECT * FROM tour_categories ORDER BY sort_order ASC');
    
    console.log(`Total categories after initialization: ${result.rows.length}`);

    return res.status(200).json({
      success: true,
      message: 'Tour categories table initialized successfully',
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error initializing tour categories:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to initialize tour categories',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
