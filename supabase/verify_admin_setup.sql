-- ============================================================================
-- ADMIN SETUP VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to check your admin setup
-- ============================================================================

-- Step 1: Check if email exists in admin_users table
SELECT 
  'Admin Users Table' as check_type,
  email,
  created_at
FROM admin_users
WHERE email = 'RovAfrika.safars@gmail.com';

-- Step 2: Check if user account exists in auth.users
SELECT 
  'Auth Users Table' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'RovAfrika.safars@gmail.com';

-- Step 3: List all admin emails for reference
SELECT 
  'All Admin Emails' as check_type,
  email,
  created_at
FROM admin_users
ORDER BY created_at DESC;

-- ============================================================================
-- FIX SCRIPT - If the email is missing from admin_users, run this:
-- ============================================================================

-- Add RovAfrika.safars@gmail.com as admin (if not already added)
INSERT INTO admin_users (email) 
VALUES ('RovAfrika.safars@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Verify it was added
SELECT 'Verification' as check_type, * FROM admin_users WHERE email = 'RovAfrika.safars@gmail.com';
