-- Site Settings Table
CREATE TABLE site_settings (
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
