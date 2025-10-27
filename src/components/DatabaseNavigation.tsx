import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Binoculars, Users, Wrench, ChevronDown, Search, User, LogOut, Mountain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { scrollToTopInstant } from '@/hooks/useScrollToTop';
import SearchModal from '@/components/SearchModal';
import Logo from '@/components/Logo';

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

const DatabaseNavigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToursOpen, setIsToursOpen] = useState(false);
  const [isMobileToursOpen, setIsMobileToursOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<DatabaseTourCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch categories from database
  useEffect(() => {
    fetchCategories();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    if (token) {
      fetchUserProfile();
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Close tours dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isToursOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-tours-dropdown]')) {
          setIsToursOpen(false);
        }
      }
      if (isProfileOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-profile-dropdown]')) {
          setIsProfileOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isToursOpen, isProfileOpen]);

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
    hiking: Binoculars,
    trekking: Binoculars,
    wildlife: Binoculars,
    'group-tours': Users,
    'tailor-made': Wrench,
    cultural: Binoculars,
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
      <div className="container mx-auto md:px-4">
        <div className="flex items-center justify-between h-24">
          {/* Left Section - Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center text-foreground hover:text-primary transition-smooth"
              onClick={scrollToTopInstant}
              onMouseEnter={() => setIsToursOpen(false)}
            >
              <Logo className="w-28 h-28" />
            </Link>
          </div>

          {/* Center Section - Search (Desktop) */}
          <div 
            className="hidden md:flex justify-center flex-1 max-w-md mx-8"
            onMouseEnter={() => setIsToursOpen(false)}
          >
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-start gap-1.5 px-3 py-1.5 w-full"
              style={{ maxWidth: '192px' }}
            >
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span className="text-xs text-muted-foreground">Search...</span>
              </div>
            </Button>
          </div>

          {/* Mobile Right Section: Search + Menu */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Search Button - Mobile (Icon Only) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="p-2 text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Right Section - Desktop Navigation */}
          <div 
            className="hidden md:flex items-center justify-end flex-shrink-0"
            onMouseEnter={() => setIsToursOpen(false)}
          >
            {/* Tours Dropdown */}
            <div 
              className="relative mr-4"
              data-tours-dropdown
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
                    className="fixed inset-0 z-20" 
                    onClick={() => setIsToursOpen(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-background border border-border rounded-lg shadow-elevated z-30 overflow-hidden"
                    onMouseEnter={() => setIsToursOpen(true)}
                    onMouseLeave={() => setIsToursOpen(false)}
                  >
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
                                setIsToursOpen(false);
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

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-foreground hover:text-primary transition-smooth font-medium mr-4 ${
                  location.pathname === item.path ? 'text-primary' : ''
                }`}
                onClick={() => {
                  scrollToTopInstant();
                  setIsToursOpen(false);
                }}
                onMouseEnter={() => {
                  setIsToursOpen(false);
                }}
                onMouseLeave={() => {
                  setIsToursOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Book Now Button */}
            <Button 
              variant="adventure" 
              size="sm"
              className="ml-4"
              asChild
              onMouseEnter={() => setIsToursOpen(false)}
            >
              <Link to="/tours" onClick={() => {
                scrollToTopInstant();
                setIsToursOpen(false);
              }}>Book Now</Link>
            </Button>

            {/* Desktop Profile Button - HIDDEN FOR NOW */}
            {false && isLoggedIn ? (
              <div className="relative" data-profile-dropdown>
                <Button 
                  variant="outline" 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2"
                >
                  <User className="w-5 h-5" />
                </Button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {userProfile?.firstName} {userProfile?.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{userProfile?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => {
                          setIsProfileOpen(false);
                          scrollToTopInstant();
                        }}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      
                      <Link
                        to="/user/bookings"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => {
                          setIsProfileOpen(false);
                          scrollToTopInstant();
                        }}
                      >
                        <Binoculars className="w-4 h-4 mr-3" />
                        My Bookings
                      </Link>
                      
                      <Link
                        to="/user/reviews"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => {
                          setIsProfileOpen(false);
                          scrollToTopInstant();
                        }}
                      >
                        <Users className="w-4 h-4 mr-3" />
                        My Reviews
                      </Link>
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        onClick={() => {
                          localStorage.removeItem('authToken');
                          setIsLoggedIn(false);
                          setIsProfileOpen(false);
                          setUserProfile(null);
                          window.location.href = '/';
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Login Button - HIDDEN FOR NOW */}
                {false && (
                  <Button variant="outline" className="hover:bg-primary hover:text-white transition-colors" asChild>
                    <Link to="/login" onClick={() => {
                      scrollToTopInstant();
                      setIsToursOpen(false);
                    }}>
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border px-4">
            <div className="flex flex-col space-y-2 max-w-full">
              {/* Tours Section */}
              <div>
                <button
                  className={`w-full flex items-center justify-between py-2 text-foreground hover:text-primary transition-smooth font-medium ${
                    location.pathname.startsWith('/tours') ? 'text-primary' : ''
                  }`}
                  onClick={() => setIsMobileToursOpen(!isMobileToursOpen)}
                >
                  <span>Tours</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileToursOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMobileToursOpen && (
                  <div className="ml-2 mt-2 space-y-2 max-w-full overflow-hidden">
                    {/* All Tours Link */}
                    <Link
                      to="/tours"
                      className={`block py-2 text-sm text-foreground hover:text-primary transition-smooth ${
                        location.pathname === '/tours' ? 'text-primary' : ''
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileToursOpen(false);
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
                            setIsMobileToursOpen(false);
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
              
              {/* Book Now Button */}
              <Button variant="adventure" className="w-fit mt-4" asChild>
                <Link to="/tours" onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTopInstant();
                }}>Book Now</Link>
              </Button>
              
              {/* Mobile Profile Section - HIDDEN FOR NOW */}
              {false && isLoggedIn ? (
                <div className="mt-4">
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {userProfile?.firstName} {userProfile?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{userProfile?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-fit" asChild>
                      <Link to="/dashboard" onClick={() => {
                        setIsMenuOpen(false);
                        scrollToTopInstant();
                      }}>
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-fit" asChild>
                      <Link to="/user/bookings" onClick={() => {
                        setIsMenuOpen(false);
                        scrollToTopInstant();
                      }}>
                        <Binoculars className="w-4 h-4 mr-2" />
                        My Bookings
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-fit" asChild>
                      <Link to="/user/reviews" onClick={() => {
                        setIsMenuOpen(false);
                        scrollToTopInstant();
                      }}>
                        <Users className="w-4 h-4 mr-2" />
                        My Reviews
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-fit text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        localStorage.removeItem('authToken');
                        setIsLoggedIn(false);
                        setIsMenuOpen(false);
                        setUserProfile(null);
                        window.location.href = '/';
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4">
                  {/* Mobile Login Button - HIDDEN FOR NOW */}
                  {false && (
                    <Button variant="outline" className="w-fit hover:bg-primary hover:text-white transition-colors" asChild>
                      <Link to="/login" onClick={() => {
                        setIsMenuOpen(false);
                        scrollToTopInstant();
                      }}>
                        <User className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                  )}
                </div>
              )}
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
