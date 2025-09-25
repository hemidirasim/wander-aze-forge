import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    // Log the request for debugging
    console.log('Image upload request received:', {
      method: req.method,
      contentType: req.headers['content-type'],
      bodyType: typeof req.body,
      hasFileData: !!(req.body && req.body.fileData),
      hasFilename: !!(req.body && req.body.filename)
    });

    // Handle JSON request with base64 file data
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { fileData, filename, fileType, fileSize, category = 'hero' } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    if (!filename) {
      return res.status(400).json({ error: 'No filename provided' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (fileType && !allowedTypes.includes(fileType)) {
      return res.status(400).json({ 
        error: `File type ${fileType} not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      });
    }

    // Validate file size (10MB limit for hero images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (fileSize && fileSize > maxSize) {
      return res.status(400).json({ 
        error: `File size ${fileSize} bytes exceeds maximum size of ${maxSize} bytes` 
      });
    }

    // Convert base64 to Buffer
    let fileBuffer;
    try {
      fileBuffer = Buffer.from(fileData, 'base64');
    } catch (error) {
      return res.status(400).json({ 
        error: 'Invalid base64 file data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Create a unique filename with timestamp and category
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = filename.split('.').pop() || 'jpg';
    const categoryPrefix = category ? `${category}/` : '';
    const uniqueFilename = `${categoryPrefix}${timestamp}-${randomString}.${fileExtension}`;

    // For now, return a mock URL since we don't have blob storage configured
    // In production, you would upload to a cloud storage service
    const mockUrl = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&t=${timestamp}`;
    
    // Return success response with mock URL
    res.status(200).json({
      success: true,
      id: `${timestamp}-${randomString}`,
      url: mockUrl,
      filename: uniqueFilename,
      originalName: filename,
      size: fileBuffer.length,
      type: fileType || 'image/jpeg',
      uploadedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
