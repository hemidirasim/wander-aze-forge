import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  type: 'tour' | 'project' | 'program' | 'partner' | 'blog' | 'review';
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  className?: string;
}

interface UploadResult {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  size: number;
}

interface PreviewFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  type,
  accept = 'image/*',
  maxSizeMB = 10,
  multiple = false,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      // Create preview files immediately
      const newPreviewFiles: PreviewFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const preview = await createPreview(file);
        const id = `${Date.now()}-${i}`;
        
        newPreviewFiles.push({
          id,
          file,
          preview,
          status: 'uploading',
          progress: 0
        });
      }

      setPreviewFiles(prev => [...prev, ...newPreviewFiles]);

      // Upload files immediately
      for (const previewFile of newPreviewFiles) {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setPreviewFiles(prev => prev.map(pf => 
            pf.id === previewFile.id 
              ? { ...pf, progress: Math.min(pf.progress + 10, 90) }
              : pf
          ));
        }, 100);

        try {
          if (multiple) {
            await uploadMultipleFiles(previewFile);
          } else {
            await uploadSingleFile(previewFile);
          }
        } finally {
          clearInterval(progressInterval);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadSingleFile = async (previewFile: PreviewFile) => {
    try {
      const formData = new FormData();
      formData.append('image', previewFile.file);
      formData.append('type', type);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.blob) {
        setPreviewFiles(prev => prev.map(pf => 
          pf.id === previewFile.id 
            ? { ...pf, status: 'completed', progress: 100, url: result.blob.url }
            : pf
        ));
        setUploadedFiles(prev => [...prev, result.blob]);
        onUploadComplete(result.blob.url);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setPreviewFiles(prev => prev.map(pf => 
        pf.id === previewFile.id 
          ? { ...pf, status: 'error', error: errorMessage }
          : pf
      ));
      onUploadError?.(errorMessage);
    }
  };

  const uploadMultipleFiles = async (previewFile: PreviewFile) => {
    try {
      const formData = new FormData();
      formData.append('images', previewFile.file);
      formData.append('type', type);

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success && result.blobs && result.blobs.length > 0) {
        const blob = result.blobs[0]; // Get the first blob for this file
        setPreviewFiles(prev => prev.map(pf => 
          pf.id === previewFile.id 
            ? { ...pf, status: 'completed', progress: 100, url: blob.url }
            : pf
        ));
        setUploadedFiles(prev => [...prev, blob]);
        onUploadComplete(blob.url);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setPreviewFiles(prev => prev.map(pf => 
        pf.id === previewFile.id 
          ? { ...pf, status: 'error', error: errorMessage }
          : pf
      ));
      onUploadError?.(errorMessage);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await handleFiles(Array.from(files));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = async (url: string) => {
    try {
      const response = await fetch('/api/upload/file', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        setUploadedFiles(prev => prev.filter(file => file.url !== url));
      }
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const removePreviewFile = (id: string) => {
    setPreviewFiles(prev => prev.filter(pf => pf.id !== id));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Compact Drag and Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onClick={triggerFileSelect}
      >
        <div className="flex items-center justify-center gap-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center transition-colors
            ${isDragOver ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}
          `}>
            <Upload className="w-4 h-4" />
          </div>
          
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              {isDragOver ? 'Drop images here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-gray-500">
              Max {maxSizeMB}MB each
            </p>
          </div>
        </div>
      </div>

          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {previewFiles.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {previewFiles.map((previewFile) => (
                  <div
                    key={previewFile.id}
                    className="relative group border rounded-lg overflow-hidden"
                  >
                    <img
                      src={previewFile.preview}
                      alt="Preview"
                      className="w-full h-24 object-cover"
                    />
                    
                    {/* Status overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      {previewFile.status === 'uploading' && (
                        <div className="text-center text-white">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                          <p className="text-xs">{previewFile.progress}%</p>
                        </div>
                      )}
                      {previewFile.status === 'completed' && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                      {previewFile.status === 'error' && (
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removePreviewFile(previewFile.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* Error message */}
                    {previewFile.status === 'error' && previewFile.error && (
                      <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1">
                        {previewFile.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
    </div>
  );
};

export default FileUpload;
