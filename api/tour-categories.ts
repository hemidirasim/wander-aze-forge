import { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from '../src/config/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
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
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tour categories API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Fetching tour categories...');
    
    // Return static data for now to test the API
    const staticCategories = [
      {
        id: 1,
        name: 'Trekking',
        slug: 'trekking',
        description: 'Multi-day hiking adventures through Azerbaijan\'s stunning mountain landscapes',
        image_url: '/tours-hero.jpg',
        is_active: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Hiking',
        slug: 'hiking',
        description: 'Day hikes and short trails perfect for all skill levels',
        image_url: '/tours-hero.jpg',
        is_active: true,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Cultural Tours',
        slug: 'cultural',
        description: 'Explore Azerbaijan\'s rich history, traditions, and cultural heritage',
        image_url: '/tours-hero.jpg',
        is_active: true,
        sort_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Adventure Tours',
        slug: 'adventure',
        description: 'Thrilling outdoor activities and extreme sports experiences',
        image_url: '/tours-hero.jpg',
        is_active: true,
        sort_order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Tailor-Made',
        slug: 'tailor-made',
        description: 'Custom tours designed specifically for your interests and schedule',
        image_url: '/tours-hero.jpg',
        is_active: true,
        sort_order: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    const { id } = req.query;
    
    if (id) {
      // Get single category
      const category = staticCategories.find(cat => cat.id === parseInt(id as string));
      
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: category
      });
    } else {
      // Get all categories
      console.log(`Returning ${staticCategories.length} static categories`);
      
      return res.status(200).json({
        success: true,
        data: staticCategories
      });
    }
  } catch (error) {
    console.error('Error fetching tour categories:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch tour categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const { name, slug, description, image_url, is_active, sort_order } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        error: 'Name and slug are required'
      });
    }

    const result = await pool.query(`
      INSERT INTO tour_categories (name, slug, description, image_url, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      name.trim(),
      slug.trim(),
      description?.trim() || '',
      image_url?.trim() || '',
      is_active !== false,
      sort_order || 0
    ]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating tour category:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create tour category'
    });
  }
}

async function handlePut(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    const { name, slug, description, image_url, is_active, sort_order } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Category ID is required'
      });
    }

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        error: 'Name and slug are required'
      });
    }

    const result = await pool.query(`
      UPDATE tour_categories SET
        name = $1,
        slug = $2,
        description = $3,
        image_url = $4,
        is_active = $5,
        sort_order = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [
      name.trim(),
      slug.trim(),
      description?.trim() || '',
      image_url?.trim() || '',
      is_active !== false,
      sort_order || 0,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating tour category:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update tour category'
    });
  }
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Category ID is required'
      });
    }

    const result = await pool.query(
      'DELETE FROM tour_categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tour category:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete tour category'
    });
  }
}
