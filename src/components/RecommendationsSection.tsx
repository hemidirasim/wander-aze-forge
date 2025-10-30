import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const RecommendationsSection = () => {
  const SHOW_REVIEWS = false;
  if (!SHOW_REVIEWS) return null;
  const recommendations = [
    {
      name: 'Sarah Johnson',
      country: 'United Kingdom',
      rating: 5,
      text: 'An absolutely incredible experience! The trek to Khinalig village was breathtaking, and our guide was knowledgeable about both the nature and local culture. The homestay experience made it truly authentic.',
      tour: 'Khinalig-Laza Homestay Trek'
    },
    {
      name: 'Marco Rossi',
      country: 'Italy', 
      rating: 5,
      text: 'Perfect organization from start to finish. The Caucasus mountains are stunning, and the team made sure we felt safe throughout the challenging trek. Highly recommend for adventure seekers!',
      tour: 'Bazarduzu Summit Trek'
    },
    {
      name: 'Emma Schmidt',
      country: 'Germany',
      rating: 5,
      text: 'Sustainable tourism at its best! Small group sizes allowed for intimate experiences with local communities. The wildlife safari exceeded all expectations. Will definitely book again!',
      tour: 'Caucasus Wildlife Safari'
    }
  ];

  return (
    <section className="py-24 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real experiences from adventurers who have explored Azerbaijan with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((recommendation, index) => (
            <Card key={index} className="group hover:shadow-elevated transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Quote className="w-8 h-8 text-primary/60 mr-3" />
                  <div className="flex space-x-1">
                    {[...Array(recommendation.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-autumn" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                  "{recommendation.text}"
                </blockquote>
                
                <div className="border-t pt-6">
                  <div className="font-semibold text-foreground text-lg">
                    {recommendation.name}
                  </div>
                  <div className="text-muted-foreground text-sm mb-2">
                    {recommendation.country}
                  </div>
                  <div className="text-primary text-sm font-medium">
                    {recommendation.tour}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="flex items-center justify-center space-x-4 text-muted-foreground">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current text-autumn" />
              ))}
            </div>
            <span className="text-2xl font-bold">4.9/5</span>
            <span>from 400+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;