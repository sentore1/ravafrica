-- ============================================================================
-- Fix Site Settings RLS Policies
-- ============================================================================

-- Enable RLS on site_settings if not already enabled
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow admin update access to site settings" ON site_settings;

-- Allow anyone (including authenticated users) to read site settings
CREATE POLICY "Allow public read access to site settings"
ON site_settings
FOR SELECT
TO public
USING (true);

-- Allow admin users to update site settings
CREATE POLICY "Allow admin update access to site settings"
ON site_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')
  )
);

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'site_settings';
