-- ============================================================================
-- Check Admin Users Table and RLS
-- ============================================================================

-- 1. Show all admin users
SELECT 
  '1. All Admin Users' as step,
  id,
  email,
  created_at
FROM admin_users
ORDER BY created_at DESC;

-- 2. Check if RLS is enabled
SELECT 
  '2. RLS Status' as step,
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✓ RLS Enabled'
    ELSE '✗ RLS Disabled'
  END as rls_status
FROM pg_tables
WHERE tablename = 'admin_users';

-- 3. Show RLS policies on admin_users
SELECT 
  '3. Admin Users Policies' as step,
  policyname,
  cmd as operation,
  roles,
  permissive
FROM pg_policies
WHERE tablename = 'admin_users'
ORDER BY policyname;

-- 4. Test if you can query admin_users with a known email
SELECT 
  '4. Test Query (case-insensitive)' as step,
  *
FROM admin_users
WHERE email ILIKE 'rovafrika.safars@gmail.com';

-- 5. Test with LOWER() function
SELECT 
  '5. Test Query (with LOWER)' as step,
  *
FROM admin_users
WHERE LOWER(email) = LOWER('rovafrika.safars@gmail.com');
