-- Create CTA (Call to Action) Section table
CREATE TABLE IF NOT EXISTS public.cta_section (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Rating section
    rating DECIMAL(2,1) DEFAULT 4.9,
    total_guests TEXT DEFAULT '132,485 guests travelled',
    
    -- Main content
    title TEXT NOT NULL DEFAULT 'Explore the World, To match your style!',
    description TEXT DEFAULT 'Our bespoke holiday planning team takes care of everything — from hotels, flights, and visas to sightseeing, transfers, or a complete package.',
    
    -- Featured destination
    destination_image TEXT,
    background_image TEXT,
    destination_name TEXT DEFAULT 'Manali, Himachal Pradesh',
    destination_description TEXT DEFAULT 'Snow-capped peaks, pine forests, and serene valleys — the perfect blend of adventure and relaxation',
    destination_rating TEXT DEFAULT '3 stars - 8,610 Excellent (4)',
    destination_location TEXT DEFAULT 'Ahmedabad (AMD) - Bhubaneshwar (BBI)',
    
    -- CTA section
    cta_text TEXT DEFAULT 'Share your travel dreams, and we''ll turn them into a perfect itinerary.',
    button_text TEXT DEFAULT 'Enquire Now',
    button_link TEXT DEFAULT '/contact',
    phone_numbers TEXT[] DEFAULT ARRAY['+250785519481'],
    
    -- Status
    active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default data
INSERT INTO public.cta_section (
    rating,
    total_guests,
    title,
    description,
    destination_image,
    background_image,
    destination_name,
    destination_description,
    destination_rating,
    destination_location,
    cta_text,
    button_text,
    button_link,
    phone_numbers,
    active
) VALUES (
    4.9,
    '132,485 guests travelled',
    'Explore the World, To match your style!',
    'Our bespoke holiday planning team takes care of everything — from hotels, flights, and visas to sightseeing, transfers, or a complete package.',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=80',
    'Serengeti National Park, Tanzania',
    'Vast plains, incredible wildlife, and the Great Migration — the ultimate safari experience',
    '5 stars - 15,240 Excellent Reviews',
    'Kigali (KGL) - Kilimanjaro (JRO)',
    'Share your travel dreams, and we''ll turn them into a perfect itinerary.',
    'Enquire Now',
    '/contact',
    ARRAY['+250-785-519-481'],
    true
) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.cta_section ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Anyone can read active CTA section"
ON public.cta_section
FOR SELECT
USING (active = true);

-- Admin write policies
CREATE POLICY "Admins can insert CTA section"
ON public.cta_section
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
    )
);

CREATE POLICY "Admins can update CTA section"
ON public.cta_section
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
    )
);

CREATE POLICY "Admins can delete CTA section"
ON public.cta_section
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
    )
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_cta_section_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cta_section_updated_at
    BEFORE UPDATE ON public.cta_section
    FOR EACH ROW
    EXECUTE FUNCTION update_cta_section_updated_at();
