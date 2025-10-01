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
    console.log('Setting up email verification table...');

    // Create email_verifications table
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

    // Create password_resets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_email_verifications_code ON email_verifications(code)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_password_resets_code ON password_resets(code)');

    console.log('Email verification tables created successfully');

    return res.status(200).json({
      success: true,
      message: 'Email verification tables created successfully',
      tables: [
        'email_verifications - Email verification codes',
        'password_resets - Password reset codes'
      ]
    });

  } catch (error) {
    console.error('Error setting up email verification tables:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to setup email verification tables',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
