import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import GalleryUpload from '@/components/GalleryUpload';
import SummernoteEditor from '@/components/SummernoteEditor';

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  isMain?: boolean;
  description?: string;
  alt?: string;
}

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  author_bio: string;
  author_avatar: string;
  author_twitter: string;
  author_linkedin: string;
  author_instagram: string;
  category: string;
  tags: string;
  featured_image: string;
  status: string;
  featured: boolean;
  published_date: string;
  slug: string;
  galleryImages: UploadedImage[];
}

const AdminBlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    author_bio: '',
    author_avatar: '',
    author_twitter: '',
    author_linkedin: '',
    author_instagram: '',
    category: '',
    tags: '',
    featured_image: '',
    status: 'draft',
    featured: false,
    published_date: new Date().toISOString().split('T')[0], // Default to today
    slug: '',
    galleryImages: []
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);



  useEffect(() => {
    if (isEditing && id) {
      fetchPost(parseInt(id));
    }
  }, [id, isEditing]);

  const fetchPost = async (postId: number) => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      const result = await response.json();
      
      if (result.success) {
        const post = result.data.find((p: any) => p.id === postId);
        if (post) {
          // Convert gallery_images to UploadedImage format
          let galleryImages: UploadedImage[] = [];
          if (post.gallery_images && post.gallery_images.length > 0) {
            galleryImages = post.gallery_images;
          } else if (post.featured_image) {
            // Fallback to featured_image if no gallery_images
            galleryImages = [{
              url: post.featured_image,
              filename: 'featured-image',
              size: 0,
              uploadedAt: new Date().toISOString(),
              isMain: true
            }];
          }

          setFormData({
            title: post.title || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            author: post.author || '',
            author_bio: post.author_bio || '',
            author_avatar: post.author_avatar || '',
            author_twitter: post.author_twitter || '',
            author_linkedin: post.author_linkedin || '',
            author_instagram: post.author_instagram || '',
            category: post.category || '',
            tags: post.tags ? post.tags.join(', ') : '',
            featured_image: post.featured_image || '',
            status: post.status || 'draft',
            featured: post.featured || false,
            published_date: post.published_date ? new Date(post.published_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            galleryImages: galleryImages
          });
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BlogFormData, value: string | boolean | UploadedImage[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in required fields');
      return;
    }

    try {
      setSaving(true);
      
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      // Set featured_image from first gallery image if available
      const featuredImage = formData.galleryImages.length > 0 ? formData.galleryImages[0].url : formData.featured_image;
      
      const requestData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: formData.author,
        author_bio: formData.author_bio,
        author_avatar: formData.author_avatar,
        author_twitter: formData.author_twitter,
        author_linkedin: formData.author_linkedin,
        author_instagram: formData.author_instagram,
        category: formData.category,
        tags: tagsArray,
        featured_image: featuredImage,
        gallery_images: formData.galleryImages,
        status: formData.status,
        featured: formData.featured,
        published_date: formData.published_date,
        ...(isEditing && { id: parseInt(id!), _method: 'PUT' })
      };

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        navigate('/admin/blogs');
      } else {
        alert('Failed to save blog post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/blogs')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Posts
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Blog Post' : 'New Blog Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter blog post title"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="Enter URL slug (e.g., my-blog-post)"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                URL: /blog/{formData.slug || 'your-slug'}
              </p>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Brief description of the post"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <SummernoteEditor
                value={formData.content}
                onChange={(content) => handleInputChange('content', content)}
                placeholder="Write your blog post content here..."
                height={400}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Author name"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="tips">Tips</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="published_date">Published Date</Label>
                <Input
                  id="published_date"
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => handleInputChange('published_date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div>
              <Label>Blog Images</Label>
              <GalleryUpload
                initialImages={formData.galleryImages}
                onImagesChange={(images) => handleInputChange('galleryImages', images)}
                maxImages={50}
                allowMultiple={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Author Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="author_bio">Author Bio</Label>
              <Textarea
                id="author_bio"
                value={formData.author_bio}
                onChange={(e) => handleInputChange('author_bio', e.target.value)}
                placeholder="Brief biography of the author"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="author_avatar">Author Avatar URL</Label>
              <Input
                id="author_avatar"
                value={formData.author_avatar}
                onChange={(e) => handleInputChange('author_avatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="author_twitter">Twitter Handle</Label>
                <Input
                  id="author_twitter"
                  value={formData.author_twitter}
                  onChange={(e) => handleInputChange('author_twitter', e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div>
                <Label htmlFor="author_linkedin">LinkedIn URL</Label>
                <Input
                  id="author_linkedin"
                  value={formData.author_linkedin}
                  onChange={(e) => handleInputChange('author_linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <Label htmlFor="author_instagram">Instagram Handle</Label>
                <Input
                  id="author_instagram"
                  value={formData.author_instagram}
                  onChange={(e) => handleInputChange('author_instagram', e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured">Featured Post</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/blogs')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogForm;
