import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

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
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email, reset code, and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Find user
    const userResult = await pool.query(
      'SELECT id, first_name, last_name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Check reset code
    const resetResult = await pool.query(
      'SELECT id, expires_at FROM password_resets WHERE user_id = $1 AND code = $2',
      [user.id, code]
    );

    if (resetResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset code'
      });
    }

    const reset = resetResult.rows[0];

    // Check if code is expired
    if (new Date() > new Date(reset.expires_at)) {
      return res.status(400).json({
        success: false,
        error: 'Reset code has expired'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, user.id]
    );

    // Delete reset code
    await pool.query(
      'DELETE FROM password_resets WHERE user_id = $1',
      [user.id]
    );

    console.log('Password reset successfully for user:', user.id);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: email
      }
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

