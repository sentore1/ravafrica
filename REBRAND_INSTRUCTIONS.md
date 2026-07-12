# RovAfrika Rebranding Instructions

## Overview
This guide will help you apply the new RovAfrika Safari Tours branding to your website, including the new color scheme and contact information.

## Changes Made

### 1. Brand Colors (from your logo)
- **Primary Brown**: `#401316` - Main branding elements
- **Orange**: `#d86222` - Accents and call-to-action buttons
- **Rust**: `#953f2a` - Additional accents
- **Dark**: `#24201f` - Text and dark backgrounds
- **White**: `#ffffff` - Light backgrounds

### 2. Company Information
- **Name**: RovAfrika Safari Tours
- **Tagline**: Rooted in Africa, Guided by Adventures
- **Logo Letter**: R (instead of M)
- **Phone**: +250-785-519-481
- **Email**: RovAfrika.safars@gmail.com

## How to Apply Changes

### Option 1: Update Database via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `/supabase/migrations/20240711_rebrand_to_rovafrika.sql`
4. Click "Run" to execute the migration
5. Refresh your website to see the changes

### Option 2: Run Migration via Command Line

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: Manual Update via Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor
2. Find the `site_settings` table
3. Edit the single row and update:
   - `logo_letter`: R
   - `company_name`: RovAfrika Safari Tours
   - `company_tagline`: Rooted in Africa, Guided by Adventures
   - `phone`: +250-785-519-481
   - `email`: RovAfrika.safars@gmail.com
4. Save changes
5. Refresh your website

## Verification

After applying the changes, verify:
- [ ] Website shows "RovAfrika Safari Tours" instead of "Messiah Safari"
- [ ] Colors are brown/orange instead of green/gold
- [ ] Phone number shows +250-785-519-481
- [ ] Email shows RovAfrika.safars@gmail.com
- [ ] Logo letter is "R" instead of "M"
- [ ] Tagline shows "Rooted in Africa, Guided by Adventures"

## Files Updated

### Frontend Components
- `src/app/globals.css` - Color scheme
- `src/app/layout.tsx` - Page metadata
- `src/components/safari-navbar.tsx` - Navigation branding
- `src/components/safari-footer.tsx` - Footer branding
- `src/components/navbar.tsx` - Simple navbar
- `src/app/(public)/about/page.tsx` - About page
- `src/app/(public)/contact/page.tsx` - Contact information
- `src/components/admin-dashboard.tsx` - Admin dashboard

### Database Migrations
- `supabase/migrations/20240207_site_settings.sql` - Updated defaults
- `supabase/migrations/20240203_admin_roles.sql` - Admin email
- `supabase/migrations/20240202_cms_content.sql` - Testimonial
- `supabase/migrations/20240711_rebrand_to_rovafrika.sql` - **NEW** migration to update existing data

## Troubleshooting

### Changes not appearing?
1. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Make sure the database migration ran successfully
3. Check Supabase logs for any errors
4. Restart your development server: `npm run dev`

### Old colors still showing?
- The CSS has been updated. Make sure to restart your development server.
- Hard refresh your browser (Ctrl+Shift+R)

### Database connection issues?
- Check your `.env.local` file has correct Supabase credentials
- Verify Supabase project is running

## Support

If you encounter any issues, check:
1. Supabase Dashboard → Logs
2. Browser Console (F12)
3. Terminal output from your Next.js server

## Next Steps

After successful rebranding:
1. Update any external marketing materials
2. Update social media profiles
3. Inform customers of the new contact information
4. Update email signatures
5. Consider setting up email forwarding from old email to new one
