-- ============================================================================
-- COMPLETE RLS FIX FOR ALL TABLES
-- Run this once to fix all permission issues
-- ============================================================================

-- ============================================================
-- 1. ADMIN USERS
-- ============================================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Service role can manage admin_users" ON admin_users;

CREATE POLICY "Allow authenticated users to read admin_users"
ON admin_users FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service role can manage admin_users"
ON admin_users FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- 2. SITE SETTINGS
-- ============================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admin update access to site settings" ON site_settings;

CREATE POLICY "Allow public read access to site settings"
ON site_settings FOR SELECT USING (true);

CREATE POLICY "Allow admin update access to site settings"
ON site_settings FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- 3. TOURS
-- ============================================================
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to tours" ON tours;
DROP POLICY IF EXISTS "Allow admin full access to tours" ON tours;

CREATE POLICY "Allow public read access to tours"
ON tours FOR SELECT USING (active = true);

CREATE POLICY "Allow admin full access to tours"
ON tours FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- 4. DESTINATIONS
-- ============================================================
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to destinations" ON destinations;
DROP POLICY IF EXISTS "Allow admin full access to destinations" ON destinations;

CREATE POLICY "Allow public read access to destinations"
ON destinations FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to destinations"
ON destinations FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- 5. EXPERIENCE CATEGORIES
-- ============================================================
ALTER TABLE experience_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to experience categories" ON experience_categories;
DROP POLICY IF EXISTS "Allow admin full access to experience categories" ON experience_categories;

CREATE POLICY "Allow public read access to experience categories"
ON experience_categories FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to experience categories"
ON experience_categories FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- 6. HERO IMAGES
-- ============================================================
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to hero images" ON hero_images;
DROP POLICY IF EXISTS "Allow admin full access to hero images" ON hero_images;

CREATE POLICY "Allow public read access to hero images"
ON hero_images FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to hero images"
ON hero_images FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- 7. TESTIMONIALS
-- ============================================================
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow admin full access to testimonials" ON testimonials;

CREATE POLICY "Allow public read access to testimonials"
ON testimonials FOR SELECT USING (active = true);

CREATE POLICY "Allow admin full access to testimonials"
ON testimonials FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- 8. BOOKINGS
-- ============================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to create bookings" ON bookings;
DROP POLICY IF EXISTS "Allow users to read own bookings" ON bookings;
DROP POLICY IF EXISTS "Allow admin full access to bookings" ON bookings;

-- Anyone can create a booking
CREATE POLICY "Allow users to create bookings"
ON bookings FOR INSERT TO public WITH CHECK (true);

-- Users can read their own bookings
CREATE POLICY "Allow users to read own bookings"
ON bookings FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Admins can do everything
CREATE POLICY "Allow admin full access to bookings"
ON bookings FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- 9. INQUIRIES
-- ============================================================
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to create inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow users to read own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow admin full access to inquiries" ON inquiries;

-- Anyone can create an inquiry
CREATE POLICY "Allow users to create inquiries"
ON inquiries FOR INSERT TO public WITH CHECK (true);

-- Users can read their own inquiries
CREATE POLICY "Allow users to read own inquiries"
ON inquiries FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Admins can do everything
CREATE POLICY "Allow admin full access to inquiries"
ON inquiries FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- 10. NEWSLETTER SUBSCRIBERS
-- ============================================================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin to read subscribers" ON newsletter_subscribers;

-- Anyone can subscribe
CREATE POLICY "Allow public to subscribe to newsletter"
ON newsletter_subscribers FOR INSERT TO public WITH CHECK (true);

-- Admins can read all subscribers
CREATE POLICY "Allow admin to read subscribers"
ON newsletter_subscribers FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- ============================================================
-- 11. TRUST STATS (if exists)
-- ============================================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'trust_stats') THEN
    ALTER TABLE trust_stats ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public read access to trust stats" ON trust_stats;
    DROP POLICY IF EXISTS "Allow admin full access to trust stats" ON trust_stats;
    
    CREATE POLICY "Allow public read access to trust stats"
    ON trust_stats FOR SELECT USING (active = true);
    
    CREATE POLICY "Allow admin full access to trust stats"
    ON trust_stats FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
    WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));
  END IF;
END $$;

-- ============================================================
-- 12. PARTNERS (if exists)
-- ============================================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'partners') THEN
    ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public read access to partners" ON partners;
    DROP POLICY IF EXISTS "Allow admin full access to partners" ON partners;
    
    CREATE POLICY "Allow public read access to partners"
    ON partners FOR SELECT USING (active = true);
    
    CREATE POLICY "Allow admin full access to partners"
    ON partners FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
    WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));
  END IF;
END $$;

-- ============================================================
-- VERIFICATION
-- ============================================================
SELECT '========================================' as divider;
SELECT 'RLS FIX COMPLETE!' as status;
SELECT '========================================' as divider;

-- Show RLS status for all tables
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✓ Enabled'
    ELSE '✗ Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'admin_users', 'site_settings', 'tours', 'destinations', 
    'experience_categories', 'hero_images', 'testimonials',
    'bookings', 'inquiries', 'newsletter_subscribers',
    'trust_stats', 'partners'
  )
ORDER BY tablename;

-- Count policies per table
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

SELECT '========================================' as divider;
SELECT 'All tables are now secured with RLS!' as message;
SELECT 'Public users can: read content, create bookings/inquiries' as permissions;
SELECT 'Admin users can: manage all content' as admin_permissions;
SELECT '========================================' as divider;
