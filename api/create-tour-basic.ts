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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== CREATE BASIC TOUR API CALLED ===');
    console.log('Request body:', req.body);

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'duration', 'difficulty', 'price', 'maxParticipants'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields
      });
    }

    // Extract basic tour data
    const tourData = {
      title: req.body.title?.trim() || '',
      description: req.body.description?.trim() || '',
      category: req.body.category?.trim() || '',
      duration: req.body.duration?.trim() || '',
      difficulty: req.body.difficulty?.trim() || '',
      price: parseFloat(req.body.price) || 0,
      maxParticipants: parseInt(req.body.maxParticipants) || 0,
      rating: parseFloat(req.body.rating) || 4.5,
      reviewsCount: parseInt(req.body.reviewsCount) || 0,
      groupSize: req.body.groupSize?.trim() || '',
      location: req.body.location?.trim() || '',
      overview: req.body.overview?.trim() || '',
      bestSeason: req.body.bestSeason?.trim() || 'May to October',
      meetingPoint: req.body.meetingPoint?.trim() || '',
      languages: req.body.languages?.trim() || 'English, Azerbaijani, Russian',
      isActive: req.body.isActive !== false,
      featured: req.body.featured === true
    };

    console.log('Processed tour data:', tourData);

    // Create basic tour in database
    const query = `
      INSERT INTO tours (
        title, description, category, duration, difficulty, price, max_participants,
        rating, reviews_count, group_size, location, overview, best_season,
        meeting_point, languages, is_active, featured, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      tourData.title,
      tourData.description,
      tourData.category,
      tourData.duration,
      tourData.difficulty,
      tourData.price,
      tourData.maxParticipants,
      tourData.rating,
      tourData.reviewsCount,
      tourData.groupSize,
      tourData.location,
      tourData.overview,
      tourData.bestSeason,
      tourData.meetingPoint,
      tourData.languages,
      tourData.isActive,
      tourData.featured
    ];

    console.log('Executing database query with', values.length, 'parameters');

    const result = await pool.query(query, values);
    console.log('Basic tour created successfully:', result.rows[0]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Basic tour created successfully'
    });

  } catch (error) {
    console.error('=== ERROR CREATING BASIC TOUR ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to create basic tour',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : null
    });
  }
}

