import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import FileUpload from '@/components/FileUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Image, FileText, Users, Building2, BookOpen } from 'lucide-react';

const UploadDemo: React.FC = () => {
  const [uploadedUrls, setUploadedUrls] = useState<{
    tours: string[];
    projects: string[];
    programs: string[];
    partners: string[];
    blog: string[];
  }>({
    tours: [],
    projects: [],
    programs: [],
    partners: [],
    blog: [],
  });

  const handleUploadComplete = (type: keyof typeof uploadedUrls) => (url: string) => {
    setUploadedUrls(prev => ({
      ...prev,
      [type]: [...prev[type], url]
    }));
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Vercel Blob Storage Demo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Upload and manage files for your tourism website using Vercel Blob storage
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Image className="w-4 h-4 mr-2" />
                Image Upload
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <FileText className="w-4 h-4 mr-2" />
                Document Support
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Multiple Types
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="tours" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="tours" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Tours
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="programs" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Programs
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Partners
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Blog
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="space-y-6">
                <TabsContent value="tours">
                  <FileUpload
                    type="tour"
                    onUploadComplete={handleUploadComplete('tours')}
                    onUploadError={handleUploadError}
                    multiple={true}
                  />
                </TabsContent>

                <TabsContent value="projects">
                  <FileUpload
                    type="project"
                    onUploadComplete={handleUploadComplete('projects')}
                    onUploadError={handleUploadError}
                    multiple={true}
                  />
                </TabsContent>

                <TabsContent value="programs">
                  <FileUpload
                    type="program"
                    onUploadComplete={handleUploadComplete('programs')}
                    onUploadError={handleUploadError}
                    multiple={true}
                  />
                </TabsContent>

                <TabsContent value="partners">
                  <FileUpload
                    type="partner"
                    onUploadComplete={handleUploadComplete('partners')}
                    onUploadError={handleUploadError}
                    multiple={false}
                  />
                </TabsContent>

                <TabsContent value="blog">
                  <FileUpload
                    type="blog"
                    onUploadComplete={handleUploadComplete('blog')}
                    onUploadError={handleUploadError}
                    multiple={false}
                  />
                </TabsContent>
              </div>

              {/* Uploaded Files Preview */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Uploaded Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(uploadedUrls).map(([type, urls]) => (
                        <div key={type} className="space-y-2">
                          <h4 className="font-medium capitalize">{type}</h4>
                          {urls.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {urls.map((url, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={url}
                                    alt={`${type} ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-md border"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-md flex items-center justify-center">
                                    <button
                                      onClick={() => window.open(url, '_blank')}
                                      className="opacity-0 group-hover:opacity-100 bg-white text-black px-2 py-1 rounded text-xs font-medium transition-opacity"
                                    >
                                      View
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No files uploaded yet</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Storage Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(uploadedUrls).map(([type, urls]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="capitalize">{type}</span>
                          <Badge variant="outline">
                            {urls.length} file{urls.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      ))}
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center font-medium">
                          <span>Total Files</span>
                          <Badge>
                            {Object.values(uploadedUrls).flat().length} files
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>

          {/* API Information */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Upload Endpoints</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li><code>POST /api/upload/image</code> - Single image upload</li>
                    <li><code>POST /api/upload/images</code> - Multiple image upload</li>
                    <li><code>POST /api/upload/document</code> - Document upload</li>
                    <li><code>DELETE /api/upload/file</code> - Delete file</li>
                    <li><code>GET /api/upload/files</code> - List files</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✅ Automatic file validation</li>
                    <li>✅ Progress tracking</li>
                    <li>✅ Multiple file types support</li>
                    <li>✅ Optimized image handling</li>
                    <li>✅ Secure file deletion</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadDemo;
