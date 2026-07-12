-- Experience Categories Table
CREATE TABLE experience_categories (
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
