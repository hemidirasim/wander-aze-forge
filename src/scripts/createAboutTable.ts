import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function createAboutTable() {
  try {
    const client = await pool.connect();
    
    try {
      // Create about_page table
      await client.query(`
        CREATE TABLE IF NOT EXISTS about_page (
          id SERIAL PRIMARY KEY,
          section VARCHAR(50) UNIQUE NOT NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          image_url VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert default content for our_story and our_team sections
      await client.query(`
        INSERT INTO about_page (section, title, content, image_url) VALUES 
        (
          'our_story',
          'Our Story',
          'Founded in 2020, Outtour.az has been at the forefront of adventure tourism in Azerbaijan. We started with a simple mission: to showcase the breathtaking natural beauty of our country and provide unforgettable experiences for travelers from around the world.

Our journey began when our founders, a group of passionate hikers and nature enthusiasts, realized that Azerbaijan''s incredible landscapes were largely unknown to international travelers. From the majestic peaks of the Greater Caucasus to the pristine shores of the Caspian Sea, we saw an opportunity to share these hidden gems with the world.

Today, we are proud to be Azerbaijan''s leading adventure tourism company, having guided thousands of travelers through some of the most spectacular landscapes in the region. Our commitment to sustainable tourism, safety, and authentic experiences has earned us the trust of adventurers worldwide.',
          '/assets/about-story.jpg'
        ),
        (
          'our_team',
          'Our Team',
          'Our team consists of experienced guides, safety experts, and local experts who are passionate about sharing Azerbaijan''s natural beauty. Each team member brings unique skills and deep knowledge of the region''s geography, culture, and wildlife.

We believe that the best adventures come from combining professional expertise with genuine passion for the outdoors. Our guides are not just employees – they are adventurers, conservationists, and storytellers who love what they do and are excited to share their knowledge with you.',
          '/assets/about-team.jpg'
        )
        ON CONFLICT (section) DO NOTHING
      `);

      console.log('About page table created successfully!');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating about page table:', error);
  } finally {
    await pool.end();
  }
}

createAboutTable();
