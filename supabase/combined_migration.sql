-- ============================================================================
-- COMBINED SUPABASE MIGRATION
-- Run this entire script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- INITIAL SETUP - Users Table and Authentication
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY NOT NULL,
    avatar_url text,
    user_id text UNIQUE,
    token_identifier text NOT NULL,
    image text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone,
    email text,
    name text,
    full_name text
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
    -- Check if the policy for users exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'users' 
        AND policyname = 'Users can view own data'
    ) THEN
        -- Create policy to allow users to see only their own data
        EXECUTE 'CREATE POLICY "Users can view own data" ON public.users
                FOR SELECT USING (auth.uid()::text = user_id)';
    END IF;

END
$$;

-- Create a function that will be triggered when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    user_id,
    email,
    name,
    full_name,
    avatar_url,
    token_identifier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.id::text,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.created_at,
    NEW.updated_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user is added to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the function to handle user updates as well
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    name = NEW.raw_user_meta_data->>'name',
    full_name = NEW.raw_user_meta_data->>'full_name',
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NEW.updated_at
  WHERE user_id = NEW.id::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user is updated in auth.users
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- ============================================================================
-- TOURISM PLATFORM - Tours, Destinations, Bookings, Inquiries
-- ============================================================================

CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  countries TEXT[] DEFAULT '{}',
  duration TEXT,
  group_size TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  price INTEGER NOT NULL,
  image TEXT,
  gallery TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  category TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  image TEXT,
  gallery TEXT[] DEFAULT '{}',
  attractions TEXT[] DEFAULT '{}',
  best_time TEXT,
  currency TEXT,
  language TEXT,
  icon TEXT DEFAULT 'Mountain',
  color TEXT DEFAULT 'from-emerald-600 to-emerald-800',
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
  tour_title TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  travelers INTEGER DEFAULT 1,
  travel_date DATE,
  special_requests TEXT,
  total_price INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  destination TEXT,
  travelers TEXT,
  travel_date TEXT,
  interests TEXT[] DEFAULT '{}',
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE inquiries;

