import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      await handleGet(req, res);
    } else if (req.method === 'POST') {
      await handlePost(req, res);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Partners API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM partners ORDER BY created_at DESC'
      );
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ 
      error: 'Failed to fetch partners',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await pool.connect();
    
    try {
      const {
        name,
        description,
        website,
        email,
        phone,
        logo_url,
        category,
        status = 'active',
        gallery_images,
        id,
        _method
      } = req.body;

      // Handle DELETE request
      if (_method === 'DELETE' && id) {
        console.log('Deleting partner with ID:', id);
        
        const deleteResult = await client.query(
          'DELETE FROM partners WHERE id = $1 RETURNING id',
          [id]
        );
        
        if (deleteResult.rows.length === 0) {
          console.log('Partner not found for deletion');
          res.status(404).json({ error: 'Partner not found' });
          return;
        }
        
        console.log('Partner deleted successfully');
        res.status(200).json({
          success: true,
          message: 'Partner deleted successfully'
        });
        return;
      }

      // Handle UPDATE request
      if (_method === 'PUT' && id) {
        const updateResult = await client.query(
          `UPDATE partners SET 
            name = $1, description = $2, website = $3, email = $4, phone = $5, 
            logo_url = $6, category = $7, status = $8, gallery_images = $9,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $10 RETURNING *`,
          [name, description, website, email, phone, logo_url, category, status, 
           JSON.stringify(gallery_images || []), id]
        );
        
        if (updateResult.rows.length === 0) {
          res.status(404).json({ error: 'Partner not found' });
          return;
        }
        
        res.status(200).json({
          success: true,
          data: updateResult.rows[0]
        });
        return;
      }

      // Validate required fields for CREATE and UPDATE operations
      if (_method !== 'DELETE' && !name) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }

      // Handle CREATE request
      const result = await client.query(
        `INSERT INTO partners (
          name, description, website, email, phone, logo_url, category, status, gallery_images
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [name, description, website, email, phone, logo_url, category, status, 
         JSON.stringify(gallery_images || [])]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ 
      error: 'Failed to create partner',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
