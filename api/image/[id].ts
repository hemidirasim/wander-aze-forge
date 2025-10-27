import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const imageId = url.pathname.split('/').pop();
    
    if (!imageId || isNaN(Number(imageId))) {
      return new Response('Invalid image ID', { status: 400 });
    }

    console.log('Serving image with ID:', imageId);

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT data_url, file_type FROM uploaded_images WHERE id = $1',
        [imageId]
      );

      if (result.rows.length === 0) {
        return new Response('Image not found', { status: 404 });
      }

      const { data_url, file_type } = result.rows[0];
      
      // Parse data URL
      const base64Data = data_url.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': file_type,
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'Content-Length': buffer.length.toString()
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Image serve error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
