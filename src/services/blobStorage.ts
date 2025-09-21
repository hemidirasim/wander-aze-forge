import { put, del, list } from '@vercel/blob';

// Vercel Blob configuration
const BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_E4sM2P9CqIcdXJYG_vPxKKu1Kjc6i8fjYfN36epuHFWcXij";

export interface BlobUploadResult {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  size: number;
}

export class BlobStorageService {
  /**
   * Upload a file to Vercel Blob storage
   */
  static async uploadFile(
    filename: string,
    file: Buffer | Uint8Array | string,
    options?: {
      contentType?: string;
      access?: 'public' | 'private';
      addRandomSuffix?: boolean;
    }
  ): Promise<BlobUploadResult> {
    try {
      const blob = await put(filename, file, {
        access: 'public',
        addRandomSuffix: true,
        token: BLOB_READ_WRITE_TOKEN,
        ...options,
      });

      return {
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        pathname: blob.pathname,
        contentType: blob.contentType,
        contentDisposition: blob.contentDisposition,
        size: blob.size,
      };
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      throw new Error('Failed to upload file to blob storage');
    }
  }

  /**
   * Delete a file from Vercel Blob storage
   */
  static async deleteFile(url: string): Promise<boolean> {
    try {
      await del(url, {
        token: BLOB_READ_WRITE_TOKEN,
      });
      return true;
    } catch (error) {
      console.error('Error deleting from Vercel Blob:', error);
      return false;
    }
  }

  /**
   * List files in blob storage
   */
  static async listFiles(prefix?: string): Promise<any[]> {
    try {
      const { blobs } = await list({
        prefix,
        token: BLOB_READ_WRITE_TOKEN,
      });
      return blobs;
    } catch (error) {
      console.error('Error listing files from Vercel Blob:', error);
      return [];
    }
  }

  /**
   * Upload image with optimized settings for web
   */
  static async uploadImage(
    filename: string,
    file: Buffer | Uint8Array,
    options?: {
      quality?: number;
      maxWidth?: number;
      maxHeight?: number;
    }
  ): Promise<BlobUploadResult> {
    return this.uploadFile(filename, file, {
      contentType: 'image/jpeg',
      access: 'public',
      addRandomSuffix: true,
      ...options,
    });
  }

  /**
   * Upload document with appropriate settings
   */
  static async uploadDocument(
    filename: string,
    file: Buffer | Uint8Array,
    contentType: string = 'application/pdf'
  ): Promise<BlobUploadResult> {
    return this.uploadFile(filename, file, {
      contentType,
      access: 'public',
      addRandomSuffix: true,
    });
  }

  /**
   * Generate optimized filename for different content types
   */
  static generateFilename(type: 'tour' | 'project' | 'program' | 'partner' | 'blog', originalName: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop() || 'jpg';
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return `${type}s/${timestamp}_${sanitizedName}`;
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File | Buffer, maxSizeMB: number = 10): { valid: boolean; error?: string } {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file instanceof File) {
      if (file.size > maxSizeBytes) {
        return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'File type not allowed. Only JPEG, PNG, WebP, and PDF files are supported.' };
      }
    } else if (file instanceof Buffer) {
      if (file.length > maxSizeBytes) {
        return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
      }
    }
    
    return { valid: true };
  }
}

export default BlobStorageService;
