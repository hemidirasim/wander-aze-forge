import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DatabaseTourCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const DatabaseTourCategoryGallery = () => {
  const [categories, setCategories] = useState<DatabaseTourCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tour-categories');
      const data = await response.json();
      
      if (data.success) {
        // Filter only active categories and sort by sort_order
        const activeCategories = data.data
          .filter((cat: DatabaseTourCategory) => cat.is_active)
          .sort((a: DatabaseTourCategory, b: DatabaseTourCategory) => a.sort_order - b.sort_order);
        setCategories(activeCategories);
      } else {
        setError(data.error || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching tour categories:', err);
      setError('Failed to fetch tour categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Skeleton className="h-16 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Explore Our Adventures</h2>
          <p className="text-muted-foreground mb-8">Error loading tour categories: {error}</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Explore Our Adventures</h2>
          <p className="text-muted-foreground">No tour categories available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Explore Our Adventures
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From gentle day hikes to challenging mountain expeditions, discover the perfect adventure for your skill level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            // Special layout for the first 5 categories
            if (index === 0 || index === 1) {
              // First row - 2 cards
              return (
                <Card key={category.id} className="group relative h-80 overflow-hidden border-0 hover:shadow-elevated transition-all duration-500">
                  <Link to={`/tours/${category.slug}`} className="block h-full">
                    <div className="relative h-full">
                      <img 
                        src={category.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'} 
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-white/90">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            } else if (index === 2) {
              // Second row - Large card
              return (
                <Card key={category.id} className="group relative h-80 md:col-span-2 lg:col-span-1 lg:row-span-2 lg:h-auto overflow-hidden border-0 hover:shadow-elevated transition-all duration-500">
                  <Link to={`/tours/${category.slug}`} className="block h-full">
                    <div className="relative h-full lg:h-[656px]">
                      <img 
                        src={category.image_url || 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=400&fit=crop'} 
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-3xl font-bold mb-4">{category.name}</h3>
                        <p className="text-white/90 text-lg">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            } else {
              // Remaining cards
              return (
                <Card key={category.id} className="group relative h-80 overflow-hidden border-0 hover:shadow-elevated transition-all duration-500">
                  <Link to={`/tours/${category.slug}`} className="block h-full">
                    <div className="relative h-full">
                      <img 
                        src={category.image_url || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop'} 
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-white/90">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};

export default DatabaseTourCategoryGallery;
