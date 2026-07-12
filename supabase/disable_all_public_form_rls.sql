-- =====================================================
-- DISABLE RLS ON ALL PUBLIC-FACING FORM TABLES
-- =====================================================
-- This script removes Row Level Security from tables that
-- need to accept data from public (unauthenticated) users
-- =====================================================

-- 1. INQUIRIES TABLE
-- Drop all existing policies
DROP POLICY IF EXISTS "Public can insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Public can view own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin can view all inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin can update inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin can delete inquiries" ON inquiries;
DROP POLICY IF EXISTS "Anyone can insert" ON inquiries;
DROP POLICY IF EXISTS "Admins can view all" ON inquiries;
DROP POLICY IF EXISTS "Admins can update" ON inquiries;

-- Disable RLS
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;

RAISE NOTICE '✓ RLS disabled on inquiries table';

-- 2. BOOKINGS TABLE
-- Drop all existing policies
DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Public can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can insert" ON bookings;
DROP POLICY IF EXISTS "Admins can view all" ON bookings;
DROP POLICY IF EXISTS "Admins can update" ON bookings;

-- Disable RLS
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

RAISE NOTICE '✓ RLS disabled on bookings table';

-- 3. NEWSLETTER_SUBSCRIBERS TABLE (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'newsletter_subscribers') THEN
    -- Drop policies
    EXECUTE 'DROP POLICY IF EXISTS "Public can insert subscribers" ON newsletter_subscribers';
    EXECUTE 'DROP POLICY IF EXISTS "Admin can view all subscribers" ON newsletter_subscribers';
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can insert" ON newsletter_subscribers';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all" ON newsletter_subscribers';
    
    -- Disable RLS
    EXECUTE 'ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY';
    
    RAISE NOTICE '✓ RLS disabled on newsletter_subscribers table';
  END IF;
END $$;

-- 4. VERIFY ALL CHANGES
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '❌ RLS ENABLED'
    ELSE '✓ RLS DISABLED'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('inquiries', 'bookings', 'newsletter_subscribers')
ORDER BY tablename;

-- Final message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS DISABLED ON PUBLIC FORM TABLES';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'The following tables now accept data from anyone:';
  RAISE NOTICE '  • inquiries';
  RAISE NOTICE '  • bookings';
  RAISE NOTICE '  • newsletter_subscribers (if exists)';
  RAISE NOTICE '';
  RAISE NOTICE 'This allows public users to:';
  RAISE NOTICE '  ✓ Submit inquiry forms';
  RAISE NOTICE '  ✓ Submit booking forms';
  RAISE NOTICE '  ✓ Subscribe to newsletter';
  RAISE NOTICE '';
  RAISE NOTICE 'Security Note:';
  RAISE NOTICE '  - These tables still have database-level security';
  RAISE NOTICE '  - Only RLS policies have been removed';
  RAISE NOTICE '  - Consider adding rate limiting at application level';
  RAISE NOTICE '========================================';
END $$;
