# Vercel Blob Storage Integration

This project now includes comprehensive file storage capabilities using Vercel Blob storage. You can upload, manage, and serve images and documents for tours, projects, programs, partners, and blog posts.

## 🔑 Configuration

**Blob Storage Token:**
```
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_E4sM2P9CqIcdXJYG_vPxKKu1Kjc6i8fjYfN36epuHFWcXij"
```

## 📁 File Organization

Files are automatically organized by type in the blob storage:
- `tours/` - Tour images and documents
- `projects/` - Project images and documentation
- `programs/` - Program images and materials
- `partners/` - Partner logos and documents
- `blog/` - Blog post images and attachments

## 🚀 Upload API Endpoints

### Single Image Upload
```http
POST /api/upload/image
Content-Type: multipart/form-data

Body:
- image: File (required)
- type: string (tour|project|program|partner|blog)
```

### Multiple Images Upload
```http
POST /api/upload/images
Content-Type: multipart/form-data

Body:
- images: File[] (required, max 10 files)
- type: string (tour|project|program|partner|blog)
```

### Document Upload
```http
POST /api/upload/document
Content-Type: multipart/form-data

Body:
- document: File (required)
- type: string (tour|project|program|partner|blog)
```

### Delete File
```http
DELETE /api/upload/file
Content-Type: application/json

Body:
{
  "url": "https://blob.vercel-storage.com/..."
}
```

### List Files
```http
GET /api/upload/files?prefix=tours
```

## 🎨 React Components

### FileUpload Component
```tsx
import FileUpload from '@/components/FileUpload';

<FileUpload
  type="tour"                    // Content type
  onUploadComplete={(url) => {}} // Callback for successful upload
  onUploadError={(error) => {}}  // Callback for upload errors
  multiple={true}                // Allow multiple files
  maxSizeMB={10}                 // Max file size
  accept="image/*"               // Accepted file types
/>
```

## 📊 Features

### ✅ File Validation
- **File Size**: Maximum 10MB per file
- **File Types**: JPEG, PNG, WebP, PDF
- **Multiple Files**: Support for batch uploads
- **Progress Tracking**: Real-time upload progress

### ✅ Automatic Optimization
- **Image Compression**: Automatic optimization for web
- **Unique Filenames**: Timestamp-based naming with random suffixes
- **Public Access**: All files are publicly accessible via CDN
- **Secure Deletion**: Safe file removal from storage

### ✅ User Experience
- **Drag & Drop**: Intuitive file selection
- **Preview**: Real-time file preview
- **Progress Bars**: Visual upload progress
- **Error Handling**: Comprehensive error messages
- **File Management**: View and delete uploaded files

## 🎯 Usage Examples

### 1. Upload Tour Images
```tsx
<FileUpload
  type="tour"
  multiple={true}
  onUploadComplete={(url) => {
    // Update tour record with new image URL
    updateTour({ id: tourId, image_url: url });
  }}
/>
```

### 2. Upload Partner Logo
```tsx
<FileUpload
  type="partner"
  multiple={false}
  accept="image/*"
  onUploadComplete={(url) => {
    // Update partner record with logo URL
    updatePartner({ id: partnerId, logo_url: url });
  }}
/>
```

### 3. Upload Project Documents
```tsx
<FileUpload
  type="project"
  accept=".pdf,.doc,.docx"
  onUploadComplete={(url) => {
    // Add document to project gallery
    addProjectDocument({ projectId, documentUrl: url });
  }}
/>
```

## 🛠️ Technical Implementation

### BlobStorageService
```typescript
import { BlobStorageService } from '@/services/blobStorage';

// Upload image
const result = await BlobStorageService.uploadImage(
  'tours/hero-image.jpg',
  fileBuffer
);

// Upload document
const result = await BlobStorageService.uploadDocument(
  'projects/proposal.pdf',
  pdfBuffer,
  'application/pdf'
);

// Delete file
const success = await BlobStorageService.deleteFile(url);

// List files
const files = await BlobStorageService.listFiles('tours/');
```

### File Validation
```typescript
const validation = BlobStorageService.validateFile(file, 10); // 10MB max
if (!validation.valid) {
  console.error(validation.error);
}
```

## 📱 Demo Page

Visit `/upload-demo` to see the file upload functionality in action:

- **Upload Interface**: Interactive file upload with progress tracking
- **File Preview**: Real-time preview of uploaded files
- **Storage Stats**: Statistics about uploaded files
- **API Documentation**: Live examples of API usage

## 🔧 Configuration Options

### Environment Variables
```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_E4sM2P9CqIcdXJYG_vPxKKu1Kjc6i8fjYfN36epuHFWcXij"
```

### Upload Limits
- **Max File Size**: 10MB
- **Max Files per Upload**: 10
- **Supported Types**: JPEG, PNG, WebP, PDF
- **Storage**: Unlimited (Vercel Blob)

## 🎨 UI Components

### FileUpload Props
```typescript
interface FileUploadProps {
  type: 'tour' | 'project' | 'program' | 'partner' | 'blog';
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  className?: string;
}
```

### Upload Result
```typescript
interface BlobUploadResult {
  url: string;           // Public URL
  downloadUrl: string;   // Download URL
  pathname: string;      // File path
  contentType: string;   // MIME type
  contentDisposition: string;
  size: number;          // File size in bytes
}
```

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   npm run server
   ```

2. **Visit the demo page:**
   ```
   http://localhost:8080/upload-demo
   ```

3. **Test file uploads:**
   - Select different content types (tours, projects, etc.)
   - Upload single or multiple files
   - View uploaded files and storage statistics

## 📈 Benefits

- **Fast CDN Delivery**: Files served via Vercel's global CDN
- **Automatic Optimization**: Images optimized for web delivery
- **Scalable Storage**: Unlimited storage capacity
- **Secure Access**: Token-based authentication
- **Easy Integration**: Simple API and React components
- **Cost Effective**: Pay only for what you use

## 🔗 Related Files

- `src/services/blobStorage.ts` - Core blob storage service
- `src/server/upload.ts` - Upload API endpoints
- `src/components/FileUpload.tsx` - React upload component
- `src/pages/UploadDemo.tsx` - Demo page
- `DATABASE_SETUP.md` - Database integration guide

The Vercel Blob storage integration is now fully functional and ready for production use!
