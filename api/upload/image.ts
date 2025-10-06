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
    // Log the request for debugging
    console.log('Image upload request received:', {
      method: req.method,
      contentType: req.headers['content-type'],
      bodyType: typeof req.body,
      isFormData: req.headers['content-type']?.includes('multipart/form-data'),
      hasFileData: !!(req.body && req.body.fileData),
      hasFilename: !!(req.body && req.body.filename)
    });

    // Handle both FormData and JSON requests
    let fileData, filename, fileType, fileSize, category = 'tours';

    if (req.headers['content-type']?.includes('multipart/form-data')) {
      // Handle FormData using formidable
      try {
        const form = formidable({
          maxFileSize: 5 * 1024 * 1024, // 5MB
          keepExtensions: true,
        });

        const [fields, files] = await form.parse(req);
        
        console.log('FormData fields:', fields);
        console.log('FormData files:', files);

        const file = files.image?.[0] || files.file?.[0] || files.upload?.[0];
        
        if (!file) {
          return res.status(400).json({ error: 'No file provided in FormData' });
        }

        fileData = await require('fs').promises.readFile(file.filepath);
        filename = file.originalFilename || 'uploaded-image';
        fileType = file.mimetype || 'image/jpeg';
        fileSize = file.size || 0;
        category = fields.type?.[0] || 'tours';

        // Clean up temporary file
        await require('fs').promises.unlink(file.filepath).catch(() => {});
        
      } catch (formError) {
        console.error('Formidable parsing error:', formError);
        return res.status(400).json({ 
          error: 'Failed to parse FormData',
          details: formError instanceof Error ? formError.message : 'Unknown error'
        });
      }
    } else {
      // Handle JSON request with base64 file data (legacy support)
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      const body = req.body as any;
      fileData = body.fileData;
      filename = body.filename;
      fileType = body.fileType;
      fileSize = body.fileSize;
      category = body.category || 'tours';

      if (!fileData) {
        return res.status(400).json({ error: 'No file data provided' });
      }

      if (!filename) {
        return res.status(400).json({ error: 'No filename provided' });
      }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (fileType && !allowedTypes.includes(fileType)) {
      return res.status(400).json({ 
        error: `File type ${fileType} not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileSize && fileSize > maxSize) {
      return res.status(400).json({ 
        error: `File size ${fileSize} bytes exceeds maximum size of ${maxSize} bytes` 
      });
    }

    // Create a unique filename with timestamp and category
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = filename.split('.').pop() || 'jpg';
    const categoryPrefix = category ? `${category}/` : '';
    const uniqueFilename = `${categoryPrefix}${timestamp}-${randomString}.${fileExtension}`;

    let fileBuffer;
    let dataUrl;

    if (typeof fileData === 'string') {
      // Handle base64 data (legacy)
      try {
        fileBuffer = Buffer.from(fileData, 'base64');
        dataUrl = `data:${fileType || 'image/jpeg'};base64,${fileData}`;
      } catch (error) {
        return res.status(400).json({ 
          error: 'Invalid base64 file data',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      // Handle binary data (FormData)
      fileBuffer = Buffer.from(fileData);
      dataUrl = `data:${fileType || 'image/jpeg'};base64,${fileBuffer.toString('base64')}`;
    }

    // Upload to Vercel Blob Storage
    try {
      const blob = await put(uniqueFilename, fileBuffer, {
        access: 'public',
        contentType: fileType || 'image/jpeg',
      });

      // Return success response with blob URL
      res.status(200).json({
        success: true,
        id: `${timestamp}-${randomString}`,
        url: blob.url,
        filename: uniqueFilename,
        originalName: filename,
        size: fileBuffer.length,
        type: fileType || 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      });
    } catch (blobError) {
      console.error('Blob upload error:', blobError);
      // Fallback to data URL if blob upload fails
      res.status(200).json({
        success: true,
        id: `${timestamp}-${randomString}`,
        url: dataUrl,
        filename: uniqueFilename,
        originalName: filename,
        size: fileBuffer.length,
        type: fileType || 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      });
    }

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
