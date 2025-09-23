import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  ArrowLeft,
  Save,
  X,
  Upload,
  Image,
  Calendar,
  MapPin,
  DollarSign,
  Target,
  Users
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: string;
  image_url: string;
  gallery_urls: string[];
  created_at: string;
  updated_at: string;
}

const AdminProjects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      if (result.success) {
        setProjects(result.data.projects);
      } else {
        console.error('Failed to fetch projects:', result.error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setProjects(projects.filter(project => project.id !== id));
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleEdit = (project: Project) => {
    navigate(`/admin/project-form/${project.id}`);
  };

  const handleCreate = () => {
    navigate('/admin/project-form');
  };



  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'community_development': return 'bg-purple-100 text-purple-800';
      case 'conservation': return 'bg-green-100 text-green-800';
      case 'research': return 'bg-blue-100 text-blue-800';
      case 'infrastructure': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Manage Projects</h1>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects by title, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={project.image_url || '/placeholder-project.jpg'}
                alt={project.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-3 right-3">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg line-clamp-2">{project.title}</h3>
                <Badge className={getCategoryColor(project.category)}>
                  {project.category.replace('_', ' ')}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{project.start_date} - {project.end_date}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>${project.budget.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(project)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first project.'}
          </p>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
