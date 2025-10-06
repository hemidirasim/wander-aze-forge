import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Save,
  ArrowLeft,
  Plus,
  X,
  Camera,
  Image,
  Upload,
  Trash2
} from 'lucide-react';

interface Tour {
  id: number;
  title: string;
  gallery_images?: string[];
  photography_service?: string;
}

const AdminTourEditMedia: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    galleryImages: [] as string[],
    photographyService: '',
    mainImage: ''
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (id) {
      fetchTour();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tours/${id}`);
      const data = await response.json();

      if (data.success) {
        const tourData = data.data;
        setTour(tourData);
        setFormData({
          galleryImages: tourData.gallery_images || [],
          photographyService: tourData.photography_service || '',
          mainImage: tourData.image_url || ''
        });
        
        console.log('Loaded media data:', {
          galleryImages: tourData.gallery_images,
          photographyService: tourData.photography_service
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load tour details",
          variant: "destructive"
        });
        navigate(`/admin/tours/${id}/manage`);
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
      toast({
        title: "Error",
        description: "Failed to load tour details",
        variant: "destructive"
      });
      navigate(`/admin/tours/${id}/manage`);
    } finally {
      setLoading(false);
    }
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, '']
    }));
  };

  const isBase64Image = (url: string) => {
    return url.startsWith('data:image/') || url.startsWith('data:image/webp');
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  const updateGalleryImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.map((item, i) => i === index ? value : item)
    }));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Check file size (5MB limit per file)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
        }

        // Use FormData instead of base64
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'tour');
        formData.append('filename', file.name);
        formData.append('fileType', file.type);
        formData.append('fileSize', file.size.toString());

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Upload failed for ${file.name}: ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        setUploadProgress(((index + 1) / files.length) * 100);
        
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedUrls]
      }));

      toast({
        title: "Upload Successful!",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Filter out empty strings from gallery images
    const cleanedFormData = {
      galleryImages: formData.galleryImages.filter(item => item.trim() !== ''),
      photographyService: formData.photographyService,
      mainImage: formData.mainImage
    };

    console.log('Sending media data:', cleanedFormData);

    try {
      // Check payload size
      const payloadSize = JSON.stringify(cleanedFormData).length;
      console.log('Payload size:', payloadSize, 'bytes');
      
      // Check if any images are still base64 (not uploaded)
      const base64Images = cleanedFormData.galleryImages.filter(img => 
        img.trim() !== '' && isBase64Image(img)
      );
      
      if (base64Images.length > 0) {
        toast({
          title: "Images Not Uploaded",
          description: `Please upload ${base64Images.length} image(s) first before saving. Only URLs are allowed.`,
          variant: "destructive"
        });
        return;
      }
      
      if (payloadSize > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "Payload Too Large",
          description: "Please reduce the number of images or image sizes.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`/api/tours/${id}/update-media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData)
      });

      if (!response.ok) {
        if (response.status === 413) {
          toast({
            title: "Request Too Large",
            description: "The request is too large. Please reduce the number of images.",
            variant: "destructive"
          });
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Media Updated Successfully!",
          description: "Tour media information has been updated.",
        });
        
        navigate(`/admin/tours/${id}/manage`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update media",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update media",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tour Not Found</h1>
            <p className="text-muted-foreground mb-6">The tour you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/admin/tours')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tours
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/tours/${id}/manage`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tour Management
              </Button>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Media & Photography</h1>
            <p className="text-muted-foreground">Manage gallery images and photography services for {tour.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Gallery Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  Gallery Images
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload images or add image URLs for the tour gallery
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-medium">
                      {uploading ? 'Uploading...' : 'Click to upload images'}
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, JPEG up to 5MB each
                    </span>
                  </label>
                  
                  {uploading && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(uploadProgress)}% complete
                      </p>
                    </div>
                  )}
                </div>

                {/* Gallery Images List */}
                {formData.galleryImages.length > 0 && (
                  <div className="space-y-4">
                    <Label>Gallery Images ({formData.galleryImages.length})</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.galleryImages.map((image, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="relative">
                            <img 
                              src={image} 
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-32 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            {formData.mainImage === image && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                <Camera className="w-3 h-3" />
                              </div>
                            )}
                            {isBase64Image(image) && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1">
                                <Upload className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={formData.mainImage === image ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, mainImage: image }))}
                              className="flex-1"
                            >
                              {formData.mainImage === image ? 'Main Foto' : 'Main Foto Et'}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeGalleryImage(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {isBase64Image(image) && (
                            <p className="text-xs text-red-500 text-center">
                              Not uploaded - Only URLs allowed
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photography Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Photography Service
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe photography services provided during the tour
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photographyService">Photography Service Details</Label>
                  <Textarea
                    id="photographyService"
                    value={formData.photographyService}
                    onChange={(e) => handleInputChange('photographyService', e.target.value)}
                    placeholder="Describe photography services, equipment provided, photo sharing arrangements, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/admin/tours/${id}/manage`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Updating Media...' : 'Update Media'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTourEditMedia;
