-- ============================================================================
-- Test CMS Access - Run this while logged in as admin
-- ============================================================================

-- First, check what policies exist
SELECT 
  tablename,
  policyname,
  cmd as operation,
  roles
FROM pg_policies
WHERE tablename IN ('site_settings', 'destinations', 'experience_categories', 'hero_images')
ORDER BY tablename, policyname;

-- Test if you can read site_settings (this should work for everyone)
SELECT 'Testing site_settings SELECT' as test;
SELECT * FROM site_settings;

-- Test if you can read destinations (this should work for everyone)
SELECT 'Testing destinations SELECT' as test;
SELECT * FROM destinations LIMIT 5;

-- Test if you can read experience_categories (this should work for everyone)
SELECT 'Testing experience_categories SELECT' as test;
SELECT * FROM experience_categories LIMIT 5;

-- Test if you can read hero_images (this should work for everyone)
SELECT 'Testing hero_images SELECT' as test;
SELECT * FROM hero_images LIMIT 5;

-- Check current authenticated user
SELECT 
  'Current User Info' as test,
  auth.uid() as user_id,
  auth.jwt()->>'email' as email,
  auth.role() as role;

-- Check if you're in admin_users table
SELECT 
  'Admin Check' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM admin_users 
      WHERE LOWER(email) = LOWER(auth.jwt()->>'email')
    ) 
    THEN '✓ You are an admin'
    ELSE '✗ You are NOT an admin'
  END as admin_status;
