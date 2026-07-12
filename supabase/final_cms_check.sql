-- ============================================================================
-- Final CMS RLS Check - Run this to verify everything is set up
-- ============================================================================

-- 1. Check RLS is enabled on all tables
SELECT 
  '1. RLS Status' as check_name,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✓ Enabled'
    ELSE '✗ DISABLED - FIX NEEDED!'
  END as rls_status
FROM pg_tables
WHERE tablename IN ('site_settings', 'destinations', 'experience_categories', 'hero_images', 'admin_users')
ORDER BY tablename;

-- 2. Check policies exist for site_settings
SELECT 
  '2. Site Settings Policies' as check_name,
  policyname,
  cmd as operation,
  roles,
  permissive
FROM pg_policies
WHERE tablename = 'site_settings'
ORDER BY policyname;

-- 3. Check if we can read site_settings (this simulates what the app does)
SELECT 
  '3. Site Settings Data Test' as check_name,
  COUNT(*) as row_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✗ NO DATA - Need to insert!'
    WHEN COUNT(*) = 1 THEN '✓ Exactly 1 row (perfect)'
    ELSE '⚠ Multiple rows (might cause issues with .single())'
  END as status
FROM site_settings;

-- 4. Show the actual site_settings data
SELECT 
  '4. Site Settings Content' as check_name,
  id,
  company_name,
  email,
  phone
FROM site_settings;

-- 5. Check admin_users policies
SELECT 
  '5. Admin Users Policies' as check_name,
  policyname,
  cmd as operation,
  roles
FROM pg_policies
WHERE tablename = 'admin_users'
ORDER BY policyname;

-- 6. Show admin users
SELECT 
  '6. Admin Users' as check_name,
  email,
  created_at
FROM admin_users;

-- ============================================================================
-- SUMMARY: What should you see?
-- ============================================================================
-- Check 1: All tables should show "✓ Enabled"
-- Check 2: Should show 2 policies (public read + admin update)
-- Check 3: Should show "✓ Exactly 1 row (perfect)"
-- Check 4: Should show your company data
-- Check 5: Should show at least 1 policy for authenticated users to read
-- Check 6: Should show rovafrika.safars@gmail.com
-- ============================================================================
