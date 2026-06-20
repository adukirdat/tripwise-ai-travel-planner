import {
  CalendarDays,
  Compass,
  CreditCard,
  Home,
  Luggage,
  Map,
  MapPin,
  Plane,
  Sparkles,
  UserRound
} from "lucide-react";

export const images = {
  hero:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
  login:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
  bali:
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85",
  goa:
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85",
  japan:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85",
  dubai:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
  switzerland:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85",
  santorini:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85",
  maldives:
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85",
  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
  kerala:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=85"
};

export const appNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Create Trip", href: "/create-trip", icon: Plane },
  { label: "My Trips", href: "/my-trips", icon: Luggage },
  { label: "Buy Plans", href: "/buy-plans", icon: CreditCard },
  { label: "Profile", href: "/profile", icon: UserRound }
];

export const landingFeatures = [
  {
    icon: Map,
    title: "Visual itinerary builder",
    description:
      "Shape each day around places, timing, hotels, and budget with a clear travel-first workflow."
  },
  {
    icon: CalendarDays,
    title: "Day-by-day clarity",
    description:
      "See morning, afternoon, and evening plans in one timeline before the trip begins."
  },
  {
    icon: Compass,
    title: "Companion mode",
    description:
      "Follow your plan while traveling with current day progress, hotel info, weather, and nearby context."
  }
];

export const howItWorks = [
  {
    step: "01",
    title: "Tell TripWise where you are going",
    description: "Add destination, dates, budget style, traveler type, and interests."
  },
  {
    step: "02",
    title: "Review a complete travel plan",
    description: "Compare hotels, costs, daily activities, and local travel notes in one place."
  },
  {
    step: "03",
    title: "Customize and travel with confidence",
    description: "Edit the plan manually, request changes, then follow the itinerary during the trip."
  }
];

export const popularDestinations = [
  {
    destination: "Goa",
    country: "India",
    image: images.goa,
    description: "Beach clubs, old Portuguese lanes, spice farms, and lazy coastal drives.",
    price: "from $420"
  },
  {
    destination: "Japan",
    country: "Japan",
    image: images.japan,
    description: "Temples, neon streets, bullet trains, ryokans, and seasonal food trails.",
    price: "from $1,250"
  },
  {
    destination: "Dubai",
    country: "UAE",
    image: images.dubai,
    description: "Skyline stays, desert safaris, premium shopping, and marina evenings.",
    price: "from $780"
  },
  {
    destination: "Switzerland",
    country: "Europe",
    image: images.switzerland,
    description: "Alpine train journeys, lake towns, mountain walks, and cozy chalets.",
    price: "from $1,480"
  }
];

export const testimonials = [
  {
    name: "Aisha Mehta",
    role: "Solo traveler",
    quote:
      "TripWise made my first Japan trip feel structured without making it rigid. I knew what to do next every morning."
  },
  {
    name: "Rohan Iyer",
    role: "Family planner",
    quote:
      "The budget view and hotel suggestions saved hours. It felt like planning with a very organized travel expert."
  },
  {
    name: "Maya Fernandez",
    role: "Weekend explorer",
    quote:
      "I bought a Bali plan, customized two days, and had a polished itinerary ready the same evening."
  }
];

export const quickActions = [
  {
    title: "Create Trip",
    description: "Build a fresh itinerary from destination, budget, and interests.",
    href: "/create-trip",
    icon: Plane,
    tone: "blue"
  },
  {
    title: "My Trips",
    description: "View saved, purchased, and in-progress travel plans.",
    href: "/my-trips",
    icon: Luggage,
    tone: "green"
  },
  {
    title: "Explore Plans",
    description: "Browse curated itineraries published by other travelers.",
    href: "/buy-plans",
    icon: Sparkles,
    tone: "orange"
  }
];

export const recentTrips = [
  {
    id: "bali-escape",
    destination: "Bali Escape",
    location: "Bali, Indonesia",
    image: images.bali,
    days: "7 days",
    budget: "$1,850",
    createdDate: "12 Jun 2026",
    duration: "7 days"
  },
  {
    id: "goa-weekender",
    destination: "Goa Weekender",
    location: "Goa, India",
    image: images.goa,
    days: "4 days",
    budget: "$520",
    createdDate: "02 Jun 2026",
    duration: "4 days"
  },
  {
    id: "swiss-alps",
    destination: "Swiss Alps Rail",
    location: "Lucerne, Switzerland",
    image: images.switzerland,
    days: "8 days",
    budget: "$2,900",
    createdDate: "18 May 2026",
    duration: "8 days"
  }
];

export const budgetBreakdown = [
  { label: "Flights", value: "$640" },
  { label: "Hotels", value: "$720" },
  { label: "Food", value: "$260" },
  { label: "Activities", value: "$230" },
  { label: "Total", value: "$1,850" }
];

