import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mountain, Menu, X, Binoculars, Users, Wrench, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { tourCategories } from '@/data/tourCategories';
import { scrollToTopInstant } from '@/hooks/useScrollToTop';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToursOpen, setIsToursOpen] = useState(false);

  const categoryIcons = {
    hiking: Mountain,
    trekking: Mountain,
    wildlife: Binoculars,
    'group-tours': Users,
    'tailor-made': Wrench
  };

  const navItems = [
    { path: '/projects', label: 'Projects' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-natural">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-foreground hover:text-primary transition-smooth"
            onClick={scrollToTopInstant}
          >
            <Mountain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Camping Azerbaijan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Tours Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsToursOpen(true)}
              onMouseLeave={() => setIsToursOpen(false)}
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

                      {/* Category Links */}
                      {tourCategories.map((category) => {
                        const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons] || Mountain;
                        const isActive = location.pathname === `/tours/${category.id}`;
                        
                        return (
                          <Link
                            key={category.id}
                            to={`/tours/${category.id}`}
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
                      })}
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
                onClick={scrollToTopInstant}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="adventure" asChild>
              <Link to="/contact" onClick={scrollToTopInstant}>Book Now</Link>
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
                    {tourCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/tours/${category.id}`}
                        className={`block py-2 text-sm text-foreground hover:text-primary transition-smooth ${
                          location.pathname === `/tours/${category.id}` ? 'text-primary' : ''
                        }`}
                        onClick={() => {
                          setIsMenuOpen(false);
                          scrollToTopInstant();
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
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
    </nav>
  );
};

export default Navigation;