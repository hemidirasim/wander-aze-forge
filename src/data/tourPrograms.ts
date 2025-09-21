import { DayProgram } from '../components/TourProgramAccordion';

// Hiking Tours Programs
export const hikingPrograms: { [key: number]: DayProgram[] } = {
  101: [ // Shahdag Day Hike
    {
      day: "Day 1",
      title: "Shahdag National Park Exploration",
      overview: "A perfect introduction to Azerbaijan's mountain landscapes with moderate hiking through pristine forests and alpine meadows.",
      activities: [
        {
          time: "08:00",
          activity: "Departure from Baku",
          description: "Meet your guide and fellow hikers at the designated meeting point in central Baku. Brief introduction and safety briefing.",
          duration: "30 min",
          icon: "coffee"
        },
        {
          time: "08:30",
          activity: "Scenic Drive to Shahdag",
          description: "Comfortable journey through picturesque countryside with stops for photography and local insights from your guide.",
          duration: "3 hours",
          location: "Baku to Shahdag National Park",
          icon: "mountain"
        },
        {
          time: "11:30",
          activity: "Arrival & Trail Preparation",
          description: "Arrive at Shahdag National Park entrance. Equipment check, final preparations, and trail briefing.",
          duration: "30 min",
          icon: "hiking"
        },
        {
          time: "12:00",
          activity: "Forest Trail Hike",
          description: "Begin hiking through beautiful beech and oak forests. Look for local wildlife including deer and various bird species.",
          duration: "2 hours",
          location: "Lower forest trails",
          icon: "mountain"
        },
        {
          time: "14:00",
          activity: "Picnic Lunch",
          description: "Enjoy a traditional Azerbaijani picnic lunch with local specialties and fresh mountain air.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "15:00",
          activity: "Alpine Meadow Walk",
          description: "Continue to higher elevations through alpine meadows with spectacular mountain views and wildflower displays.",
          duration: "2 hours",
          location: "Alpine meadows",
          icon: "sunrise"
        },
        {
          time: "17:00",
          activity: "Summit Viewpoint",
          description: "Reach a scenic viewpoint offering panoramic views of the Greater Caucasus range and surrounding valleys.",
          duration: "1 hour",
          location: "Mountain viewpoint",
          icon: "camera"
        },
        {
          time: "18:00",
          activity: "Return Journey",
          description: "Descend back to the park entrance through a different trail, experiencing the changing light and colors.",
          duration: "1.5 hours",
          icon: "mountain"
        },
        {
          time: "19:30",
          activity: "Departure to Baku",
          description: "Return to Baku with memories and photos of an unforgettable day in Azerbaijan's mountains.",
          duration: "3 hours",
          icon: "coffee"
        }
      ],
      highlights: [
        "Stunning panoramic mountain views",
        "Diverse forest and alpine ecosystems",
        "Wildlife spotting opportunities",
        "Traditional Azerbaijani lunch experience",
        "Professional photography guidance"
      ],
      difficulty: "Easy",
      elevation: "1,200m - 1,800m",
      distance: "8 km total",
      meals: ["Traditional picnic lunch", "Snacks and water provided", "Local tea and refreshments"]
    }
  ],

  102: [ // Gobustan Petroglyphs Hike
    {
      day: "Day 1",
      title: "Ancient Rock Art & Geological Wonders",
      overview: "Discover Azerbaijan's rich cultural heritage through ancient petroglyphs and unique geological formations in Gobustan National Park.",
      activities: [
        {
          time: "09:00",
          activity: "Departure from Baku",
          description: "Meet your archaeologist guide and begin the journey to Gobustan, a UNESCO World Heritage site.",
          duration: "30 min",
          icon: "coffee"
        },
        {
          time: "09:30",
          activity: "Drive to Gobustan",
          description: "Scenic drive through the Absheron Peninsula with insights into Azerbaijan's geological history.",
          duration: "1.5 hours",
          location: "Baku to Gobustan",
          icon: "mountain"
        },
        {
          time: "11:00",
          activity: "Gobustan Museum Visit",
          description: "Explore the modern museum showcasing artifacts and interactive displays about the region's history.",
          duration: "1 hour",
          location: "Gobustan Museum",
          icon: "camera"
        },
        {
          time: "12:00",
          activity: "Petroglyph Trail Hike",
          description: "Hike to the main petroglyph sites, viewing thousands of years old rock carvings depicting ancient life.",
          duration: "2 hours",
          location: "Petroglyph sites",
          icon: "hiking"
        },
        {
          time: "14:00",
          activity: "Lunch Break",
          description: "Enjoy lunch at a local restaurant featuring traditional Azerbaijani cuisine.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "15:00",
          activity: "Mud Volcanoes Exploration",
          description: "Visit the famous mud volcanoes, unique geological formations found in few places worldwide.",
          duration: "1.5 hours",
          location: "Mud volcano field",
          icon: "mountain"
        },
        {
          time: "16:30",
          activity: "Archaeological Site Walk",
          description: "Explore additional archaeological sites and learn about the ancient inhabitants of the region.",
          duration: "1 hour",
          location: "Additional archaeological sites",
          icon: "camera"
        },
        {
          time: "17:30",
          activity: "Return to Baku",
          description: "Drive back to Baku with a deeper understanding of Azerbaijan's ancient history.",
          duration: "1.5 hours",
          icon: "coffee"
        }
      ],
      highlights: [
        "UNESCO World Heritage petroglyphs",
        "Unique mud volcano formations",
        "Expert archaeological guidance",
        "Ancient rock art interpretation",
        "Geological wonder exploration"
      ],
      difficulty: "Easy",
      elevation: "Sea level to 200m",
      distance: "5 km total",
      meals: ["Traditional Azerbaijani lunch", "Museum cafe refreshments", "Snacks and water"]
    }
  ],

  103: [ // Khinalig Village Walk
    {
      day: "Day 1",
      title: "Journey to Europe's Highest Village",
      overview: "Experience the authentic mountain culture of Khinalig, one of Europe's highest inhabited villages, with stunning Caucasus views.",
      activities: [
        {
          time: "07:00",
          activity: "Early Departure from Baku",
          description: "Early morning departure to maximize time in the mountains. Coffee and light breakfast provided.",
          duration: "30 min",
          icon: "coffee"
        },
        {
          time: "07:30",
          activity: "Mountain Drive to Quba",
          description: "Scenic drive through diverse landscapes, from coastal plains to mountain foothills.",
          duration: "3 hours",
          location: "Baku to Quba region",
          icon: "mountain"
        },
        {
          time: "10:30",
          activity: "Quba Region Stop",
          description: "Brief stop in the historic town of Quba for coffee and local market exploration.",
          duration: "30 min",
          location: "Quba town center",
          icon: "coffee"
        },
        {
          time: "11:00",
          activity: "Journey to Khinalig",
          description: "Dramatic drive up winding mountain roads to reach Khinalig village at 2,350m elevation.",
          duration: "1.5 hours",
          location: "Mountain roads to Khinalig",
          icon: "mountain"
        },
        {
          time: "12:30",
          activity: "Village Arrival & Orientation",
          description: "Arrive in Khinalig and meet with local families. Learn about the unique culture and traditions.",
          duration: "1 hour",
          location: "Khinalig village",
          icon: "camera"
        },
        {
          time: "13:30",
          activity: "Traditional Lunch",
          description: "Authentic meal with a local family, featuring traditional mountain cuisine and hospitality.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "14:30",
          activity: "Village Walking Tour",
          description: "Explore the ancient stone houses, mosque, and learn about the village's 5,000-year history.",
          duration: "1.5 hours",
          location: "Khinalig village streets",
          icon: "hiking"
        },
        {
          time: "16:00",
          activity: "Mountain Viewpoint Hike",
          description: "Short hike to a viewpoint offering panoramic views of the Greater Caucasus range.",
          duration: "1 hour",
          location: "Village viewpoint",
          icon: "sunrise"
        },
        {
          time: "17:00",
          activity: "Cultural Exchange",
          description: "Spend time with local families, learn traditional crafts, and experience mountain life.",
          duration: "1 hour",
          location: "Local homes",
          icon: "camera"
        },
        {
          time: "18:00",
          activity: "Sunset Photography",
          description: "Capture the stunning mountain sunset with professional photography guidance.",
          duration: "30 min",
          icon: "camera"
        },
        {
          time: "18:30",
          activity: "Return Journey Begins",
          description: "Begin the return journey to Baku with unforgettable memories of mountain life.",
          duration: "4.5 hours",
          icon: "coffee"
        }
      ],
      highlights: [
        "Europe's highest inhabited village",
        "5,000-year-old cultural heritage",
        "Traditional mountain hospitality",
        "Panoramic Caucasus mountain views",
        "Authentic local cuisine experience"
      ],
      difficulty: "Moderate",
      elevation: "2,350m village elevation",
      distance: "3 km walking",
      meals: ["Traditional mountain lunch", "Local tea and refreshments", "Evening snacks"],
      accommodation: "Return to Baku (day tour)"
    }
  ]
};

