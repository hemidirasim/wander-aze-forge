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
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4">
                <Skeleton className="w-20 h-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-16 h-8" />
              </div>
            ))}
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

  // Sadələşdirilmiş: Yalnız 3 ən son post'u göstər
  const latestPosts = posts.slice(0, 3);

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

        {/* Sadə Post List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {latestPosts.map((post) => (
            <div key={post.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0">
                <img 
                  src={post.featured_image || "https://images.unsplash.com/photo-1551632811-561732d1e306?w=120&h=80&fit=crop"}
                  alt={post.title}
                  className="w-20 h-16 object-cover rounded-md"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {post.excerpt || post.content.substring(0, 100) + '...'}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  {post.category && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/blog/${post.id}`} className="flex items-center">
                    Read
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/blog">View All Stories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DatabaseBlog;
