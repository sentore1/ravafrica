-- ============================================================================
-- Complete Admin Access Fix
-- ============================================================================

-- Step 1: Show current state
SELECT '=== CURRENT STATE ===' as status;

SELECT 'Admin Users:' as info, email FROM admin_users;

-- Step 2: Ensure RLS is properly configured on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow authenticated users to read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Service role can manage admin_users" ON admin_users;

-- Step 4: Create policy to allow authenticated users to check if they're admin
-- This is CRITICAL for the dashboard to work
CREATE POLICY "Allow authenticated users to read admin_users"
ON admin_users
FOR SELECT
TO authenticated
USING (true);

-- This allows the service role (server-side) to manage admins
CREATE POLICY "Service role can manage admin_users"
ON admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 5: Ensure the correct admin email exists
-- First, let's see what we have
SELECT '=== BEFORE CLEANUP ===' as status;
SELECT * FROM admin_users;

-- Clean up any duplicates or wrong emails
DELETE FROM admin_users WHERE LOWER(email) NOT IN ('rovafrika.safars@gmail.com');

-- Insert the correct admin email if it doesn't exist
INSERT INTO admin_users (email)
SELECT 'rovafrika.safars@gmail.com'
WHERE NOT EXISTS (
  SELECT 1 FROM admin_users 
  WHERE LOWER(email) = 'rovafrika.safars@gmail.com'
);

-- Step 6: Verify the fix
SELECT '=== AFTER FIX ===' as status;

SELECT 
  'Admin Users Table:' as info,
  id,
  email,
  created_at
FROM admin_users;

SELECT 
  'RLS Policies:' as info,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'admin_users';

-- Step 7: Test the query that the dashboard uses
SELECT 
  'Dashboard Query Test:' as info,
  *
FROM admin_users
WHERE email ILIKE 'rovafrika.safars@gmail.com';

SELECT '=== FIX COMPLETE ===' as status;
SELECT 'Now restart your dev server and try logging in again!' as next_step;
