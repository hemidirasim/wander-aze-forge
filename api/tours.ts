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
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tours API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const { category } = req.query;

  try {
    let query = 'SELECT * FROM tours ORDER BY created_at DESC';
    let params: any[] = [];

    if (category && typeof category === 'string') {
      query = 'SELECT * FROM tours WHERE category = $1 ORDER BY created_at DESC';
      params = [category];
    }

    const result = await pool.query(query, params);
    
    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch tours'
    });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Received tour data:', JSON.stringify(req.body, null, 2));

    // Validate required fields
    if (!req.body.title || !req.body.description || !req.body.category || !req.body.duration || !req.body.difficulty || !req.body.price || !req.body.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Extract all fields from request body
    const {
      title,
      description,
      category,
      duration,
      difficulty,
      price,
      maxParticipants,
      highlights = [],
      includes = [],
      excludes = [],
      itinerary = '',
      requirements = '',
      specialFields = null,
      imageUrl = '',
      galleryImages = [],
      rating = 4.5,
      reviewsCount = 0,
      groupSize = '',
      location = '',
      overview = '',
      bestSeason = 'May to October',
      meetingPoint = '',
      languages = 'English, Azerbaijani, Russian',
      accommodationDetails = '',
      mealsDetails = '',
      waterSnacksDetails = '',
      providedEquipment = [],
      whatToBring = [],
      transportDetails = '',
      pickupService = '',
      photographyService = '',
      priceIncludes = [],
      groupDiscounts = '',
      earlyBirdDiscount = '',
      contactPhone = '+994 51 400 90 91',
      bookingTerms = '',
      isActive = true,
      featured = false
    } = req.body;

    // Set first gallery image as main image if no imageUrl provided
    const mainImageUrl = imageUrl || (galleryImages && galleryImages.length > 0 ? galleryImages[0] : '');

    console.log('Creating tour with main image URL:', mainImageUrl);

    // Create tour in database with extended fields
    const result = await pool.query(
      `INSERT INTO tours (
        title, description, category, duration, difficulty, price, max_participants, image_url, 
        highlights, includes, excludes, itinerary, requirements, special_fields,
        rating, reviews_count, group_size, location, overview, best_season, meeting_point, languages,
        accommodation_details, meals_details, water_snacks_details, provided_equipment, what_to_bring,
        transport_details, pickup_service, gallery_images, photography_service,
        price_includes, group_discounts, early_bird_discount, contact_phone, booking_terms,
        is_active, featured
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38)
       RETURNING *`,
      [
        title.trim(),
        description.trim(),
        category.trim(),
        duration.trim(),
        difficulty.trim(),
        parseFloat(price),
        parseInt(maxParticipants),
        mainImageUrl?.trim() || null,
        JSON.stringify(highlights),
        JSON.stringify(includes),
        JSON.stringify(excludes),
        itinerary.trim(),
        requirements.trim(),
        specialFields,
        
        // Extended fields with defaults
        parseFloat(rating),
        parseInt(reviewsCount),
        groupSize.trim(),
        location.trim(),
        overview.trim(),
        bestSeason.trim(),
        meetingPoint.trim(),
        languages.trim(),
        
        accommodationDetails.trim(),
        mealsDetails.trim(),
        waterSnacksDetails.trim(),
        providedEquipment,
        whatToBring,
        
        transportDetails.trim(),
        pickupService.trim(),
        galleryImages,
        photographyService.trim(),
        
        priceIncludes,
        groupDiscounts.trim(),
        earlyBirdDiscount.trim(),
        contactPhone.trim(),
        bookingTerms.trim(),
        
        isActive,
        featured
      ]
    );

    console.log('Tour created successfully:', result.rows[0]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Tour created successfully'
    });

  } catch (error) {
    console.error('Error creating tour:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}