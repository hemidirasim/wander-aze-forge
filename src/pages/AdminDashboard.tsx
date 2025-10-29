import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  Globe,
  FolderOpen,
  Users,
  Handshake,
  FileText,
  Calendar,
  MessageSquare,
  Mail,
  LogOut,
  Home,
  Tags,
  ExternalLink,
  Star
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Get admin user from localStorage
    const user = localStorage.getItem('adminUser');
    if (user) {
      setAdminUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 font-medium">Tourism Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                asChild
                variant="outline" 
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
              >
                <Link to="/">
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Website</span>
                </Link>
              </Button>
              <Badge variant="outline" className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{adminUser?.username}</span>
              </Badge>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {adminUser?.username}! 👋
                </h2>
                <p className="text-lg text-gray-600">
                  Manage your tourism business with ease.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Globe className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Shield className="w-6 h-6 text-green-500" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                asChild
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
              >
                <Link to="/admin/tours">
                  <FolderOpen className="w-6 h-6" />
                  <span className="font-semibold">Manage Tours</span>
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
              >
                <Link to="/admin/projects">
                  <Calendar className="w-6 h-6" />
                  <span className="font-semibold">Manage Projects</span>
                </Link>
              </Button>

              <Button 
                asChild
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
              >
                <Link to="/admin/about">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">About Page</span>
                </Link>
              </Button>

              <Button 
                asChild
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
              >
                <Link to="/admin/contact">
                  <MessageSquare className="w-6 h-6" />
                  <span className="font-semibold">Contact Page</span>
                </Link>
              </Button>

              <Button 
                asChild
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
              >
                <Link to="/admin/contact-messages">
                  <Mail className="w-6 h-6" />
                  <span className="font-semibold">Contact Messages</span>
                </Link>
              </Button>

              <Button 
                asChild
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
              >
                <Link to="/admin/team-members">
                  <Users className="w-6 h-6" />
                  <span className="font-semibold">Team Members</span>
                </Link>
              </Button>

              <Button 
                asChild
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
              >
                <Link to="/admin/reviews">
                  <Star className="w-6 h-6" />
                  <span className="font-semibold">Manage Reviews</span>
                </Link>
              </Button>

              <Button 
                asChild
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
              >
                <Link to="/admin/tour-categories">
                  <Tags className="w-6 h-6" />
                  <span className="font-semibold">Tour Categories</span>
                </Link>
              </Button>

              <Button 
                asChild
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-gray-50"
              >
                <Link to="/admin/hero">
                  <Home className="w-6 h-6" />
                  <span className="font-semibold">Hero Section</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;