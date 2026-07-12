-- ============================================================================
-- DEBUG ADMIN ACCESS ISSUE
-- Run this to find the exact problem
-- ============================================================================

-- 1. Check what email you're signed in with (from auth.users)
SELECT 
  'Your Account Email' as info,
  email,
  email_confirmed_at
FROM auth.users 
WHERE email ILIKE '%rovafrika%';

-- 2. Check what emails are in admin_users table
SELECT 
  'Admin Emails in Database' as info,
  email
FROM admin_users;

-- 3. Check if there's an EXACT match (case-sensitive)
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM admin_users a
      JOIN auth.users u ON a.email = u.email
      WHERE u.email ILIKE '%rovafrika%'
    ) 
    THEN 'MATCH FOUND - Should work!' 
    ELSE 'NO MATCH - Case mismatch issue!'
  END as result;

-- ============================================================================
-- FIX: Add both case variations to admin_users
-- ============================================================================

INSERT INTO admin_users (email) 
VALUES 
  ('RovAfrika.safars@gmail.com'),
  ('rovafrika.safars@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Verify both are now in the table
SELECT * FROM admin_users WHERE email ILIKE '%rovafrika%';
