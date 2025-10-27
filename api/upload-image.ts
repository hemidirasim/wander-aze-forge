import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    console.log('Image upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No file provided'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Only image files are allowed'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({
        success: false,
        error: 'File size too large. Maximum 5MB allowed.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert file to base64 for storage
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `review_${timestamp}_${randomString}.${fileExtension}`;

    // Store image data in database
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO uploaded_images (filename, original_name, file_type, file_size, data_url, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW()) 
         RETURNING id, filename`,
        [fileName, file.name, file.type, file.size, dataUrl]
      );

      const imageRecord = result.rows[0];
      
      // Return the image URL (we'll serve it from our API)
      const imageUrl = `https://outtour.az/api/image/${imageRecord.id}`;
      
      console.log('Image uploaded successfully:', {
        id: imageRecord.id,
        filename: imageRecord.filename,
        url: imageUrl
      });

      return new Response(JSON.stringify({
        success: true,
        data: {
          id: imageRecord.id,
          filename: imageRecord.filename,
          url: imageUrl,
          originalName: file.name,
          size: file.size,
          type: file.type
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Image upload error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Create table if it doesn't exist
export async function GET() {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS uploaded_images (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          file_type VARCHAR(100) NOT NULL,
          file_size INTEGER NOT NULL,
          data_url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      return new Response(JSON.stringify({
        success: true,
        message: 'Uploaded images table ready'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Table creation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create table',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
