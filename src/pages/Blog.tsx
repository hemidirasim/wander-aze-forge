import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "Best Hiking Trails in Azerbaijan: A Complete Guide",
      excerpt: "Discover the most breathtaking hiking trails across Azerbaijan, from beginner-friendly walks to challenging mountain expeditions.",
      author: "Camping Azerbaijan Team",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Travel Guide",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
      featured: true,
    },
    {
      id: 2, 
      title: "Sustainable Tourism: Our Commitment to Nature",
      excerpt: "Learn about our eco-friendly practices and how we're working to protect Azerbaijan's pristine wilderness for future generations.",
      author: "Environmental Team",
      date: "2024-01-10",
      readTime: "5 min read",
      category: "Conservation",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
      featured: false,
    },
    {
      id: 3,
      title: "Village Life in Khinalig: Ancient Traditions",
      excerpt: "Experience the unique culture and traditions of one of the world's highest villages in the Caucasus Mountains.",
      author: "Cultural Guide",
      date: "2024-01-05", 
      readTime: "6 min read",
      category: "Culture",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      featured: false,
    },
    {
      id: 4,
      title: "Wildlife Photography Tips for Mountain Adventures",
      excerpt: "Capture stunning wildlife moments during your mountain adventures with these expert photography tips and techniques.",
      author: "Photography Expert",
      date: "2023-12-28",
      readTime: "7 min read", 
      category: "Photography",
      image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=400&fit=crop",
      featured: false,
    },
    {
      id: 5,
      title: "Essential Gear for Caucasus Mountain Hiking",
      excerpt: "Complete packing guide for hiking in the Caucasus Mountains, including recommended gear and safety equipment.",
      author: "Gear Specialist",
      date: "2023-12-20",
      readTime: "10 min read",
      category: "Gear Guide", 
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
      featured: false,
    },
    {
      id: 6,
      title: "Local Cuisine: Tastes of the Mountains",
      excerpt: "Discover the delicious traditional foods you'll encounter during homestays in Azerbaijan's mountain villages.",
      author: "Culinary Guide",
      date: "2023-12-15",
      readTime: "4 min read",
      category: "Food & Culture",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
      featured: false,
    },
  ];

  const categories = ["All", "Travel Guide", "Conservation", "Culture", "Photography", "Gear Guide", "Food & Culture"];
  
  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-mountain">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Adventure Blog</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Stories, guides, and insights from the trails of Azerbaijan
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Featured Story</h2>
            </div>
            
            <Card className="overflow-hidden max-w-4xl mx-auto hover:shadow-elevated transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-primary">{featuredPost.category}</Badge>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {featuredPost.title}
                  </CardTitle>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <Button variant="adventure" asChild>
                    <Link to={`/blog/${featuredPost.id}`} className="flex items-center w-fit">
                      Read Story
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Latest Stories</h2>
            <p className="text-xl text-muted-foreground">
              Adventures, tips, and insights from our team and community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
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
    </div>
  );
};

export default Blog;