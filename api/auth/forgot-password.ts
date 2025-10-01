import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user exists
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

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset code in database
    await pool.query(`
      INSERT INTO password_resets (user_id, code, expires_at, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET code = $2, expires_at = $3, created_at = CURRENT_TIMESTAMP
    `, [user.id, resetCode, expiresAt]);

    // Send reset email
    try {
      const emailResult = await resend.emails.send({
        from: 'Outtour Azerbaijan <noreply@outtour.az>',
        to: [email],
        subject: 'Reset Your Password - Outtour Azerbaijan',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">Outtour Azerbaijan</h1>
              <p style="color: #666; margin: 5px 0;">Adventure Awaits</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 10px; text-align: center;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0;">Reset Your Password</h2>
              <p style="color: #4b5563; margin: 0 0 30px 0; line-height: 1.6;">
                Hi ${user.first_name},<br>
                You requested to reset your password. Use the code below to reset your password.
              </p>
              
              <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
                ${resetCode}
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
                This code will expire in 15 minutes.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                If you didn't request a password reset, please ignore this email.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                © 2024 Outtour Azerbaijan. All rights reserved.
              </p>
            </div>
          </div>
        `
      });

      console.log('Password reset email sent:', emailResult);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({
        success: false,
        error: 'Failed to send email',
        message: 'Email service is temporarily unavailable'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email',
      data: {
        email: email,
        expiresIn: 15 // minutes
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send password reset email',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
