import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ success: false, error: 'Invalid booking ID' });
  }

  try {
    const bookingId = parseInt(id);

    if (req.method === 'DELETE') {
      console.log(`=== DELETING BOOKING REQUEST ${bookingId} ===`);
      
      const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING id', [bookingId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Booking request not found' });
      }

      console.log(`Booking request ${bookingId} deleted successfully`);
      
      return res.status(200).json({
        success: true,
        message: 'Booking request deleted successfully'
      });
    }

    if (req.method === 'PATCH') {
      console.log(`=== UPDATING BOOKING REQUEST ${bookingId} ===`);
      
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ success: false, error: 'Status is required' });
      }

      const result = await pool.query(
        'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, status',
        [status, bookingId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Booking request not found' });
      }

      console.log(`Booking request ${bookingId} status updated to ${status}`);
      
      return res.status(200).json({
        success: true,
        message: 'Booking request status updated successfully',
        data: result.rows[0]
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });

  } catch (error) {
    console.error('Error handling booking request:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to handle booking request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

