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

const newReviews = [
  {
    name: 'Lonely Planet',
    rating: 5,
    review_text: 'While the national park route can technically be covered independently in a long single day, it is highly recommended to break it into two days with an overnight in Siyov with the support of the great people at Camping Azerbaijan (@camping_azerbaijan).',
    source: 'Lonely Planet - Georgia, Armenia & Azerbaijan, 2024 edition, page 236',
    source_url: 'https://www.lonelyplanet.com/destinations/azerbaijan',
    is_featured: true
  },
  {
    name: 'Kasia from Poland',
    rating: 5,
    review_text: 'We booked a 5 days trek with Camping Azerbaijan, based on their recommended location. I added a half-day horse ride for the more difficult part of the trek - it was the most incredible experience we have had. Everything was perfectly organised, we used homestays that were clean and nice, the hosts were super friendly and we felt most welcomed. The food was simple but honestly tasted better than at most restaurants. Our guide - Elvin - promotes sustainable tourism and is involved in many social and environmental projects, this was important to us. I can honestly say that it was one of the best tours that I have ever been on.',
    source: 'TripAdvisor',
    source_url: 'https://www.tripadvisor.com/ShowUserReviews-g293934-d12661334-r590128625-Camping_Azerbaijan-Baku_Absheron_Region.html',
    is_featured: true
  },
  {
    name: 'Henning from Germany',
    rating: 5,
    review_text: 'Camping Azerbaijan is a must for curious and intrepid tourists, locals, and expats. Azerbaijan is typically known for Baku and a few other cities. But the Caucasus mountains have so much more to offer. Highly recommended - most travellers will never see what Camping Azerbaijan will show you!',
    source: 'TripAdvisor',
    source_url: 'https://www.tripadvisor.com/ShowUserReviews-g293934-d12661334-r623064553-Camping_Azerbaijan-Baku_Absheron_Region.html',
    is_featured: true
  },
  {
    name: 'Hilde from Netherlands',
    rating: 5,
    review_text: 'I went hiking with the guys from Camping Azerbaijan for over 10 times and every time again the hikes are amazing. The guides are friendly, the journey to the mountains is comfortable, and then the hikes are stunning. The guides know the best routes and even when going to the same place for a second time, it\'s different than before. The visits to the villages are special. It gives a unique insight in people\'s lives, there\'s no other way to experience it better as during those hikes. The trips are fun to do solo as well as with friends.',
    source: 'TripAdvisor',
    source_url: 'https://www.tripadvisor.com/ShowUserReviews-g293934-d12661334-r633448143-Camping_Azerbaijan-Baku_Absheron_Region.html',
    is_featured: true
  },
  {
    name: 'Nathan from USA',
    rating: 5,
    review_text: 'I was so impressed by my experience with Camping Azerbaijan. Tural — our hike leader — was on top of communication when I was inquiring about and booking the hike, and did a great job of leading the group all day. The planning and organization were impeccable; this was among the most well-organized tours I\'ve ever been on. If you\'re looking for an affordable and unique way to experience the countryside of Azerbaijan, you\'ve found it. Camping Azerbaijan is the best!',
    source: 'Open Road Before Me',
    source_url: 'https://openroadbeforeme.com/2018/05/hiking-with-camping-azerbaijan.html',
    is_featured: true
  },
  {
    name: 'Roya from UAE',
    rating: 5,
    review_text: 'They are real game-changers when it comes to touring the regions, either in overnight or one-day hiking trips. Unlike many others in the market who try to accommodate as many activities and places in a matter of a few hours, CA organises a unique and immersive experience for people to get up close and personal with the culture and the people by creating a detailed route plan with multiple stops along the way for tea and food in local houses, combined with interesting commentaries about the places we pass by, and some tales from their past and present by our amazing guide, Elvin.',
    source: 'TripAdvisor',
    source_url: 'https://www.tripadvisor.com/ShowUserReviews-g293934-d12661334-r845509136-Camping_Azerbaijan-Baku_Absheron_Region.html',
    is_featured: true
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
    console.log('Starting to seed reviews...');

    // Delete all existing reviews
    await pool.query('DELETE FROM reviews');
    console.log('Deleted all existing reviews');

    // Insert new reviews
    for (const review of newReviews) {
      await pool.query(
        `INSERT INTO reviews (name, rating, review_text, source, source_url, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [review.name, review.rating, review.review_text, review.source, review.source_url, review.is_featured]
      );
    }

    console.log(`Successfully inserted ${newReviews.length} reviews`);

    return res.status(200).json({
      success: true,
      message: `Successfully seeded ${newReviews.length} reviews`,
      count: newReviews.length
    });

  } catch (error) {
    console.error('Error seeding reviews:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to seed reviews',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}


