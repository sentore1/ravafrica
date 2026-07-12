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
