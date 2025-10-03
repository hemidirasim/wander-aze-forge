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
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <Skeleton className="h-16 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Business Partners
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We collaborate with trusted organizations to ensure exceptional experiences and sustainable tourism practices
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500">Error loading partners: {error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Make sure the API server is running
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!partners || partners.length === 0) {
    return (
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Business Partners
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We collaborate with trusted organizations to ensure exceptional experiences and sustainable tourism practices
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">No partners available</p>
          </div>
        </div>
      </section>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {partners.map((partner, index) => (
              partner.website_url ? (
                <a
                  key={partner.id}
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-6 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20 hover:scale-105 cursor-pointer group"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-300">
                    {partner.logo_url ? (
                      <img 
                        src={partner.logo_url} 
                        alt={partner.name}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2 text-lg group-hover:text-primary transition-colors duration-300">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </a>
              ) : (
                <div 
                  key={partner.id} 
                  className="flex items-center space-x-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center">
                    {partner.logo_url ? (
                      <img 
                        src={partner.logo_url} 
                        alt={partner.name}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2 text-lg">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </div>
              )
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

