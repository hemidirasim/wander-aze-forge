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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting to update reviews with images...');

    // First, ensure the image_url column exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'reviews' AND column_name = 'image_url'
    `;
    
    const checkResult = await pool.query(checkColumnQuery);
    
    if (checkResult.rows.length === 0) {
      // Add the column if it doesn't exist
      await pool.query('ALTER TABLE reviews ADD COLUMN image_url TEXT');
      console.log('Added image_url column');
    }

    // Update each review with its corresponding image
    const updates = [
      {
        name: 'Lonely Planet',
        image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/reviews/Lonely%20Planet.webp'
      },
      {
        name: 'Kasia from Poland',
        image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/reviews/Kasia.webp'
      },
      {
        name: 'Henning from Germany',
        image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/reviews/Henning.webp'
      },
      {
        name: 'Hilde from Netherlands',
        image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/reviews/Hilde.webp'
      },
      {
        name: 'Nathan from USA',
        image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/reviews/Nathan.webp'
      },
      {
        name: 'Roya from UAE',
        image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/reviews/Roya.webp'
      }
    ];

    let updatedCount = 0;
    for (const update of updates) {
      const result = await pool.query(
        'UPDATE reviews SET image_url = $1 WHERE name = $2',
        [update.image_url, update.name]
      );
      
      if (result.rowCount && result.rowCount > 0) {
        updatedCount++;
        console.log(`Updated ${update.name} with image`);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} reviews with images`,
      updatedCount
    });

  } catch (error) {
    console.error('Error updating reviews with images:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update reviews with images',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

