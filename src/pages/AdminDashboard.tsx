import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  FolderOpen, 
  Handshake, 
  FileText, 
  Calendar,
  MessageSquare,
  Upload,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Database,
  Shield
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
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin/login');
      return;
    }

    setAdminUser(JSON.parse(user));
    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      // For now, use mock data since API endpoints are not fully implemented
      setStats({
        tours: 12,
        projects: 8,
        programs: 6,
        partners: 15,
        blogPosts: 25,
        bookings: 45,
        contactMessages: 18
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
    navigate('/admin/login');
  };

  const statCards = [
    {
      title: 'Tours',
      value: stats.tours,
      icon: MapPin,
      color: 'bg-blue-500',
      description: 'Active tour packages'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: FolderOpen,
      color: 'bg-green-500',
      description: 'Development projects'
    },
    {
      title: 'Programs',
      value: stats.programs,
      icon: Users,
      color: 'bg-purple-500',
      description: 'Educational programs'
    },
    {
      title: 'Partners',
      value: stats.partners,
      icon: Handshake,
      color: 'bg-orange-500',
      description: 'Business partners'
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      color: 'bg-pink-500',
      description: 'Published articles'
    },
    {
      title: 'Bookings',
      value: stats.bookings,
      icon: Calendar,
      color: 'bg-indigo-500',
      description: 'Tour bookings'
    },
    {
      title: 'Messages',
      value: stats.contactMessages,
      icon: MessageSquare,
      color: 'bg-teal-500',
      description: 'Contact messages'
    }
  ];

  const quickActions = [
    { title: 'Add New Tour', icon: Plus, action: () => navigate('/admin/tours'), color: 'bg-blue-500' },
    { title: 'Manage Projects', icon: FolderOpen, action: () => navigate('/admin/projects'), color: 'bg-green-500' },
    { title: 'Manage Programs', icon: Users, action: () => navigate('/admin/programs'), color: 'bg-purple-500' },
    { title: 'Manage Partners', icon: Handshake, action: () => navigate('/admin/partners'), color: 'bg-orange-500' },
    { title: 'Manage Blog', icon: FileText, action: () => navigate('/admin/blog'), color: 'bg-pink-500' },
    { title: 'View Bookings', icon: Calendar, action: () => navigate('/admin/bookings'), color: 'bg-indigo-500' },
    { title: 'Contact Messages', icon: MessageSquare, action: () => navigate('/admin/contact'), color: 'bg-teal-500' },
    { title: 'File Manager', icon: Upload, action: () => navigate('/admin/files'), color: 'bg-gray-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your tourism website</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>{adminUser?.username}</span>
              </Badge>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>System Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Database Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tours Table</span>
                    <Badge variant="outline" className="text-green-600">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Projects Table</span>
                    <Badge variant="outline" className="text-green-600">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Programs Table</span>
                    <Badge variant="outline" className="text-green-600">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Partners Table</span>
                    <Badge variant="outline" className="text-green-600">Connected</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Records</span>
                    <span className="font-medium">{Object.values(stats).reduce((a, b) => a + b, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Tours</span>
                    <span className="font-medium">{stats.tours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Messages</span>
                    <span className="font-medium">{stats.contactMessages}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recent Bookings</span>
                    <span className="font-medium">{stats.bookings}</span>
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
