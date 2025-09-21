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
  Download,
  Star,
  StarIcon,
  GripVertical,
  Crown
} from 'lucide-react';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  description?: string;
  alt?: string;
  isMain?: boolean;
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    try {
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      const base64Data = await convertToBase64(file);
      
      // Remove data URL prefix
      const base64String = base64Data.split(',')[1];
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData: base64String,
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          category: 'gallery'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      return {
        id: result.blob.url,
        url: result.blob.url,
        filename: result.blob.pathname.split('/').pop() || file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        isMain: false
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed maxImages limit
    if (images.length + fileArray.length > maxImages) {
      setErrors([`Cannot upload ${fileArray.length} files. Maximum ${maxImages} images allowed. Current: ${images.length}`]);
      return;
    }

    setUploading(true);
    setErrors([]);

    const uploadPromises = fileArray.map(async (file, index) => {
      const imageId = `${Date.now()}-${index}`;
      
      try {
        setUploadProgress(prev => ({ ...prev, [imageId]: 0 }));
        
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadProgress(prev => ({ ...prev, [imageId]: i }));
        }

        const uploadedImage = await uploadImage(file);
        
        if (uploadedImage) {
          setImages(prev => [...prev, uploadedImage]);
          onImagesChange?.([...images, uploadedImage]);
        }
        
        // Remove progress tracking
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[imageId];
          return newProgress;
        });
        
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        setErrors(prev => [...prev, `${file.name}: ${error instanceof Error ? error.message : 'Upload failed'}`]);
        
        // Remove progress tracking on error
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[imageId];
          return newProgress;
        });
      }
    });

    await Promise.all(uploadPromises);
    setUploading(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
    handleFiles(e.target.files);
  };

  const removeImage = (id: string) => {
    const newImages = images.filter(img => img.id !== id);
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

  // Set image as main
  const setAsMain = (id: string) => {
    const newImages = images.map(img => ({
      ...img,
      isMain: img.id === id
    }));
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  // Drag and drop handlers for reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverReorder = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropReorder = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged image from original position
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    setImages(newImages);
    onImagesChange?.(newImages);
    setDraggedIndex(null);
  };

  const handleDragEndReorder = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-500" />
            <span>Upload Images</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="gallery-upload"
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading || images.length >= maxImages}
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 text-gray-400">
                <Upload className="w-full h-full" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop images here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Supports {allowedTypes.join(', ')} up to {maxSize}MB each
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {images.length} / {maxImages} images uploaded
                </p>
              </div>
            </div>
            
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
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                💡 Drag images to reorder • Click "Set as Main" to make an image the primary tour image
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <div 
                    key={image.id} 
                    className={`border rounded-lg p-4 space-y-3 relative transition-all duration-200 ${
                      image.isMain ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''
                    } ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOverReorder}
                    onDrop={(e) => handleDropReorder(e, index)}
                    onDragEnd={handleDragEndReorder}
                  >
                    {/* Main Image Badge */}
                    {image.isMain && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-yellow-500 text-white flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>Main</span>
                        </Badge>
                      </div>
                    )}

                    {/* Drag Handle */}
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-move hover:bg-gray-200"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>

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

                    {/* Set as Main Button */}
                    <div className="flex justify-center">
                      <Button
                        size="sm"
                        variant={image.isMain ? "default" : "outline"}
                        onClick={() => setAsMain(image.id)}
                        className={`w-full ${image.isMain ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                      >
                        <Star className={`w-4 h-4 mr-2 ${image.isMain ? 'fill-current' : ''}`} />
                        {image.isMain ? 'Main Image' : 'Set as Main'}
                      </Button>
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GalleryUpload;