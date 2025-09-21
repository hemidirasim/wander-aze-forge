import React from 'react';
import { Outlet } from 'react-router-dom';

const SimpleAdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Simple Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        
        <nav className="space-y-2">
          <a 
            href="/admin/dashboard" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Dashboard
          </a>
          <a 
            href="/admin/tour-categories" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Tour Categories
          </a>
          <a 
            href="/admin/tours" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            All Tours
          </a>
          <a 
            href="/admin/login" 
            className="block px-4 py-2 text-red-600 hover:bg-red-50 rounded"
          >
            Logout
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SimpleAdminLayout;
