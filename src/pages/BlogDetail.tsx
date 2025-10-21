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
  author_bio?: string;
  author_avatar?: string;
  author_twitter?: string;
  author_linkedin?: string;
  author_instagram?: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
  status: string;
  featured: boolean;
  published_date?: string;
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

    if (post && post.gallery_images && post.gallery_images.length > 1) {
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
                  <span>{new Date(post.published_date || post.created_at).toLocaleDateString('en-US', { 
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
      {post.gallery_images && post.gallery_images.length > 1 && (
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {post.gallery_images.map((image: any, index: number) => (
                <div key={index} className="group">
                  <a
                    href={image.url}
                    data-fancybox="gallery"
                    data-caption={image.description || image.alt || `Gallery image ${index + 1}`}
                    className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 block"
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
                  {(image.title || image.description) && (
                    <div className="mt-2 text-center">
                      {image.title && (
                        <h4 className="text-sm font-semibold text-foreground mb-1">{image.title}</h4>
                      )}
                      {image.description && (
                        <p className="text-xs text-muted-foreground">{image.description}</p>
                      )}
                    </div>
                  )}
                </div>
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
              className="text-muted-foreground leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>

      <style>{`
        .blog-content img {
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
          display: block;
          margin: 2rem auto;
          border-radius: 0.5rem;
        }
      `}</style>

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
                {post.author_avatar ? (
                  <img 
                    src={post.author_avatar} 
                    alt={post.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{post.author}</h3>
                  <p className="text-sm text-muted-foreground">Blog Author</p>
                  {(post.author_twitter || post.author_linkedin || post.author_instagram) && (
                    <div className="flex items-center space-x-3 mt-2">
                      {post.author_twitter && (
                        <a 
                          href={`https://twitter.com/${post.author_twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                      {post.author_linkedin && (
                        <a 
                          href={post.author_linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                      {post.author_instagram && (
                        <a 
                          href={`https://instagram.com/${post.author_instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            {post.author_bio && (
              <CardContent>
                <p className="text-muted-foreground">
                  {post.author_bio}
                </p>
              </CardContent>
            )}
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