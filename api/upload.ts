import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

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
    // Handle multipart/form-data
    if (!req.body || typeof req.body === 'string') {
      return res.status(400).json({ error: 'No file data received' });
    }

    // Get file data from the request
    const { file, category } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return res.status(400).json({ 
        error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return res.status(400).json({ 
        error: `File size ${file.size} bytes exceeds maximum size of ${maxSize} bytes` 
      });
    }

    // Create a unique filename with timestamp and category
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const categoryPrefix = category ? `${category}/` : '';
    const uniqueFilename = `${categoryPrefix}${timestamp}-${randomString}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Return success response
    res.status(200).json({
      success: true,
      id: `${timestamp}-${randomString}`,
      url: blob.url,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
