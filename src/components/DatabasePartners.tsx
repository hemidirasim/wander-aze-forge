import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Mail, Phone, Building2 } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  type?: string;
  description?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  partnership_type?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const DatabasePartners: React.FC = () => {
  const { data: partners, loading, error } = useApi<Partner[]>('/partners');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading partners: {error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure the API server is running on port 3001
        </p>
      </div>
    );
  }

  if (!partners || partners.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No partners available</p>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'government':
        return 'bg-blue-100 text-blue-800';
      case 'international_organization':
        return 'bg-green-100 text-green-800';
      case 'ngo':
        return 'bg-orange-100 text-orange-800';
      case 'tourism_authority':
        return 'bg-purple-100 text-purple-800';
      case 'educational_institution':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartnershipTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'strategic':
        return 'bg-red-100 text-red-800';
      case 'funding':
        return 'bg-green-100 text-green-800';
      case 'conservation':
        return 'bg-blue-100 text-blue-800';
      case 'promotion':
        return 'bg-yellow-100 text-yellow-800';
      case 'research':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Partners from Database
        </h2>
        <p className="text-gray-600">
          Live data from PostgreSQL database via API
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className={getTypeColor(partner.type || '')}>
                  {partner.type?.replace('_', ' ') || 'Partner'}
                </Badge>
                {partner.partnership_type && (
                  <Badge className={getPartnershipTypeColor(partner.partnership_type)}>
                    {partner.partnership_type}
                  </Badge>
                )}
                <Badge variant="outline" className="text-green-600">
                  {partner.status}
                </Badge>
              </div>
              <CardTitle className="text-xl flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                {partner.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {partner.description}
              </p>
              
              <div className="space-y-2 text-sm">
                {partner.website_url && (
                  <div className="flex items-center text-blue-600">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <a 
                      href={partner.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline truncate"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                
                {partner.contact_email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <a 
                      href={`mailto:${partner.contact_email}`}
                      className="hover:underline truncate"
                    >
                      {partner.contact_email}
                    </a>
                  </div>
                )}
                
                {partner.contact_phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <a 
                      href={`tel:${partner.contact_phone}`}
                      className="hover:underline"
                    >
                      {partner.contact_phone}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  ID: {partner.id}
                </span>
                {partner.logo_url && (
                  <span className="text-xs text-blue-600">
                    🏢 Logo Available
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DatabasePartners;

