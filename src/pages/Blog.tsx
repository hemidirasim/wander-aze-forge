import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

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

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      const result = await response.json();
      
      if (result.success) {
        setPosts(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section Skeleton */}
        <section className="pt-24 pb-16 px-4 bg-gradient-mountain">
          <div className="container mx-auto text-center">
            <Skeleton className="h-20 w-96 mx-auto mb-6" />
            <Skeleton className="h-8 w-2/3 mx-auto" />
          </div>
        </section>

        {/* Featured Post Skeleton */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-48 mx-auto mb-4" />
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </section>

        {/* Regular Posts Skeleton */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-48 mx-auto mb-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <section className="pt-24 pb-16 px-4 bg-gradient-mountain">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Adventure Blog</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Stories, guides, and insights from the trails of Azerbaijan
            </p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Error Loading Posts</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchPosts}>
              Try Again
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <section className="pt-24 pb-16 px-4 bg-gradient-mountain">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Adventure Blog</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Stories, guides, and insights from the trails of Azerbaijan
            </p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <p className="text-gray-500 text-xl">No blog posts available</p>
          </div>
        </section>
      </div>
    );
  }

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  // Get unique categories for filter
  const categories = ["All", ...Array.from(new Set(posts.map(post => post.category).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      

      {/* Featured Post */}
      {featuredPost && (
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Featured Story</h2>
            </div>
            
            <Card className="group hover:shadow-elevated transition-all duration-500 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-80 lg:h-full overflow-hidden">
                  <img 
                    src={featuredPost.featured_image || "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {featuredPost.category && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-background/90">
                        {featuredPost.category}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col justify-center">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {featuredPost.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>5 min read</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {featuredPost.excerpt || featuredPost.content.substring(0, 200) + '...'}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-4">
                    <Button variant="adventure" asChild className="w-fit">
                      <Link to={`/blog/${featuredPost.id}`} className="flex items-center">
                        Read Full Story
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">All Stories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-elevated transition-all duration-500 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.featured_image || "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {post.category && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-background/90">
                        {post.category}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                </CardContent>
                
                <CardFooter>
                  <Button variant="ghost" asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    <Link to={`/blog/${post.id}`} className="flex items-center justify-center">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-forest">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get the latest adventure stories, trail updates, and conservation news delivered to your inbox
          </p>
          <Button size="lg" variant="outline" className="bg-white text-forest hover:bg-white/90">
            Subscribe to Newsletter
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;