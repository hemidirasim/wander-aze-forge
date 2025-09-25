import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  Database,
  Shield,
  TrendingUp,
  Clock,
  Star,
  Globe,
  Mountain,
  Camera,
  Heart,
  MapPin,
  FolderOpen,
  Users,
  Handshake,
  FileText,
  Calendar,
  MessageSquare,
  LogOut
} from 'lucide-react';

interface DashboardStats {
  tours: number;
  projects: number;
  programs: number;
  partners: number;
  blogPosts: number;
  bookings: number;
  contactMessages: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    tours: 0,
    projects: 0,
    programs: 0,
    partners: 0,
    blogPosts: 0,
    bookings: 0,
    contactMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Get admin user from localStorage
    const user = localStorage.getItem('adminUser');
    if (user) {
      setAdminUser(JSON.parse(user));
    }
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for demonstration
      setStats({
        tours: 32,
        projects: 12,
        programs: 8,
        partners: 24,
        blogPosts: 45,
        bookings: 128,
        contactMessages: 67
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const statCards = [
    {
      title: 'Active Tours',
      value: stats.tours,
      icon: MapPin,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12%',
      description: 'Tour packages available'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: FolderOpen,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      change: '+8%',
      description: 'Development projects'
    },
    {
      title: 'Programs',
      value: stats.programs,
      icon: Users,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+15%',
      description: 'Educational programs'
    },
    {
      title: 'Partners',
      value: stats.partners,
      icon: Handshake,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      change: '+5%',
      description: 'Business partners'
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      change: '+22%',
      description: 'Published articles'
    },
    {
      title: 'Bookings',
      value: stats.bookings,
      icon: Calendar,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      change: '+18%',
      description: 'Tour bookings'
    },
    {
      title: 'Messages',
      value: stats.contactMessages,
      icon: MessageSquare,
      color: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      change: '+3%',
      description: 'Contact messages'
    }
  ];

  const tourCategories = [
    {
      title: 'Hiking Tours',
      icon: Mountain,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      count: 8,
      description: 'Nature hiking adventures'
    },
    {
      title: 'Trekking Tours',
      icon: Mountain,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      count: 6,
      description: 'Mountain trekking experiences'
    },
    {
      title: 'Wildlife Tours',
      icon: Camera,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      count: 5,
      description: 'Wildlife photography tours'
    },
    {
      title: 'Group Tours',
      icon: Users,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      count: 7,
      description: 'Group adventure packages'
    },
    {
      title: 'Tailor Made',
      icon: Heart,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      count: 6,
      description: 'Custom tour packages'
    }
  ];


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-600">Loading Dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your data</p>
        </div>
      </div>
    );
  }

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
                  Here's what's happening with your tourism business today.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tour Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🗺️ Tour Categories Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {tourCategories.map((category, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <Badge variant="outline" className="bg-gray-50">
                    {category.count} tours
                  </Badge>
                </CardContent>
              </Card>
            ))}
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
                <Link to="/admin/team-members">
                  <Users className="w-6 h-6" />
                  <span className="font-semibold">Team Members</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <span>System Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-yellow-500" />
                  Database Status
                </h4>
                <div className="space-y-3">
                  {['Tours Table', 'Projects Table', 'Programs Table', 'Partners Table', 'Blog Table', 'Bookings Table'].map((table, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium text-gray-700">{table}</span>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Performance Metrics
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">Total Records</span>
                    <span className="font-bold text-blue-600">{Object.values(stats).reduce((a, b) => a + b, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">Active Tours</span>
                    <span className="font-bold text-blue-600">{stats.tours}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">Pending Messages</span>
                    <span className="font-bold text-blue-600">{stats.contactMessages}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">Recent Bookings</span>
                    <span className="font-bold text-blue-600">{stats.bookings}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;