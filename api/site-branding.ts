import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_cuU7z3plExsy@ep-winter-shadow-ad30554v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(dbConfig);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(res);
      case 'PUT':
        return await handlePut(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Site branding API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_branding (
      id INTEGER PRIMARY KEY DEFAULT 1,
      favicon_url TEXT,
      apple_touch_icon_url TEXT,
      updated_by VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function handleGet(res: VercelResponse) {
  await ensureTable();

  const result = await pool.query(`
    SELECT id, favicon_url, apple_touch_icon_url, updated_by, created_at, updated_at
    FROM site_branding
    ORDER BY updated_at DESC
    LIMIT 1
  `);

  return res.status(200).json({
    success: true,
    data: result.rows[0] || null
  });
}

async function handlePut(req: VercelRequest, res: VercelResponse) {
  await ensureTable();

  const rawFaviconUrl = typeof req.body?.favicon_url === 'string' ? req.body.favicon_url.trim() : '';
  const rawAppleUrl = typeof req.body?.apple_touch_icon_url === 'string' ? req.body.apple_touch_icon_url.trim() : '';
  const updatedBy = typeof req.body?.updated_by === 'string' ? req.body.updated_by.trim() : 'admin-panel';

  if (!rawFaviconUrl) {
    return res.status(400).json({
      success: false,
      error: 'favicon_url is required'
    });
  }

  const result = await pool.query(`
    INSERT INTO site_branding (id, favicon_url, apple_touch_icon_url, updated_by)
    VALUES (1, $1, $2, $3)
    ON CONFLICT (id)
    DO UPDATE SET
      favicon_url = EXCLUDED.favicon_url,
      apple_touch_icon_url = EXCLUDED.apple_touch_icon_url,
      updated_by = EXCLUDED.updated_by,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id, favicon_url, apple_touch_icon_url, updated_by, created_at, updated_at
  `, [
    rawFaviconUrl,
    rawAppleUrl || null,
    updatedBy || 'admin-panel'
  ]);

  return res.status(200).json({
    success: true,
    data: result.rows[0],
    message: 'Branding updated successfully'
  });
}


