import { DatabaseService } from '../services/databaseService';

const sampleTours = [
  {
    title: "Khinalig-Laza Trek",
    description: "A challenging 3-day trek through the remote villages of Khinalig and Laza, offering stunning mountain views and authentic cultural experiences.",
    category: "trekking",
    duration: "3 days",
    difficulty: "challenging",
    price: 250.00,
    max_participants: 12,
    image_url: "/images/khinalig-trek.jpg"
  },
  {
    title: "Bazarduzu Summit",
    description: "Conquer Azerbaijan's highest peak at 4,466 meters. A challenging 2-day expedition with breathtaking views.",
    category: "mountaineering",
    duration: "2 days",
    difficulty: "expert",
    price: 350.00,
    max_participants: 8,
    image_url: "/images/bazarduzu-summit.jpg"
  },
  {
    title: "Wildlife Safari",
    description: "Explore the diverse wildlife of Azerbaijan's national parks with expert guides and comfortable accommodations.",
    category: "wildlife",
    duration: "1 day",
    difficulty: "easy",
    price: 120.00,
    max_participants: 15,
    image_url: "/images/wildlife-safari.jpg"
  },
  {
    title: "Cultural Heritage Tour",
    description: "Discover Azerbaijan's rich cultural heritage through visits to ancient cities, museums, and traditional villages.",
    category: "cultural",
    duration: "5 days",
    difficulty: "moderate",
    price: 400.00,
    max_participants: 20,
    image_url: "/images/cultural-tour.jpg"
  },
  {
    title: "Gobustan Rock Art",
    description: "Explore the ancient petroglyphs and mud volcanoes of Gobustan, a UNESCO World Heritage site.",
    category: "cultural",
    duration: "1 day",
    difficulty: "easy",
    price: 80.00,
    max_participants: 25,
    image_url: "/images/gobustan-tour.jpg"
  }
];

const sampleBlogPosts = [
  {
    title: "Best Hiking Trails in Azerbaijan: A Complete Guide",
    content: "Azerbaijan offers some of the most spectacular hiking trails in the Caucasus region. From the ancient villages of Khinalig to the pristine wilderness of Shahdag National Park, our comprehensive guide covers everything you need to know about hiking in Azerbaijan. Whether you're a beginner looking for day hikes or an experienced trekker seeking multi-day adventures, this guide will help you discover the perfect trail for your next adventure.",
    excerpt: "Discover the most breathtaking hiking trails across Azerbaijan, from beginner-friendly walks to challenging mountain expeditions.",
    author: "Camping Azerbaijan Team",
    category: "Travel Guide",
    tags: ["hiking", "trails", "azerbaijan", "mountains"],
    featured_image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    status: "published",
    featured: true
  },
  {
    title: "Sustainable Tourism: Our Commitment to Nature",
    content: "At Camping Azerbaijan, we believe that tourism should benefit both visitors and local communities while protecting the natural environment. Our commitment to sustainable tourism practices includes supporting local homestays, using eco-friendly equipment, and educating travelers about conservation. Learn about our initiatives to reduce environmental impact and support local communities across Azerbaijan.",
    excerpt: "Learn about our eco-friendly practices and how we're working to protect Azerbaijan's pristine wilderness for future generations.",
    author: "Environmental Team",
    category: "Conservation",
    tags: ["sustainability", "ecotourism", "conservation", "environment"],
    featured_image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    status: "published",
    featured: false
  },
  {
    title: "Village Life in Khinalig: Ancient Traditions",
    content: "Khinalig, one of the highest villages in the Caucasus Mountains, offers a unique glimpse into traditional Azerbaijani mountain life. With a history spanning over 5,000 years, this ancient village preserves customs and traditions that have remained largely unchanged for centuries. Join us as we explore the daily life, cultural practices, and architectural marvels of this remarkable mountain community.",
    excerpt: "Experience the unique culture and traditions of one of the world's highest villages in the Caucasus Mountains.",
    author: "Cultural Guide",
    category: "Culture",
    tags: ["culture", "khinalig", "traditions", "mountain-village"],
    featured_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    status: "published",
    featured: false
  },
  {
    title: "Wildlife Watching in Azerbaijan: A Photographer's Guide",
    content: "Azerbaijan's diverse ecosystems provide excellent opportunities for wildlife photography and observation. From the majestic golden eagles of the Greater Caucasus to the elusive Caucasian leopards, our guide covers the best locations, seasons, and techniques for wildlife watching in Azerbaijan. Whether you're a professional photographer or a nature enthusiast, discover the incredible biodiversity that calls Azerbaijan home.",
    excerpt: "Discover the best locations and techniques for wildlife photography in Azerbaijan's diverse ecosystems.",
    author: "Wildlife Team",
    category: "Photography",
    tags: ["wildlife", "photography", "biodiversity", "nature"],
    featured_image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop",
    status: "published",
    featured: false
  },
  {
    title: "Winter Adventures in Shahdag: Skiing and Beyond",
    content: "Shahdag Mountain Resort offers world-class skiing and snowboarding, but the winter adventures don't stop there. From snowshoeing through pristine forests to ice climbing on frozen waterfalls, discover the full range of winter activities available in Azerbaijan's premier mountain destination. Our comprehensive guide covers equipment, safety tips, and the best times to visit for optimal conditions.",
    excerpt: "Explore the full range of winter activities available in Azerbaijan's premier mountain destination.",
    author: "Adventure Team",
    category: "Adventure",
    tags: ["winter", "skiing", "shahdag", "adventure"],
    featured_image: "https://images.unsplash.com/photo-1551524164-6cf2ac531d04?w=800&h=600&fit=crop",
    status: "published",
    featured: false
  },
  {
    title: "Traditional Azerbaijani Cuisine: Mountain to Table",
    content: "Discover the rich culinary traditions of Azerbaijan's mountain regions, where ancient recipes have been preserved for generations. From hearty stews that warm the soul on cold mountain nights to delicate pastries that celebrate special occasions, our guide explores the stories behind Azerbaijan's most beloved dishes. Learn about the ingredients, cooking methods, and cultural significance of these traditional foods.",
    excerpt: "Explore the rich culinary traditions of Azerbaijan's mountain communities and their unique dishes.",
    author: "Culinary Expert",
    category: "Food & Culture",
    tags: ["cuisine", "traditional", "mountains", "culture"],
    featured_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    status: "published",
    featured: false
  }
];

