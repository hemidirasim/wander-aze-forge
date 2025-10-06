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

const categoryIcons = [
  {
    slug: 'hiking',
    icon_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/icons/Hiking.svg'
  },
  {
    slug: 'trekking',
    icon_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/icons/Trekking.svg'
  },
  {
    slug: 'wildlife',
    icon_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/icons/Wildlife.svg'
  },
  {
    slug: 'culture-tours',
    icon_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/icons/Culture.svg'
  },
  {
    slug: 'tailor-made',
    icon_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/icons/Tailor-made.svg'
  }
];

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
    console.log('Adding icon_url column and updating category icons...');

    // Check if column already exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tour_categories' AND column_name = 'icon_url'
    `;
    
    const checkResult = await pool.query(checkColumnQuery);
    
    if (checkResult.rows.length === 0) {
      // Add the icon_url column
      await pool.query('ALTER TABLE tour_categories ADD COLUMN icon_url TEXT');
      console.log('Added icon_url column');
    } else {
      console.log('icon_url column already exists');
    }

    // Update each category with its icon
    let updatedCount = 0;
    const results = [];

    for (const category of categoryIcons) {
      const result = await pool.query(
        'UPDATE tour_categories SET icon_url = $1 WHERE slug = $2 RETURNING name, slug, icon_url',
        [category.icon_url, category.slug]
      );
      
      if (result.rowCount && result.rowCount > 0) {
        updatedCount++;
        results.push(result.rows[0]);
        console.log(`Updated ${category.slug} with icon`);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully added icon column and updated ${updatedCount} category icons`,
      updatedCount,
      results
    });

  } catch (error) {
    console.error('Error updating category icons:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update category icons',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}


