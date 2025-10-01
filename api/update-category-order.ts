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

// Desired order by slug
const categoryOrder = [
  'hiking',
  'trekking',
  'wildlife',
  'culture-tours',
  'group-tours',
  'tailor-made'
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
    console.log('Starting to update category order...');

    let updatedCount = 0;
    
    // Update each category's sort_order based on the desired order
    for (let i = 0; i < categoryOrder.length; i++) {
      const slug = categoryOrder[i];
      const result = await pool.query(
        'UPDATE tour_categories SET sort_order = $1 WHERE slug = $2',
        [i, slug]
      );
      
      if (result.rowCount && result.rowCount > 0) {
        updatedCount++;
        console.log(`Updated ${slug} to order ${i}`);
      }
    }

    console.log(`Successfully updated ${updatedCount} categories`);

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} categories`,
      order: categoryOrder,
      updatedCount
    });

  } catch (error) {
    console.error('Error updating category order:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update category order',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