const sampleProjects = [
  {
    title: "Khinalig Village Development",
    description: "A comprehensive development project focused on improving infrastructure and tourism facilities in the ancient village of Khinalig, preserving its unique culture while promoting sustainable tourism.",
    category: "community_development",
    location: "Khinalig, Quba District",
    start_date: "2024-01-15",
    end_date: "2025-12-31",
    budget: 250000.00,
    status: "active",
    image_url: "/images/khinalig-project.jpg",
    gallery_urls: ["/images/khinalig-1.jpg", "/images/khinalig-2.jpg", "/images/khinalig-3.jpg"]
  },
  {
    title: "Gobustan National Park Conservation",
    description: "Environmental conservation project to protect the UNESCO World Heritage site of Gobustan, including petroglyph preservation and visitor center development.",
    category: "conservation",
    location: "Gobustan, Absheron District",
    start_date: "2023-06-01",
    end_date: "2024-12-31",
    budget: 180000.00,
    status: "active",
    image_url: "/images/gobustan-project.jpg",
    gallery_urls: ["/images/gobustan-conservation-1.jpg", "/images/gobustan-conservation-2.jpg"]
  },
  {
    title: "Talysh Mountains Biodiversity Study",
    description: "Scientific research project to document and protect the unique biodiversity of the Talysh Mountains, including rare species monitoring and habitat restoration.",
    category: "research",
    location: "Talysh Mountains, Lankaran District",
    start_date: "2024-03-01",
    end_date: "2026-02-28",
    budget: 320000.00,
    status: "active",
    image_url: "/images/talysh-project.jpg",
    gallery_urls: ["/images/talysh-biodiversity-1.jpg", "/images/talysh-biodiversity-2.jpg", "/images/talysh-biodiversity-3.jpg"]
  }
];

