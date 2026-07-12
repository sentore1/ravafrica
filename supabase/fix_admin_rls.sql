-- ============================================================================
-- FIX ADMIN ACCESS - Row Level Security Issue
-- ============================================================================

-- 1. Check if RLS is enabled on admin_users table
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'admin_users';

-- 2. Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'admin_users';

-- ============================================================================
-- FIX: Disable RLS or add proper policy
-- ============================================================================

-- Option 1: Disable RLS (simplest for admin table)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Option 2: Or create a policy that allows service role to read
CREATE POLICY "Allow service role to read admin_users"
ON admin_users
FOR SELECT
TO service_role
USING (true);

-- Option 3: Allow authenticated users to check if they're admin
CREATE POLICY "Allow users to check their own admin status"
ON admin_users
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Test the query that the dashboard uses
SELECT email 
FROM admin_users 
WHERE LOWER(email) = LOWER('rovafrika.safars@gmail.com');

-- List all admin emails
SELECT * FROM admin_users;