// Trekking Tours Programs
export const trekkingPrograms: { [key: number]: DayProgram[] } = {
  201: [ // Laza to Laza Cross-Caucasus Trek
    {
      day: "Day 1",
      title: "Journey to the Mountains",
      overview: "Begin your epic 3-day trek with arrival in the mountains and preparation for the adventure ahead.",
      activities: [
        {
          time: "08:00",
          activity: "Departure from Baku",
          description: "Meet your mountain guide and fellow trekkers. Equipment check and final preparations.",
          duration: "30 min",
          icon: "coffee"
        },
        {
          time: "08:30",
          activity: "Scenic Mountain Drive",
          description: "Journey through diverse landscapes to reach the starting point of your trek.",
          duration: "4 hours",
          location: "Baku to Laza region",
          icon: "mountain"
        },
        {
          time: "12:30",
          activity: "Lunch in Laza Village",
          description: "Traditional mountain lunch in a local guesthouse, meeting the community.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "13:30",
          activity: "Trek Preparation",
          description: "Final equipment check, pack organization, and safety briefing for the trek ahead.",
          duration: "1 hour",
          icon: "hiking"
        },
        {
          time: "14:30",
          activity: "Initial Trail Walk",
          description: "Begin the trek with a moderate walk to the first campsite, acclimatizing to the terrain.",
          duration: "3 hours",
          location: "Laza to first campsite",
          icon: "mountain"
        },
        {
          time: "17:30",
          activity: "Camp Setup",
          description: "Set up camp in a beautiful mountain location with assistance from guides.",
          duration: "1 hour",
          icon: "sleep"
        },
        {
          time: "18:30",
          activity: "Mountain Dinner",
          description: "Enjoy a hearty dinner prepared by guides, sharing stories around the campfire.",
          duration: "1.5 hours",
          icon: "food"
        },
        {
          time: "20:00",
          activity: "Stargazing",
          description: "Experience incredible mountain stargazing with minimal light pollution.",
          duration: "1 hour",
          icon: "camera"
        }
      ],
      highlights: [
        "Mountain village cultural experience",
        "First night under the stars",
        "Traditional mountain hospitality",
        "Stunning sunset and stargazing",
        "Team building with fellow trekkers"
      ],
      difficulty: "Moderate",
      elevation: "1,800m - 2,200m",
      distance: "8 km",
      meals: ["Traditional mountain lunch", "Hearty camp dinner", "Snacks and hot drinks"],
      accommodation: "Mountain camping with tents"
    },
    {
      day: "Day 2",
      title: "Cross-Caucasus Challenge",
      overview: "The most challenging day of the trek, crossing high mountain passes and experiencing pristine wilderness.",
      activities: [
        {
          time: "07:00",
          activity: "Mountain Sunrise",
          description: "Wake up to a spectacular mountain sunrise and enjoy breakfast with mountain views.",
          duration: "1 hour",
          icon: "sunrise"
        },
        {
          time: "08:00",
          activity: "Breakfast & Pack Up",
          description: "Hearty mountain breakfast and efficient camp breakdown for the day ahead.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "09:00",
          activity: "High Mountain Ascent",
          description: "Begin the challenging ascent to the main mountain pass, taking breaks for photos and rest.",
          duration: "4 hours",
          location: "Mountain pass ascent",
          icon: "mountain"
        },
        {
          time: "13:00",
          activity: "Summit Lunch",
          description: "Lunch at a high mountain location with panoramic views of the Caucasus range.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "14:00",
          activity: "Alpine Ridge Walk",
          description: "Trek along high alpine ridges with breathtaking views and unique mountain flora.",
          duration: "3 hours",
          location: "Alpine ridge trails",
          icon: "hiking"
        },
        {
          time: "17:00",
          activity: "Descent to Valley",
          description: "Careful descent into a beautiful mountain valley for the second night's camp.",
          duration: "2 hours",
          location: "Mountain valley descent",
          icon: "mountain"
        },
        {
          time: "19:00",
          activity: "Camp Setup & Dinner",
          description: "Set up camp in a sheltered valley location and enjoy a well-earned dinner.",
          duration: "2 hours",
          icon: "food"
        },
        {
          time: "21:00",
          activity: "Mountain Stories",
          description: "Share experiences and learn about local mountain legends and traditions.",
          duration: "1 hour",
          icon: "camera"
        }
      ],
      highlights: [
        "Crossing high mountain passes",
        "Panoramic Caucasus views",
        "Alpine ridge walking",
        "Mountain flora and fauna",
        "Achievement of personal limits"
      ],
      difficulty: "Challenging",
      elevation: "2,200m - 2,800m",
      distance: "12 km",
      meals: ["Mountain breakfast", "Summit lunch", "Valley camp dinner"],
      accommodation: "Remote mountain camping"
    },
    {
      day: "Day 3",
      title: "Return Journey & Celebration",
      overview: "Complete the circular trek with a return to Laza village and celebration of your achievement.",
      activities: [
        {
          time: "08:00",
          activity: "Final Mountain Morning",
          description: "Wake up in the mountain valley and enjoy breakfast with a sense of accomplishment.",
          duration: "1 hour",
          icon: "sunrise"
        },
        {
          time: "09:00",
          activity: "Valley Trek",
          description: "Trek through beautiful mountain valleys with waterfalls and pristine landscapes.",
          duration: "3 hours",
          location: "Mountain valley trails",
          icon: "hiking"
        },
        {
          time: "12:00",
          activity: "Arrival in Laza",
          description: "Return to Laza village and celebrate the completion of your epic trek.",
          duration: "1 hour",
          icon: "mountain"
        },
        {
          time: "13:00",
          activity: "Celebration Lunch",
          description: "Traditional celebration meal with local families and fellow trekkers.",
          duration: "1.5 hours",
          icon: "food"
        },
        {
          time: "14:30",
          activity: "Cultural Exchange",
          description: "Spend time with local families, sharing stories and learning about mountain life.",
          duration: "1 hour",
          icon: "camera"
        },
        {
          time: "15:30",
          activity: "Departure for Baku",
          description: "Begin the journey back to Baku with unforgettable memories and new friendships.",
          duration: "4 hours",
          icon: "coffee"
        },
        {
          time: "19:30",
          activity: "Arrival in Baku",
          description: "Return to Baku with a sense of achievement and incredible mountain memories.",
          duration: "30 min",
          icon: "coffee"
        }
      ],
      highlights: [
        "Completion of epic trek",
        "Mountain valley exploration",
        "Cultural celebration",
        "Achievement recognition",
        "Lifetime mountain memories"
      ],
      difficulty: "Moderate",
      elevation: "1,800m - 2,200m",
      distance: "10 km",
      meals: ["Mountain breakfast", "Celebration lunch", "Snacks for journey"],
      accommodation: "Return to Baku"
    }
  ],

  203: [ // Bazarduzu Summit Trek
    {
      day: "Day 1",
      title: "Base Camp Preparation",
      overview: "Arrive at base camp and prepare for the challenging ascent of Azerbaijan's highest peak.",
      activities: [
        {
          time: "07:00",
          activity: "Early Departure",
          description: "Early morning departure from Baku to maximize preparation time at base camp.",
          duration: "30 min",
          icon: "coffee"
        },
        {
          time: "07:30",
          activity: "Mountain Journey",
          description: "Drive to the base camp area with stops for equipment and supplies.",
          duration: "5 hours",
          location: "Baku to base camp",
          icon: "mountain"
        },
        {
          time: "12:30",
          activity: "Base Camp Arrival",
          description: "Arrive at base camp and begin acclimatization process.",
          duration: "30 min",
          icon: "mountain"
        },
        {
          time: "13:00",
          activity: "Acclimatization Walk",
          description: "Short walk to help with altitude acclimatization and equipment testing.",
          duration: "2 hours",
          location: "Base camp area",
          icon: "hiking"
        },
        {
          time: "15:00",
          activity: "Equipment Check",
          description: "Comprehensive equipment check and safety briefing for the summit attempt.",
          duration: "1 hour",
          icon: "hiking"
        },
        {
          time: "16:00",
          activity: "Summit Strategy Briefing",
          description: "Detailed briefing about the summit route, weather conditions, and safety protocols.",
          duration: "1 hour",
          icon: "mountain"
        },
        {
          time: "17:00",
          activity: "Early Dinner",
          description: "Early dinner and early rest to prepare for the summit attempt.",
          duration: "2 hours",
          icon: "food"
        },
        {
          time: "19:00",
          activity: "Early Rest",
          description: "Early bedtime to prepare for the pre-dawn summit attempt.",
          duration: "8 hours",
          icon: "sleep"
        }
      ],
      highlights: [
        "Base camp experience",
        "Altitude acclimatization",
        "Expert safety briefing",
        "Mountain equipment preparation",
        "Summit strategy planning"
      ],
      difficulty: "Expert",
      elevation: "3,200m base camp",
      distance: "4 km acclimatization",
      meals: ["Hearty mountain dinner", "Energy snacks", "Hydration preparation"],
      accommodation: "Base camp tents"
    },
    {
      day: "Day 2",
      title: "Summit Day - Bazarduzu Peak",
      overview: "The ultimate challenge - summit Azerbaijan's highest peak at 4,466 meters.",
      activities: [
        {
          time: "02:00",
          activity: "Pre-Dawn Wake-up",
          description: "Early wake-up call for the summit attempt. Light breakfast and final preparations.",
          duration: "1 hour",
          icon: "sunrise"
        },
        {
          time: "03:00",
          activity: "Summit Attempt Begins",
          description: "Begin the challenging ascent to the summit in darkness with headlamps.",
          duration: "6 hours",
          location: "Base camp to summit",
          icon: "mountain"
        },
        {
          time: "09:00",
          activity: "Summit Achievement",
          description: "Reach the summit of Bazarduzu Peak (4,466m) - Azerbaijan's highest point!",
          duration: "30 min",
          location: "Bazarduzu Summit",
          icon: "camera"
        },
        {
          time: "09:30",
          activity: "Summit Celebration",
          description: "Celebrate your achievement with photos and taking in the incredible views.",
          duration: "30 min",
          icon: "camera"
        },
        {
          time: "10:00",
          activity: "Careful Descent",
          description: "Begin the careful descent back to base camp with expert guidance.",
          duration: "4 hours",
          location: "Summit to base camp",
          icon: "mountain"
        },
        {
          time: "14:00",
          activity: "Base Camp Return",
          description: "Return to base camp for rest and celebration of your incredible achievement.",
          duration: "2 hours",
          icon: "food"
        },
        {
          time: "16:00",
          activity: "Celebration & Rest",
          description: "Celebrate your summit achievement and rest after the challenging day.",
          duration: "4 hours",
          icon: "food"
        },
        {
          time: "20:00",
          activity: "Early Sleep",
          description: "Well-deserved rest after conquering Azerbaijan's highest peak.",
          duration: "10 hours",
          icon: "sleep"
        }
      ],
      highlights: [
        "Summit of Azerbaijan's highest peak",
        "Incredible 360-degree mountain views",
        "Personal achievement and triumph",
        "Professional summit photography",
        "Lifetime bragging rights"
      ],
      difficulty: "Expert",
      elevation: "3,200m - 4,466m",
      distance: "8 km round trip",
      meals: ["Early breakfast", "Summit snacks", "Celebration dinner"],
      accommodation: "Base camp tents"
    },
    {
      day: "Day 3",
      title: "Return Journey & Celebration",
      overview: "Return to civilization with your incredible achievement and mountain memories.",
      activities: [
        {
          time: "09:00",
          activity: "Leisurely Morning",
          description: "Relaxed morning at base camp with breakfast and time to reflect on your achievement.",
          duration: "2 hours",
          icon: "sunrise"
        },
        {
          time: "11:00",
          activity: "Base Camp Cleanup",
          description: "Pack up base camp and prepare for the return journey to Baku.",
          duration: "1 hour",
          icon: "hiking"
        },
        {
          time: "12:00",
          activity: "Journey to Baku",
          description: "Return journey to Baku with stops for meals and celebration.",
          duration: "5 hours",
          location: "Base camp to Baku",
          icon: "coffee"
        },
        {
          time: "17:00",
          activity: "Arrival in Baku",
          description: "Return to Baku as a conqueror of Azerbaijan's highest peak!",
          duration: "30 min",
          icon: "coffee"
        }
      ],
      highlights: [
        "Reflection on achievement",
        "Return as a mountain conqueror",
        "Celebration of personal limits",
        "Unforgettable mountain memories",
        "Lifetime achievement recognition"
      ],
      difficulty: "Easy",
      elevation: "3,200m to sea level",
      distance: "2 km",
      meals: ["Mountain breakfast", "Celebration lunch", "Welcome back dinner"],
      accommodation: "Return to Baku"
    }
  ]
};

