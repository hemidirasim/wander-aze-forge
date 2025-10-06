import express from 'express';
import multer from 'multer';
import { BlobStorageService } from '../services/blobStorage';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed.'));
    }
  },
});

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type } = req.body; // tour, project, program, partner, blog
    const filename = BlobStorageService.generateFilename(
      (type as any) || 'tour',
      req.file.originalname
    );

    const result = await BlobStorageService.uploadImage(filename, req.file.buffer);

    res.json({
      success: true,
      blob: result,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Upload multiple images
router.post('/images', upload.array('images', 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { type } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = files.map(file => {
      const filename = BlobStorageService.generateFilename(
        (type as any) || 'tour',
        file.originalname
      );
      return BlobStorageService.uploadImage(filename, file.buffer);
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      blobs: results,
      message: `${results.length} images uploaded successfully`
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Upload document
router.post('/document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type } = req.body;
    const filename = BlobStorageService.generateFilename(
      (type as any) || 'document',
      req.file.originalname
    );

    const result = await BlobStorageService.uploadDocument(
      filename,
      req.file.buffer,
      req.file.mimetype
    );

    res.json({
      success: true,
      blob: result,
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete file
router.delete('/file', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const success = await BlobStorageService.deleteFile(url);

    if (success) {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(500).json({
        error: 'Failed to delete file'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// List files
router.get('/files', async (req, res) => {
  try {
    const { prefix } = req.query;
    const files = await BlobStorageService.listFiles(prefix as string);

    res.json({
      success: true,
      files,
      count: files.length
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      error: 'Failed to list files',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
