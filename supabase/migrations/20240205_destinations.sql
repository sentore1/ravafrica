-- Drop existing tables if they exist
DROP TABLE IF EXISTS destination_attractions;

-- Add missing columns to destinations table
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Mountain';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'from-emerald-600 to-emerald-800';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add slug values if missing
UPDATE destinations SET slug = LOWER(name) WHERE slug IS NULL;

-- Make slug unique
ALTER TABLE destinations ADD CONSTRAINT destinations_slug_key UNIQUE (slug);

CREATE TABLE IF NOT EXISTS destination_attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update existing destinations with new fields
UPDATE destinations SET icon = 'Mountain', color = 'from-emerald-600 to-emerald-800', display_order = 1 WHERE slug = 'rwanda';
UPDATE destinations SET icon = 'TreePine', color = 'from-green-600 to-green-800', display_order = 2 WHERE slug = 'uganda';
UPDATE destinations SET icon = 'Sun', color = 'from-amber-600 to-amber-800', display_order = 3 WHERE slug = 'kenya';
UPDATE destinations SET icon = 'Bird', color = 'from-orange-600 to-orange-800', display_order = 4 WHERE slug = 'tanzania';
UPDATE destinations SET icon = 'Waves', color = 'from-teal-600 to-teal-800', display_order = 5 WHERE slug = 'burundi';

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
