import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// Initialize PostgreSQL connection
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
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      tourCategory,
      tourType,
      groupSize,
      dates,
      message,
      newsletter
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !country || !tourCategory || !groupSize || !dates || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Ensure contact_messages table exists with all required fields
    // First, add columns if they don't exist (one by one)
    try {
      await pool.query(`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS first_name VARCHAR(255)`);
      await pool.query(`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS last_name VARCHAR(255)`);
      await pool.query(`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS country VARCHAR(100)`);
      await pool.query(`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS tour_category VARCHAR(100)`);
      await pool.query(`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS tour_type VARCHAR(255)`);
      await pool.query(`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS group_size INTEGER`);
      await pool.query(`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS dates VARCHAR(255)`);
      await pool.query(`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS newsletter BOOLEAN DEFAULT false`);
    } catch (alterError) {
      console.log('Error adding columns (may already exist):', alterError);
      // Continue anyway, columns might already exist
    }

    // Check which columns exist in the table
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_messages' 
      AND column_name IN ('name', 'first_name', 'last_name')
    `);
    
    const hasName = checkResult.rows.some(r => r.column_name === 'name');
    const hasFirstName = checkResult.rows.some(r => r.column_name === 'first_name');
    
    // If first_name and last_name columns exist, use them
    if (hasFirstName) {
      // Use new structure with first_name and last_name
      // Also include name field if it exists (to satisfy NOT NULL constraint)
      const insertFields = hasName 
        ? 'first_name, last_name, name, email, phone, country, tour_category, tour_type, group_size, dates, message, newsletter'
        : 'first_name, last_name, email, phone, country, tour_category, tour_type, group_size, dates, message, newsletter';
      
      const insertValues = hasName
        ? '$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12'
        : '$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11';
      
      const returnFields = hasName
        ? 'id, first_name, last_name, name, email, phone, country, tour_category, tour_type, group_size, dates, message, newsletter, created_at'
        : 'id, first_name, last_name, email, phone, country, tour_category, tour_type, group_size, dates, message, newsletter, created_at';
      
      const params = hasName
        ? [
            firstName,
            lastName,
            `${firstName} ${lastName}`, // name field
            email,
            phone || null,
            country,
            tourCategory,
            tourType || null,
            parseInt(groupSize),
            dates,
            message,
            newsletter || false
          ]
        : [
            firstName,
            lastName,
            email,
            phone || null,
            country,
            tourCategory,
            tourType || null,
            parseInt(groupSize),
            dates,
            message,
            newsletter || false
          ];
      
      const result = await pool.query(`
        INSERT INTO contact_messages (
          ${insertFields}
        ) VALUES (${insertValues})
        RETURNING ${returnFields}
      `, params);
      
      const contactMessage = result.rows[0];
      console.log('Contact message created successfully (new structure):', { id: contactMessage.id, email });
      
      return res.status(201).json({
        success: true,
        data: contactMessage,
        message: 'Thank you for contacting us! We will get back to you soon.'
      });
    }
    
    // If only name column exists (old structure), use it
    if (hasName) {
      // Insert with name field (concatenating first and last name)
      const result = await pool.query(`
        INSERT INTO contact_messages (
          name, email, phone, country, 
          tour_category, tour_type, group_size, dates, 
          message, newsletter
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, name, email, phone, country, 
                  tour_category, tour_type, group_size, dates, message, 
                  newsletter, created_at
      `, [
        `${firstName} ${lastName}`,
        email,
        phone || null,
        country,
        tourCategory,
        tourType || null,
        parseInt(groupSize),
        dates,
        message,
        newsletter || false
      ]);
      
      const contactMessage = result.rows[0];
      console.log('Contact message created successfully (old structure):', { id: contactMessage.id, email });
      
      return res.status(201).json({
        success: true,
        data: contactMessage,
        message: 'Thank you for contacting us! We will get back to you soon.'
      });
    }
    
    // Fallback: try to insert with name field (in case table was just created)
    const result = await pool.query(`
      INSERT INTO contact_messages (
        name, email, phone, country, 
        tour_category, tour_type, group_size, dates, 
        message, newsletter
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, name, email, phone, country, 
                tour_category, tour_type, group_size, dates, message, 
                newsletter, created_at
    `, [
      `${firstName} ${lastName}`,
      email,
      phone || null,
      country,
      tourCategory,
      tourType || null,
      parseInt(groupSize),
      dates,
      message,
      newsletter || false
    ]);

    const contactMessage = result.rows[0];

    console.log('Contact message created successfully:', { id: contactMessage.id, email });

    return res.status(201).json({
      success: true,
      data: contactMessage,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to submit contact form',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

