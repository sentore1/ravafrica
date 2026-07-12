-- Add background_image column to existing cta_section table
ALTER TABLE public.cta_section 
ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Update existing row with background image
UPDATE public.cta_section 
SET background_image = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=80',
    phone_numbers = ARRAY['+250-785-519-481']
WHERE background_image IS NULL;

-- Verify the update
SELECT 
    id,
    title,
    destination_name,
    destination_image,
    background_image,
    active
FROM public.cta_section;
