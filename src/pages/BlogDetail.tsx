import { useParams, Link } from 'react-router-dom';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, Clock, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useEffect } from 'react';

// Extend Window interface for Fancybox
declare global {
  interface Window {
    Fancybox: any;
  }
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const BlogDetail = () => {
  const { id } = useParams();
  const { data: post, loading, error } = useApi<BlogPost>(`/blog?id=${id}`);

  // Initialize Fancybox
  useEffect(() => {
    const loadFancybox = async () => {
      try {
        // Check if already loaded
        if (window.Fancybox) {
          initializeFancybox();
          return;
        }

        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js';
        script.onload = () => {
          console.log('Fancybox loaded');
          setTimeout(() => {
            initializeFancybox();
          }, 100);
        };
        script.onerror = () => {
          console.error('Failed to load Fancybox');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Fancybox:', error);
      }
    };

    const initializeFancybox = () => {
      if (window.Fancybox) {
        console.log('Initializing Fancybox');
        window.Fancybox.bind('[data-fancybox="gallery"]', {
          Toolbar: {
            display: {
              left: ["infobar"],
              middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
              right: ["slideshow", "thumbs", "close"]
            }
          },
          Thumbs: {
            autoStart: false,
          }
        });
      }
    };

    if (post && post.gallery_images && post.gallery_images.length > 0) {
      loadFancybox();
    }

    // Cleanup
    return () => {
      if (window.Fancybox) {
        window.Fancybox.destroy();
      }
    };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        
        {/* Hero Section Skeleton */}
        <section className="pt-32 pb-16 px-4 bg-gradient-mountain">
          <div className="container mx-auto">
            <div className="mb-8">
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="max-w-4xl">
              <Skeleton className="h-16 w-full mb-6" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        
        <section className="pt-32 pb-16 px-4 bg-gradient-mountain">
          <div className="container mx-auto">
            <div className="mb-8">
              <Button variant="ghost" asChild className="text-white hover:text-white/80">
                <Link to="/blog" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Error Loading Post</h1>
              <p className="text-xl text-white/90">Something went wrong while loading this blog post.</p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <p className="text-red-500 text-xl">Error: {error}</p>
            <Button asChild className="mt-4">
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <DatabaseNavigation />
        
        <section className="pt-32 pb-16 px-4 bg-gradient-mountain">
          <div className="container mx-auto">
            <div className="mb-8">
              <Button variant="ghost" asChild className="text-white hover:text-white/80">
                <Link to="/blog" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Post Not Found</h1>
              <p className="text-xl text-white/90">The blog post you're looking for doesn't exist.</p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <p className="text-gray-500 text-xl">Blog post not found</p>
            <Button asChild className="mt-4">
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      
      {/* Back Button */}
      <section className="pt-32 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/blog" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Section - Split Layout */}
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Title and Meta */}
            <div className="space-y-6">
              {post.category && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {post.category}
                </Badge>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Right Side - Featured Image */}
            {post.featured_image && (
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Images */}
      {post.gallery_images && post.gallery_images.length > 0 && (
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {post.gallery_images.map((image: any, index: number) => (
                <a
                  key={index}
                  href={image.url}
                  data-fancybox="gallery"
                  data-caption={image.description || image.alt || `Gallery image ${index + 1}`}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <img 
                    src={image.url} 
                    alt={image.alt || `Gallery image ${index + 1}`}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <section className="py-8 px-4 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-xl font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Author Card */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-card/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{post.author}</h3>
                  <p className="text-sm text-muted-foreground">Blog Author</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Experienced travel writer and adventure enthusiast sharing insights from the trails of Azerbaijan.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get the latest adventure stories, trail updates, and conservation news delivered to your inbox
          </p>
          <Button size="lg" variant="adventure" asChild>
            <Link to="/contact">Get Travel Updates</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BlogDetail;