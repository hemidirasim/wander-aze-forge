import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify admin token (you might want to use JWT verification here)
    // For now, we'll just check if it exists
    if (!token) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { tourIds } = await request.json();

    if (!Array.isArray(tourIds) || tourIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid tour IDs' }, { status: 400 });
    }

    // Update the order of tours
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update each tour with its new order
      for (let i = 0; i < tourIds.length; i++) {
        await client.query(
          'UPDATE tours SET display_order = $1, updated_at = NOW() WHERE id = $2',
          [i + 1, tourIds[i]]
        );
      }
      
      await client.query('COMMIT');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Tour order updated successfully' 
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error reordering tours:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder tours' },
      { status: 500 }
    );
  }
}
