-- ============================================================================
-- Fix Tours RLS
-- ============================================================================

-- Enable RLS on tours
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to tours" ON tours;
DROP POLICY IF EXISTS "Allow admin full access to tours" ON tours;

-- Allow public to read active tours
CREATE POLICY "Allow public read access to tours"
ON tours 
FOR SELECT 
TO public
USING (active = true);

-- Allow admin users full access
CREATE POLICY "Allow admin full access to tours"
ON tours 
FOR ALL 
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- Verify
SELECT 'Tours RLS Policies' as info, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'tours';

-- Test query
SELECT 'Test - Can Read Tours?' as test, COUNT(*) as tours_found FROM tours WHERE active = true;
