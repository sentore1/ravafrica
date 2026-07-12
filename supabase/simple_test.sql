-- ============================================================================
-- SIMPLE TEST - Just run this and tell me the results
-- ============================================================================

-- Test 1: Can we read site_settings?
SELECT 
  'TEST 1: Read site_settings' as test,
  COUNT(*) as rows_found,
  CASE 
    WHEN COUNT(*) = 0 THEN '✗ FAILED - No data returned'
    WHEN COUNT(*) = 1 THEN '✓ SUCCESS - Got 1 row'
    ELSE '⚠ Multiple rows found'
  END as status
FROM site_settings;

-- Test 2: Show the data
SELECT 'TEST 2: Show data' as test, * FROM site_settings;

-- Test 3: Check policies
SELECT 
  'TEST 3: Policies' as test,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✗ FAILED - No policies!'
    ELSE '✓ Has policies'
  END as status
FROM pg_policies 
WHERE tablename = 'site_settings';

-- Test 4: Show policy details
SELECT 
  'TEST 4: Policy details' as test,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'site_settings';
