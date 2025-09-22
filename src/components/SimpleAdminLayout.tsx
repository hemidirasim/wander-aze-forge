import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';

const SimpleAdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['tours', 'projects', 'programs', 'partners', 'blog']);
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '📊',
      path: '/admin'
    },
    {
      id: 'tours',
      title: 'Tours',
      icon: '🏔️',
      children: [
        { title: 'New Tour (Simple)', path: '/admin/tour-categories' },
        { title: 'New Tour (Complete)', path: '/admin/tour-form-extended' },
        { title: 'All Tours', path: '/admin/tours' }
      ]
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: '📁',
      children: [
        { title: 'New Project', path: '/admin/project-form' },
        { title: 'All Projects', path: '/admin/projects' }
      ]
    },
    {
      id: 'programs',
      title: 'Programs',
      icon: '👥',
      children: [
        { title: 'New Program', path: '/admin/programs/new' },
        { title: 'All Programs', path: '/admin/programs' }
      ]
    },
    {
      id: 'partners',
      title: 'Partners',
      icon: '🤝',
      children: [
        { title: 'New Partner', path: '/admin/partners/new' },
        { title: 'All Partners', path: '/admin/partners' }
      ]
    },
    {
      id: 'blog',
      title: 'Blog',
      icon: '📝',
      children: [
        { title: 'New Post', path: '/admin/blog/new' },
        { title: 'All Posts', path: '/admin/blog' }
      ]
    },
    {
      id: 'bookings',
      title: 'Bookings',
      icon: '📅',
      path: '/admin/bookings'
    },
    {
      id: 'contact',
      title: 'Contact Messages',
      icon: '💬',
      path: '/admin/contact'
    },
    {
      id: 'gallery',
      title: 'Gallery',
      icon: '🖼️',
      path: '/admin/gallery'
    },
    {
      id: 'files',
      title: 'File Manager',
      icon: '📤',
      path: '/admin/files'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
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

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    return location.pathname === path;
  };

  const isMenuExpanded = (menuId: string) => {
    return expandedMenus.includes(menuId);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
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
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors ${
                      item.children.some(child => isActive(child.path)) 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      {sidebarOpen && <span className="font-medium">{item.title}</span>}
                    </div>
                    {sidebarOpen && (
                      <span className="text-sm">
                        {isMenuExpanded(item.id) ? '▼' : '▶'}
                      </span>
                    )}
                  </button>
                  
                  {sidebarOpen && isMenuExpanded(item.id) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child, index) => (
                        <a
                          key={index}
                          href={child.path}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(child.path) 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path) 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span>{item.title}</span>}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {location.pathname === '/admin' ? 'Dashboard' : 
                 menuItems.find(item => 
                   item.path === location.pathname || 
                   item.children?.some(child => child.path === location.pathname)
                 )?.title || 'Admin Panel'}
              </h2>
              <p className="text-sm text-gray-500">
                {location.pathname === '/admin' ? 'Overview and statistics' : 'Management interface'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Online
              </span>
              <span className="text-sm text-gray-500">Admin User</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {location.pathname === '/admin' ? <AdminDashboard /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminLayout;
