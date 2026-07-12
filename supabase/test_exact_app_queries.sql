-- ============================================================================
-- Test Exact Queries That The App Uses
-- ============================================================================
-- Run these in order and check which one fails

-- These queries simulate what happens when you click "Edit" in the dashboard

-- Query 1: Get site_settings (this is what .single() does internally)
DO $$ 
BEGIN
  RAISE NOTICE '=== TEST 1: site_settings ===';
END $$;

SELECT * FROM site_settings LIMIT 2;
-- Expected: Should return 1 row with company data
-- If 0 rows: RLS policy is blocking you
-- If 2+ rows: .single() will fail (it expects exactly 1)

-- Query 2: Get destinations
DO $$ 
BEGIN
  RAISE NOTICE '=== TEST 2: destinations ===';
END $$;

SELECT * FROM destinations ORDER BY display_order LIMIT 5;
-- Expected: Should return your destinations
-- If error or 0 rows: RLS policy issue

-- Query 3: Get experience_categories
DO $$ 
BEGIN
  RAISE NOTICE '=== TEST 3: experience_categories ===';
END $$;

SELECT * FROM experience_categories ORDER BY display_order LIMIT 5;
-- Expected: Should return your experience categories

-- Query 4: Get hero_images
DO $$ 
BEGIN
  RAISE NOTICE '=== TEST 4: hero_images ===';
END $$;

SELECT * FROM hero_images ORDER BY display_order LIMIT 5;
-- Expected: Should return your hero images

-- ============================================================================
-- If ANY of these queries return 0 rows or error, you need to:
-- 1. Run fix_all_cms_rls.sql
-- 2. Make sure you have data in the tables
-- ============================================================================
