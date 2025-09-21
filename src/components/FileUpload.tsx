import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  type: 'tour' | 'project' | 'program' | 'partner' | 'blog';
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
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      if (multiple) {
        Array.from(files).forEach(file => {
          formData.append('images', file);
        });
        formData.append('type', type);

        const response = await fetch('/api/upload/images', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        
        if (result.success && result.blobs) {
          setUploadedFiles(result.blobs);
          result.blobs.forEach((blob: UploadResult) => {
            onUploadComplete(blob.url);
          });
        }
      } else {
        const file = files[0];
        formData.append('image', file);
        formData.append('type', type);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 100);

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        
        if (result.success && result.blob) {
          setUploadedFiles([result.blob]);
          onUploadComplete(result.blob.url);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload {type} {multiple ? 'images' : 'image'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="w-full"
            variant="outline"
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose {multiple ? 'Images' : 'Image'}
              </>
            )}
          </Button>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Uploaded Files:</h4>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {file.pathname.split('/').pop()}
                      </p>
                      <p className="text-xs text-green-600">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(file.downloadUrl, '_blank')}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile(file.url)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">
            Max file size: {maxSizeMB}MB. Supported formats: JPEG, PNG, WebP
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
