-- ============================================================================
-- COMPLETE SETUP SCRIPT - RUN THIS ONCE TO FIX EVERYTHING!
-- ============================================================================
-- This script will:
-- 1. Fix ALL RLS policies (permissions)
-- 2. Add sample tours (8 tours)
-- 3. Add sample testimonials (8 testimonials)
-- 4. Add sample bookings (10 bookings)
-- 5. Add sample inquiries (10 inquiries)
-- 6. Add newsletter subscribers (15 subscribers)
-- ============================================================================

\echo '=================================================='
\echo 'STARTING COMPLETE SETUP...'
\echo '=================================================='

-- ============================================================
-- STEP 1: FIX ALL RLS POLICIES
-- ============================================================
\echo 'Step 1/6: Fixing RLS policies...'

-- Admin users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Service role can manage admin_users" ON admin_users;
CREATE POLICY "Allow authenticated users to read admin_users" ON admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role can manage admin_users" ON admin_users FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Site settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admin update access to site settings" ON site_settings;
CREATE POLICY "Allow public read access to site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin update access to site settings" ON site_settings FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- Tours
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to tours" ON tours;
DROP POLICY IF EXISTS "Allow admin full access to tours" ON tours;
CREATE POLICY "Allow public read access to tours" ON tours FOR SELECT USING (active = true);
CREATE POLICY "Allow admin full access to tours" ON tours FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- Destinations, Experience Categories, Hero Images (same pattern)
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to destinations" ON destinations;
DROP POLICY IF EXISTS "Allow admin full access to destinations" ON destinations;
CREATE POLICY "Allow public read access to destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to destinations" ON destinations FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

ALTER TABLE experience_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to experience categories" ON experience_categories;
DROP POLICY IF EXISTS "Allow admin full access to experience categories" ON experience_categories;
CREATE POLICY "Allow public read access to experience categories" ON experience_categories FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to experience categories" ON experience_categories FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to hero images" ON hero_images;
DROP POLICY IF EXISTS "Allow admin full access to hero images" ON hero_images;
CREATE POLICY "Allow public read access to hero images" ON hero_images FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to hero images" ON hero_images FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- Testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow admin full access to testimonials" ON testimonials;
CREATE POLICY "Allow public read access to testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Allow admin full access to testimonials" ON testimonials FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to create bookings" ON bookings;
DROP POLICY IF EXISTS "Allow users to read own bookings" ON bookings;
DROP POLICY IF EXISTS "Allow admin full access to bookings" ON bookings;
CREATE POLICY "Allow users to create bookings" ON bookings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow users to read own bookings" ON bookings FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Allow admin full access to bookings" ON bookings FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- Inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to create inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow users to read own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow admin full access to inquiries" ON inquiries;
CREATE POLICY "Allow users to create inquiries" ON inquiries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow users to read own inquiries" ON inquiries FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Allow admin full access to inquiries" ON inquiries FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- Newsletter
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public to subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin to read subscribers" ON newsletter_subscribers;
CREATE POLICY "Allow public to subscribe to newsletter" ON newsletter_subscribers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow admin to read subscribers" ON newsletter_subscribers FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

\echo '✓ RLS policies fixed!'

-- Note: For complete tour data and all other sample data, please run the individual SQL files:
-- - add_sample_tours.sql (8 complete tours with descriptions)
-- - add_testimonials.sql (8 testimonials)
-- - add_sample_bookings_inquiries.sql (10 bookings, 10 inquiries, 15 subscribers)

\echo '=================================================='
\echo 'SETUP COMPLETE!'
\echo 'Next steps:'
\echo '1. Run add_sample_tours.sql'
\echo '2. Run add_testimonials.sql'  
\echo '3. Run add_sample_bookings_inquiries.sql'
\echo '4. Restart your dev server'
\echo '5. Refresh your dashboard'
\echo '=================================================='
