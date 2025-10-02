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
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Featured Post Skeleton */}
            <div className="lg:col-span-1">
              <Skeleton className="h-80 w-full rounded-lg mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            
            {/* Other Posts Skeleton */}
            <div className="lg:col-span-1 space-y-4">
              <Skeleton className="h-6 w-32" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3 p-3">
                  <Skeleton className="w-20 h-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Latest Stories</h2>
            <p className="text-red-500">Error loading blog posts</p>
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Latest Stories</h2>
            <p className="text-muted-foreground">No blog posts available</p>
          </div>
        </div>
      </section>
    );
  }

  // Featured post (sol tərəf) və digər post'lar (sağ tərəf)
  const featuredPost = posts[0]; // İlk post featured olaraq
  const otherPosts = posts.slice(1, 6); // Sonrakı 5 post

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Latest Stories
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover our latest adventures and travel tips
          </p>
        </div>

        {/* Featured Post (Sol) + Other Posts (Sağ) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Featured Post - Sol tərəf */}
          {featuredPost && (
            <div className="lg:col-span-1">
              <Card className="group hover:shadow-elevated transition-all duration-500 overflow-hidden border-0 bg-card/80 backdrop-blur-sm h-full">
                <div className="relative h-80 overflow-hidden">
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
                
                <div className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-3">
                      {featuredPost.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {featuredPost.excerpt || featuredPost.content.substring(0, 150) + '...'}
                    </p>
                  </CardContent>
                  
                  <CardFooter>
                    <Button size="lg" variant="hero-outline" asChild className="text-lg px-8 py-4 border-0 bg-primary/10 text-foreground hover:bg-primary hover:text-white w-fit">
                      <Link to={`/blog/${featuredPost.id}`} className="flex items-center">
                        Read Full Story
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </div>
          )}

          {/* Other Posts - Sağ tərəf */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">More Stories</h3>
            {otherPosts.map((post) => (
              <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <img 
                    src={post.featured_image || "https://images.unsplash.com/photo-1551632811-561732d1e306?w=100&h=80&fit=crop"}
                    alt={post.title}
                    className="w-20 h-16 object-cover rounded-md"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 hover:text-primary transition-colors">
                    <Link to={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {post.excerpt || post.content.substring(0, 80) + '...'}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    {post.category && (
                      <>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {post.category}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button size="lg" variant="hero-outline" asChild className="text-lg px-8 py-4 border-0 bg-primary/10 text-foreground hover:bg-primary hover:text-white">
            <Link to="/blog" className="flex items-center">
              View All Stories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DatabaseBlog;
