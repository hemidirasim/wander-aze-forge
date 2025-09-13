import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Mountain, Camera, Users, Wrench, Binoculars } from 'lucide-react';
import { tourCategories } from '@/data/tourCategories';

const TourCategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const categoryIcons = {
    hiking: Mountain,
    trekking: Mountain,
    wildlife: Binoculars,
    'group-tours': Users,
    'tailor-made': Wrench
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
                className={`flex items-center px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                  location.pathname === '/tours' ? 'bg-accent text-accent-foreground' : 'text-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Mountain className="w-4 h-4 mr-3 text-primary" />
                <div>
                  <div className="font-medium">All Tours</div>
                  <div className="text-xs text-muted-foreground">Browse all adventures</div>
                </div>
              </Link>

              <div className="border-t border-border my-2" />

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
                    onClick={() => setIsOpen(false)}
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

              <div className="border-t border-border mt-2 pt-2">
                <Link
                  to="/contact"
                  className="flex items-center px-4 py-3 text-sm text-primary hover:bg-primary/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Camera className="w-4 h-4 mr-3" />
                  <div>
                    <div className="font-medium">Custom Tour Request</div>
                    <div className="text-xs text-muted-foreground">Design your perfect adventure</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TourCategoryDropdown;