const samplePrograms = [
  {
    name: "Eco-Guide Training Program",
    description: "Comprehensive training program for local guides focusing on sustainable tourism practices, environmental protection, and cultural heritage preservation.",
    type: "education",
    duration: "6 months",
    target_audience: "Local guides and tourism professionals",
    objectives: "Train 50 certified eco-guides by 2025",
    activities: ["Environmental education", "Cultural sensitivity training", "First aid certification", "Language skills development"],
    status: "active",
    image_url: "/images/eco-guide-program.jpg"
  },
  {
    name: "Youth Conservation Leadership",
    description: "Leadership development program for young people aged 18-25, focusing on environmental conservation and sustainable development initiatives.",
    type: "youth_development",
    duration: "12 months",
    target_audience: "Young adults (18-25 years)",
    objectives: "Develop 30 conservation leaders by 2025",
    activities: ["Leadership workshops", "Field research projects", "Community outreach", "International exchange programs"],
    status: "active",
    image_url: "/images/youth-leadership-program.jpg"
  },
  {
    name: "Women in Tourism Entrepreneurship",
    description: "Empowerment program supporting women in rural areas to start and manage sustainable tourism businesses, including homestays and local crafts.",
    type: "women_empowerment",
    duration: "9 months",
    target_audience: "Women entrepreneurs in rural areas",
    objectives: "Support 25 women-led tourism businesses",
    activities: ["Business planning workshops", "Marketing training", "Financial literacy", "Networking events"],
    status: "active",
    image_url: "/images/women-entrepreneurship-program.jpg"
  }
];

const samplePartners = [
  {
    name: "Ministry of Ecology and Natural Resources",
    type: "government",
    description: "Official government partner supporting environmental conservation and sustainable tourism initiatives across Azerbaijan.",
    website_url: "https://eco.gov.az",
    contact_email: "info@eco.gov.az",
    contact_phone: "+994 12 510 10 10",
    logo_url: "/images/ministry-ecology-logo.png",
    partnership_type: "strategic",
    status: "active"
  },
  {
    name: "UNDP Azerbaijan",
    type: "international_organization",
    description: "United Nations Development Programme supporting sustainable development and environmental protection projects in Azerbaijan.",
    website_url: "https://www.az.undp.org",
    contact_email: "registry.az@undp.org",
    contact_phone: "+994 12 498 98 88",
    logo_url: "/images/undp-logo.png",
    partnership_type: "funding",
    status: "active"
  },
  {
    name: "WWF Caucasus",
    type: "ngo",
    description: "World Wildlife Fund Caucasus Programme working on biodiversity conservation and sustainable development in the Caucasus region.",
    website_url: "https://www.wwf-caucasus.org",
    contact_email: "caucasus@wwf.org",
    contact_phone: "+995 32 223 75 00",
    logo_url: "/images/wwf-logo.png",
    partnership_type: "conservation",
    status: "active"
  },
  {
    name: "Azerbaijan Tourism Board",
    type: "tourism_authority",
    description: "National tourism organization promoting Azerbaijan as a destination and supporting tourism development initiatives.",
    website_url: "https://azerbaijan.travel",
    contact_email: "info@azerbaijan.travel",
    contact_phone: "+994 12 598 07 77",
    logo_url: "/images/atb-logo.png",
    partnership_type: "promotion",
    status: "active"
  },
  {
    name: "Lankaran State University",
    type: "educational_institution",
    description: "Higher education institution collaborating on research projects and providing academic support for environmental and tourism studies.",
    website_url: "https://www.lsu.edu.az",
    contact_email: "info@lsu.edu.az",
    contact_phone: "+994 25 244 12 34",
    logo_url: "/images/lsu-logo.png",
    partnership_type: "research",
    status: "active"
  }
];

const seedDatabase = async () => {
  console.log('🌱 Seeding database with sample data...');

  try {
    // Seed tours
    console.log('📋 Adding sample tours...');
    for (const tour of sampleTours) {
      await DatabaseService.createTour(tour);
      console.log(`✅ Added tour: ${tour.title}`);
    }

    // Seed blog posts
    console.log('📝 Adding sample blog posts...');
    for (const post of sampleBlogPosts) {
      await DatabaseService.createBlogPost(post);
      console.log(`✅ Added blog post: ${post.title}`);
    }

    // Seed projects
    console.log('🏗️ Adding sample projects...');
    for (const project of sampleProjects) {
      await DatabaseService.createProject(project);
      console.log(`✅ Added project: ${project.title}`);
    }

    // Seed programs
    console.log('📚 Adding sample programs...');
    for (const program of samplePrograms) {
      await DatabaseService.createProgram(program);
      console.log(`✅ Added program: ${program.name}`);
    }

    // Seed partners
    console.log('🤝 Adding sample partners...');
    for (const partner of samplePartners) {
      await DatabaseService.createPartner(partner);
      console.log(`✅ Added partner: ${partner.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Added:`);
    console.log(`   - ${sampleTours.length} tours`);
    console.log(`   - ${sampleBlogPosts.length} blog posts`);
    console.log(`   - ${sampleProjects.length} projects`);
    console.log(`   - ${samplePrograms.length} programs`);
    console.log(`   - ${samplePartners.length} partners`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
};

seedDatabase();
