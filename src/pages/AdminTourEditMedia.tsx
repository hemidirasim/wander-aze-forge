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
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arraySwap,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GalleryImage {
  url: string;
  caption?: string;
  alt_text?: string;
}

interface Tour {
  id: number;
  title: string;
  gallery_images?: GalleryImage[] | string[];
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
    galleryImages: [] as GalleryImage[],
    photographyService: '',
    mainImage: ''
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

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
        
        // Parse gallery_images - handle both JSON string and array formats
        let galleryImagesRaw = tourData.gallery_images || [];
        
        // If it's a JSON string, parse it
        if (typeof galleryImagesRaw === 'string') {
          try {
            galleryImagesRaw = JSON.parse(galleryImagesRaw);
          } catch (e) {
            console.warn('Failed to parse gallery_images JSON:', e);
            galleryImagesRaw = [];
          }
        }
        
        // Convert gallery_images to object array format
        const galleryImages = (Array.isArray(galleryImagesRaw) ? galleryImagesRaw : []).map((img: string | GalleryImage | any) => {
          // If it's already an object with url property
          if (typeof img === 'object' && img !== null && 'url' in img) {
            return { 
              url: img.url || '', 
              caption: img.caption || '', 
              alt_text: img.alt_text || '' 
            };
          }
          // If it's a string URL
          if (typeof img === 'string') {
            return { url: img, caption: '', alt_text: '' };
          }
          // Fallback
          return { url: '', caption: '', alt_text: '' };
        }).filter(img => img.url.trim() !== ''); // Filter out empty URLs
        
        setFormData({
          galleryImages,
          photographyService: tourData.photography_service || '',
          mainImage: tourData.image_url || ''
        });
        
