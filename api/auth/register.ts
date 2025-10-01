import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_azc4jdxV_DsucP4N5cvXWsbiQxU6Rk7fD');

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
    const { firstName, lastName, email, password, phone, country } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'First name, last name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Ensure users table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        country VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user (email_verified = false by default)
    const result = await pool.query(`
      INSERT INTO users (first_name, last_name, email, password_hash, phone, country, email_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, first_name, last_name, email, phone, country, email_verified, created_at
    `, [
      firstName.trim(),
      lastName.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      phone?.trim() || null,
      country?.trim() || null
    ]);

    const user = result.rows[0];

    console.log('User registered successfully:', { id: user.id, email: user.email });

    // Send verification email
    try {
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Ensure email_verifications table exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS email_verifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          code VARCHAR(6) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id)
        )
      `);

      // Store verification code in database
      await pool.query(`
        INSERT INTO email_verifications (user_id, code, expires_at, created_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) 
        DO UPDATE SET code = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP
      `, [user.id, verificationCode, expiresAt]);

      // Send verification email
      const emailResult = await resend.emails.send({
        from: 'Outtour Azerbaijan <noreply@outtour.az>',
        to: [user.email],
        subject: 'Verify Your Email - Outtour Azerbaijan',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">Outtour Azerbaijan</h1>
              <p style="color: #666; margin: 5px 0;">Adventure Awaits</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 10px; text-align: center;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">Verify Your Email Address</h2>
              <p style="color: #4b5563; margin: 0 0 30px 0; line-height: 1.6;">
                Hi ${user.first_name},<br>
                Welcome to Outtour Azerbaijan! Please verify your email address to complete your registration.
              </p>
              
              <div style="background: #1f2937; color: white; padding: 20px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
                ${verificationCode}
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
                This code will expire in 15 minutes.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                If you didn't create an account with Outtour Azerbaijan, please ignore this email.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                © 2024 Outtour Azerbaijan. All rights reserved.
              </p>
            </div>
          </div>
        `
      });

      console.log('Verification email sent:', emailResult);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail registration if email fails
    }

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        emailVerified: user.email_verified,
        createdAt: user.created_at
      },
      message: 'User registered successfully. Please check your email to verify your account.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to register user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
