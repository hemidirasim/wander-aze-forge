import React from 'react';
import { useApi } from '@/hooks/useApi';
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

const DatabaseBlog: React.FC = () => {
  const { data: posts, loading, error } = useApi<BlogPost[]>('/blog');

  if (loading) {
    return (
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Skeleton className="h-16 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          
          {/* Featured Post Skeleton */}
          <div className="mb-16">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
          
          {/* Regular Posts Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
    );
  }

  if (error) {
    return (
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Latest Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our latest adventures, travel tips, and conservation stories
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500">Error loading blog posts: {error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Make sure the API server is running
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Latest Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our latest adventures, travel tips, and conservation stories
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">No blog posts available</p>
          </div>
        </div>
      </section>
    );
  }

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured).slice(0, 3);

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Latest Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our latest adventures, travel tips, and conservation stories
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Featured Story</h3>
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
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">More Stories</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
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
        )}

        {/* View All Blog Button */}
        <div className="text-center mt-16">
          <Button size="lg" variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground">
            <Link to="/blog">View All Stories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DatabaseBlog;
