import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// Database configuration
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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Hero Section API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await pool.query('SELECT * FROM hero_section WHERE is_active = true ORDER BY created_at DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No active hero section found'
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching hero section:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch hero section',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      title,
      subtitle,
      description,
      image_url,
      button1_text,
      button1_link,
      button2_text,
      button2_link,
      is_active,
      title_color,
      subtitle_color,
      description_color
    } = req.body;

    console.log('Hero section POST request:', {
      title,
      subtitle,
      description,
      image_url,
      button1_text,
      button1_link,
      button2_text,
      button2_link,
      is_active,
      title_color,
      subtitle_color,
      description_color
    });

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    // Ensure hero_section table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_section (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(500),
        description TEXT,
        image_url VARCHAR(500),
        button1_text VARCHAR(100),
        button1_link VARCHAR(255),
        button2_text VARCHAR(100),
        button2_link VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        title_color VARCHAR(7) DEFAULT '#ffffff',
        subtitle_color VARCHAR(7) DEFAULT '#d46e39',
        description_color VARCHAR(7) DEFAULT '#ffffff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add color columns if they don't exist
    await pool.query(`
      ALTER TABLE hero_section 
      ADD COLUMN IF NOT EXISTS title_color VARCHAR(7) DEFAULT '#ffffff',
      ADD COLUMN IF NOT EXISTS subtitle_color VARCHAR(7) DEFAULT '#d46e39',
      ADD COLUMN IF NOT EXISTS description_color VARCHAR(7) DEFAULT '#ffffff'
    `);

    // Deactivate all existing hero sections
    await pool.query('UPDATE hero_section SET is_active = false');

    // Insert new hero section
    const result = await pool.query(`
      INSERT INTO hero_section (
        title, subtitle, description, image_url, 
        button1_text, button1_link, button2_text, button2_link, is_active,
        title_color, subtitle_color, description_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      title.trim(),
      subtitle?.trim() || '',
      description?.trim() || '',
      image_url?.trim() || '',
      button1_text?.trim() || '',
      button1_link?.trim() || '',
      button2_text?.trim() || '',
      button2_link?.trim() || '',
      is_active !== false,
      title_color?.trim() || '#ffffff',
      subtitle_color?.trim() || '#d46e39',
      description_color?.trim() || '#ffffff'
    ]);

    console.log('Hero section created successfully:', result.rows[0]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Hero section created successfully'
    });

  } catch (error) {
    console.error('Error creating hero section:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create hero section',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}

async function handlePut(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    const {
      title,
      subtitle,
      description,
      image_url,
      button1_text,
      button1_link,
      button2_text,
      button2_link,
      is_active
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Hero section ID is required'
      });
    }

    // If this hero section is being activated, deactivate all others
    if (is_active === true) {
      await pool.query('UPDATE hero_section SET is_active = false WHERE id != $1', [id]);
    }

    // Update hero section
    const result = await pool.query(`
      UPDATE hero_section SET
        title = $1,
        subtitle = $2,
        description = $3,
        image_url = $4,
        button1_text = $5,
        button1_link = $6,
        button2_text = $7,
        button2_link = $8,
        is_active = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [
      title?.trim() || '',
      subtitle?.trim() || '',
      description?.trim() || '',
      image_url?.trim() || '',
      button1_text?.trim() || '',
      button1_link?.trim() || '',
      button2_text?.trim() || '',
      button2_link?.trim() || '',
      is_active !== false,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Hero section not found'
      });
    }

    console.log('Hero section updated successfully:', result.rows[0]);

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Hero section updated successfully'
    });

  } catch (error) {
    console.error('Error updating hero section:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update hero section',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