// Wildlife Tours Programs
export const wildlifePrograms: { [key: number]: DayProgram[] } = {
  301: [ // Caucasus Wildlife Safari
    {
      day: "Day 1",
      title: "Arrival & Introduction to Caucasus Wildlife",
      overview: "Begin your wildlife adventure with arrival in the Caucasus region and introduction to local ecosystems.",
      activities: [
        {
          time: "08:00",
          activity: "Departure from Baku",
          description: "Meet your wildlife expert guide and fellow nature enthusiasts for the adventure ahead.",
          duration: "30 min",
          icon: "coffee"
        },
        {
          time: "08:30",
          activity: "Journey to Wildlife Reserve",
          description: "Scenic drive to the Caucasus wildlife reserve with stops for bird watching along the way.",
          duration: "3 hours",
          location: "Baku to wildlife reserve",
          icon: "mountain"
        },
        {
          time: "11:30",
          activity: "Reserve Arrival & Orientation",
          description: "Arrive at the wildlife reserve and receive orientation about local species and safety protocols.",
          duration: "1 hour",
          icon: "camera"
        },
        {
          time: "12:30",
          activity: "Lunch at Reserve",
          description: "Enjoy lunch while learning about the reserve's conservation efforts and research programs.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "13:30",
          activity: "Afternoon Wildlife Walk",
          description: "First wildlife spotting walk focusing on birds, small mammals, and plant identification.",
          duration: "2 hours",
          location: "Reserve trails",
          icon: "hiking"
        },
        {
          time: "15:30",
          activity: "Wildlife Photography Session",
          description: "Learn wildlife photography techniques with expert guidance in optimal lighting conditions.",
          duration: "1.5 hours",
          icon: "camera"
        },
        {
          time: "17:00",
          activity: "Evening Wildlife Drive",
          description: "Evening safari drive to spot crepuscular animals and birds during their active period.",
          duration: "2 hours",
          location: "Reserve roads",
          icon: "mountain"
        },
        {
          time: "19:00",
          activity: "Dinner & Wildlife Discussion",
          description: "Dinner with discussion about the day's sightings and tomorrow's wildlife opportunities.",
          duration: "2 hours",
          icon: "food"
        }
      ],
      highlights: [
        "Introduction to Caucasus wildlife",
        "Professional wildlife photography",
        "Evening safari experience",
        "Expert naturalist guidance",
        "Conservation education"
      ],
      difficulty: "Easy",
      elevation: "800m - 1,200m",
      distance: "6 km walking",
      meals: ["Wildlife reserve lunch", "Traditional dinner", "Snacks and refreshments"],
      accommodation: "Wildlife reserve lodge"
    },
    {
      day: "Day 2",
      title: "Early Morning Bird Watching & Mountain Wildlife",
      overview: "Dawn bird watching session followed by mountain wildlife exploration and photography.",
      activities: [
        {
          time: "05:30",
          activity: "Dawn Bird Watching",
          description: "Early morning bird watching session when birds are most active and vocal.",
          duration: "2 hours",
          icon: "sunrise"
        },
        {
          time: "07:30",
          activity: "Breakfast at Lodge",
          description: "Hearty breakfast while discussing the morning's bird sightings and identification.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "08:30",
          activity: "Mountain Wildlife Hike",
          description: "Hike to higher elevations to spot mountain wildlife including deer and mountain birds.",
          duration: "3 hours",
          location: "Mountain trails",
          icon: "hiking"
        },
        {
          time: "11:30",
          activity: "Wildlife Tracking Workshop",
          description: "Learn to identify animal tracks, scat, and other signs of wildlife presence.",
          duration: "1 hour",
          icon: "camera"
        },
        {
          time: "12:30",
          activity: "Mountain Lunch",
          description: "Picnic lunch with mountain views while discussing wildlife conservation.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "13:30",
          activity: "Wildlife Photography Masterclass",
          description: "Advanced wildlife photography techniques with professional equipment.",
          duration: "2 hours",
          icon: "camera"
        },
        {
          time: "15:30",
          activity: "Forest Wildlife Walk",
          description: "Explore forest habitats to spot small mammals, reptiles, and forest birds.",
          duration: "2 hours",
          location: "Forest trails",
          icon: "hiking"
        },
        {
          time: "17:30",
          activity: "Wildlife Data Recording",
          description: "Learn how to record wildlife observations and contribute to conservation research.",
          duration: "1 hour",
          icon: "camera"
        },
        {
          time: "18:30",
          activity: "Evening Wildlife Presentation",
          description: "Evening presentation about Caucasus wildlife and conservation efforts.",
          duration: "1.5 hours",
          icon: "camera"
        }
      ],
      highlights: [
        "Dawn bird watching experience",
        "Mountain wildlife spotting",
        "Wildlife tracking skills",
        "Professional photography techniques",
        "Conservation education"
      ],
      difficulty: "Easy",
      elevation: "800m - 1,500m",
      distance: "8 km",
      meals: ["Early breakfast", "Mountain picnic", "Wildlife lodge dinner"],
      accommodation: "Wildlife reserve lodge"
    },
    {
      day: "Day 3",
      title: "Waterfowl & Wetland Wildlife",
      overview: "Explore wetland habitats and observe waterfowl, aquatic mammals, and wetland ecosystems.",
      activities: [
        {
          time: "08:00",
          activity: "Breakfast & Morning Briefing",
          description: "Breakfast with briefing about the day's wetland wildlife exploration.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "09:00",
          activity: "Wetland Bird Watching",
          description: "Explore wetland areas to observe waterfowl, wading birds, and aquatic species.",
          duration: "2.5 hours",
          location: "Wetland areas",
          icon: "hiking"
        },
        {
          time: "11:30",
          activity: "Aquatic Wildlife Observation",
          description: "Observe aquatic mammals and fish species in their natural wetland habitat.",
          duration: "1.5 hours",
          icon: "camera"
        },
        {
          time: "13:00",
          activity: "Wetland Lunch",
          description: "Lunch near wetlands while discussing aquatic ecosystems and conservation.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "14:00",
          activity: "Wildlife Photography Review",
          description: "Review and edit wildlife photographs with expert guidance and tips.",
          duration: "1.5 hours",
          icon: "camera"
        },
        {
          time: "15:30",
          activity: "Final Wildlife Walk",
          description: "Final opportunity to spot wildlife and practice identification skills.",
          duration: "2 hours",
          location: "Various habitats",
          icon: "hiking"
        },
        {
          time: "17:30",
          activity: "Wildlife Summary & Departure",
          description: "Summary of wildlife sightings and begin return journey to Baku.",
          duration: "3.5 hours",
          icon: "coffee"
        },
        {
          time: "21:00",
          activity: "Arrival in Baku",
          description: "Return to Baku with incredible wildlife memories and photography skills.",
          duration: "30 min",
          icon: "coffee"
        }
      ],
      highlights: [
        "Wetland wildlife exploration",
        "Waterfowl identification",
        "Aquatic ecosystem observation",
        "Wildlife photography skills",
        "Comprehensive wildlife education"
      ],
      difficulty: "Easy",
      elevation: "800m - 1,000m",
      distance: "6 km",
      meals: ["Wildlife lodge breakfast", "Wetland lunch", "Snacks for journey"],
      accommodation: "Return to Baku"
    }
  ],

  302: [ // Shirvan Bird Watching Tour
    {
      day: "Day 1",
      title: "Introduction to Shirvan's Avian Diversity",
      overview: "Begin your bird watching adventure in one of Azerbaijan's premier birding destinations.",
      activities: [
        {
          time: "06:00",
          activity: "Early Departure from Baku",
          description: "Early morning departure to catch the best bird watching hours of the day.",
          duration: "30 min",
          icon: "coffee"
        },
        {
          time: "06:30",
          activity: "Drive to Shirvan National Park",
          description: "Journey to Shirvan National Park with bird watching stops along the way.",
          duration: "2.5 hours",
          location: "Baku to Shirvan",
          icon: "mountain"
        },
        {
          time: "09:00",
          activity: "Park Arrival & Orientation",
          description: "Arrive at Shirvan National Park and receive orientation about the park's bird species.",
          duration: "30 min",
          icon: "camera"
        },
        {
          time: "09:30",
          activity: "Morning Bird Watching Session",
          description: "First bird watching session focusing on resident and migratory species.",
          duration: "2 hours",
          location: "Park birding areas",
          icon: "hiking"
        },
        {
          time: "11:30",
          activity: "Bird Identification Workshop",
          description: "Learn to identify different bird species using field guides and binoculars.",
          duration: "1 hour",
          icon: "camera"
        },
        {
          time: "12:30",
          activity: "Lunch at Park",
          description: "Lunch while discussing morning sightings and park conservation efforts.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "13:30",
          activity: "Afternoon Bird Watching",
          description: "Continue bird watching in different habitats within the national park.",
          duration: "3 hours",
          location: "Various park habitats",
          icon: "hiking"
        },
        {
          time: "16:30",
          activity: "Bird Photography Session",
          description: "Learn bird photography techniques with professional guidance.",
          duration: "1.5 hours",
          icon: "camera"
        },
        {
          time: "18:00",
          activity: "Evening Bird Watching",
          description: "Evening session to observe birds during their most active period.",
          duration: "1.5 hours",
          icon: "sunrise"
        },
        {
          time: "19:30",
          activity: "Dinner & Bird Discussion",
          description: "Dinner with discussion about the day's bird sightings and identification.",
          duration: "2 hours",
          icon: "food"
        }
      ],
      highlights: [
        "200+ bird species in one location",
        "Expert bird identification",
        "Professional bird photography",
        "National park conservation",
        "Migratory bird observation"
      ],
      difficulty: "Easy",
      elevation: "Sea level to 100m",
      distance: "8 km walking",
      meals: ["Park lunch", "Traditional dinner", "Bird watching snacks"],
      accommodation: "Park lodge"
    },
    {
      day: "Day 2",
      title: "Advanced Bird Watching & Migration Study",
      overview: "Advanced bird watching techniques and study of migratory patterns in the park.",
      activities: [
        {
          time: "05:00",
          activity: "Pre-Dawn Bird Watching",
          description: "Early morning bird watching to catch birds at their most active time.",
          duration: "2 hours",
          icon: "sunrise"
        },
        {
          time: "07:00",
          activity: "Breakfast & Bird Count",
          description: "Breakfast while conducting a bird count and recording observations.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "08:00",
          activity: "Migratory Bird Study",
          description: "Study migratory bird patterns and learn about migration routes.",
          duration: "2 hours",
          icon: "camera"
        },
        {
          time: "10:00",
          activity: "Wetland Bird Watching",
          description: "Focus on wetland bird species including waterfowl and wading birds.",
          duration: "2 hours",
          location: "Wetland areas",
          icon: "hiking"
        },
        {
          time: "12:00",
          activity: "Bird Ringing Demonstration",
          description: "Observe bird ringing (banding) demonstration by park researchers.",
          duration: "1 hour",
          icon: "camera"
        },
        {
          time: "13:00",
          activity: "Lunch with Researchers",
          description: "Lunch with park researchers discussing bird conservation and research.",
          duration: "1 hour",
          icon: "food"
        },
        {
          time: "14:00",
          activity: "Forest Bird Watching",
          description: "Explore forest habitats to spot woodland bird species.",
          duration: "2.5 hours",
          location: "Forest trails",
          icon: "hiking"
        },
        {
          time: "16:30",
          activity: "Bird Photography Masterclass",
          description: "Advanced bird photography techniques and equipment usage.",
          duration: "1.5 hours",
          icon: "camera"
        },
        {
          time: "18:00",
          activity: "Final Bird Watching Session",
          description: "Final bird watching session and summary of species observed.",
          duration: "1.5 hours",
          icon: "hiking"
        },
        {
          time: "19:30",
          activity: "Celebration Dinner",
          description: "Celebration dinner with bird watching achievements and certificates.",
          duration: "2 hours",
          icon: "food"
        }
      ],
      highlights: [
        "Advanced bird identification",
        "Migratory pattern study",
        "Bird ringing observation",
        "Research collaboration",
        "Professional photography skills"
      ],
      difficulty: "Easy",
      elevation: "Sea level to 100m",
      distance: "10 km",
      meals: ["Early breakfast", "Researcher lunch", "Celebration dinner"],
      accommodation: "Park lodge"
    }
  ]
};

// Combined export
export const allTourPrograms = {
  ...hikingPrograms,
  ...trekkingPrograms,
  ...wildlifePrograms
};
