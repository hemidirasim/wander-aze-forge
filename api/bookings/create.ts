import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
    // Check authentication (optional - user_id can be null)
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId || null;
      } catch (jwtError) {
        console.log('JWT verification failed (optional):', jwtError);
        // Continue without user_id - booking can be created without authentication
      }
    }

    console.log('=== BOOKING REQUEST RECEIVED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Extract data from request body - support both old and new structure
    const { 
      tourId, 
      tourTitle, 
      tourCategory, 
      tourDate,
      participants,
      totalPrice,
      formData,
      specialRequests, 
      emergencyContactName, 
      emergencyContactPhone 
    } = req.body;

    // Extract from formData if present (new structure)
    const finalTourId = tourId || formData?.tourId;
    const finalTourTitle = tourTitle || formData?.tourName || tourTitle;
    const finalTourCategory = tourCategory || formData?.tourCategory || tourCategory;
    const finalTourDate = tourDate || formData?.preferredDate;
    const finalParticipants = participants || parseInt(formData?.groupSize || '1');
    
    // Parse price from tourPrice (format: "Total $360" or "$360" or "360")
    let parsedPrice = 0;
    if (totalPrice) {
      parsedPrice = typeof totalPrice === 'number' ? totalPrice : parseFloat(String(totalPrice));
    } else if (formData?.tourPrice) {
      const priceStr = String(formData.tourPrice).replace(/[^0-9.]/g, '');
      parsedPrice = parseFloat(priceStr) || 0;
    }
    const finalTotalPrice = parsedPrice;
    const finalSpecialRequests = specialRequests || formData?.specialRequests || null;
    const finalEmergencyContactName = emergencyContactName || formData?.emergencyContactName || null;
    const finalEmergencyContactPhone = emergencyContactPhone || formData?.emergencyContactPhone || null;

    // Contact information from formData
    const fullName = formData?.fullName || null;
    const email = formData?.email || null;
    const phone = formData?.phone || null;
    const country = formData?.country || null;
    const alternativeDate = formData?.alternativeDate || null;
    const pickupLocation = formData?.pickupLocation || null;
    const informLater = formData?.informLater || false;
    const bookingRequest = formData?.bookingRequest || false;
    const termsAccepted = formData?.terms || false;

    console.log('Extracted fields:', {
      finalTourId,
      finalTourTitle,
      finalTourCategory,
      finalTourDate,
      finalParticipants,
      finalTotalPrice,
      fullName,
      email,
      phone
    });

    // Validation
    if (!finalTourId || !finalTourTitle || !finalTourCategory || !finalTourDate || !finalParticipants) {
      console.error('Validation failed - missing fields:', {
        tourId: !!finalTourId,
        tourTitle: !!finalTourTitle,
        tourCategory: !!finalTourCategory,
        tourDate: !!finalTourDate,
        participants: !!finalParticipants,
        totalPrice: finalTotalPrice,
        formDataTourPrice: formData?.tourPrice
      });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields: {
          tourId: !finalTourId,
          tourTitle: !finalTourTitle,
          tourCategory: !finalTourCategory,
          tourDate: !finalTourDate,
          participants: !finalParticipants
        },
        received: {
          tourId: finalTourId,
          tourTitle: finalTourTitle,
          tourCategory: finalTourCategory,
          tourDate: finalTourDate,
          participants: finalParticipants,
          totalPrice: finalTotalPrice,
          formDataTourPrice: formData?.tourPrice
        }
      });
    }

    if (finalTotalPrice <= 0) {
      console.error('Validation failed - invalid totalPrice:', {
        totalPrice: finalTotalPrice,
        formDataTourPrice: formData?.tourPrice,
        originalTotalPrice: totalPrice
      });
      return res.status(400).json({
        success: false,
        error: 'Total price must be greater than 0',
        received: {
          totalPrice: finalTotalPrice,
          formDataTourPrice: formData?.tourPrice
        }
      });
    }

    if (finalParticipants < 1 || finalParticipants > 20) {
      return res.status(400).json({
        success: false,
        error: 'Number of participants must be between 1 and 20'
      });
    }

    if (finalTotalPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Total price must be greater than 0'
      });
    }

    // Ensure bookings table exists with all required columns
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        tour_id INTEGER NOT NULL,
        tour_title VARCHAR(255) NOT NULL,
        tour_category VARCHAR(100),
        group_size INTEGER NOT NULL,
        tour_price VARCHAR(100),
        full_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        country VARCHAR(100),
        preferred_date DATE,
        alternative_date DATE,
        pickup_location TEXT,
        inform_later BOOLEAN DEFAULT false,
        special_requests TEXT,
        booking_request BOOLEAN DEFAULT false,
        terms_accepted BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'pending',
        total_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add new columns if they don't exist (for existing tables)
    try {
      // Check which columns exist
      const columnCheck = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'bookings'
      `);
      const existingColumns = columnCheck.rows.map(r => r.column_name);
      console.log('Existing columns:', existingColumns);
      
      // Add all required columns that don't exist
      const columnsToAdd = [
        { name: 'user_id', sql: 'ALTER TABLE bookings ADD COLUMN user_id INTEGER' },
        { name: 'tour_id', sql: 'ALTER TABLE bookings ADD COLUMN tour_id INTEGER' },
        { name: 'tour_title', sql: 'ALTER TABLE bookings ADD COLUMN tour_title VARCHAR(255)' },
        { name: 'tour_category', sql: 'ALTER TABLE bookings ADD COLUMN tour_category VARCHAR(100)' },
        { name: 'group_size', sql: 'ALTER TABLE bookings ADD COLUMN group_size INTEGER' },
        { name: 'tour_price', sql: 'ALTER TABLE bookings ADD COLUMN tour_price VARCHAR(100)' },
        { name: 'full_name', sql: 'ALTER TABLE bookings ADD COLUMN full_name VARCHAR(255)' },
        { name: 'customer_name', sql: 'ALTER TABLE bookings ADD COLUMN customer_name VARCHAR(255)' },
        { name: 'customer_email', sql: 'ALTER TABLE bookings ADD COLUMN customer_email VARCHAR(255)' },
        { name: 'customer_phone', sql: 'ALTER TABLE bookings ADD COLUMN customer_phone VARCHAR(50)' },
        { name: 'email', sql: 'ALTER TABLE bookings ADD COLUMN email VARCHAR(255)' },
        { name: 'phone', sql: 'ALTER TABLE bookings ADD COLUMN phone VARCHAR(50)' },
        { name: 'country', sql: 'ALTER TABLE bookings ADD COLUMN country VARCHAR(100)' },
        { name: 'preferred_date', sql: 'ALTER TABLE bookings ADD COLUMN preferred_date DATE' },
        { name: 'booking_date', sql: 'ALTER TABLE bookings ADD COLUMN booking_date DATE' },
        { name: 'alternative_date', sql: 'ALTER TABLE bookings ADD COLUMN alternative_date DATE' },
        { name: 'pickup_location', sql: 'ALTER TABLE bookings ADD COLUMN pickup_location TEXT' },
        { name: 'inform_later', sql: 'ALTER TABLE bookings ADD COLUMN inform_later BOOLEAN DEFAULT false' },
        { name: 'special_requests', sql: 'ALTER TABLE bookings ADD COLUMN special_requests TEXT' },
        { name: 'booking_request', sql: 'ALTER TABLE bookings ADD COLUMN booking_request BOOLEAN DEFAULT false' },
        { name: 'terms_accepted', sql: 'ALTER TABLE bookings ADD COLUMN terms_accepted BOOLEAN DEFAULT false' },
        { name: 'status', sql: 'ALTER TABLE bookings ADD COLUMN status VARCHAR(50) DEFAULT \'pending\'' },
        { name: 'total_price', sql: 'ALTER TABLE bookings ADD COLUMN total_price DECIMAL(10,2)' },
        { name: 'created_at', sql: 'ALTER TABLE bookings ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
        { name: 'updated_at', sql: 'ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
      ];

      for (const column of columnsToAdd) {
        if (!existingColumns.includes(column.name)) {
          console.log(`Adding column ${column.name}...`);
          try {
            await pool.query(column.sql);
            console.log(`Column ${column.name} added successfully`);
          } catch (colError: any) {
            console.error(`Error adding column ${column.name}:`, colError.message);
          }
        }
      }

      // If tour_date exists but preferred_date doesn't, copy data
      if (existingColumns.includes('tour_date') && !existingColumns.includes('preferred_date')) {
        await pool.query(`ALTER TABLE bookings ADD COLUMN preferred_date DATE`);
        await pool.query(`UPDATE bookings SET preferred_date = tour_date WHERE preferred_date IS NULL`);
      }
      
      // Ensure booking_date exists and copy from preferred_date if needed
      if (!existingColumns.includes('booking_date')) {
        await pool.query(`ALTER TABLE bookings ADD COLUMN booking_date DATE`);
        if (existingColumns.includes('preferred_date')) {
          await pool.query(`UPDATE bookings SET booking_date = preferred_date WHERE booking_date IS NULL`);
        } else if (existingColumns.includes('tour_date')) {
          await pool.query(`UPDATE bookings SET booking_date = tour_date WHERE booking_date IS NULL`);
        }
      }
      
      // Verify all required columns exist before insert
      const updatedColumnCheck = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'bookings'
      `);
      const finalColumns = updatedColumnCheck.rows.map(r => r.column_name);
      console.log('Final columns after migration:', finalColumns);
      
      // If user_id exists but has NOT NULL constraint, we need to make it nullable
      // This is handled by the CREATE TABLE IF NOT EXISTS above which has user_id as nullable
    } catch (alterError) {
      console.log('Error adding columns (may already exist):', alterError);
    }

    // Create booking
    console.log('Inserting booking into database...');
    const result = await pool.query(`
      INSERT INTO bookings (
        user_id, tour_id, tour_title, tour_category, group_size, tour_price,
        customer_name, customer_email, customer_phone, country,
        booking_date, preferred_date, alternative_date, pickup_location, inform_later,
        special_requests, booking_request, terms_accepted, total_price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING id, tour_id, tour_title, tour_category, group_size, tour_price,
                customer_name, customer_email, customer_phone, country,
                booking_date, preferred_date, alternative_date, pickup_location, inform_later,
                special_requests, booking_request, terms_accepted, status, total_price, created_at
    `, [
      userId, // Can be null
      finalTourId,
      finalTourTitle,
      finalTourCategory,
      finalParticipants,
      formData?.tourPrice || null,
      fullName, // This maps to customer_name
      email, // This maps to customer_email
      phone, // This maps to customer_phone
      country,
      finalTourDate || null, // This maps to booking_date
      finalTourDate || null, // This maps to preferred_date
      alternativeDate || null,
      pickupLocation || null,
      informLater,
      finalSpecialRequests,
      bookingRequest,
      termsAccepted,
      finalTotalPrice
    ]);

    const booking = result.rows[0];

    console.log('Booking created successfully:', { id: booking.id, userId: userId });

    return res.status(201).json({
      success: true,
      data: booking,
      message: 'Tour booked successfully! You will receive a confirmation email shortly.'
    });

  } catch (error: any) {
    console.error('=== BOOKING CREATION ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error detail:', error?.detail);
    
    // Check if it's a database error
    if (error?.code === '42703') {
      // Extract column name from error message
      const columnMatch = error?.message?.match(/column "([^"]+)"/);
      const columnName = columnMatch ? columnMatch[1] : 'unknown';
      return res.status(500).json({
        success: false,
        error: 'Database column does not exist',
        message: `Column "${columnName}" does not exist. Please run the migration SQL script.`,
        details: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error?.detail || error?.message,
      code: error?.code
    });
  }
}
