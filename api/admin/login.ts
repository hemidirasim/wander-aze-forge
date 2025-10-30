import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// DB connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username, password: password ? '***' : 'empty' });
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Ensure admin_users table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Try database authentication first
    const userResult = await pool.query(
      `SELECT id, username, email, password_hash, role, is_active FROM admin_users WHERE username = $1 OR email = $1 LIMIT 1`,
      [username]
    );

    if (userResult.rows.length > 0) {
      const dbUser = userResult.rows[0];
      if (!dbUser.is_active) {
        return res.status(403).json({ success: false, message: 'Account is disabled' });
      }

      const ok = await bcrypt.compare(password, dbUser.password_hash);
      if (!ok) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const secret = process.env.ADMIN_JWT_SECRET || 'replace-this-secret';
      const token = jwt.sign(
        { sub: dbUser.id, username: dbUser.username, role: dbUser.role || 'admin' },
        secret,
        { expiresIn: '12h' }
      );
      console.log('Authentication successful for:', username);
      
      return res.status(200).json({ 
        success: true, 
        token, 
        user: { 
          username: dbUser.username, 
          id: dbUser.id,
          permissions: ['manage_tours', 'manage_projects', 'manage_programs', 'manage_partners', 'manage_blog', 'view_analytics'],
          role: dbUser.role
        } 
      });
    }

    // Fallback to ENV credentials ONLY if no admin_users records exist
    const countResult = await pool.query('SELECT COUNT(*)::int AS cnt FROM admin_users');
    if (countResult.rows[0].cnt === 0) {
      const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-this-password';
      const userMatch = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
      if (userMatch) {
        const secret = process.env.ADMIN_JWT_SECRET || 'replace-this-secret';
        const token = jwt.sign(
          { sub: ADMIN_USERNAME, username: ADMIN_USERNAME, role: 'admin' },
          secret,
          { expiresIn: '12h' }
        );
        return res.status(200).json({ 
          success: true, 
          token, 
          user: { username: ADMIN_USERNAME, id: 1, permissions: ['manage_tours','manage_projects','manage_programs','manage_partners','manage_blog','view_analytics'], role: 'admin' }
        });
      }
    }

    console.log('Authentication failed for:', username);
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}