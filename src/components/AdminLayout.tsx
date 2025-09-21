import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  Mountain,
  Plus,
  List,
  FolderOpen,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: MenuItem[];
}

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['tours', 'projects']);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      window.location.href = '/admin/login';
      return;
    }

    setLoading(false);
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard'
    },
    {
      id: 'tours',
      title: 'Tours',
      icon: Mountain,
      children: [
        {
          id: 'new-tour',
          title: 'New Tour',
          icon: Plus,
          path: '/admin/tour-categories'
        },
        {
          id: 'all-tours',
          title: 'All Tours',
          icon: List,
          path: '/admin/tours'
        }
      ]
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: FolderOpen,
      children: [
        {
          id: 'new-project',
          title: 'New Project',
          icon: Plus,
          path: '/admin/projects/new'
        },
        {
          id: 'all-projects',
          title: 'All Projects',
          icon: List,
          path: '/admin/projects'
        }
      ]
    },
    {
      id: 'programs',
      title: 'Programs',
      icon: Users,
      children: [
        {
          id: 'new-program',
          title: 'New Program',
          icon: Plus,
          path: '/admin/programs/new'
        },
        {
          id: 'all-programs',
          title: 'All Programs',
          icon: List,
          path: '/admin/programs'
        }
      ]
    },
    {
      id: 'partners',
      title: 'Partners',
      icon: Users,
      children: [
        {
          id: 'new-partner',
          title: 'New Partner',
          icon: Plus,
          path: '/admin/partners/new'
        },
        {
          id: 'all-partners',
          title: 'All Partners',
          icon: List,
          path: '/admin/partners'
        }
      ]
    },
    {
      id: 'blog',
      title: 'Blog',
      icon: FileText,
      children: [
        {
          id: 'new-post',
          title: 'New Post',
          icon: Plus,
          path: '/admin/blog/new'
        },
        {
          id: 'all-posts',
          title: 'All Posts',
          icon: List,
          path: '/admin/blog'
        }
      ]
    },
    {
      id: 'bookings',
      title: 'Bookings',
      icon: Calendar,
      path: '/admin/bookings'
    },
    {
      id: 'contact',
      title: 'Contact Messages',
      icon: MessageSquare,
      path: '/admin/contact'
    },
    {
      id: 'files',
      title: 'File Manager',
      icon: Upload,
      path: '/admin/files'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings'
    }
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isMenuExpanded = (menuId: string) => {
    return expandedMenus.includes(menuId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg border-r border-gray-200 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">Tour Management</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${sidebarOpen ? 'justify-between' : 'justify-center'} ${
                      item.children.some(child => isActive(child.path || '')) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleMenu(item.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      {sidebarOpen && <span>{item.title}</span>}
                    </div>
                    {sidebarOpen && (
                      isMenuExpanded(item.id) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {sidebarOpen && isMenuExpanded(item.id) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.id}
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start text-gray-600 hover:bg-gray-100 ${
                            isActive(child.path || '') ? 'bg-blue-50 text-blue-700' : ''
                          }`}
                          onClick={() => window.location.href = child.path || ''}
                        >
                          <child.icon className="w-3 h-3 mr-2" />
                          {child.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${sidebarOpen ? 'justify-start' : 'justify-center'} ${
                    isActive(item.path || '') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => window.location.href = item.path || ''}
                >
                  <item.icon className="w-4 h-4" />
                  {sidebarOpen && <span className="ml-3">{item.title}</span>}
                </Button>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-red-600 hover:bg-red-50`}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {menuItems.find(item => 
                  item.path === location.pathname || 
                  item.children?.some(child => child.path === location.pathname)
                )?.title || 'Admin Panel'}
              </h2>
              <p className="text-sm text-gray-500">
                {location.pathname === '/admin/dashboard' ? 'Overview and statistics' : 'Management interface'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Online
              </Badge>
              <div className="text-sm text-gray-500">
                Admin User
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
