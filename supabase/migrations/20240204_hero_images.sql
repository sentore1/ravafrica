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
