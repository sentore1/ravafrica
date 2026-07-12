export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  countries: string[];
  duration: string | null;
  group_size: string | null;
  rating: number;
  reviews_count: number;
  price: number;
  image: string | null;
  gallery: string[];
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  includes: string[];
  excludes: string[];
  category: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  image: string | null;
  gallery: string[];
  attractions: string[];
  best_time: string | null;
  currency: string | null;
  language: string | null;
  active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  tour_id: string | null;
  tour_title: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  travelers: number;
  travel_date: string | null;
  special_requests: string | null;
  total_price: number | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  destination: string | null;
  travelers: string | null;
  travel_date: string | null;
  interests: string[];
  message: string | null;
  status: "new" | "contacted" | "converted" | "closed";
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}
