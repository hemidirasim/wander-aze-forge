import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import { sendEmail, contactConfirmationTemplate } from '../_lib/email.js';

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
    // First, check if table exists
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

    // Add columns if they don't exist (one by one with proper error handling)
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
        }
      } catch (alterError: any) {
        console.error(`Error adding column ${column.name}:`, alterError.message);
        // Continue anyway, might already exist or have issues
      }
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
      // Send confirmation email (non-blocking)
      try {
        await sendEmail({
          to: email,
          cc: 'info@outtour.az',
          subject: 'We received your message - Outtour Azerbaijan',
          html: contactConfirmationTemplate({
            firstName,
            lastName,
            tourCategory,
            groupSize,
            dates,
            message,
          })
        });
      } catch (e) {
        console.error('Contact confirmation email error:', e);
      }
      
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
      try {
        await sendEmail({
          to: email,
          cc: 'info@outtour.az',
          subject: 'We received your message - Outtour Azerbaijan',
          html: contactConfirmationTemplate({
            firstName,
            lastName,
            tourCategory,
            groupSize,
            dates,
            message,
          })
        });
      } catch (e) {
        console.error('Contact confirmation email error:', e);
      }
      
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

    try {
      await sendEmail({
        to: email,
        cc: 'info@outtour.az',
        subject: 'We received your message - Outtour Azerbaijan',
        html: contactConfirmationTemplate({
          firstName,
          lastName,
          tourCategory,
          groupSize,
          dates,
          message,
        })
      });
    } catch (e) {
      console.error('Contact confirmation email error:', e);
    }

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

