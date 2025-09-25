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
    console.error('Team Members API error:', error);
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
        'SELECT * FROM team_members WHERE is_active = true ORDER BY order_index ASC, created_at ASC'
      );
      
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ 
      error: 'Failed to fetch team members',
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
        position,
        bio,
        photo_url,
        email,
        phone,
        social_links,
        order_index,
        is_active,
        id,
        _method
      } = req.body;

      // Handle DELETE request
      if (_method === 'DELETE' && id) {
        console.log('Deleting team member with ID:', id);
        
        const deleteResult = await client.query(
          'DELETE FROM team_members WHERE id = $1 RETURNING id',
          [id]
        );
        
        if (deleteResult.rows.length === 0) {
          console.log('Team member not found for deletion');
          res.status(404).json({ error: 'Team member not found' });
          return;
        }
        
        console.log('Team member deleted successfully');
        res.status(200).json({
          success: true,
          message: 'Team member deleted successfully'
        });
        return;
      }

      // Handle UPDATE request
      if (_method === 'PUT' && id) {
        const updateResult = await client.query(
          `UPDATE team_members SET 
            name = $1, position = $2, bio = $3, photo_url = $4, email = $5, phone = $6, 
            social_links = $7, order_index = $8, is_active = $9,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $10 RETURNING *`,
          [name, position, bio, photo_url, email, phone, JSON.stringify(social_links), order_index, is_active, id]
        );
        
        if (updateResult.rows.length === 0) {
          res.status(404).json({ error: 'Team member not found' });
          return;
        }
        
        res.status(200).json({
          success: true,
          data: updateResult.rows[0]
        });
        return;
      }

      // Validate required fields for CREATE and UPDATE operations
      if (_method !== 'DELETE' && (!name || !position)) {
        res.status(400).json({ error: 'Name and position are required' });
        return;
      }

      // Handle CREATE request
      console.log('Creating team member with data:', { name, position, bio, photo_url, email, phone });
      
      const result = await client.query(
        `INSERT INTO team_members (
          name, position, bio, photo_url, email, phone, social_links, order_index, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [name, position, bio, photo_url, email, phone, JSON.stringify(social_links), order_index || 0, is_active !== false]
      );

      console.log('Team member created successfully:', result.rows[0]);

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error managing team member:', error);
    res.status(500).json({ 
      error: 'Failed to manage team member',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