-- Insert default destinations
INSERT INTO destinations (name, slug, tagline, description, image, attractions, best_time, currency, language, icon, color, display_order) VALUES
('Rwanda', 'rwanda', 'Land of a Thousand Hills', 'Rwanda, known as the "Land of a Thousand Hills," is a remarkable East African destination that has transformed into one of the continent''s premier safari locations. This small but stunning country offers an intimate wildlife experience, most notably the rare opportunity to trek through misty volcanic mountains to encounter endangered mountain gorillas in their natural habitat. Beyond gorillas, Rwanda boasts diverse ecosystems including the ancient Nyungwe Forest with its chimpanzees and canopy walks, the savannah plains of Akagera National Park home to the Big Five, and the serene shores of Lake Kivu. With its clean cities, welcoming people, and commitment to conservation, Rwanda provides a safe, accessible, and deeply moving safari experience that combines wildlife encounters with cultural immersion and breathtaking landscapes.', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80', ARRAY['Mountain Gorillas', 'Volcanoes National Park', 'Lake Kivu', 'Nyungwe Forest', 'Akagera National Park'], 'June to September', 'Rwandan Franc (RWF)', 'Kinyarwanda, French, English', 'Mountain', 'from-emerald-600 to-emerald-800', 1),
('Uganda', 'uganda', 'Pearl of Africa', 'Uganda, aptly named the "Pearl of Africa" by Winston Churchill, is a wildlife paradise offering some of the most diverse safari experiences on the continent. Home to over half of the world''s remaining mountain gorillas in Bwindi Impenetrable Forest, Uganda provides unparalleled primate encounters including chimpanzee tracking in Kibale Forest. The country''s ten national parks showcase incredible biodiversity, from the thundering Murchison Falls to the tree-climbing lions of Queen Elizabeth National Park. With the snow-capped Rwenzori Mountains, the source of the Nile, and abundant birdlife exceeding 1,000 species, Uganda combines adventure, wildlife, and natural beauty in a warm and welcoming atmosphere that makes every visitor feel at home.', 'https://images.unsplash.com/photo-1619451683160-8d896d0b95b6?w=1200&q=80', ARRAY['Bwindi Gorillas', 'Queen Elizabeth NP', 'Murchison Falls', 'Kibale Chimps', 'Rwenzori Mountains'], 'June to August, December to February', 'Ugandan Shilling (UGX)', 'English, Swahili, Luganda', 'TreePine', 'from-green-600 to-green-800', 2),
('Kenya', 'kenya', 'Magical Kenya', 'Kenya is the birthplace of the safari and remains Africa''s most iconic wildlife destination. The legendary Masai Mara hosts the annual Great Migration, where millions of wildebeest and zebra cross crocodile-infested rivers in one of nature''s greatest spectacles. Beyond the Mara, Kenya offers diverse landscapes from the elephant herds of Amboseli against the backdrop of Mount Kilimanjaro, to the flamingo-filled lakes of the Great Rift Valley, and the pristine beaches of the Indian Ocean coast. With world-class lodges, experienced guides, rich Maasai culture, and excellent infrastructure, Kenya delivers the quintessential African safari experience that has captivated travelers for over a century.', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80', ARRAY['Masai Mara', 'Amboseli National Park', 'Great Rift Valley', 'Diani Beach', 'Mount Kenya', 'Lake Nakuru'], 'July to October', 'Kenyan Shilling (KES)', 'English, Swahili', 'Sun', 'from-amber-600 to-amber-800', 3),
('Tanzania', 'tanzania', 'The Soul of Africa', 'Tanzania is home to Africa''s most spectacular wildlife destinations and natural wonders. The vast Serengeti plains host the greatest wildlife show on Earth—the Great Migration—while the Ngorongoro Crater offers the world''s highest concentration of predators in a stunning volcanic caldera. Mount Kilimanjaro, Africa''s highest peak, beckons adventurers, and the spice island of Zanzibar provides the perfect beach retreat after safari. With Tarangire''s elephant herds, Lake Manyara''s tree-climbing lions, and the remote wilderness of Selous and Ruaha, Tanzania offers unmatched diversity. This is where safari dreams come true, combining world-class wildlife viewing with breathtaking landscapes and rich cultural heritage.', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80', ARRAY['Serengeti Migration', 'Ngorongoro Crater', 'Mount Kilimanjaro', 'Zanzibar', 'Tarangire NP', 'Lake Manyara'], 'June to October', 'Tanzanian Shilling (TZS)', 'English, Swahili', 'Bird', 'from-orange-600 to-orange-800', 4),
('Burundi', 'burundi', 'Heart of Africa', 'Burundi, the "Heart of Africa," is East Africa''s best-kept secret, offering authentic and crowd-free experiences for adventurous travelers. Nestled along the shores of Lake Tanganyika, the world''s second-deepest lake, Burundi provides stunning lakeside scenery, excellent snorkeling, and fresh-water beaches. The country''s Kibira National Park protects pristine montane rainforest home to chimpanzees and colobus monkeys, while Rusizi National Park offers hippo and bird watching. Experience the famous Drummers of Burundi, explore the cultural capital of Gitega, and discover the source of the Nile. With warm hospitality, untouched nature, and rich traditions, Burundi offers an off-the-beaten-path adventure that few travelers experience.', 'https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=1200&q=80', ARRAY['Lake Tanganyika', 'Kibira National Park', 'Rusizi Reserve', 'Gitega Culture', 'Source of the Nile'], 'June to September', 'Burundian Franc (BIF)', 'Kirundi, French', 'Waves', 'from-teal-600 to-teal-800', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert default tours
INSERT INTO tours (title, slug, description, short_description, countries, duration, group_size, rating, reviews_count, price, image, highlights, category, featured, itinerary, includes, excludes) VALUES
('East Africa Grand Safari', 'east-africa-grand-safari', 'Experience the best of East Africa on this comprehensive 14-day journey through Kenya, Tanzania, and Rwanda. From the endless plains of the Masai Mara to the volcanic peaks of Volcanoes National Park, this tour combines Big Five safaris with intimate gorilla encounters.', 'The ultimate multi-country East African safari experience', ARRAY['Kenya', 'Tanzania', 'Rwanda'], '14 Days', '2-8', 4.9, 127, 5499, 'https://images.unsplash.com/photo-1535338454528-1b5a12780c22?w=1200&q=80', ARRAY['Masai Mara', 'Serengeti', 'Gorilla Trek', 'Ngorongoro Crater'], 'Big Five Safaris', true, '[{"day":1,"title":"Arrival in Nairobi","description":"Airport pickup and transfer to your hotel. Evening welcome dinner."},{"day":2,"title":"Masai Mara Game Drive","description":"Full day exploring the Masai Mara with expert guides."},{"day":3,"title":"Masai Mara Big Five","description":"Morning and afternoon game drives focused on the Big Five."}]', ARRAY['Airport transfers', 'All accommodations', 'All meals during safari', 'English-speaking guide', 'Park entry fees', 'Gorilla trekking permit'], ARRAY['International flights', 'Travel insurance', 'Personal expenses', 'Tips and gratuities', 'Visa fees']),
('Gorilla & Chimp Encounter', 'gorilla-chimp-encounter', 'An 8-day primate adventure through Rwanda and Uganda, offering face-to-face encounters with mountain gorillas and chimpanzees in their misty forest homes.', 'Face-to-face with gorillas and chimpanzees', ARRAY['Rwanda', 'Uganda'], '8 Days', '2-6', 5.0, 89, 3999, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80', ARRAY['Volcanoes NP', 'Bwindi', 'Kibale Forest', 'Golden Monkeys'], 'Gorilla Trekking', false, '[{"day":1,"title":"Arrive in Kigali","description":"Welcome to Rwanda! Transfer to your hotel in Kigali."},{"day":2,"title":"Gorilla Trekking","description":"Trek into Volcanoes National Park for your gorilla encounter."}]', ARRAY['Airport transfers', 'All accommodations', 'All meals', 'Gorilla permits', 'Chimp tracking permits', 'Expert guides'], ARRAY['International flights', 'Travel insurance', 'Personal expenses', 'Tips']),
('Great Migration Experience', 'great-migration-experience', 'Witness one of nature''s greatest spectacles — the Great Migration — as millions of wildebeest and zebra traverse the Serengeti-Mara ecosystem on this 10-day safari.', 'Witness the greatest wildlife spectacle on Earth', ARRAY['Kenya', 'Tanzania'], '10 Days', '2-8', 4.8, 203, 4299, 'https://images.unsplash.com/photo-1534759926787-89fa60f18909?w=1200&q=80', ARRAY['Masai Mara', 'Serengeti', 'Ngorongoro', 'River Crossings'], 'Big Five Safaris', false, '[{"day":1,"title":"Nairobi Arrival","description":"Airport pickup and transfer."},{"day":2,"title":"Masai Mara","description":"Drive to the Masai Mara for game drives."}]', ARRAY['Airport transfers', 'All accommodations', 'All meals', 'Game drives', 'Park fees', 'Expert guide'], ARRAY['International flights', 'Insurance', 'Tips', 'Personal items']),
('Kilimanjaro Summit & Safari', 'kilimanjaro-summit-safari', 'Combine the thrill of summiting Africa''s highest peak with a classic Tanzanian safari, ending with relaxation on the beaches of Zanzibar.', 'Summit Africa''s highest peak then safari in the Serengeti', ARRAY['Tanzania'], '12 Days', '2-10', 4.7, 156, 3799, 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=1200&q=80', ARRAY['Kilimanjaro Trek', 'Serengeti', 'Zanzibar', 'Ngorongoro'], 'Big Five Safaris', false, '[{"day":1,"title":"Arrive Moshi","description":"Transfer to hotel at the base of Kilimanjaro."}]', ARRAY['Mountain guides', 'Porters', 'All meals on trek', 'Safari accommodation', 'Park fees'], ARRAY['International flights', 'Climbing gear rental', 'Tips', 'Insurance']),
('Primate Safari Complete', 'primate-safari-complete', 'The ultimate primate lover''s dream — 15 days tracking gorillas, chimps, golden monkeys, and colobus monkeys across Rwanda, Uganda, and Tanzania.', 'The ultimate primate tracking adventure', ARRAY['Rwanda', 'Uganda', 'Tanzania'], '15 Days', '2-6', 4.9, 67, 6999, 'https://images.unsplash.com/photo-1619451683160-8d896d0b95b6?w=1200&q=80', ARRAY['Mountain Gorillas', 'Chimps', 'Colobus Monkeys', 'Golden Monkeys'], 'Primate Tracking', true, '[{"day":1,"title":"Arrive Kigali","description":"Welcome dinner in Rwanda''s capital."}]', ARRAY['All permits', 'Expert primate guides', 'All accommodations', 'All meals', 'Ground transport'], ARRAY['International flights', 'Insurance', 'Tips', 'Personal items']),
('Lake Tanganyika & Beyond', 'lake-tanganyika-beyond', 'Discover the hidden gems of Burundi and western Tanzania on this 7-day off-the-beaten-path adventure featuring Lake Tanganyika and pristine national parks.', 'East Africa''s hidden gem', ARRAY['Burundi', 'Tanzania'], '7 Days', '2-8', 4.6, 34, 2499, 'https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=1200&q=80', ARRAY['Lake Tanganyika', 'Kibira NP', 'Rusizi', 'Drummers'], 'Cultural Immersion', false, '[{"day":1,"title":"Arrive Bujumbura","description":"Welcome to Burundi! Transfer to lakeside hotel."}]', ARRAY['All accommodations', 'All meals', 'Local guides', 'Park fees', 'Lake activities'], ARRAY['International flights', 'Insurance', 'Tips', 'Visa fees'])
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- CMS CONTENT - Hero, Stats, Testimonials, Partners
-- ============================================================================

-- Hero Section Content
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_text TEXT DEFAULT 'East Africa''s Premier Safari Operator',
  headline TEXT DEFAULT 'Discover the',
  headline_highlight TEXT DEFAULT 'Heart of Africa',
  description TEXT DEFAULT 'Embark on unforgettable journeys across Rwanda, Uganda, Kenya, Tanzania & Burundi.',
  cta_primary_text TEXT DEFAULT 'Explore Our Tours',
  cta_primary_link TEXT DEFAULT '/tours',
  cta_secondary_text TEXT DEFAULT 'Watch Our Story',
  background_image TEXT DEFAULT 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hero Stats
CREATE TABLE IF NOT EXISTS hero_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  avatar TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  tour TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trust Stats
CREATE TABLE IF NOT EXISTS trust_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default hero content
INSERT INTO hero_content (badge_text, headline, headline_highlight, description, background_image) VALUES
('East Africa''s Premier Safari Operator', 'Discover the', 'Heart of Africa', 'Embark on unforgettable journeys across Rwanda, Uganda, Kenya, Tanzania & Burundi. From gorilla trekking in misty mountains to the Great Migration on endless plains.', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80');

-- Insert default hero stats
INSERT INTO hero_stats (value, label, display_order) VALUES
('5', 'Countries', 1),
('15+', 'Years Experience', 2),
('2,500+', 'Happy Travelers', 3),
('50+', 'Tour Packages', 4);

-- Insert default testimonials
INSERT INTO testimonials (name, location, avatar, rating, text, tour, display_order) VALUES
('Sarah & James Mitchell', 'London, UK', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80', 5, 'Our 14-day East Africa Grand Safari was truly life-changing. Seeing gorillas in Rwanda and the Great Migration in Tanzania — RovAfrika Safari Tours made every moment magical.', 'East Africa Grand Safari', 1),
('Michael Chen', 'San Francisco, USA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', 5, 'The gorilla trekking experience in Volcanoes National Park exceeded all expectations. Our guide was incredibly knowledgeable and the logistics were flawless.', 'Gorilla & Chimp Encounter', 2),
('Elena Rodriguez', 'Madrid, Spain', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', 5, 'From the Masai Mara to Zanzibar, every detail was thoughtfully planned. The luxury camps were stunning and the wildlife sightings were beyond our wildest dreams.', 'Great Migration Experience', 3),
('David Okonkwo', 'Lagos, Nigeria', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', 5, 'As an African exploring East Africa, I was impressed by the depth of cultural experiences. The team''s local connections made all the difference.', 'Cultural Immersion Safari', 4);

-- Insert default trust stats
INSERT INTO trust_stats (value, label, display_order) VALUES
('2,500+', 'Happy Travelers', 1),
('4.9/5', 'Average Rating', 2),
('98%', 'Would Recommend', 3),
('15+', 'Years of Excellence', 4);

-- Insert default partners
INSERT INTO partners (name, display_order) VALUES
('Rwanda Development Board', 1),
('Uganda Wildlife Authority', 2),
('Kenya Tourism Board', 3),
('Tanzania National Parks', 4),
('African Travel & Tourism Association', 5);

-- ============================================================================
-- ADMIN ROLES
-- ============================================================================

-- Create admin_users table to track admin emails
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert your admin email (CHANGE THIS TO YOUR EMAIL)
INSERT INTO admin_users (email) VALUES ('admin@rovafrika.com')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- HERO IMAGES SLIDER
-- ============================================================================

-- Hero Images Slider
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default hero images
INSERT INTO hero_images (image_url, display_order) VALUES
('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80', 1),
('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80', 2),
('https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80', 3),
('https://images.unsplash.com/photo-1619451683160-8d896d0b95b6?w=1920&q=80', 4);

-- ============================================================================
-- DESTINATION ATTRACTIONS
-- ============================================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS destination_attractions;

CREATE TABLE IF NOT EXISTS destination_attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert attractions for Rwanda
INSERT INTO destination_attractions (destination_id, name, display_order)
SELECT id, 'Mountain Gorillas', 1 FROM destinations WHERE name = 'Rwanda'
UNION ALL
SELECT id, 'Volcanoes National Park', 2 FROM destinations WHERE name = 'Rwanda'
UNION ALL
SELECT id, 'Lake Kivu', 3 FROM destinations WHERE name = 'Rwanda'
UNION ALL
SELECT id, 'Nyungwe Forest', 4 FROM destinations WHERE name = 'Rwanda';

-- Insert attractions for Uganda
INSERT INTO destination_attractions (destination_id, name, display_order)
SELECT id, 'Bwindi Gorillas', 1 FROM destinations WHERE name = 'Uganda'
UNION ALL
SELECT id, 'Queen Elizabeth NP', 2 FROM destinations WHERE name = 'Uganda'
UNION ALL
SELECT id, 'Murchison Falls', 3 FROM destinations WHERE name = 'Uganda'
UNION ALL
SELECT id, 'Kibale Chimps', 4 FROM destinations WHERE name = 'Uganda';

-- Insert attractions for Kenya
INSERT INTO destination_attractions (destination_id, name, display_order)
SELECT id, 'Masai Mara', 1 FROM destinations WHERE name = 'Kenya'
UNION ALL
SELECT id, 'Amboseli National Park', 2 FROM destinations WHERE name = 'Kenya'
UNION ALL
SELECT id, 'Great Rift Valley', 3 FROM destinations WHERE name = 'Kenya'
UNION ALL
SELECT id, 'Diani Beach', 4 FROM destinations WHERE name = 'Kenya';

-- Insert attractions for Tanzania
INSERT INTO destination_attractions (destination_id, name, display_order)
SELECT id, 'Serengeti Migration', 1 FROM destinations WHERE name = 'Tanzania'
UNION ALL
SELECT id, 'Ngorongoro Crater', 2 FROM destinations WHERE name = 'Tanzania'
UNION ALL
SELECT id, 'Mount Kilimanjaro', 3 FROM destinations WHERE name = 'Tanzania'
UNION ALL
SELECT id, 'Zanzibar', 4 FROM destinations WHERE name = 'Tanzania';

-- Insert attractions for Burundi
INSERT INTO destination_attractions (destination_id, name, display_order)
SELECT id, 'Lake Tanganyika', 1 FROM destinations WHERE name = 'Burundi'
UNION ALL
SELECT id, 'Kibira National Park', 2 FROM destinations WHERE name = 'Burundi'
UNION ALL
SELECT id, 'Rusizi Reserve', 3 FROM destinations WHERE name = 'Burundi'
UNION ALL
SELECT id, 'Gitega Culture', 4 FROM destinations WHERE name = 'Burundi';

-- ============================================================================
-- EXPERIENCE CATEGORIES
-- ============================================================================

-- Experience Categories Table
CREATE TABLE IF NOT EXISTS experience_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'TreePine',
  image TEXT NOT NULL,
  tours_count INTEGER DEFAULT 0,
  slug TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default experience categories
INSERT INTO experience_categories (title, description, icon, image, tours_count, slug, display_order) VALUES
('Gorilla Trekking', 'Trek through misty volcanic forests to encounter endangered mountain gorillas in their natural habitat', 'TreePine', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80', 8, 'gorilla-trekking', 1),
('Big Five Safaris', 'Witness lions, elephants, buffalo, leopards, and rhinos across iconic national parks', 'Binoculars', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80', 15, 'big-five', 2),
('Primate Tracking', 'From golden monkeys to chimpanzees, discover East Africa''s incredible primate diversity', 'Camera', 'https://images.unsplash.com/photo-1619451683160-8d896d0b95b6?w=600&q=80', 6, 'primate-tracking', 3),
('Cultural Immersion', 'Connect with Maasai warriors, Rwandan dancers, and ancient tribal traditions', 'Heart', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80', 10, 'cultural', 4),
('Beach Extensions', 'Unwind on the pristine shores of Zanzibar, Diani Beach, or Lake Tanganyika', 'Waves', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', 5, 'beach', 5),
('Luxury Camping', 'Experience the wild in style with premium tented camps under the African stars', 'Tent', 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80', 7, 'luxury-camping', 6);

-- ============================================================================
-- SITE SETTINGS
-- ============================================================================

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  logo_letter TEXT DEFAULT 'R',
  company_name TEXT DEFAULT 'RovAfrika Safari Tours',
  company_tagline TEXT DEFAULT 'Rooted in Africa, Guided by Adventures',
  company_description TEXT DEFAULT 'East Africa''s premier safari operator, crafting unforgettable wildlife and cultural experiences across Rwanda, Uganda, Kenya, Tanzania, and Burundi since 2009.',
  phone TEXT DEFAULT '+250-785-519-481',
  email TEXT DEFAULT 'RovAfrika.safars@gmail.com',
  address TEXT DEFAULT 'KG 548 St, Kigali, Rwanda',
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  youtube_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (logo_letter, company_name, company_tagline, company_description, phone, email, address) VALUES
('R', 'RovAfrika Safari Tours', 'Rooted in Africa, Guided by Adventures', 'East Africa''s premier safari operator, crafting unforgettable wildlife and cultural experiences across Rwanda, Uganda, Kenya, Tanzania, and Burundi since 2009.', '+250-785-519-481', 'RovAfrika.safars@gmail.com', 'KG 548 St, Kigali, Rwanda');

-- ============================================================================
-- STORAGE BUCKET FOR IMAGES
-- ============================================================================

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read images
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access" ON storage.objects 
        FOR SELECT USING (bucket_id = 'images');
    END IF;
END $$;

-- Allow authenticated users to upload images
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can upload'
    ) THEN
        CREATE POLICY "Authenticated users can upload" ON storage.objects 
        FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- Allow authenticated users to update images
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can update'
    ) THEN
        CREATE POLICY "Authenticated users can update" ON storage.objects 
        FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- Allow authenticated users to delete images
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can delete'
    ) THEN
        CREATE POLICY "Authenticated users can delete" ON storage.objects 
        FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables, functions, triggers, and initial data have been created.
-- 
-- IMPORTANT NEXT STEPS:
-- 1. Update the admin email in the admin_users table to your actual email
-- 2. Configure your environment variables in .env.local with your Supabase URL and keys
-- 3. Test authentication by signing up and signing in
-- 4. Verify that all tables are populated correctly in Supabase Dashboard
--
-- For more information, refer to the README.md and CMS_SETUP.md files
-- ============================================================================
