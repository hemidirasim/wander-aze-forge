import { pool } from '../config/database';

async function createTourCategoriesTable() {
  try {
    console.log('Creating tour_categories table...');

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
    console.log('Categories:', result.rows);

    process.exit(0);
  } catch (error) {
    console.error('Error creating tour categories table:', error);
    process.exit(1);
  }
}

createTourCategoriesTable();
