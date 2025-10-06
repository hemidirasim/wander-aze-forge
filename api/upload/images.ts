import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for FormData
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Multiple images upload request received:', {
      method: req.method,
      contentType: req.headers['content-type'],
    });

    // Handle FormData using formidable
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB per file
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    console.log('FormData fields:', fields);
    console.log('FormData files:', files);

    const imageFiles = files.images || [];
    const type = fields.type?.[0] || 'tours';
    
    if (imageFiles.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    // Upload all images
    const uploadPromises = imageFiles.map(async (file: any) => {
      try {
        const fileBuffer = await require('fs').promises.readFile(file.filepath);
        
        // Create unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileExtension = file.originalFilename?.split('.').pop() || 'jpg';
        const uniqueFilename = `${type}/${timestamp}-${randomString}.${fileExtension}`;

        // Upload to Vercel Blob
        const blob = await put(uniqueFilename, fileBuffer, {
          access: 'public',
          contentType: file.mimetype || 'image/jpeg',
        });

        // Clean up temporary file
        await require('fs').promises.unlink(file.filepath).catch(() => {});

        return {
          url: blob.url,
          downloadUrl: blob.url,
          pathname: uniqueFilename,
          contentType: file.mimetype || 'image/jpeg',
          size: fileBuffer.length,
        };
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      blobs: results,
      message: `${results.length} images uploaded successfully`,
    });

  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
