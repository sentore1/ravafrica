-- ============================================================================
-- Diagnose Admin Email Mismatch
-- ============================================================================

-- 1. What email are you currently logged in with?
SELECT 
  '1. Your Current Login' as step,
  auth.jwt()->>'email' as your_email,
  LOWER(auth.jwt()->>'email') as lowercase_version;

-- 2. What emails are in the admin_users table?
SELECT 
  '2. Admin Users Table' as step,
  id,
  email,
  LOWER(email) as lowercase_version,
  created_at
FROM admin_users
ORDER BY created_at DESC;

-- 3. Do they match?
SELECT 
  '3. Match Check' as step,
  auth.jwt()->>'email' as your_login_email,
  (SELECT email FROM admin_users LIMIT 1) as admin_table_email,
  CASE 
    WHEN LOWER(auth.jwt()->>'email') = LOWER((SELECT email FROM admin_users LIMIT 1))
    THEN '✓ Emails Match (case-insensitive)'
    ELSE '✗ Emails DO NOT Match'
  END as match_status;

-- 4. Exact comparison
SELECT 
  '4. Detailed Comparison' as step,
  auth.jwt()->>'email' as login_email,
  email as admin_email,
  LOWER(auth.jwt()->>'email') = LOWER(email) as lowercase_match,
  auth.jwt()->>'email' = email as exact_match
FROM admin_users;

-- ============================================================================
-- IF EMAILS DON'T MATCH, RUN THIS FIX:
-- ============================================================================

-- First, show what will be deleted/added:
SELECT 'Preview: Will delete these emails' as action, email FROM admin_users;
SELECT 'Preview: Will add this email' as action, auth.jwt()->>'email' as new_email;

-- Uncomment and run these lines to fix:
-- DELETE FROM admin_users;
-- INSERT INTO admin_users (email) 
-- SELECT auth.jwt()->>'email'
-- RETURNING *;
