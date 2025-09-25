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

// Create a connection pool
export const pool = new Pool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0]);
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create tours table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        duration VARCHAR(50),
        difficulty VARCHAR(50),
        price DECIMAL(10,2),
        max_participants INTEGER,
        image_url VARCHAR(500),
        highlights JSONB,
        includes JSONB,
        excludes JSONB,
        itinerary TEXT,
        requirements TEXT,
        special_fields JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        tour_id INTEGER REFERENCES tours(id),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        participants INTEGER DEFAULT 1,
        booking_date DATE NOT NULL,
        total_price DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contact messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create blog posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        author VARCHAR(255),
        image_url VARCHAR(500),
        published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        location VARCHAR(255),
        start_date DATE,
        end_date DATE,
        budget DECIMAL(12,2),
        status VARCHAR(50) DEFAULT 'active',
        image_url VARCHAR(500),
        gallery_urls TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create programs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(100),
        duration VARCHAR(50),
        target_audience VARCHAR(255),
        objectives TEXT,
        activities TEXT[],
        status VARCHAR(50) DEFAULT 'active',
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create partners table
    await client.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        description TEXT,
        website_url VARCHAR(500),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        logo_url VARCHAR(500),
        partnership_type VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

  // Create tour_programs table
  await client.query(`
    CREATE TABLE IF NOT EXISTS tour_programs (
      id SERIAL PRIMARY KEY,
      tour_id INTEGER NOT NULL,
      day_number INTEGER NOT NULL,
      day_title VARCHAR(255) NOT NULL,
      day_overview TEXT,
      difficulty VARCHAR(50),
      elevation VARCHAR(100),
      distance VARCHAR(100),
      activities JSONB,
      highlights TEXT[],
      meals TEXT[],
      accommodation TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create admin_users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(100),
      full_name VARCHAR(100),
      permissions TEXT[],
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create admin_sessions table
  await client.query(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
      token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

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

  // Insert default content for about page sections
  await client.query(`
    INSERT INTO about_page (section, title, content, image_url) VALUES 
    (
      'our_story',
      'Our Story',
      'Founded in 2020, OutTour.az has been at the forefront of adventure tourism in Azerbaijan. We started with a simple mission: to showcase the breathtaking natural beauty of our country and provide unforgettable experiences for travelers from around the world.

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

  // Create contact_page table
  await client.query(`
    CREATE TABLE IF NOT EXISTS contact_page (
      id SERIAL PRIMARY KEY,
      section VARCHAR(50) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      contact_info JSONB,
      image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default content for contact page sections
  await client.query(`
    INSERT INTO contact_page (section, title, content, contact_info, image_url) VALUES 
    (
      'hero',
      'Get in Touch',
      'Ready to start your adventure? We''d love to hear from you! Whether you have questions about our tours, need help planning your trip, or want to share your experience with us, our team is here to help.',
      '{"phone": "+994 50 123 45 67", "email": "info@outtour.az", "address": "Baku, Azerbaijan", "working_hours": "Mon-Fri: 9:00-18:00, Sat: 10:00-16:00"}',
      '/assets/contact-hero.jpg'
    ),
    (
      'office_info',
      'Our Office',
      'Visit our main office in Baku for personalized tour planning and consultation. Our experienced team is ready to help you create the perfect adventure itinerary.',
      '{"address": "123 Adventure Street, Baku, Azerbaijan", "phone": "+994 50 123 45 67", "email": "office@outtour.az", "working_hours": "Monday - Friday: 9:00 AM - 6:00 PM\\nSaturday: 10:00 AM - 4:00 PM\\nSunday: Closed"}',
      '/assets/office-image.jpg'
    ),
    (
      'emergency_contact',
      'Emergency Contact',
      'For urgent matters during your tour or immediate assistance, please use our emergency contact information.',
      '{"emergency_phone": "+994 50 999 88 77", "emergency_email": "emergency@outtour.az", "available": "24/7"}',
      null
    ),
    (
      'contact_form',
      'Contact Form',
      'Planning a custom tour or have questions? We''d love to hear from you. Fill out the form below and we''ll get back to you within 24 hours.',
      '{"form_title": "Send us a Message", "form_description": "Planning a custom tour or have questions? We''d love to hear from you.", "response_time": "We''ll respond within 24 hours", "privacy_note": "We respect your privacy. Your information will only be used to respond to your inquiry."}',
      null
    ),
    (
      'social_media',
      'Follow Our Adventures',
      'Stay updated with our latest tours and tips on social media. Follow us for daily inspiration and behind-the-scenes content from our adventures.',
      '{"facebook": "https://www.facebook.com/campingazerbaijan2014", "instagram": "https://www.instagram.com/camping_azerbaijan/", "linkedin": "https://www.linkedin.com/company/campingazerbaijan/", "twitter": "https://x.com/CampingAze", "description": "Stay updated with our latest tours and tips on social media"}',
      null
    ),
    (
      'faq_section',
      'Quick Answers',
      'Find quick answers to common questions about our tours, booking process, and what to expect.',
      '{"faq_title": "Quick Answers", "faqs": [{"question": "How far in advance should I book?", "answer": "We recommend booking 2-4 weeks in advance, especially for popular tours during peak season (June-September)."}, {"question": "What''s included in the price?", "answer": "All tours include professional guides, safety equipment, accommodation (where applicable), and transportation from designated meeting points."}, {"question": "Do you offer private tours?", "answer": "Yes! We can customize any tour for private groups. Contact us for personalized itineraries and pricing."}]}',
      null
    ),
    (
      'map_section',
      'Our Location',
      'Based in Baku, we operate tours throughout Azerbaijan. Our main office is located in the heart of the city, easily accessible by public transportation.',
      '{"location_title": "Based in Baku", "location_description": "Tours operate throughout Azerbaijan", "map_image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"}',
      null
    )
    ON CONFLICT (section) DO NOTHING
  `);

  // Create team_members table
  await client.query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      bio TEXT,
      photo_url VARCHAR(500),
      email VARCHAR(255),
      phone VARCHAR(50),
      social_links JSONB,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default team members
  await client.query(`
    INSERT INTO team_members (name, position, bio, photo_url, email, phone, social_links, order_index) VALUES 
    (
      'Rashad Mammadov',
      'Founder & Lead Guide',
      'With over 10 years of experience exploring Azerbaijan''s wilderness, Rashad founded OutTour.az to share his passion for the country''s natural beauty. He has led hundreds of successful expeditions and is certified in mountain safety and wilderness first aid.',
      '/assets/team/rashad-mammadov.jpg',
      'rashad@outtour.az',
      '+994 50 123 45 67',
      '{"linkedin": "https://linkedin.com/in/rashad-mammadov", "instagram": "https://instagram.com/rashad_guide"}',
      1
    ),
    (
      'Leyla Gasimova',
      'Cultural & Environmental Specialist',
      'Leyla ensures our tours respect local traditions while promoting environmental conservation in the communities we visit. She holds a degree in Environmental Science and has worked with local communities for over 8 years.',
      '/assets/team/leyla-gasimova.jpg',
      'leyla@outtour.az',
      '+994 50 123 45 68',
      '{"linkedin": "https://linkedin.com/in/leyla-gasimova", "instagram": "https://instagram.com/leyla_eco"}',
      2
    ),
    (
      'Elvin Huseynov',
      'Mountain Safety Expert',
      'Elvin brings extensive mountaineering experience and ensures the highest safety standards on all our adventures. He is a certified mountain guide with international qualifications and has climbed peaks across the Caucasus region.',
      '/assets/team/elvin-huseynov.jpg',
      'elvin@outtour.az',
      '+994 50 123 45 69',
      '{"linkedin": "https://linkedin.com/in/elvin-huseynov", "instagram": "https://instagram.com/elvin_mountain"}',
      3
    )
    ON CONFLICT DO NOTHING
  `);

    client.release();
    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

export default pool;
