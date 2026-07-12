-- Disable RLS on bookings table to allow unrestricted access
-- This allows public users to submit bookings without authentication

-- First, drop all existing policies on bookings
DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Public can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can insert" ON bookings;
DROP POLICY IF EXISTS "Admins can view all" ON bookings;
DROP POLICY IF EXISTS "Admins can update" ON bookings;

-- Disable RLS on the bookings table
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'bookings';

-- Show message
DO $$
BEGIN
  RAISE NOTICE 'RLS has been disabled on the bookings table';
  RAISE NOTICE 'Public users can now insert bookings without authentication';
  RAISE NOTICE 'Admins can view, update, and delete all bookings without restrictions';
END $$;
