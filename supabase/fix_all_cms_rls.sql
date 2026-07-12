-- ============================================================================
-- Fix All CMS Tables RLS Policies
-- ============================================================================

-- ============================================================
-- SITE SETTINGS
-- ============================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admin update access to site settings" ON site_settings;

CREATE POLICY "Allow public read access to site settings"
ON site_settings FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin update access to site settings"
ON site_settings FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- DESTINATIONS
-- ============================================================
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to destinations" ON destinations;
DROP POLICY IF EXISTS "Allow admin full access to destinations" ON destinations;

CREATE POLICY "Allow public read access to destinations"
ON destinations FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to destinations"
ON destinations FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- EXPERIENCE CATEGORIES
-- ============================================================
ALTER TABLE experience_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to experience categories" ON experience_categories;
DROP POLICY IF EXISTS "Allow admin full access to experience categories" ON experience_categories;

CREATE POLICY "Allow public read access to experience categories"
ON experience_categories FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to experience categories"
ON experience_categories FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- HERO IMAGES
-- ============================================================
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to hero images" ON hero_images;
DROP POLICY IF EXISTS "Allow admin full access to hero images" ON hero_images;

CREATE POLICY "Allow public read access to hero images"
ON hero_images FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to hero images"
ON hero_images FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- VERIFY ALL POLICIES
-- ============================================================
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('site_settings', 'destinations', 'experience_categories', 'hero_images')
ORDER BY tablename, policyname;
