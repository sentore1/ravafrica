# CMS Settings Debug Checklist

## Current Status
Looking at your screenshot, the Site Settings section shows:
> "Click 'Edit' to load and modify site settings"

This means `settings` state is still `null` after the useEffect runs.

## What to Check Now:

### 1. Open Browser DevTools Console
Press **F12** → Go to **Console** tab

Look for these messages when you:
- First load the CMS tab
- Click the "Edit" button

You should see:
```
Fetching CMS data as user: rovafrika.safars@gmail.com
Settings data: { id: '...', company_name: 'RovAfrika Safari Tours', ... }
Destinations count: X
Experiences count: Y
Hero images count: Z
```

### 2. If you see errors instead:

#### Error: "Failed to load settings: ..."
- The RLS policy is still blocking the query
- Solution: Run the SQL fix again (make sure it completed successfully)

#### Error: "Settings error: {}"
- Empty error object means RLS is blocking
- Solution: Verify policies exist with this SQL:
```sql
SELECT * FROM pg_policies WHERE tablename = 'site_settings';
```

#### Console shows: "Settings data: null"
- Query returned no data
- Solution: Check if data exists:
```sql
SELECT * FROM site_settings;
```

### 3. Network Tab Check

In DevTools:
1. Go to **Network** tab
2. Filter by **Fetch/XHR**
3. Click "Edit" button
4. Look for a request to Supabase
5. Click on it and check:
   - **Headers** → What's the request URL?
   - **Response** → What data came back?
   - **Status** → Should be 200, not 401 or 403

### 4. Verify Database Setup

Run this in Supabase SQL Editor:

```sql
-- Check everything is set up correctly
SELECT 'Data exists?' as check, COUNT(*) FROM site_settings;
SELECT 'RLS enabled?' as check, rowsecurity FROM pg_tables WHERE tablename = 'site_settings';
SELECT 'Policies exist?' as check, COUNT(*) FROM pg_policies WHERE tablename = 'site_settings';

-- Test the actual query
SELECT * FROM site_settings;
```

Expected output:
- Data exists? → 1
- RLS enabled? → true
- Policies exist? → 2 (or more)
- Last query should return your company data

### 5. Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| RLS blocking | Error or null data | Run `final_fix_all_issues.sql` |
| Multiple rows | ".single() error" | Already fixed with `.maybeSingle()` |
| No data | null returned | Insert data with migration |
| Wrong env key | 401 errors | Already fixed `.env.local` |
| Cache issues | Old behavior | Hard refresh (Ctrl+Shift+R) |
| Server not restarted | Changes not applied | Stop and restart `npm run dev` |

### 6. Step-by-Step Fresh Start

If nothing works, do a complete reset:

**Step A: Fresh SQL setup**
```sql
-- Run in Supabase SQL Editor
DROP POLICY IF EXISTS "Allow public read access to site settings" ON site_settings;

CREATE POLICY "Allow public read access to site settings"
ON site_settings FOR SELECT TO public USING (true);

-- Verify
SELECT * FROM site_settings;
```

**Step B: Clear everything**
```bash
# In terminal
# Stop the server
# Delete .next folder
rm -rf .next
# Start fresh
npm run dev
```

**Step C: Clear browser**
- Close all browser tabs
- Clear cache (Ctrl+Shift+Delete → Clear browsing data)
- Open fresh incognito window
- Go to dashboard

### 7. What Should Happen (When Working)

When you click "Edit":
1. Button shows "Loading..." for a moment
2. Form appears with all fields populated
3. Console shows successful data fetch
4. No errors in console

## Next Steps for You

**RIGHT NOW:**
1. Open browser console (F12)
2. Go to CMS tab (should auto-load data)
3. Screenshot what's in the console
4. Share that with me

This will tell us exactly what's failing!
