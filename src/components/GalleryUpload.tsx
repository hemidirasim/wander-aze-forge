import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle,
  Trash2,
  Eye,
  Copy,
  Download
} from 'lucide-react';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  description?: string;
  alt?: string;
}

interface GalleryUploadProps {
  onImagesChange?: (images: UploadedImage[]) => void;
  initialImages?: UploadedImage[];
  maxImages?: number;
  allowedTypes?: string[];
  maxSize?: number; // in MB
}

const GalleryUpload: React.FC<GalleryUploadProps> = ({
  onImagesChange,
  initialImages = [],
  maxImages = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSize = 5 // 5MB
}) => {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File size ${formatFileSize(file.size)} exceeds maximum size of ${maxSize}MB`;
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<UploadedImage> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'gallery');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      id: result.id || Date.now().toString(),
      url: result.url,
      filename: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check max images limit
    if (images.length + validFiles.length > maxImages) {
      setErrors([`Maximum ${maxImages} images allowed. You're trying to upload ${validFiles.length} more images.`]);
      return;
    }

    setErrors([]);
    setUploading(true);

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const imageId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        // Simulate progress
        setUploadProgress(prev => ({ ...prev, [imageId]: 0 }));
        
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[imageId] || 0;
            if (current < 90) {
              return { ...prev, [imageId]: current + 10 };
            }
            return prev;
          });
        }, 100);

        try {
          const uploadedImage = await uploadFile(file);
          
          clearInterval(interval);
          setUploadProgress(prev => ({ ...prev, [imageId]: 100 }));
          
          // Add description field
          uploadedImage.description = '';
          uploadedImage.alt = file.name.replace(/\.[^/.]+$/, ""); // Remove extension for alt text
          
          return uploadedImage;
        } catch (error) {
          clearInterval(interval);
          throw error;
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedImages];
      
      setImages(newImages);
      onImagesChange?.(newImages);
      
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress({});
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setErrors([`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (imageId: string) => {
    const newImages = images.filter(img => img.id !== imageId);
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const updateImageDescription = (imageId: string, description: string) => {
    const newImages = images.map(img => 
      img.id === imageId ? { ...img, description } : img
    );
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const updateImageAlt = (imageId: string, alt: string) => {
    const newImages = images.map(img => 
      img.id === imageId ? { ...img, alt } : img
    );
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            <span>Gallery Upload</span>
            <Badge variant="secondary">
              {images.length}/{maxImages} images
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              {dragActive ? 'Drop images here' : 'Upload Images'}
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Supported formats: JPEG, PNG, WebP • Max size: {maxSize}MB per file
            </p>
            
            <Input
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
              id="gallery-upload"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('gallery-upload')?.click()}
              disabled={uploading || images.length >= maxImages}
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Images
            </Button>
          </div>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([imageId, progress]) => (
                <div key={imageId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Upload Errors:</span>
              </div>
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-green-500" />
              <span>Uploaded Images ({images.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 space-y-3">
                  {/* Image Preview */}
                  <div className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt || image.filename}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => window.open(image.url, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyImageUrl(image.url)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{formatFileSize(image.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uploaded:</span>
                        <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Alt Text */}
                    <div className="space-y-1">
                      <Label htmlFor={`alt-${image.id}`} className="text-xs">Alt Text</Label>
                      <Input
                        id={`alt-${image.id}`}
                        value={image.alt || ''}
                        onChange={(e) => updateImageAlt(image.id, e.target.value)}
                        placeholder="Describe the image for accessibility"
                        className="text-xs"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <Label htmlFor={`desc-${image.id}`} className="text-xs">Description</Label>
                      <Textarea
                        id={`desc-${image.id}`}
                        value={image.description || ''}
                        onChange={(e) => updateImageDescription(image.id, e.target.value)}
                        placeholder="Optional description"
                        rows={2}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GalleryUpload;
