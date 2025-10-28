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
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
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
    let query = `
      SELECT 
        id, title, slug, description, price, duration, difficulty, rating, 
        reviews_count, group_size, location, image_url, category,
        highlights, includes, excludes, is_active, featured,
        tour_programs, overview, best_season, meeting_point, languages,
        accommodation_details, meals_details, water_snacks_details,
        provided_equipment, what_to_bring, transport_details, pickup_service,
        gallery_images, photography_service, price_includes, group_discounts,
        early_bird_discount, contact_phone, booking_terms, itinerary,
        requirements, special_fields, max_participants, created_at, updated_at
      FROM tours 
      ORDER BY COALESCE(display_order, 0) ASC, created_at DESC
    `;
    let params: any[] = [];

    if (category && typeof category === 'string') {
      query = `
        SELECT 
          id, title, slug, description, price, duration, difficulty, rating, 
          reviews_count, group_size, location, image_url, category,
          highlights, includes, excludes, is_active, featured,
          tour_programs, overview, best_season, meeting_point, languages,
          accommodation_details, meals_details, water_snacks_details,
          provided_equipment, what_to_bring, transport_details, pickup_service,
          gallery_images, photography_service, price_includes, group_discounts,
          early_bird_discount, contact_phone, booking_terms, itinerary,
          requirements, special_fields, max_participants, created_at, updated_at
        FROM tours 
        WHERE category = $1 
        ORDER BY COALESCE(display_order, 0) ASC, created_at DESC
      `;
      params = [category];
    }

    const result = await pool.query(query, params);
    
    // Parse JSON fields for each tour
    const parsedTours = result.rows.map(tour => ({
      ...tour,
      highlights: tour.highlights ? (typeof tour.highlights === 'string' ? JSON.parse(tour.highlights) : tour.highlights) : [],
      includes: tour.includes ? (typeof tour.includes === 'string' ? JSON.parse(tour.includes) : tour.includes) : [],
      excludes: tour.excludes ? (typeof tour.excludes === 'string' ? JSON.parse(tour.excludes) : tour.excludes) : [],
      tour_programs: tour.tour_programs ? (typeof tour.tour_programs === 'string' ? JSON.parse(tour.tour_programs) : tour.tour_programs) : [],
      provided_equipment: tour.provided_equipment ? (typeof tour.provided_equipment === 'string' ? JSON.parse(tour.provided_equipment) : tour.provided_equipment) : [],
      what_to_bring: tour.what_to_bring ? (typeof tour.what_to_bring === 'string' ? JSON.parse(tour.what_to_bring) : tour.what_to_bring) : [],
      gallery_images: tour.gallery_images ? (typeof tour.gallery_images === 'string' ? JSON.parse(tour.gallery_images) : tour.gallery_images) : [],
      price_includes: tour.price_includes ? (typeof tour.price_includes === 'string' ? JSON.parse(tour.price_includes) : tour.price_includes) : []
    }));
    
    return res.status(200).json({
      success: true,
      data: parsedTours
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
      tour_programs = [],
      participantPricing = [],
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
        tour_programs, participant_pricing, is_active, featured
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41)
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
        JSON.stringify(tour_programs),
        JSON.stringify(participantPricing),
        
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

async function handlePut(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Tour ID is required'
    });
  }

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
  // Handle both query parameter (?id=91) and path parameter (/91)
  let id = req.query.id;
  
  // If no query parameter, try to extract from URL path
  if (!id && req.url) {
    const urlParts = req.url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && !isNaN(Number(lastPart))) {
      id = lastPart;
    }
  }
  
  console.log('DELETE request - URL:', req.url, 'ID:', id);
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Tour ID is required'
    });
  }

  try {
    // First check if tour exists
    const checkResult = await pool.query('SELECT id, title FROM tours WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    // Delete the tour
    const result = await pool.query('DELETE FROM tours WHERE id = $1 RETURNING id, title', [id]);
    
    console.log('Tour deleted successfully:', result.rows[0]);

    return res.status(200).json({
      success: true,
      data: result.rows[0],
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