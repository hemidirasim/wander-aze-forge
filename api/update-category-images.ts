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

const categoryImages = [
  {
    slug: 'hiking',
    image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/tours/Hiking.webp'
  },
  {
    slug: 'trekking',
    image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/tours/Trekking.webp'
  },
  {
    slug: 'wildlife',
    image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/tours/Wildlife.webp'
  },
  {
    slug: 'culture-tours',
    image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/tours/Culture.webp'
  },
  {
    slug: 'group-tours',
    image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/tours/Group%20tours.webp'
  },
  {
    slug: 'tailor-made',
    image_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/tours/Tailor-made.webp'
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
    console.log('Starting to update category images...');

    let updatedCount = 0;
    const results = [];

    for (const category of categoryImages) {
      const result = await pool.query(
        'UPDATE tour_categories SET image_url = $1 WHERE slug = $2 RETURNING name, slug',
        [category.image_url, category.slug]
      );
      
      if (result.rowCount && result.rowCount > 0) {
        updatedCount++;
        results.push({
          name: result.rows[0].name,
          slug: result.rows[0].slug,
          image_url: category.image_url
        });
        console.log(`Updated ${category.slug} with new image`);
      } else {
        console.log(`Category ${category.slug} not found in database`);
      }
    }

    console.log(`Successfully updated ${updatedCount} category images`);

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} category images`,
      updatedCount,
      results
    });

  } catch (error) {
    console.error('Error updating category images:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update category images',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

