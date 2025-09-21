import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseService } from '../src/services/databaseService';

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
    let tours;
    if (category && typeof category === 'string') {
      tours = await DatabaseService.getToursByCategory(category);
    } else {
      tours = await DatabaseService.getAllTours();
    }

    return res.status(200).json({
      success: true,
      data: tours
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
    const {
      title,
      description,
      category,
      duration,
      difficulty,
      price,
      maxParticipants,
      highlights,
      includes,
      excludes,
      itinerary,
      requirements,
      specialFields,
      imageUrl
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !duration || !difficulty || !price || !maxParticipants) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Create tour data
    const tourData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      duration: duration.trim(),
      difficulty: difficulty.trim(),
      price: parseFloat(price),
      max_participants: parseInt(maxParticipants),
      highlights: highlights || [],
      includes: includes || [],
      excludes: excludes || [],
      itinerary: itinerary?.trim() || '',
      requirements: requirements?.trim() || '',
      special_fields: specialFields || {},
      image_url: imageUrl?.trim() || null
    };

    // Create tour in database
    const newTour = await DatabaseService.createTour(tourData);

    return res.status(201).json({
      success: true,
      data: newTour,
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