export const recommendedHotels = [
  {
    name: "The Udaya Resorts",
    area: "Ubud",
    price: "$142/night",
    note: "Quiet villas near rice terraces",
    image: images.bali
  },
  {
    name: "Potato Head Suites",
    area: "Seminyak",
    price: "$218/night",
    note: "Beachfront, dining, and nightlife",
    image: images.maldives
  },
  {
    name: "Munduk Moding Plantation",
    area: "Munduk",
    price: "$168/night",
    note: "Mountain views and infinity pool",
    image: images.switzerland
  }
];

export const itinerary = [
  {
    day: "Day 1",
    title: "Arrival in Seminyak",
    location: "Seminyak",
    activities: [
      {
        time: "10:30 AM",
        name: "Airport pickup and hotel check-in",
        location: "Ngurah Rai Airport"
      },
      {
        time: "04:30 PM",
        name: "Beach walk and sunset dinner",
        location: "Seminyak Beach"
      }
    ]
  },
  {
    day: "Day 2",
    title: "Ubud culture loop",
    location: "Ubud",
    activities: [
      {
        time: "08:00 AM",
        name: "Tegallalang rice terrace walk",
        location: "Tegallalang"
      },
      {
        time: "01:00 PM",
        name: "Local lunch and art market",
        location: "Ubud Market"
      },
      {
        time: "05:00 PM",
        name: "Campuhan Ridge golden hour walk",
        location: "Campuhan Ridge"
      }
    ]
  },
  {
    day: "Day 3",
    title: "Waterfalls and temples",
    location: "Central Bali",
    activities: [
      {
        time: "07:30 AM",
        name: "Tibumana waterfall swim",
        location: "Bangli"
      },
      {
        time: "02:00 PM",
        name: "Tirta Empul temple visit",
        location: "Tampaksiring"
      }
    ]
  }
];

export const marketplacePlans = [
  {
    id: "japan-first-time",
    name: "Japan First-Time Loop",
    destination: "Tokyo, Kyoto, Osaka",
    image: images.japan,
    days: "10 days",
    budgetType: "Premium",
    creator: "Neha Travels",
    price: "$39",
    overview:
      "A balanced city and culture route with rail transfers, food neighborhoods, temples, and shopping blocks.",
    budget: ["Flights $980", "Hotels $1,320", "Food $470", "Experiences $360"],
    hotels: ["Nohga Hotel Ueno", "Cross Hotel Kyoto", "Hotel The Flag Shinsaibashi"],
    itinerary: ["Tokyo arrival and Shinjuku", "Asakusa and Ginza", "Kyoto temples", "Osaka food night"]
  },
  {
    id: "dubai-luxe",
    name: "Dubai Luxe Long Weekend",
    destination: "Dubai",
    image: images.dubai,
    days: "4 days",
    budgetType: "Luxury",
    creator: "Omar Routes",
    price: "$24",
    overview:
      "A polished city escape with skyline hotels, marina dining, desert safari, and curated shopping stops.",
    budget: ["Flights $430", "Hotels $890", "Food $260", "Experiences $310"],
    hotels: ["Address Sky View", "Vida Dubai Marina", "Sofitel Downtown"],
    itinerary: ["Downtown arrival", "Desert safari", "Marina day", "Old Dubai and shopping"]
  },
  {
    id: "swiss-rail",
    name: "Swiss Scenic Rail",
    destination: "Lucerne, Interlaken, Zermatt",
    image: images.switzerland,
    days: "8 days",
    budgetType: "Comfort",
    creator: "Elena Maps",
    price: "$49",
    overview:
      "A slow travel plan through lakes, alpine trains, mountain viewpoints, and compact old towns.",
    budget: ["Flights $760", "Hotels $1,420", "Food $520", "Rail pass $430"],
    hotels: ["Hotel des Alpes", "Boutique Hotel Bellevue", "Hotel Bristol Zermatt"],
    itinerary: ["Lucerne lake day", "GoldenPass train", "Jungfraujoch", "Zermatt and Matterhorn"]
  }
];

export const activeTrip = {
  destination: "Bali Escape",
  currentDay: "Day 2 of 7",
  progress: 38,
  nextActivity: "Campuhan Ridge golden hour walk",
  hotel: "The Udaya Resorts, Ubud",
  weather: "29 C, partly cloudy",
  today: itinerary[1],
  upcoming: ["Tirta Empul temple visit", "Munduk mountain transfer", "Nusa Penida day cruise"]
};

export const profileStats = [
  { label: "Trips Created", value: "12" },
  { label: "Plans Published", value: "3" },
  { label: "Plans Purchased", value: "5" },
  { label: "Member Since", value: "Jan 2025" }
];

export const pinIcon = MapPin;
