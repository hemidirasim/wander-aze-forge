import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  Search,
  Filter,
  Grid,
  List,
  Download,
  Trash2,
  Copy,
  Eye,
  Plus,
  RefreshCw
} from 'lucide-react';
import GalleryUpload from '@/components/GalleryUpload';

interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  description?: string;
  alt?: string;
  category?: string;
}

const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration - in real app, this would come from API
  const mockImages: GalleryImage[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      filename: 'mountain-landscape.jpg',
      size: 1024000,
      uploadedAt: '2024-01-15T10:30:00Z',
      description: 'Beautiful mountain landscape',
      alt: 'Mountain landscape with snow peaks',
      category: 'nature'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      filename: 'forest-path.jpg',
      size: 856000,
      uploadedAt: '2024-01-14T14:20:00Z',
      description: 'Forest hiking path',
      alt: 'Forest path surrounded by tall trees',
      category: 'hiking'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400&h=300&fit=crop',
      filename: 'sunset-view.jpg',
      size: 1200000,
      uploadedAt: '2024-01-13T18:45:00Z',
      description: 'Stunning sunset view',
      alt: 'Golden sunset over mountains',
      category: 'nature'
    }
  ];

  useEffect(() => {
    setImages(mockImages);
    setFilteredImages(mockImages);
  }, []);

  useEffect(() => {
    let filtered = images;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.alt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    setFilteredImages(filtered);
  }, [images, searchTerm, selectedCategory]);

  const handleImagesUploaded = (newImages: GalleryImage[]) => {
    setImages(prev => [...prev, ...newImages]);
  };

  const handleImageDelete = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    setSelectedImages(prev => prev.filter(id => id !== imageId));
  };

  const handleBulkDelete = () => {
    setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const categories = ['all', 'nature', 'hiking', 'wildlife', 'cultural', 'adventure'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">Upload, organize, and manage your tour images</p>
        </div>

        {/* Upload Section */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-blue-500" />
              <span>Upload New Images</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GalleryUpload 
              onImagesChange={handleImagesUploaded}
              maxImages={20}
            />
          </CardContent>
        </Card>

        {/* Filters and Controls */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Label htmlFor="category-filter" className="text-sm font-medium">Category:</Label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Bulk Actions */}
              {selectedImages.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {selectedImages.length} selected
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images Grid/List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-green-500" />
              <span>Images ({filteredImages.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Upload some images to get started'
                  }
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg ${
                      selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''
                    } ${viewMode === 'list' ? 'flex' : ''}`}
                  >
                    {/* Image */}
                    <div className={`relative group ${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'w-full h-48'}`}>
                      <img
                        src={image.url}
                        alt={image.alt || image.filename}
                        className={`w-full h-full object-cover ${viewMode === 'list' ? '' : 'cursor-pointer'}`}
                        onClick={() => viewMode === 'grid' && window.open(image.url, '_blank')}
                      />
                      
                      {/* Selection Checkbox */}
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(image.id)}
                          onChange={() => toggleImageSelection(image.id)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
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
                            variant="secondary"
                            onClick={() => downloadImage(image.url, image.filename)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleImageDelete(image.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {image.filename}
                        </h3>
                        
                        {image.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {image.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatFileSize(image.size)}</span>
                          <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
                        </div>

                        {image.category && (
                          <Badge variant="outline" className="text-xs">
                            {image.category}
                          </Badge>
                        )}

                        {image.alt && (
                          <p className="text-xs text-gray-400 italic">
                            Alt: {image.alt}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGallery;
