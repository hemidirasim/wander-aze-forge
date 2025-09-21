import React from 'react';
import { useApi } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2 } from 'lucide-react';

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


  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our Business Partners
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We collaborate with trusted organizations to ensure exceptional experiences and sustainable tourism practices
          </p>
        </div>
        
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading partners: {error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Make sure the API server is running
            </p>
          </div>
        )}
        
        {!loading && !error && partners && partners.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {partners.map((partner, index) => (
          <div 
            key={partner.id} 
            className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300"
          >
            <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center group-hover:shadow-lg transition-shadow">
              {partner.logo_url ? (
                <img 
                  src={partner.logo_url} 
                  alt={partner.name}
                  className="w-16 h-16 object-contain rounded-full"
                />
              ) : (
                <Building2 className="w-8 h-8 text-primary" />
              )}
            </div>
            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {partner.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {partner.description}
            </p>
          </div>
        ))}
          </div>
        )}
        
        {!loading && !error && (!partners || partners.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-500">No partners available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DatabasePartners;

