-- Add role column to auth.users metadata
-- Create admin_users table to track admin emails
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert your admin email (CHANGE THIS TO YOUR EMAIL)
INSERT INTO admin_users (email) VALUES ('admin@rovafrika.com')
ON CONFLICT (email) DO NOTHING;
