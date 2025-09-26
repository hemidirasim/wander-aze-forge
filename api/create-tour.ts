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

    // Create tour in database - without tour_programs (will update separately)
    const query = `
      INSERT INTO tours (
        title, description, category, duration, difficulty, price, max_participants, image_url, 
        highlights, includes, excludes, itinerary, requirements, special_fields,
        rating, reviews_count, group_size, location, overview, best_season, meeting_point, languages,
        accommodation_details, meals_details, water_snacks_details, provided_equipment, what_to_bring,
        transport_details, pickup_service, gallery_images, photography_service,
        price_includes, group_discounts, early_bird_discount, contact_phone, booking_terms,
        is_active, featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39)
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
      mainImageUrl || null,
      JSON.stringify(tourData.highlights),
      JSON.stringify(tourData.includes),
      JSON.stringify(tourData.excludes),
      tourData.itinerary,
      tourData.requirements,
      tourData.specialFields,
      
      tourData.rating,
      tourData.reviewsCount,
      tourData.groupSize || null,
      tourData.location || null,
      tourData.overview || null,
      tourData.bestSeason,
      tourData.meetingPoint || null,
      tourData.languages,
      
      tourData.accommodationDetails || null,
      tourData.mealsDetails || null,
      tourData.waterSnacksDetails || null,
      tourData.providedEquipment,
      tourData.whatToBring,
      
      tourData.transportDetails || null,
      tourData.pickupService || null,
      tourData.galleryImages,
      tourData.photographyService || null,
      
      tourData.priceIncludes,
      tourData.groupDiscounts || null,
      tourData.earlyBirdDiscount || null,
      tourData.contactPhone,
      tourData.bookingTerms || null,
      
      tourData.isActive,
      tourData.featured
    ];

    console.log('Executing database query with', values.length, 'parameters');
    console.log('Query:', query);
    console.log('Values:', values);

    let result;
    try {
      result = await pool.query(query, values);
      console.log('Tour created successfully:', result.rows[0]);
      
      // Update tour_programs separately
      if (tourData.tour_programs && tourData.tour_programs.length > 0) {
        console.log('Updating tour_programs for tour ID:', result.rows[0].id);
        await pool.query(`
          UPDATE tours SET tour_programs = $1 WHERE id = $2
        `, [JSON.stringify(tourData.tour_programs), result.rows[0].id]);
        console.log('Tour programs updated successfully');
        
        // Fetch the updated tour
        const updatedResult = await pool.query('SELECT * FROM tours WHERE id = $1', [result.rows[0].id]);
        result = updatedResult;
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
