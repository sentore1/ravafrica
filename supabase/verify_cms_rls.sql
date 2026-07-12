-- ============================================================================
-- Verify CMS RLS Policies Are Set Up
-- ============================================================================

-- Check what policies exist on CMS tables
SELECT 
  tablename,
  policyname,
  cmd as operation,
  roles,
  CASE 
    WHEN qual IS NOT NULL THEN 'Has USING clause'
    ELSE 'No USING clause'
  END as using_check,
  CASE 
    WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
    ELSE 'No WITH CHECK clause'
  END as with_check_check
FROM pg_policies
WHERE tablename IN ('site_settings', 'destinations', 'experience_categories', 'hero_images')
ORDER BY tablename, policyname;

-- Check if RLS is enabled on these tables
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✓ RLS Enabled'
    ELSE '✗ RLS Disabled'
  END as rls_status
FROM pg_tables
WHERE tablename IN ('site_settings', 'destinations', 'experience_categories', 'hero_images')
ORDER BY tablename;
