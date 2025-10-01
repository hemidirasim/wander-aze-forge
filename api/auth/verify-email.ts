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
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'Email and verification code are required'
      });
    }

    // Find user
    const userResult = await pool.query(
      'SELECT id, first_name, last_name, email_verified FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // Check verification code
    const verificationResult = await pool.query(
      'SELECT id, expires_at FROM email_verifications WHERE user_id = $1 AND code = $2',
      [user.id, code]
    );

    if (verificationResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    const verification = verificationResult.rows[0];

    // Check if code is expired
    if (new Date() > new Date(verification.expires_at)) {
      return res.status(400).json({
        success: false,
        error: 'Verification code has expired'
      });
    }

    // Mark email as verified
    await pool.query(
      'UPDATE users SET email_verified = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Delete verification code
    await pool.query(
      'DELETE FROM email_verifications WHERE user_id = $1',
      [user.id]
    );

    console.log('Email verified successfully for user:', user.id);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: email,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify email',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
