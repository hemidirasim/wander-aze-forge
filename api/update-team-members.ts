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

const newTeamMembers = [
  {
    name: 'Javid Gara',
    position: 'Founder & Mountain guide',
    bio: 'Founder of Outtour Azerbaijan and experienced mountain guide',
    photo_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/team/javid.avif',
    social_links: {
      linkedin: 'https://www.linkedin.com/in/javidgara/'
    },
    order_index: 0,
    is_active: true
  },
  {
    name: 'Elvin Mammadsoy',
    position: 'Director, Mountain & Birding guide',
    bio: 'Director and expert mountain and birding guide',
    photo_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/team/elvin.avif',
    social_links: {
      linkedin: 'https://www.linkedin.com/in/elvin-memmedsoy-497014aa/',
      instagram: 'https://www.instagram.com/memmedsoy/'
    },
    order_index: 1,
    is_active: true
  },
  {
    name: 'Gunay Murshud',
    position: 'Mountain guide',
    bio: 'Experienced mountain guide',
    photo_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/team/gunay.avif',
    social_links: {
      linkedin: 'https://www.linkedin.com/in/gunay-murshud/',
      instagram: 'https://www.instagram.com/gunaygedir/'
    },
    order_index: 2,
    is_active: true
  },
  {
    name: 'Shahin Garayev',
    position: 'Mountain guide',
    bio: 'Professional mountain guide',
    photo_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/team/shahin.avif',
    social_links: {
      instagram: 'https://www.instagram.com/shahin_garayev/'
    },
    order_index: 3,
    is_active: true
  },
  {
    name: 'Zulfu Farajli',
    position: 'Birding guide',
    bio: 'Expert birding guide',
    photo_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/team/zulfu.avif',
    social_links: {
      linkedin: 'https://www.linkedin.com/in/zulfu-farajli-681905160/'
    },
    order_index: 4,
    is_active: true
  },
  {
    name: 'Elshan Baba',
    position: 'Photographer & Graphic Designer',
    bio: 'Professional photographer and graphic designer',
    photo_url: 'https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/team/elshan.avif',
    social_links: {
      linkedin: 'https://www.linkedin.com/in/baba-elshan/',
      instagram: 'https://www.instagram.com/elshan_baba/'
    },
    order_index: 5,
    is_active: true
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
    console.log('Starting to update team members...');

    // Delete all existing team members
    await pool.query('DELETE FROM team_members');
    console.log('Deleted all existing team members');

    // Insert new team members
    for (const member of newTeamMembers) {
      await pool.query(
        `INSERT INTO team_members (name, position, bio, photo_url, social_links, order_index, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          member.name,
          member.position,
          member.bio,
          member.photo_url,
          JSON.stringify(member.social_links),
          member.order_index,
          member.is_active
        ]
      );
    }

    console.log(`Successfully inserted ${newTeamMembers.length} team members`);

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${newTeamMembers.length} team members`,
      count: newTeamMembers.length
    });

  } catch (error) {
    console.error('Error updating team members:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update team members',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

