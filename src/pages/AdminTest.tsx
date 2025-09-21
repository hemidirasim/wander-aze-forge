import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminTest: React.FC = () => {
  const testApiConnection = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      alert(`API Status: ${JSON.stringify(data)}`);
    } catch (error) {
      alert(`API Error: ${error}`);
    }
  };

  const testAdminLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'admin', password: 'admin123' }),
      });
      const data = await response.json();
      alert(`Admin Login: ${JSON.stringify(data)}`);
    } catch (error) {
      alert(`Admin Login Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Panel Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testApiConnection} className="w-full">
            Test API Connection
          </Button>
          <Button onClick={testAdminLogin} className="w-full">
            Test Admin Login
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vercel Admin Panel Test Page
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTest;
