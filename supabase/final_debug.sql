-- ============================================================================
-- FINAL DIAGNOSTIC - Find the exact problem
-- ============================================================================

-- 1. What email are you signed in with?
SELECT 
  'Step 1: Your Login Email' as step,
  id as user_id,
  email,
  LOWER(email) as lowercase_email,
  email_confirmed_at
FROM auth.users 
WHERE email ILIKE '%rovafrika%';

-- 2. What emails are in the admin table?
SELECT 
  'Step 2: Admin Emails' as step,
  id as admin_id,
  email,
  LOWER(email) as lowercase_email
FROM admin_users
ORDER BY created_at DESC;

-- 3. Try the EXACT query the dashboard uses (case-insensitive with ilike)
-- Replace 'YOUR_EMAIL_HERE' with the email from Step 1
SELECT 
  'Step 3: Testing Dashboard Query' as step,
  email
FROM admin_users
WHERE email ILIKE 'RovAfrika.safars@gmail.com';

-- 4. Alternative: Check if a match exists using LOWER()
SELECT 
  'Step 4: Lowercase Match Check' as step,
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE LOWER(email) = LOWER('RovAfrika.safars@gmail.com')
    ) 
    THEN '✓ Match Found!' 
    ELSE '✗ No Match' 
  END as result;

-- ============================================================================
-- If Step 3 returns no rows, run this fix:
-- ============================================================================

-- Delete duplicates and add clean version
DELETE FROM admin_users WHERE email ILIKE '%rovafrika%';

INSERT INTO admin_users (email) 
VALUES ('rovafrika.safars@gmail.com')
RETURNING *;
