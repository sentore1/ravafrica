-- ============================================================================
-- Rebrand from Messiah Safari to RovAfrika Safari Tours
-- Date: 2026-07-11
-- ============================================================================

-- Update site settings with new branding
UPDATE site_settings 
SET 
  logo_letter = 'R',
  company_name = 'RovAfrika Safari Tours',
  company_tagline = 'Rooted in Africa, Guided by Adventures',
  phone = '+250-785-519-481',
  email = 'RovAfrika.safars@gmail.com'
WHERE id IS NOT NULL;

-- Update testimonial that mentions company name
UPDATE testimonials 
SET text = 'Our 14-day East Africa Grand Safari was truly life-changing. Seeing gorillas in Rwanda and the Great Migration in Tanzania — RovAfrika Safari Tours made every moment magical.'
WHERE name = 'Sarah & James Mitchell' 
  AND location = 'London, UK'
  AND tour = 'East Africa Grand Safari';

-- Update admin email (optional - change as needed)
UPDATE admin_users 
SET email = 'admin@rovafrika.com' 
WHERE email = 'admin@messiahsafari.com';

-- ============================================================================
-- End of migration
-- ============================================================================
