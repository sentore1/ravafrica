-- Disable RLS on inquiries table to allow unrestricted access
-- This allows public users to submit inquiries without authentication

-- First, drop all existing policies on inquiries
DROP POLICY IF EXISTS "Public can insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Public can view own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin can view all inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin can update inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin can delete inquiries" ON inquiries;
DROP POLICY IF EXISTS "Anyone can insert" ON inquiries;
DROP POLICY IF EXISTS "Admins can view all" ON inquiries;
DROP POLICY IF EXISTS "Admins can update" ON inquiries;

-- Disable RLS on the inquiries table
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'inquiries';

-- Show message
DO $$
BEGIN
  RAISE NOTICE 'RLS has been disabled on the inquiries table';
  RAISE NOTICE 'Public users can now insert inquiries without authentication';
  RAISE NOTICE 'Admins can view, update, and delete all inquiries without restrictions';
END $$;
