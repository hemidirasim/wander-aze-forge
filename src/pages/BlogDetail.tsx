import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowLeft, Share2, BookOpen } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();

  // Mock blog post data - in real app, fetch based on ID
  const post = {
    id: 1,
    title: "Best Hiking Trails in Azerbaijan: A Complete Guide",
    content: `
      <p>Azerbaijan's diverse landscape offers some of the most spectacular hiking opportunities in the Caucasus region. From the ancient villages perched high in the mountains to the pristine wilderness areas, each trail tells a unique story of natural beauty and cultural heritage.</p>

      <h2>1. Khinalig to Laza Trail</h2>
      <p>This iconic 3-day trek takes you through two of Azerbaijan's most remote mountain villages. The trail winds through dramatic mountain landscapes, crossing crystal-clear streams and offering breathtaking panoramic views of the Greater Caucasus range.</p>

      <p><strong>Difficulty:</strong> Moderate to Challenging<br>
      <strong>Distance:</strong> 25 kilometers<br>
      <strong>Duration:</strong> 3 days, 2 nights</p>

      <h2>2. Shahdag National Park Trails</h2>
      <p>Located in the heart of the Greater Caucasus, Shahdag National Park offers multiple trail options suitable for all skill levels. The park is home to diverse wildlife and stunning alpine scenery.</p>

      <h2>3. Tufandag Mountain</h2>
      <p>Perfect for day hikes, Tufandag offers well-marked trails with excellent infrastructure. The mountain provides stunning views of the Caucasus peaks and is accessible year-round.</p>

      <h2>Essential Preparation Tips</h2>
      <ul>
        <li>Pack layers - mountain weather can change rapidly</li>
        <li>Carry sufficient water - natural sources may not always be available</li>
        <li>Inform someone of your hiking plans</li>
        <li>Hire local guides for remote trails</li>
        <li>Respect local customs in village areas</li>
      </ul>

      <h2>Best Time to Visit</h2>
      <p>The ideal hiking season in Azerbaijan runs from May to October. Summer months (June-August) offer the warmest weather but can be crowded. Spring and autumn provide perfect conditions with fewer tourists and spectacular scenery.</p>

      <h2>Conservation and Respect</h2>
      <p>As you explore these magnificent trails, remember that we are visitors in these pristine environments. Follow Leave No Trace principles, support local communities, and help preserve these natural treasures for future generations.</p>
    `,
    author: "Camping Azerbaijan Team",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Travel Guide",
    image: "https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=800&h=600&fit=crop",
    tags: ["Hiking", "Azerbaijan", "Mountains", "Travel Guide", "Caucasus"],
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Village Life in Khinalig: Ancient Traditions",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      category: "Culture"
    },
    {
      id: 3,
      title: "Essential Gear for Mountain Hiking",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop",
      category: "Gear Guide"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Back Button */}
      <section className="pt-20 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/blog" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </section>

      {/* Article Header */}
      <section className="px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-primary">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center space-x-6 text-muted-foreground mb-8">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Travel Guide</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-[50vh] rounded-2xl overflow-hidden mb-12">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Main Content */}
          <Card className="border-0 shadow-none">
            <CardContent className="pt-0">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="hover:bg-primary hover:text-primary-foreground cursor-pointer">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-forest">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready for Your Own Adventure?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join us on one of our guided tours to experience the trails mentioned in this guide
          </p>
          <Button size="lg" variant="outline" className="bg-white text-forest hover:bg-white/90" asChild>
            <Link to="/tours">View Our Tours</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;