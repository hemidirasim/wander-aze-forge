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

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid tour ID'
    });
  }

  if (req.method === 'GET') {
    return await handleGet(req, res);
  }

  if (req.method === 'PUT') {
    return await handlePut(req, res);
  }

  if (req.method === 'DELETE') {
    return await handleDelete(req, res);
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  try {
    console.log('Fetching tour with ID:', id);
    
    const result = await pool.query(`
      SELECT 
        id, title, description, price, duration, difficulty, rating, 
        reviews_count, group_size, location, image_url, category,
        highlights, includes, excludes, is_active, featured,
        tour_programs, overview, best_season, meeting_point, languages,
        accommodation_details, meals_details, water_snacks_details,
        provided_equipment, what_to_bring, transport_details, pickup_service,
        gallery_images, photography_service, price_includes, participant_pricing,
        group_discounts, early_bird_discount, contact_phone, booking_terms, itinerary,
        requirements, special_fields, max_participants, booked_seats, created_at, updated_at,
        total_hiking_distance, total_elevation_gain, total_elevation_loss
      FROM tours 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    // Parse JSON fields for the tour
    const tour = {
      ...result.rows[0],
      highlights: result.rows[0].highlights ? (typeof result.rows[0].highlights === 'string' ? JSON.parse(result.rows[0].highlights) : result.rows[0].highlights) : [],
      includes: result.rows[0].includes ? (typeof result.rows[0].includes === 'string' ? JSON.parse(result.rows[0].includes) : result.rows[0].includes) : [],
      excludes: result.rows[0].excludes ? (typeof result.rows[0].excludes === 'string' ? JSON.parse(result.rows[0].excludes) : result.rows[0].excludes) : [],
      tour_programs: result.rows[0].tour_programs ? (typeof result.rows[0].tour_programs === 'string' ? JSON.parse(result.rows[0].tour_programs) : result.rows[0].tour_programs) : [],
      provided_equipment: result.rows[0].provided_equipment ? (typeof result.rows[0].provided_equipment === 'string' ? JSON.parse(result.rows[0].provided_equipment) : result.rows[0].provided_equipment) : [],
      what_to_bring: result.rows[0].what_to_bring ? (typeof result.rows[0].what_to_bring === 'string' ? JSON.parse(result.rows[0].what_to_bring) : result.rows[0].what_to_bring) : [],
      gallery_images: result.rows[0].gallery_images ? (typeof result.rows[0].gallery_images === 'string' ? JSON.parse(result.rows[0].gallery_images) : result.rows[0].gallery_images) : [],
      price_includes: result.rows[0].price_includes ? (typeof result.rows[0].price_includes === 'string' ? JSON.parse(result.rows[0].price_includes) : result.rows[0].price_includes) : [],
      participant_pricing: result.rows[0].participant_pricing ? (typeof result.rows[0].participant_pricing === 'string' ? JSON.parse(result.rows[0].participant_pricing) : result.rows[0].participant_pricing) : [],
      max_participants: result.rows[0].max_participants || null,
      total_hiking_distance: result.rows[0].total_hiking_distance || null,
      total_elevation_gain: result.rows[0].total_elevation_gain || null,
      total_elevation_loss: result.rows[0].total_elevation_loss || null
    };

    return res.status(200).json({
      success: true,
      data: tour
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Database error'
    });
  }
}

async function handlePut(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  try {
    const {
      title,
      description,
      category,
      duration,
      difficulty,
      price,
      maxParticipants,
      bookedSeats,
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
        booked_seats = $8,
        rating = $9,
        reviews_count = $10,
        group_size = $11,
        location = $12,
        overview = $13,
        best_season = $14,
        meeting_point = $15,
        languages = $16,
        accommodation_details = $17,
        meals_details = $18,
        water_snacks_details = $19,
        provided_equipment = $20,
        what_to_bring = $21,
        transport_details = $22,
        pickup_service = $23,
        gallery_images = $24,
        photography_service = $25,
        price_includes = $26,
        group_discounts = $27,
        early_bird_discount = $28,
        contact_phone = $29,
        booking_terms = $30,
        highlights = $31,
        includes = $32,
        excludes = $33,
        itinerary = $34,
        requirements = $35,
        tour_programs = $36,
        is_active = $37,
        featured = $38,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $39
      RETURNING *
    `, [
      title.trim(),
      description.trim(),
      category.trim(),
      duration.trim(),
      difficulty.trim(),
      parseFloat(price),
      parseInt(maxParticipants),
      parseInt(bookedSeats) || 0,
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
  const { id } = req.query;
  
  try {
    console.log('Deleting tour with ID:', id);
    
    const result = await pool.query(`
      DELETE FROM tours 
      WHERE id = $1
      RETURNING id, title
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tour deleted successfully',
      data: { deletedTour: result.rows[0] }
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Database error'
    });
  }
}
