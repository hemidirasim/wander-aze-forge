import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const TourCategoryGallery = () => {
  const categories = [
    {
      id: 'hiking',
      name: 'Hiking',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop',
      description: 'Day hikes through stunning landscapes'
    },
    {
      id: 'trekking', 
      name: 'Trekking',
      image: 'https://images.unsplash.com/photo-1464822759844-d150356c4f2e?w=600&h=400&fit=crop',
      description: 'Multi-day mountain expeditions'
    },
    {
      id: 'group-tours',
      name: 'Group Tours', 
      image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=600&h=400&fit=crop',
      description: 'Scheduled group adventures'
    },
    {
      id: 'wildlife',
      name: 'Wildlife',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop', 
      description: 'Nature and wildlife observation'
    },
    {
      id: 'tailor-made',
      name: 'Tailor-made',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      description: 'Custom adventures just for you'
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Explore Our Adventures
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From gentle day hikes to challenging mountain expeditions, discover the perfect adventure for your skill level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First row - 2 cards */}
          <Card className="group relative h-80 overflow-hidden border-0 hover:shadow-elevated transition-all duration-500">
            <Link to={`/tours/${categories[0].id}`} className="block h-full">
              <div className="relative h-full">
                <img 
                  src={categories[0].image} 
                  alt={categories[0].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{categories[0].name}</h3>
                  <p className="text-white/90">{categories[0].description}</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="group relative h-80 overflow-hidden border-0 hover:shadow-elevated transition-all duration-500">
            <Link to={`/tours/${categories[1].id}`} className="block h-full">
              <div className="relative h-full">
                <img 
                  src={categories[1].image} 
                  alt={categories[1].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{categories[1].name}</h3>
                  <p className="text-white/90">{categories[1].description}</p>
                </div>
              </div>
            </Link>
          </Card>

          {/* Second row - Large card */}
          <Card className="group relative h-80 md:col-span-2 lg:col-span-1 lg:row-span-2 lg:h-auto overflow-hidden border-0 hover:shadow-elevated transition-all duration-500">
            <Link to={`/tours/${categories[2].id}`} className="block h-full">
              <div className="relative h-full lg:h-[656px]">
                <img 
                  src={categories[2].image} 
                  alt={categories[2].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-3xl font-bold mb-4">{categories[2].name}</h3>
                  <p className="text-white/90 text-lg">{categories[2].description}</p>
                </div>
              </div>
            </Link>
          </Card>

          {/* Third row - 2 cards */}
          <Card className="group relative h-80 overflow-hidden border-0 hover:shadow-elevated transition-all duration-500">
            <Link to={`/tours/${categories[3].id}`} className="block h-full">
              <div className="relative h-full">
                <img 
                  src={categories[3].image} 
                  alt={categories[3].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{categories[3].name}</h3>
                  <p className="text-white/90">{categories[3].description}</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="group relative h-80 overflow-hidden border-0 hover:shadow-elevated transition-all duration-500">
            <Link to={`/tours/${categories[4].id}`} className="block h-full">
              <div className="relative h-full">
                <img 
                  src={categories[4].image} 
                  alt={categories[4].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{categories[4].name}</h3>
                  <p className="text-white/90">{categories[4].description}</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TourCategoryGallery;