import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Mountain } from 'lucide-react';
import { scrollToTopInstant } from '@/hooks/useScrollToTop';

interface DatabaseTourCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  icon_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const TourCategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [categories, setCategories] = useState<DatabaseTourCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from database
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
      }
    } catch (err) {
      console.error('Error fetching tour categories:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-background/95 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground"
      >
        <span>Tour Categories</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-elevated z-40 overflow-hidden">
            <div className="py-2">
              {/* All Tours Link */}
              <Link
                to="/tours"
                className={`flex items-center px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border ${
                  location.pathname === '/tours' ? 'bg-accent text-accent-foreground' : 'text-foreground'
                }`}
                onClick={() => {
                  setIsOpen(false);
                  scrollToTopInstant();
                }}
              >
                <div className="w-6 h-6 mr-3 flex items-center justify-center flex-shrink-0">
                  <Mountain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">All Tours</div>
                  <div className="text-xs text-muted-foreground">
                    Browse all our adventure tours
                  </div>
                </div>
              </Link>

              {/* Database Category Links */}
              {loading ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  Loading categories...
                </div>
              ) : categories.length > 0 ? (
                categories.map((category) => {
                  const isActive = location.pathname === `/tours/${category.slug}`;
                  
                  return (
                    <Link
                      key={category.id}
                      to={`/tours/${category.slug}`}
                      className={`flex items-center px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                        isActive ? 'bg-accent text-accent-foreground' : 'text-foreground'
                      }`}
                      onClick={() => {
                        setIsOpen(false);
                        scrollToTopInstant();
                      }}
                    >
                      <div className="w-10 h-10 mr-3 flex items-center justify-center flex-shrink-0">
                        {category.icon_url ? (
                          <img 
                            src={category.icon_url} 
                            alt={category.name}
                            className="w-8 h-8 object-contain"
                            style={{ filter: 'brightness(0) saturate(100%) invert(45%) sepia(89%) saturate(1500%) hue-rotate(345deg) brightness(95%) contrast(95%)' }}
                          />
                        ) : (
                          <Mountain className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {category.description}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No categories available
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TourCategoryDropdown;