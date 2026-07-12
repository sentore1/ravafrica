-- ============================================================================
-- Fix Site Settings - Ensure Exactly One Row
-- ============================================================================

-- Step 1: Check how many rows exist
SELECT 
  'Step 1: Row Count' as step,
  COUNT(*) as total_rows,
  CASE 
    WHEN COUNT(*) = 0 THEN '✗ No rows - need to insert'
    WHEN COUNT(*) = 1 THEN '✓ Exactly 1 row (perfect)'
    ELSE '⚠ Multiple rows - need to clean up'
  END as status
FROM site_settings;

-- Step 2: Show all rows
SELECT 
  'Step 2: All Rows' as step,
  id,
  company_name,
  email,
  created_at
FROM site_settings
ORDER BY created_at;

-- Step 3: If multiple rows exist, keep only the most recent one
-- Uncomment these lines if you have multiple rows:

-- DELETE FROM site_settings 
-- WHERE id NOT IN (
--   SELECT id 
--   FROM site_settings 
--   ORDER BY updated_at DESC NULLS LAST, created_at DESC 
--   LIMIT 1
-- );

-- Step 4: If no rows exist, insert default
INSERT INTO site_settings (
  logo_letter, 
  company_name, 
  company_tagline, 
  company_description, 
  phone, 
  email, 
  address
) 
SELECT 
  'R', 
  'RovAfrika Safari Tours', 
  'Rooted in Africa, Guided by Adventures', 
  'East Africa''s premier safari operator, crafting unforgettable wildlife and cultural experiences across Rwanda, Uganda, Kenya, Tanzania, and Burundi since 2009.', 
  '+250-785-519-481', 
  'RovAfrika.safars@gmail.com', 
  'KG 548 St, Kigali, Rwanda'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Step 5: Verify we now have exactly 1 row
SELECT 
  'Step 5: Verification' as step,
  COUNT(*) as total_rows,
  CASE 
    WHEN COUNT(*) = 1 THEN '✓ FIXED - Exactly 1 row'
    ELSE '✗ Still have issues'
  END as status
FROM site_settings;

-- Step 6: Show the final row
SELECT 
  'Step 6: Final Row' as step,
  *
FROM site_settings;
