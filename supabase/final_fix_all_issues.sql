-- ============================================================================
-- FINAL FIX - Run this to fix all CMS issues at once
-- ============================================================================

-- 1. Ensure site_settings has exactly one row
DELETE FROM site_settings WHERE id NOT IN (
  SELECT id FROM site_settings 
  ORDER BY updated_at DESC NULLS LAST
  LIMIT 1
);

-- Insert if doesn't exist
INSERT INTO site_settings (
  logo_letter, company_name, company_tagline, company_description, 
  phone, email, address
) 
SELECT 'R', 'RovAfrika Safari Tours', 'Rooted in Africa, Guided by Adventures', 
  'East Africa''s premier safari operator, crafting unforgettable wildlife and cultural experiences across Rwanda, Uganda, Kenya, Tanzania, and Burundi since 2009.', 
  '+250-785-519-481', 'RovAfrika.safars@gmail.com', 'KG 548 St, Kigali, Rwanda'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- 2. Fix RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admin update access to site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to read site settings" ON site_settings;

-- Allow ANYONE (public + authenticated) to read settings
CREATE POLICY "Allow public read access to site settings"
ON site_settings FOR SELECT 
USING (true);

-- Allow admin users to update
CREATE POLICY "Allow admin update access to site settings"
ON site_settings FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- 3. Fix RLS on other CMS tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to destinations" ON destinations;
CREATE POLICY "Allow public read access to destinations"
ON destinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to experience categories" ON experience_categories;
CREATE POLICY "Allow public read access to experience categories"
ON experience_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to hero images" ON hero_images;
CREATE POLICY "Allow public read access to hero images"
ON hero_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full access to destinations" ON destinations;
CREATE POLICY "Allow admin full access to destinations"
ON destinations FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

DROP POLICY IF EXISTS "Allow admin full access to experience categories" ON experience_categories;
CREATE POLICY "Allow admin full access to experience categories"
ON experience_categories FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

DROP POLICY IF EXISTS "Allow admin full access to hero images" ON hero_images;
CREATE POLICY "Allow admin full access to hero images"
ON hero_images FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- 4. Fix admin_users RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Service role can manage admin_users" ON admin_users;

CREATE POLICY "Allow authenticated users to read admin_users"
ON admin_users FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Service role can manage admin_users"
ON admin_users FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- 5. Ensure admin user exists
DELETE FROM admin_users WHERE LOWER(email) NOT IN ('rovafrika.safars@gmail.com');
INSERT INTO admin_users (email)
SELECT 'rovafrika.safars@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = 'rovafrika.safars@gmail.com');

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '=== VERIFICATION ===' as status;

-- Check row counts
SELECT 'site_settings rows:' as check, COUNT(*) FROM site_settings;
SELECT 'admin_users rows:' as check, COUNT(*) FROM admin_users;

-- Test the SELECT query
SELECT 'Can read site_settings?' as check, company_name FROM site_settings;

-- Show policies
SELECT 'site_settings policies:' as check, policyname, cmd 
FROM pg_policies WHERE tablename = 'site_settings';

SELECT '=== FIX COMPLETE ===' as status;
SELECT 'Now restart your dev server and try again!' as next_step;
