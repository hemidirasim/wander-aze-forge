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

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    console.log('=== UPDATE BASIC TOUR API CALLED ===');
    console.log('Tour ID:', id);
    console.log('Request body:', req.body);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Tour ID is required'
      });
    }

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
    const title = req.body.title?.trim() || '';
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const tourData = {
      title,
      slug,
      description: req.body.description?.trim() || '',
      category: req.body.category?.trim() || '',
      duration: req.body.duration?.trim() || '',
      difficulty: req.body.difficulty?.trim() || '',
      price: parseFloat(req.body.price) || 0,
      maxParticipants: parseInt(req.body.maxParticipants) || 0,
      bookedSeats: parseInt(req.body.bookedSeats) || 0,
      minParticipants: parseInt(req.body.minParticipants) || null,
      rating: parseFloat(req.body.rating) || 4.5,
      reviewsCount: parseInt(req.body.reviewsCount) || 0,
      groupSize: req.body.groupSize?.trim() || '',
      location: req.body.location?.trim() || '',
      totalHikingDistance: req.body.totalHikingDistance?.trim() || '',
      totalElevationGain: req.body.totalElevationGain?.trim() || '',
      totalElevationLoss: req.body.totalElevationLoss?.trim() || '',
      overview: req.body.overview?.trim() || '',
      bestSeason: req.body.bestSeason?.trim() || 'May to October',
      meetingPoint: req.body.meetingPoint?.trim() || '',
      languages: req.body.languages?.trim() || 'English, Azerbaijani, Russian',
      startDate: req.body.startDate?.trim() || null,
      endDate: req.body.endDate?.trim() || null,
      isActive: req.body.isActive !== false,
      featured: req.body.featured === true
    };

    console.log('Processed tour data:', tourData);

    // Update tour in database
    const query = `
      UPDATE tours SET
        title = $1,
        slug = $2,
        description = $3,
        category = $4,
        duration = $5,
        difficulty = $6,
        price = $7,
        max_participants = $8,
        booked_seats = $9,
        min_participants = $10,
        rating = $11,
        reviews_count = $12,
        group_size = $13,
        location = $14,
        total_hiking_distance = $15,
        total_elevation_gain = $16,
        total_elevation_loss = $17,
        overview = $18,
        best_season = $19,
        meeting_point = $20,
        languages = $21,
        start_date = $22,
        end_date = $23,
        is_active = $24,
        featured = $25,
        updated_at = NOW()
      WHERE id = $26
      RETURNING *
    `;

    const values = [
      tourData.title,
      tourData.slug,
      tourData.description,
      tourData.category,
      tourData.duration,
      tourData.difficulty,
      tourData.price,
      tourData.maxParticipants,
      tourData.bookedSeats,
      tourData.minParticipants,
      tourData.rating,
      tourData.reviewsCount,
      tourData.groupSize,
      tourData.location,
      tourData.totalHikingDistance,
      tourData.totalElevationGain,
      tourData.totalElevationLoss,
      tourData.overview,
      tourData.bestSeason,
      tourData.meetingPoint,
      tourData.languages,
      tourData.startDate,
      tourData.endDate,
      tourData.isActive,
      tourData.featured,
      id
    ];

    console.log('Executing database query with', values.length, 'parameters');

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    console.log('Basic tour updated successfully:', result.rows[0]);

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Basic tour information updated successfully'
    });

  } catch (error) {
    console.error('=== ERROR UPDATING BASIC TOUR ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to update basic tour information',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : null
    });
  }
}

