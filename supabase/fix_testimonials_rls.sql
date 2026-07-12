-- ============================================================================
-- Fix Testimonials RLS
-- ============================================================================

-- Enable RLS on testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow admin full access to testimonials" ON testimonials;

-- Allow public to read active testimonials
CREATE POLICY "Allow public read access to testimonials"
ON testimonials 
FOR SELECT 
TO public
USING (active = true);

-- Allow admin users full access
CREATE POLICY "Allow admin full access to testimonials"
ON testimonials 
FOR ALL 
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')))
WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE LOWER(admin_users.email) = LOWER(auth.jwt()->>'email')));

-- Verify
SELECT 'Testimonials RLS Policies' as info, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'testimonials';
