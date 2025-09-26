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
    console.log('=== CREATE TOUR API CALLED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('tour_programs from request:', req.body.tour_programs);

    // Ensure tour_programs column exists
    try {
      await pool.query(`
        ALTER TABLE tours ADD COLUMN IF NOT EXISTS tour_programs JSONB DEFAULT '[]'
      `);
      console.log('tour_programs column ensured');
    } catch (columnError) {
      console.log('Column might already exist or error adding:', columnError);
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

    // Extract all fields with safe defaults
    const tourData = {
      title: req.body.title?.trim() || '',
      description: req.body.description?.trim() || '',
      category: req.body.category?.trim() || '',
      duration: req.body.duration?.trim() || '',
      difficulty: req.body.difficulty?.trim() || '',
      price: parseFloat(req.body.price) || 0,
      maxParticipants: parseInt(req.body.maxParticipants) || 0,
      
      // Optional fields with defaults
      highlights: req.body.highlights || [],
      includes: req.body.includes || [],
      excludes: req.body.excludes || [],
      itinerary: req.body.itinerary?.trim() || '',
      requirements: req.body.requirements?.trim() || '',
      specialFields: req.body.specialFields || null,
      imageUrl: req.body.imageUrl?.trim() || '',
      galleryImages: req.body.galleryImages || [],
      
      rating: parseFloat(req.body.rating) || 4.5,
      reviewsCount: parseInt(req.body.reviewsCount) || 0,
      groupSize: req.body.groupSize?.trim() || '',
      location: req.body.location?.trim() || '',
      overview: req.body.overview?.trim() || '',
      bestSeason: req.body.bestSeason?.trim() || 'May to October',
      meetingPoint: req.body.meetingPoint?.trim() || '',
      languages: req.body.languages?.trim() || 'English, Azerbaijani, Russian',
      
      accommodationDetails: req.body.accommodationDetails?.trim() || '',
      mealsDetails: req.body.mealsDetails?.trim() || '',
      waterSnacksDetails: req.body.waterSnacksDetails?.trim() || '',
      providedEquipment: req.body.providedEquipment || [],
      whatToBring: req.body.whatToBring || [],
      
      transportDetails: req.body.transportDetails?.trim() || '',
      pickupService: req.body.pickupService?.trim() || '',
      photographyService: req.body.photographyService?.trim() || '',
      
      priceIncludes: req.body.priceIncludes || [],
      groupDiscounts: req.body.groupDiscounts?.trim() || '',
      earlyBirdDiscount: req.body.earlyBirdDiscount?.trim() || '',
      contactPhone: req.body.contactPhone?.trim() || '+994 51 400 90 91',
      bookingTerms: req.body.bookingTerms?.trim() || '',
      
      isActive: req.body.isActive !== false,
      featured: req.body.featured === true,
      tour_programs: req.body.tour_programs || []
    };

    console.log('Processed tour data:', JSON.stringify(tourData, null, 2));

    // Set main image URL
    const mainImageUrl = tourData.imageUrl || (tourData.galleryImages.length > 0 ? tourData.galleryImages[0] : '');
    console.log('Main image URL:', mainImageUrl);

    // Create tour in database - minimal fields first
    const query = `
      INSERT INTO tours (
        title, description, category, duration, difficulty, price, max_participants
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      tourData.title,
      tourData.description,
      tourData.category,
      tourData.duration,
      tourData.difficulty,
      tourData.price,
      tourData.maxParticipants
    ];

    console.log('Executing database query with', values.length, 'parameters');
    console.log('Query:', query);
    console.log('Values:', values);

    let result;
    try {
      result = await pool.query(query, values);
      console.log('Tour created successfully:', result.rows[0]);
      
      // Update with additional fields - only basic fields first
      const updateQuery = `
        UPDATE tours SET
          image_url = $1,
          rating = $2,
          reviews_count = $3,
          group_size = $4,
          location = $5,
          overview = $6,
          best_season = $7,
          meeting_point = $8,
          languages = $9,
          accommodation_details = $10,
          meals_details = $11,
          water_snacks_details = $12,
          transport_details = $13,
          pickup_service = $14,
          photography_service = $15,
          group_discounts = $16,
          early_bird_discount = $17,
          contact_phone = $18,
          booking_terms = $19,
          itinerary = $20,
          requirements = $21,
          is_active = $22,
          featured = $23
        WHERE id = $24
        RETURNING *
      `;
      
      const updateValues = [
        mainImageUrl || null,
        tourData.rating,
        tourData.reviewsCount,
        tourData.groupSize,
        tourData.location,
        tourData.overview,
        tourData.bestSeason,
        tourData.meetingPoint,
        tourData.languages,
        tourData.accommodationDetails,
        tourData.mealsDetails,
        tourData.waterSnacksDetails,
        tourData.transportDetails,
        tourData.pickupService,
        tourData.photographyService,
        tourData.groupDiscounts,
        tourData.earlyBirdDiscount,
        tourData.contactPhone,
        tourData.bookingTerms,
        tourData.itinerary,
        tourData.requirements,
        tourData.isActive,
        tourData.featured,
        result.rows[0].id
      ];
      
      console.log('Updating tour with additional fields...');
      console.log('Update query:', updateQuery);
      console.log('Update values count:', updateValues.length);
      console.log('Update values:', updateValues);
      
      const updateResult = await pool.query(updateQuery, updateValues);
      console.log('Tour updated successfully:', updateResult.rows[0]);
      
      // Update array fields separately with proper JSON handling
      if (tourData.providedEquipment || tourData.whatToBring || tourData.galleryImages || 
          tourData.priceIncludes || tourData.highlights || tourData.includes || 
          tourData.excludes || tourData.tour_programs || tourData.specialFields) {
        
        console.log('Updating array fields...');
        const arrayUpdateQuery = `
          UPDATE tours SET
            provided_equipment = $1,
            what_to_bring = $2,
            gallery_images = $3,
            price_includes = $4,
            highlights = $5,
            includes = $6,
            excludes = $7,
            tour_programs = $8,
            special_fields = $9
          WHERE id = $10
          RETURNING *
        `;
        
        const arrayUpdateValues = [
          tourData.providedEquipment || [],
          tourData.whatToBring || [],
          tourData.galleryImages || [],
          tourData.priceIncludes || [],
          tourData.highlights || [],
          tourData.includes || [],
          tourData.excludes || [],
          JSON.stringify(tourData.tour_programs || []),
          JSON.stringify(tourData.specialFields || {}),
          result.rows[0].id
        ];
        
        console.log('Array update query:', arrayUpdateQuery);
        console.log('Array update values:', arrayUpdateValues);
        
        const arrayUpdateResult = await pool.query(arrayUpdateQuery, arrayUpdateValues);
        console.log('Array fields updated successfully:', arrayUpdateResult.rows[0]);
        result = arrayUpdateResult;
      }
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      console.error('Database error message:', dbError.message);
      console.error('Database error code:', dbError.code);
      throw dbError;
    }

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Tour created successfully'
    });

  } catch (error) {
    console.error('=== ERROR CREATING TOUR ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return res.status(500).json({
      success: false,
      error: 'Failed to create tour',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : null
    });
  }
}
