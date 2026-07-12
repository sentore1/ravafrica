-- ============================================================================
-- Check Site Settings Table
-- ============================================================================

-- 1. Check if site_settings table exists and has data
SELECT 
  'Step 1: Site Settings Data' as step,
  *
FROM site_settings;

-- 2. Count rows in site_settings
SELECT 
  'Step 2: Row Count' as step,
  COUNT(*) as total_rows
FROM site_settings;

-- 3. Check table structure
SELECT 
  'Step 3: Table Columns' as step,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'site_settings'
ORDER BY ordinal_position;

-- ============================================================================
-- If no data exists, run this to insert default settings:
-- ============================================================================

-- Insert default site settings
INSERT INTO site_settings (
  logo_letter, 
  company_name, 
  company_tagline, 
  company_description, 
  phone, 
  email, 
  address
) VALUES (
  'R', 
  'RovAfrika Safari Tours', 
  'Rooted in Africa, Guided by Adventures', 
  'East Africa''s premier safari operator, crafting unforgettable wildlife and cultural experiences across Rwanda, Uganda, Kenya, Tanzania, and Burundi since 2009.', 
  '+250-785-519-481', 
  'RovAfrika.safars@gmail.com', 
  'KG 548 St, Kigali, Rwanda'
)
ON CONFLICT (id) DO NOTHING
RETURNING *;
