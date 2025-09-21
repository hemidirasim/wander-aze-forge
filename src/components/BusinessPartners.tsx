const BusinessPartners = () => {
  const partners = [
    {
      name: 'Ministry of Ecology Azerbaijan',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      description: 'Official partnership for sustainable tourism'
    },
    {
      name: 'Azerbaijan Tourism Board',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      description: 'Promoting authentic Azerbaijan experiences'
    },
    {
      name: 'Caucasus Nature Fund', 
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      description: 'Conservation and biodiversity protection'
    },
    {
      name: 'Local Mountain Guides Association',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      description: 'Professional mountain guide certification'
    },
    {
      name: 'Shahdag Resort',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      description: 'Premium mountain resort partnership'
    },
    {
      name: 'Village Homestay Network',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      description: 'Authentic village accommodation'
    }
  ];

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="group text-center hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-muted/20 rounded-xl p-6 mb-4 group-hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-full h-16 object-contain mx-auto grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-2 group-hover:text-primary transition-colors">
                {partner.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-tight">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-primary/5 rounded-full px-8 py-4">
            <span className="text-primary font-semibold">Certified by:</span>
            <span className="text-muted-foreground">Azerbaijan Tourism Board • Sustainable Tourism Association • Mountain Guide Alliance</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessPartners;