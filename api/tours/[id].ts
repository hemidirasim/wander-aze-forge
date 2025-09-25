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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Tour ID is required'
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tour API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await pool.query('SELECT * FROM tours WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching tour:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePut(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      title,
      description,
      category,
      duration,
      difficulty,
      price,
      maxParticipants,
      rating,
      reviewsCount,
      groupSize,
      location,
      overview,
      bestSeason,
      meetingPoint,
      languages,
      accommodationDetails,
      mealsDetails,
      waterSnacksDetails,
      providedEquipment,
      whatToBring,
      transportDetails,
      pickupService,
      galleryImages,
      photographyService,
      priceIncludes,
      groupDiscounts,
      earlyBirdDiscount,
      contactPhone,
      bookingTerms,
      highlights,
      includes,
      excludes,
      itinerary,
      requirements,
      tourPrograms,
      isActive,
      featured
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !duration || !difficulty || !price || !maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Prepare arrays for database
    const providedEquipmentArray = Array.isArray(providedEquipment) ? providedEquipment : [];
    const whatToBringArray = Array.isArray(whatToBring) ? whatToBring : [];
    const priceIncludesArray = Array.isArray(priceIncludes) ? priceIncludes : [];
    const highlightsArray = Array.isArray(highlights) ? highlights : [];
    const includesArray = Array.isArray(includes) ? includes : [];
    const excludesArray = Array.isArray(excludes) ? excludes : [];
    const galleryImagesArray = Array.isArray(galleryImages) ? galleryImages : [];
    const tourProgramsArray = Array.isArray(tourPrograms) ? tourPrograms : [];

    // Update tour in database
    const result = await pool.query(`
      UPDATE tours SET
        title = $1,
        description = $2,
        category = $3,
        duration = $4,
        difficulty = $5,
        price = $6,
        max_participants = $7,
        rating = $8,
        reviews_count = $9,
        group_size = $10,
        location = $11,
        overview = $12,
        best_season = $13,
        meeting_point = $14,
        languages = $15,
        accommodation_details = $16,
        meals_details = $17,
        water_snacks_details = $18,
        provided_equipment = $19,
        what_to_bring = $20,
        transport_details = $21,
        pickup_service = $22,
        gallery_images = $23,
        photography_service = $24,
        price_includes = $25,
        group_discounts = $26,
        early_bird_discount = $27,
        contact_phone = $28,
        booking_terms = $29,
        highlights = $30,
        includes = $31,
        excludes = $32,
        itinerary = $33,
        requirements = $34,
        tour_programs = $35,
        is_active = $36,
        featured = $37,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $38
      RETURNING *
    `, [
      title.trim(),
      description.trim(),
      category.trim(),
      duration.trim(),
      difficulty.trim(),
      parseFloat(price),
      parseInt(maxParticipants),
      parseFloat(rating) || 4.5,
      parseInt(reviewsCount) || 0,
      groupSize?.trim() || '',
      location?.trim() || '',
      overview?.trim() || '',
      bestSeason?.trim() || '',
      meetingPoint?.trim() || '',
      languages?.trim() || '',
      accommodationDetails?.trim() || '',
      mealsDetails?.trim() || '',
      waterSnacksDetails?.trim() || '',
      JSON.stringify(providedEquipmentArray),
      JSON.stringify(whatToBringArray),
      transportDetails?.trim() || '',
      pickupService?.trim() || '',
      JSON.stringify(galleryImagesArray),
      photographyService?.trim() || '',
      JSON.stringify(priceIncludesArray),
      groupDiscounts?.trim() || '',
      earlyBirdDiscount?.trim() || '',
      contactPhone?.trim() || '',
      bookingTerms?.trim() || '',
      JSON.stringify(highlightsArray),
      JSON.stringify(includesArray),
      JSON.stringify(excludesArray),
      itinerary?.trim() || '',
      requirements?.trim() || '',
      JSON.stringify(tourProgramsArray),
      isActive !== false,
      featured === true,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    console.log('Tour updated successfully:', result.rows[0]);

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Tour updated successfully'
    });

  } catch (error) {
    console.error('Error updating tour:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await pool.query('DELETE FROM tours WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tour deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tour:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete tour',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
