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
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
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

ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE inquiries;

INSERT INTO destinations (name, slug, tagline, description, image, attractions, best_time, currency, language) VALUES
('Rwanda', 'rwanda', 'Land of a Thousand Hills', 'Rwanda is a land of breathtaking natural beauty. Known for its mountain gorillas, lush volcanic mountains, and remarkable recovery story, Rwanda offers an intimate and transformative safari experience.', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80', ARRAY['Mountain Gorillas', 'Volcanoes National Park', 'Lake Kivu', 'Nyungwe Forest', 'Akagera National Park'], 'June to September', 'Rwandan Franc (RWF)', 'Kinyarwanda, French, English'),
('Uganda', 'uganda', 'Pearl of Africa', 'Uganda is a wildlife paradise with incredible biodiversity. From gorilla trekking in Bwindi to tracking tree-climbing lions in Queen Elizabeth, Uganda delivers world-class safari experiences.', 'https://images.unsplash.com/photo-1619451683160-8d896d0b95b6?w=1200&q=80', ARRAY['Bwindi Gorillas', 'Queen Elizabeth NP', 'Murchison Falls', 'Kibale Chimps', 'Rwenzori Mountains'], 'June to August, December to February', 'Ugandan Shilling (UGX)', 'English, Swahili, Luganda'),
('Kenya', 'kenya', 'Magical Kenya', 'Kenya is the ultimate Big Five destination. The Masai Mara hosts the Great Migration, while Amboseli offers stunning views of Kilimanjaro. Kenya blends safari thrills with coastal beauty.', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80', ARRAY['Masai Mara', 'Amboseli National Park', 'Great Rift Valley', 'Diani Beach', 'Mount Kenya', 'Lake Nakuru'], 'July to October', 'Kenyan Shilling (KES)', 'English, Swahili'),
('Tanzania', 'tanzania', 'The Soul of Africa', 'Tanzania is where the Serengeti stretches endlessly and Kilimanjaro pierces the sky. With Ngorongoro Crater and Zanzibar, Tanzania offers the most diverse safari experience in Africa.', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80', ARRAY['Serengeti Migration', 'Ngorongoro Crater', 'Mount Kilimanjaro', 'Zanzibar', 'Tarangire NP', 'Lake Manyara'], 'June to October', 'Tanzanian Shilling (TZS)', 'English, Swahili'),
('Burundi', 'burundi', 'Heart of Africa', 'Burundi is East Africa''s hidden gem. With Lake Tanganyika, lush national parks, and vibrant Drummers of Burundi, this small nation offers authentic, crowd-free experiences.', 'https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=1200&q=80', ARRAY['Lake Tanganyika', 'Kibira National Park', 'Rusizi Reserve', 'Gitega Culture', 'Source of the Nile'], 'June to September', 'Burundian Franc (BIF)', 'Kirundi, French')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tours (title, slug, description, short_description, countries, duration, group_size, rating, reviews_count, price, image, highlights, category, featured, itinerary, includes, excludes) VALUES
('East Africa Grand Safari', 'east-africa-grand-safari', 'Experience the best of East Africa on this comprehensive 14-day journey through Kenya, Tanzania, and Rwanda. From the endless plains of the Masai Mara to the volcanic peaks of Volcanoes National Park, this tour combines Big Five safaris with intimate gorilla encounters.', 'The ultimate multi-country East African safari experience', ARRAY['Kenya', 'Tanzania', 'Rwanda'], '14 Days', '2-8', 4.9, 127, 5499, 'https://images.unsplash.com/photo-1535338454528-1b5a12780c22?w=1200&q=80', ARRAY['Masai Mara', 'Serengeti', 'Gorilla Trek', 'Ngorongoro Crater'], 'Big Five Safaris', true, '[{"day":1,"title":"Arrival in Nairobi","description":"Airport pickup and transfer to your hotel. Evening welcome dinner."},{"day":2,"title":"Masai Mara Game Drive","description":"Full day exploring the Masai Mara with expert guides."},{"day":3,"title":"Masai Mara Big Five","description":"Morning and afternoon game drives focused on the Big Five."}]', ARRAY['Airport transfers', 'All accommodations', 'All meals during safari', 'English-speaking guide', 'Park entry fees', 'Gorilla trekking permit'], ARRAY['International flights', 'Travel insurance', 'Personal expenses', 'Tips and gratuities', 'Visa fees']),
('Gorilla & Chimp Encounter', 'gorilla-chimp-encounter', 'An 8-day primate adventure through Rwanda and Uganda, offering face-to-face encounters with mountain gorillas and chimpanzees in their misty forest homes.', 'Face-to-face with gorillas and chimpanzees', ARRAY['Rwanda', 'Uganda'], '8 Days', '2-6', 5.0, 89, 3999, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80', ARRAY['Volcanoes NP', 'Bwindi', 'Kibale Forest', 'Golden Monkeys'], 'Gorilla Trekking', false, '[{"day":1,"title":"Arrive in Kigali","description":"Welcome to Rwanda! Transfer to your hotel in Kigali."},{"day":2,"title":"Gorilla Trekking","description":"Trek into Volcanoes National Park for your gorilla encounter."}]', ARRAY['Airport transfers', 'All accommodations', 'All meals', 'Gorilla permits', 'Chimp tracking permits', 'Expert guides'], ARRAY['International flights', 'Travel insurance', 'Personal expenses', 'Tips']),
('Great Migration Experience', 'great-migration-experience', 'Witness one of nature''s greatest spectacles — the Great Migration — as millions of wildebeest and zebra traverse the Serengeti-Mara ecosystem on this 10-day safari.', 'Witness the greatest wildlife spectacle on Earth', ARRAY['Kenya', 'Tanzania'], '10 Days', '2-8', 4.8, 203, 4299, 'https://images.unsplash.com/photo-1534759926787-89fa60f18909?w=1200&q=80', ARRAY['Masai Mara', 'Serengeti', 'Ngorongoro', 'River Crossings'], 'Big Five Safaris', false, '[{"day":1,"title":"Nairobi Arrival","description":"Airport pickup and transfer."},{"day":2,"title":"Masai Mara","description":"Drive to the Masai Mara for game drives."}]', ARRAY['Airport transfers', 'All accommodations', 'All meals', 'Game drives', 'Park fees', 'Expert guide'], ARRAY['International flights', 'Insurance', 'Tips', 'Personal items']),
('Kilimanjaro Summit & Safari', 'kilimanjaro-summit-safari', 'Combine the thrill of summiting Africa''s highest peak with a classic Tanzanian safari, ending with relaxation on the beaches of Zanzibar.', 'Summit Africa''s highest peak then safari in the Serengeti', ARRAY['Tanzania'], '12 Days', '2-10', 4.7, 156, 3799, 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=1200&q=80', ARRAY['Kilimanjaro Trek', 'Serengeti', 'Zanzibar', 'Ngorongoro'], 'Big Five Safaris', false, '[{"day":1,"title":"Arrive Moshi","description":"Transfer to hotel at the base of Kilimanjaro."}]', ARRAY['Mountain guides', 'Porters', 'All meals on trek', 'Safari accommodation', 'Park fees'], ARRAY['International flights', 'Climbing gear rental', 'Tips', 'Insurance']),
('Primate Safari Complete', 'primate-safari-complete', 'The ultimate primate lover''s dream — 15 days tracking gorillas, chimps, golden monkeys, and colobus monkeys across Rwanda, Uganda, and Tanzania.', 'The ultimate primate tracking adventure', ARRAY['Rwanda', 'Uganda', 'Tanzania'], '15 Days', '2-6', 4.9, 67, 6999, 'https://images.unsplash.com/photo-1619451683160-8d896d0b95b6?w=1200&q=80', ARRAY['Mountain Gorillas', 'Chimps', 'Colobus Monkeys', 'Golden Monkeys'], 'Primate Tracking', true, '[{"day":1,"title":"Arrive Kigali","description":"Welcome dinner in Rwanda''s capital."}]', ARRAY['All permits', 'Expert primate guides', 'All accommodations', 'All meals', 'Ground transport'], ARRAY['International flights', 'Insurance', 'Tips', 'Personal items']),
('Lake Tanganyika & Beyond', 'lake-tanganyika-beyond', 'Discover the hidden gems of Burundi and western Tanzania on this 7-day off-the-beaten-path adventure featuring Lake Tanganyika and pristine national parks.', 'East Africa''s hidden gem', ARRAY['Burundi', 'Tanzania'], '7 Days', '2-8', 4.6, 34, 2499, 'https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=1200&q=80', ARRAY['Lake Tanganyika', 'Kibira NP', 'Rusizi', 'Drummers'], 'Cultural Immersion', false, '[{"day":1,"title":"Arrive Bujumbura","description":"Welcome to Burundi! Transfer to lakeside hotel."}]', ARRAY['All accommodations', 'All meals', 'Local guides', 'Park fees', 'Lake activities'], ARRAY['International flights', 'Insurance', 'Tips', 'Visa fees'])
ON CONFLICT (slug) DO NOTHING;
