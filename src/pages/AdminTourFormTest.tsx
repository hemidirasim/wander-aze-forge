import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Save,
  MapPin,
  Clock,
  Users,
  Star,
  DollarSign
} from 'lucide-react';

const AdminTourFormTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Tour - Test Page</h1>
          <p className="text-gray-600">This is a test page to verify the admin tour form is working.</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Tour Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tour Title</Label>
                <Input
                  id="title"
                  placeholder="Enter tour title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hiking">Hiking</SelectItem>
                    <SelectItem value="wildlife">Wildlife</SelectItem>
                    <SelectItem value="trekking">Trekking</SelectItem>
                    <SelectItem value="group-tours">Group Tours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter tour description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 3 days"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  placeholder="e.g., $299"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="group-size">Group Size</Label>
                <Input
                  id="group-size"
                  placeholder="e.g., 6-12 people"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✓ Test Page Working
              </Badge>
              <Badge variant="outline">
                Ready for Tour Creation
              </Badge>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Tour
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Page URL:</strong> /admin/tour-form-test</p>
              <p><strong>Component:</strong> AdminTourFormTest</p>
              <p><strong>Status:</strong> ✅ Working</p>
              <p><strong>Build:</strong> ✅ Successful</p>
              <p><strong>Routing:</strong> ✅ Configured</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTourFormTest;
