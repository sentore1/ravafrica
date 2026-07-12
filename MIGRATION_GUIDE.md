# Supabase Migration Guide

## Overview
This guide will help you set up your new Supabase database with all the necessary tables and data for your East Africa Safari platform.

## Steps to Run the Migration

### 1. Access Your Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project (or create a new one if you haven't already)

### 2. Run the Migration SQL
1. In your Supabase dashboard, click on the **SQL Editor** in the left sidebar
2. Click on **New Query**
3. Open the file: `e:\ravafrica\supabase\combined_migration.sql`
4. Copy the ENTIRE contents of the file
5. Paste it into the SQL Editor in Supabase
6. Click **RUN** button (or press Ctrl+Enter)

### 3. Verify the Migration
After running the migration, verify everything was created:

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `users`
   - `tours`
   - `destinations`
   - `destination_attractions`
   - `bookings`
   - `inquiries`
   - `newsletter_subscribers`
   - `hero_content`
   - `hero_stats`
   - `hero_images`
   - `testimonials`
   - `trust_stats`
   - `partners`
   - `experience_categories`
   - `site_settings`
   - `admin_users`

### 4. Update Admin Email
1. In the SQL Editor, run this command (replace with your actual email):
```sql
UPDATE admin_users SET email = 'your-email@example.com' WHERE email = 'admin@rovafrika.com';
```

### 5. Get Your Supabase Credentials
1. Click on **Project Settings** (gear icon) in the left sidebar
2. Click on **API** tab
3. Copy these values to update your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Key (anon public)** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 6. Update Your .env.local File
Update your `.env.local` file with the credentials from step 5:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## What Was Created

### Database Tables
- **Authentication**: User management with automatic profile creation
- **Tours**: Safari packages with detailed itineraries
- **Destinations**: 5 East African countries (Rwanda, Uganda, Kenya, Tanzania, Burundi)
- **Bookings & Inquiries**: Customer booking and inquiry management
- **CMS Content**: Hero sections, testimonials, stats, partners
- **Site Settings**: Company information and contact details

### Sample Data Included
- ✅ 5 destinations with full descriptions
- ✅ 6 sample tours
- ✅ 4 testimonials
- ✅ Hero content and stats
- ✅ Experience categories
- ✅ Site settings

### Security Features
- ✅ Row Level Security (RLS) enabled on users table
- ✅ Automatic user profile creation on signup
- ✅ Admin role management
- ✅ Storage bucket policies for image uploads

## Troubleshooting

### If you get an error about existing tables:
The migration uses `CREATE TABLE IF NOT EXISTS` and `INSERT ... ON CONFLICT DO NOTHING`, so it should be safe to run multiple times.

### If storage bucket already exists:
The migration uses `ON CONFLICT (id) DO NOTHING` for the storage bucket, so it won't error if it already exists.

### If policies already exist:
The migration checks for existing policies before creating them using `DO $$ BEGIN IF NOT EXISTS...` blocks.

## Next Steps

1. ✅ Run the migration
2. ✅ Update admin email
3. ✅ Update .env.local with your Supabase credentials
4. ✅ Test authentication by signing up
5. ✅ Start your development server: `npm run dev`
6. ✅ Visit your site and explore!

## Support

If you encounter any issues:
1. Check the Supabase SQL Editor for error messages
2. Verify your credentials in .env.local
3. Check the browser console for any frontend errors
4. Refer to CMS_SETUP.md for content management instructions