        console.log('=== LOADED MEDIA DATA ===');
        console.log('Raw gallery_images:', tourData.gallery_images);
        console.log('Type of gallery_images:', typeof tourData.gallery_images);
        console.log('Is array?', Array.isArray(tourData.gallery_images));
        console.log('Parsed gallery_images:', galleryImagesRaw);
        console.log('Processed gallery_images:', galleryImages);
        console.log('Gallery images count:', galleryImages.length);
        galleryImages.forEach((img, idx) => {
          console.log(`Image ${idx}:`, {
            url: img.url,
            caption: img.caption,
            alt_text: img.alt_text,
            type: typeof img,
            isObject: typeof img === 'object'
          });
        });
        console.log('Photography service:', tourData.photography_service);
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
      galleryImages: [...prev.galleryImages, { url: '', caption: '', alt_text: '' }]
    }));
  };

  const isBase64Image = (url: string) => {
    // Only check for actual base64 data URLs, not regular URLs
    return url.startsWith('data:image/') && url.includes('base64,');
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  const updateGalleryImage = (index: number, field: 'url' | 'caption' | 'alt_text', value: string) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Sortable item component
  const SortableImage: React.FC<{ id: string; index: number; image: GalleryImage }> = ({ id, index, image }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.8 : 1,
      cursor: 'grab'
    };
    
    // Ensure image is an object with url property
    const imageUrl = typeof image === 'object' && image !== null && 'url' in image 
      ? image.url 
      : typeof image === 'string' 
        ? image 
        : '';
    
    const imageCaption = typeof image === 'object' && image !== null && 'caption' in image 
      ? image.caption || '' 
      : '';
    
    const imageAltText = typeof image === 'object' && image !== null && 'alt_text' in image 
      ? image.alt_text || '' 
      : '';
    
    if (!imageUrl) {
      console.warn('Invalid image object at index', index, ':', image);
      return null;
    }
    
    return (
      <div ref={setNodeRef} style={style} className="border rounded-lg p-3 space-y-2 bg-white">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={imageAltText || `Gallery ${index + 1}`}
            className="w-full h-32 object-cover rounded"
            onError={(e) => { 
              console.error('Image load error:', imageUrl);
              (e.currentTarget as HTMLImageElement).style.display = 'none'; 
            }}
          />
          <button
            type="button"
            className="absolute top-2 left-2 bg-gray-800/70 text-white rounded px-2 py-1 text-xs"
            {...attributes}
            {...listeners}
          >
            Drag
          </button>
          {formData.mainImage === image.url && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <Camera className="w-3 h-3" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor={`caption-${index}`} className="text-xs">Caption</Label>
            <Input
              id={`caption-${index}`}
              type="text"
              value={imageCaption}
              onChange={(e) => updateGalleryImage(index, 'caption', e.target.value)}
              placeholder="Foto başlığı..."
              className="text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`alt-${index}`} className="text-xs">Alt Text</Label>
            <Input
              id={`alt-${index}`}
              type="text"
              value={imageAltText}
              onChange={(e) => updateGalleryImage(index, 'alt_text', e.target.value)}
              placeholder="Alt text (SEO üçün)..."
              className="text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={formData.mainImage === imageUrl ? "default" : "outline"}
            size="sm"
            onClick={() => setFormData(prev => ({ ...prev, mainImage: imageUrl }))}
            className="flex-1"
          >
            {formData.mainImage === imageUrl ? 'Main Foto' : 'Main Foto Et'}
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
      </div>
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = formData.galleryImages.findIndex((img) => img.url === active.id);
    const newIndex = formData.galleryImages.findIndex((img) => img.url === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setFormData(prev => ({
      ...prev,
      galleryImages: arraySwap(prev.galleryImages, oldIndex, newIndex)
    }));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Use the same logic as FileUpload component
      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });
      formData.append('type', 'tour');

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success && result.blobs) {
        const uploadedImages = result.blobs.map((blob: any) => ({
          url: blob.url,
          caption: '',
          alt_text: ''
        }));
        
        setFormData(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, ...uploadedImages]
        }));

        toast({
          title: "Upload Successful!",
          description: `${uploadedImages.length} image(s) uploaded successfully.`,
        });
      }

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

    // Filter out empty URLs from gallery images
    const cleanedFormData = {
      galleryImages: formData.galleryImages.filter(item => item.url.trim() !== ''),
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
        img.url.trim() !== '' && isBase64Image(img.url)
      );
      
      if (base64Images.length > 0) {
        toast({
          title: "Images Not Uploaded",
          description: `Please upload ${base64Images.length} image(s) first before saving. Base64 images are not allowed.`,
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

      console.log('=== UPDATE MEDIA RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      console.log('Gallery images in response:', data.data?.gallery_images);

      if (data.success) {
        console.log('✅ Media updated successfully!');
        console.log('Updated gallery images:', data.data?.gallery_images);
        
        toast({
          title: "Media Updated Successfully!",
          description: "Tour media information has been updated.",
        });
        
        // Refresh the page data to show updated images
        await fetchTour();
        
        // Small delay before navigation to ensure data is refreshed
        setTimeout(() => {
          navigate(`/admin/tours/${id}/manage`);
        }, 500);
      } else {
        console.error('❌ Update failed:', data);
        toast({
          title: "Error",
          description: data.message || data.error || "Failed to update media",
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
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext 
                        items={formData.galleryImages
                          .filter(img => img && (typeof img === 'object' ? img.url : typeof img === 'string' ? img : ''))
                          .map(img => typeof img === 'object' && img !== null && 'url' in img ? img.url : typeof img === 'string' ? img : '')
                        } 
                        strategy={rectSortingStrategy}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {formData.galleryImages
                            .map((image, index) => {
                              // Ensure image is in correct format
                              const normalizedImage: GalleryImage = typeof image === 'object' && image !== null && 'url' in image
                                ? { url: image.url || '', caption: image.caption || '', alt_text: image.alt_text || '' }
                                : typeof image === 'string'
                                  ? { url: image, caption: '', alt_text: '' }
                                  : { url: '', caption: '', alt_text: '' };
                              
                              if (!normalizedImage.url) {
                                console.warn('Skipping image with empty URL at index', index);
                                return null;
                              }
                              
                              return (
                                <SortableImage 
                                  key={normalizedImage.url} 
                                  id={normalizedImage.url} 
                                  index={index} 
                                  image={normalizedImage} 
                                />
                              );
                            })
                            .filter(Boolean)
                          }
                        </div>
                      </SortableContext>
                    </DndContext>
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
