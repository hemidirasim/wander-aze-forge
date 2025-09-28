import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mountain, Menu, X, Binoculars, Users, Wrench, ChevronDown, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { scrollToTopInstant } from '@/hooks/useScrollToTop';
import SearchModal from '@/components/SearchModal';

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

const DatabaseNavigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToursOpen, setIsToursOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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


  const categoryIcons = {
    hiking: Mountain,
    trekking: Mountain,
    wildlife: Binoculars,
    'group-tours': Users,
    'tailor-made': Wrench,
    cultural: Mountain,
    photography: Binoculars
  };

  const navItems = [
    { path: '/projects', label: 'Projects' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-natural"
      onMouseLeave={() => setIsToursOpen(false)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-foreground hover:text-primary transition-smooth"
            onClick={scrollToTopInstant}
            onMouseEnter={() => setIsToursOpen(false)}
          >
            <Mountain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Outtour.az</span>
          </Link>

          {/* Search Button - Center */}
          <div 
            className="hidden md:flex justify-center flex-1 max-w-md"
            onMouseEnter={() => setIsToursOpen(false)}
          >
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 w-full max-w-sm px-3 py-1.5"
            >
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span className="text-xs text-muted-foreground">Search...</span>
              </div>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div 
            className="hidden md:flex items-center space-x-8"
            onMouseEnter={() => setIsToursOpen(false)}
          >
            {/* Tours Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsToursOpen(true)}
              onMouseLeave={() => {
                // Close dropdown when mouse leaves the tours area
                setTimeout(() => setIsToursOpen(false), 150);
              }}
            >
              <button
                className={`flex items-center space-x-1 text-foreground hover:text-primary transition-smooth font-medium ${
                  location.pathname.startsWith('/tours') ? 'text-primary' : ''
                }`}
                onClick={() => setIsToursOpen(!isToursOpen)}
              >
                <span>Tours</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isToursOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToursOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsToursOpen(false)}
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
                          setIsToursOpen(false);
                          scrollToTopInstant();
                        }}
                      >
                        <Mountain className="w-4 h-4 mr-3 text-primary" />
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
                          const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Mountain;
                          const isActive = location.pathname === `/tours/${category.slug}`;
                          
                          return (
                            <Link
                              key={category.id}
                              to={`/tours/${category.slug}`}
                              className={`flex items-center px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                                isActive ? 'bg-accent text-accent-foreground' : 'text-foreground'
                              }`}
                              onClick={() => {
                                setIsToursOpen(false);
                                scrollToTopInstant();
                              }}
                            >
                              <IconComponent className="w-4 h-4 mr-3 text-primary" />
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

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-foreground hover:text-primary transition-smooth font-medium ${
                  location.pathname === item.path ? 'text-primary' : ''
                }`}
                onClick={() => {
                  scrollToTopInstant();
                  setIsToursOpen(false);
                }}
                onMouseEnter={() => setIsToursOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <Button 
              variant="adventure" 
              asChild
              onMouseEnter={() => setIsToursOpen(false)}
            >
              <Link to="/contact" onClick={() => {
                scrollToTopInstant();
                setIsToursOpen(false);
              }}>Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {/* Tours Section */}
              <div>
                <button
                  className={`w-full flex items-center justify-between py-2 text-foreground hover:text-primary transition-smooth font-medium ${
                    location.pathname.startsWith('/tours') ? 'text-primary' : ''
                  }`}
                  onClick={() => setIsToursOpen(!isToursOpen)}
                >
                  <span>Tours</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isToursOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isToursOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {/* All Tours Link */}
                    <Link
                      to="/tours"
                      className={`block py-2 text-sm text-foreground hover:text-primary transition-smooth ${
                        location.pathname === '/tours' ? 'text-primary' : ''
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        scrollToTopInstant();
                      }}
                    >
                      All Tours
                    </Link>
                    
                    {loading ? (
                      <div className="py-2 text-sm text-muted-foreground">Loading categories...</div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/tours/${category.slug}`}
                          className={`block py-2 text-sm text-foreground hover:text-primary transition-smooth ${
                            location.pathname === `/tours/${category.slug}` ? 'text-primary' : ''
                          }`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            scrollToTopInstant();
                          }}
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <div className="py-2 text-sm text-muted-foreground">No categories available</div>
                    )}
                  </div>
                )}
              </div>
              
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-foreground hover:text-primary transition-smooth font-medium py-2 ${
                    location.pathname === item.path ? 'text-primary' : ''
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    scrollToTopInstant();
                  }}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Search Button */}
              <Button 
                variant="ghost" 
                className="w-fit flex items-center gap-1.5"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(true);
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span className="text-sm">Search</span>
                </div>
              </Button>
              
              <Button variant="adventure" className="w-fit mt-4" asChild>
                <Link to="/contact" onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTopInstant();
                }}>Book Now</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>
  );
};

export default DatabaseNavigation;
