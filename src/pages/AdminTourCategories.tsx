import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import GalleryUpload from '@/components/GalleryUpload';
import { 
  Plus,
  Edit, 
  Trash2, 
  Save,
  X, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react';

interface TourCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  icon_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface UploadedImage {
  url: string;
  name: string;
}

const AdminTourCategories = () => {
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    icon_url: '',
    is_active: true,
    sort_order: 0
  });
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);
  const [iconImages, setIconImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tour-categories');
      const data = await response.json();
      
      if (data.success) {
        // Sort by sort_order to display correctly
        const sortedCategories = data.data.sort((a: TourCategory, b: TourCategory) => a.sort_order - b.sort_order);
        setCategories(sortedCategories);
        console.log('Fetched and sorted categories:', sortedCategories.map((c: TourCategory) => ({ name: c.name, sort_order: c.sort_order })));
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = (category: TourCategory) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.image_url,
      icon_url: category.icon_url || '',
      is_active: category.is_active,
      sort_order: category.sort_order
    });
    setGalleryImages(category.image_url ? [{ url: category.image_url, name: 'Current Image' }] : []);
    setIconImages(category.icon_url ? [{ url: category.icon_url, name: 'Current Icon' }] : []);
    setEditingId(category.id);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      icon_url: '',
      is_active: true,
      sort_order: 0
    });
    setGalleryImages([]);
    setIconImages([]);
    setEditingId(null);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      icon_url: '',
      is_active: true,
      sort_order: 0
    });
    setGalleryImages([]);
    setIconImages([]);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        image_url: galleryImages.length > 0 ? galleryImages[0].url : formData.image_url,
        icon_url: iconImages.length > 0 ? iconImages[0].url : formData.icon_url
      };

      const url = editingId ? `/api/tour-categories?id=${editingId}` : '/api/tour-categories';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        await fetchCategories();
        handleCancel();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Failed to save category');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await fetch(`/api/tour-categories?id=${id}`, { method: 'DELETE' });
      await fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      setError('Failed to delete category');
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const category = categories.find(c => c.id === id);
      if (!category) return;

      const response = await fetch(`/api/tour-categories?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...category,
          is_active: !currentStatus
        }),
      });

      if (response.ok) {
        await fetchCategories();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update category');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.setData('application/json', JSON.stringify({ index }));
    setDraggedIndex(index);
    setDragStartIndex(index);
    console.log('Drag started for index:', index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragStartIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Try multiple ways to get the drag index
    let dragIndex: number;
    
    // First try state-based approach (most reliable)
    if (dragStartIndex !== null) {
      dragIndex = dragStartIndex;
      console.log('Using state-based drag index:', dragIndex);
    } else {
      try {
        // Try JSON data
        const jsonData = e.dataTransfer.getData('application/json');
        if (jsonData) {
          const parsed = JSON.parse(jsonData);
          dragIndex = parsed.index;
          console.log('Using JSON drag index:', dragIndex);
        } else {
          // Fallback to text/plain
          dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
          console.log('Using text drag index:', dragIndex);
        }
      } catch (err) {
        console.error('Error parsing drag data:', err);
        dragIndex = NaN;
      }
    }
    
    console.log('=== DRAG & DROP DEBUG ===');
    console.log('Drag index:', dragIndex);
    console.log('Drop index:', dropIndex);
    console.log('Current categories:', categories.map((c, i) => ({ index: i, name: c.name, sort_order: c.sort_order })));
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    if (dragIndex === dropIndex || isNaN(dragIndex)) {
      console.log('Same position or invalid index, skipping');
      return;
    }

    // Validate indices
    if (dragIndex < 0 || dragIndex >= categories.length || dropIndex < 0 || dropIndex >= categories.length) {
      console.error('Invalid indices:', { dragIndex, dropIndex, length: categories.length });
      return;
    }

    const cat1 = categories[dragIndex];
    const cat2 = categories[dropIndex];
    
    console.log('Swapping categories:');
    console.log('Cat 1:', { name: cat1.name, id: cat1.id, sort_order: cat1.sort_order });
    console.log('Cat 2:', { name: cat2.name, id: cat2.id, sort_order: cat2.sort_order });

    // Create updated versions with swapped sort_order
    const updatedCat1 = { ...cat1, sort_order: cat2.sort_order };
    const updatedCat2 = { ...cat2, sort_order: cat1.sort_order };
    
    console.log('After swap:');
    console.log('Updated Cat 1:', { name: updatedCat1.name, sort_order: updatedCat1.sort_order });
    console.log('Updated Cat 2:', { name: updatedCat2.name, sort_order: updatedCat2.sort_order });

    // Update database
    try {
      setIsUpdating(true);
      setError(null);
      console.log('Updating database...');
      
      // Try batch update approach - update both categories in parallel
      const [response1, response2] = await Promise.all([
        fetch(`/api/tour-categories?id=${updatedCat1.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCat1)
        }),
        fetch(`/api/tour-categories?id=${updatedCat2.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCat2)
        })
      ]);
      
      const [result1, result2] = await Promise.all([
        response1.json(),
        response2.json()
      ]);
      
      console.log('API Response 1:', result1);
      console.log('API Response 2:', result2);

      if (!response1.ok || !response2.ok) {
        const errors = [];
        if (!response1.ok) errors.push(`Category 1: ${result1.error || 'Unknown error'}`);
        if (!response2.ok) errors.push(`Category 2: ${result2.error || 'Unknown error'}`);
        throw new Error(`Update failed: ${errors.join(', ')}`);
      }

      console.log('Database updated successfully');
      console.log('Fetching fresh data...');
      
      // Refresh from database
      await fetchCategories();
      
      console.log('=== SWAP COMPLETE ===');
      
    } catch (err) {
      console.error('Error swapping categories:', err);
      setError(`Failed to swap categories: ${err instanceof Error ? err.message : 'Unknown error'}`);
      // Still refresh to show current state
      await fetchCategories();
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
              </div>
            </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tour Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage tour categories and their settings. Drag and drop to reorder.
          </p>
          {isUpdating && (
            <div className="mt-2 text-sm text-primary flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Updating order...
            </div>
          )}
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
          </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="mb-8">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingId ? 'Edit Category' : 'Create New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                    <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Trekking"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                    <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="e.g., trekking"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe this tour category..."
                  rows={3}
                  />
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <GalleryUpload
                    images={galleryImages}
                    onImagesChange={setGalleryImages}
                    maxImages={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Icon (SVG/PNG) - for Header Menu</Label>
                  <GalleryUpload
                    images={iconImages}
                    onImagesChange={setIconImages}
                    maxImages={1}
                    className="w-full"
                  />
                  {iconImages.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-md flex items-center gap-3">
                      <img src={iconImages[0].url} alt="Icon preview" className="w-8 h-8" />
                      <span className="text-sm text-muted-foreground">Icon preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                      <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="is_active">Active</Label>
                    </div>
                </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update' : 'Create'}
                      </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                  </Button>
                </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
                <Card 
                  key={category.id} 
                  className={`group transition-all duration-300 cursor-move ${
                    draggedIndex === index ? 'opacity-30 scale-90 shadow-none rotate-2' : 
                    dragOverIndex === index ? 'border-2 border-primary shadow-2xl scale-105 bg-primary/10 ring-2 ring-primary/20' : 
                    isUpdating ? 'opacity-75 pointer-events-none' :
                    'hover:shadow-lg hover:scale-102'
                  }`}
                  draggable={!isUpdating}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    #{category.sort_order}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {category.image_url && (
                <div className="mb-4">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {category.description || 'No description provided'}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(category.id, category.is_active)}
                  >
                    {category.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Categories Found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first tour category
          </p>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Category
          </Button>
      </div>
      )}
    </div>
  );
};

export default AdminTourCategories;