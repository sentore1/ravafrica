# CMS Settings Troubleshooting Guide

## Issue: Site Settings not loading/working in Admin Dashboard

### Quick Fixes (Try these first)

1. **Restart your dev server** after the .env.local change:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Run the RLS policy fix** in your Supabase SQL Editor:
   - Go to: https://anvtbcweykeotdllpsht.supabase.co/project/anvtbcweykeotdllpsht/sql
   - Open and run: `supabase/fix_all_cms_rls.sql`

3. **Check if site_settings has data**:
   - Go to: https://anvtbcweykeotdllpsht.supabase.co/project/anvtbcweykeotdllpsht/editor
   - Run the SQL from: `supabase/check_site_settings.sql`
   - If no data exists, run the INSERT statement at the bottom of that file

4. **Clear your browser cache and reload**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito/private window

### What Was Fixed

#### 1. Environment Variable Fix
**Problem**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` was using the service role key instead of the anon key.

**Fixed**: Updated `.env.local` to use the correct anon key.

**Why it matters**: Using the wrong key can cause authentication and permission issues.

#### 2. Added Error Handling
**Problem**: `fetchCMSData()` had no error handling, failing silently.

**Fixed**: Added try-catch blocks and console logging to show what's failing.

#### 3. Added Loading States
**Problem**: No feedback when clicking "Edit" button.

**Fixed**: Button now shows "Loading..." while fetching data.

#### 4. RLS Policies Missing
**Problem**: The CMS tables (site_settings, destinations, experience_categories, hero_images) had no Row Level Security policies.

**Fixed**: Created `fix_all_cms_rls.sql` with proper policies:
- Public can read all CMS content
- Admin users can update/modify content

### Debugging Steps

If the quick fixes don't work, follow these steps:

#### Step 1: Check Browser Console
1. Open your admin dashboard
2. Open browser DevTools (F12)
3. Go to Console tab
4. Click "Edit" in Site Settings
5. Look for error messages

Common errors:
- `Failed to load settings: ...` - Check RLS policies
- `permission denied` - Run the RLS fix script
- `null` or `undefined` - Table might be empty

#### Step 2: Verify Database Connection
Open the check script in Supabase SQL Editor:
```sql
-- Run this in Supabase SQL Editor
SELECT 'Connected!' as status;
```

#### Step 3: Check Site Settings Data
Run the full check from `supabase/check_site_settings.sql`

Expected output:
- Step 1: Should show at least 1 row with company data
- Step 2: Should show `total_rows >= 1`
- Step 3: Should show all columns (id, logo_letter, company_name, etc.)

#### Step 4: Verify RLS Policies
Run this in SQL Editor:
```sql
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('site_settings', 'destinations', 'experience_categories', 'hero_images')
ORDER BY tablename, policyname;
```

Expected: You should see at least 2 policies per table (one for SELECT, one for UPDATE/ALL)

#### Step 5: Test the Query Directly
Run this in SQL Editor:
```sql
SELECT * FROM site_settings;
```

If this fails with "permission denied", run `fix_all_cms_rls.sql`

### Common Issues and Solutions

#### Issue: "Failed to load settings: new row violates row-level security policy"
**Solution**: Run `fix_all_cms_rls.sql` to add proper RLS policies

#### Issue: "Cannot read properties of null (reading 'id')"
**Solution**: This was the original error, now fixed with null checks in the code

#### Issue: Blank form when clicking Edit
**Solution**: 
1. Check browser console for errors
2. Verify data exists in site_settings table
3. Ensure RLS policies allow SELECT

#### Issue: Can't save changes
**Solution**:
1. Verify you're logged in with an admin email
2. Check that your email exists in `admin_users` table
3. Run the admin setup query if needed

### Files Created/Modified

**New Files**:
- `supabase/check_site_settings.sql` - Diagnostic queries
- `supabase/fix_site_settings_rls.sql` - RLS fix for site_settings only
- `supabase/fix_all_cms_rls.sql` - RLS fix for all CMS tables
- `CMS_TROUBLESHOOTING.md` - This file

**Modified Files**:
- `.env.local` - Fixed NEXT_PUBLIC_SUPABASE_ANON_KEY
- `src/components/admin-dashboard.tsx` - Added error handling, loading states, null checks

### Testing Checklist

After applying fixes, test the following:

- [ ] Can access admin dashboard
- [ ] Can click CMS tab
- [ ] Can click "Edit" on Site Settings (should show loading state)
- [ ] Edit form displays with current values
- [ ] Can modify values in the form
- [ ] Can click "Save" successfully
- [ ] Can click "Cancel" to exit edit mode
- [ ] Changes persist after refresh

### Need More Help?

1. Run all the diagnostic scripts in order
2. Copy error messages from browser console
3. Check the Supabase logs at: https://anvtbcweykeotdllpsht.supabase.co/project/anvtbcweykeotdllpsht/logs/explorer

### Quick Reference: Important URLs

- **Supabase Dashboard**: https://anvtbcweykeotdllpsht.supabase.co/project/anvtbcweykeotdllpsht
- **SQL Editor**: https://anvtbcweykeotdllpsht.supabase.co/project/anvtbcweykeotdllpsht/sql
- **Table Editor**: https://anvtbcweykeotdllpsht.supabase.co/project/anvtbcweykeotdllpsht/editor
- **Logs**: https://anvtbcweykeotdllpsht.supabase.co/project/anvtbcweykeotdllpsht/logs/explorer
