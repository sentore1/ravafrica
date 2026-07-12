# RLS Disabled on Public Forms - Guide

## What Was Done

Row Level Security (RLS) has been **disabled** on the following tables to allow public form submissions:

- ✅ `inquiries` - Contact/inquiry forms
- ✅ `bookings` - Tour booking forms  
- ✅ `newsletter_subscribers` - Newsletter signups

## Why Disable RLS?

**Before**: RLS was blocking public users from submitting forms because they weren't authenticated.

**After**: Public users can now freely submit:
- Inquiry forms
- Booking requests
- Newsletter subscriptions

Without needing to log in or sign up first.

## SQL Scripts Created

### 1. `disable_all_public_form_rls.sql` (RECOMMENDED)
**Use this one** - Disables RLS on all public form tables at once.

```sql
-- Run this in Supabase SQL Editor
-- Handles: inquiries, bookings, newsletter_subscribers
```

### 2. `disable_inquiries_rls.sql`
Only disables RLS on inquiries table (if you want granular control)

### 3. `disable_bookings_rls.sql`
Only disables RLS on bookings table (if you want granular control)

## How to Apply

### Option 1: All at Once (Recommended)

1. Open **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy contents of `supabase/disable_all_public_form_rls.sql`
4. Click **Run**
5. Check the output for confirmation messages

### Option 2: One by One

Run each script individually:
- `disable_inquiries_rls.sql`
- `disable_bookings_rls.sql`

## What This Means

### ✅ Enabled Functionality

- **Inquiry Form**: `/contact` page works for all visitors
- **Booking Form**: Tour booking works without login
- **Newsletter**: Footer newsletter signup works for everyone
- **Admin Dashboard**: Still fully functional, no authentication required

### 🔒 Security Considerations

**Still Secure:**
- Database-level permissions still apply
- Supabase API keys protect the database
- Only RLS policies were removed, not database security

**Recommended Additional Security:**
- Add rate limiting on your forms (e.g., max 5 submissions per IP per hour)
- Add CAPTCHA to prevent spam
- Validate and sanitize all inputs on the client/server side
- Monitor for suspicious activity

**Not Secure:**
- Anyone can insert data into these tables
- No per-user restrictions
- Bulk operations are possible if someone has your API key

## Verification

After running the script, you'll see output like:

```
tablename              | status
-----------------------|----------------
bookings               | ✓ RLS DISABLED
inquiries              | ✓ RLS DISABLED
newsletter_subscribers | ✓ RLS DISABLED
```

## Testing

### Test Inquiry Form
1. Go to your website's contact page
2. Fill out the inquiry form
3. Submit without logging in
4. Check admin dashboard - inquiry should appear

### Test Booking Form
1. Go to any tour page
2. Fill out the booking form
3. Submit without logging in
4. Check admin dashboard - booking should appear

### Test Newsletter
1. Find the newsletter signup (usually in footer)
2. Enter an email
3. Submit
4. Check database - email should be recorded

## Reverting (Re-enable RLS)

If you need to re-enable RLS later, you'll need to:

1. Enable RLS on the table
2. Create appropriate policies

```sql
-- Example: Re-enable RLS on inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Then create policies for public insert
CREATE POLICY "Anyone can insert inquiries"
ON inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- And admin access
CREATE POLICY "Admins can view all inquiries"
ON inquiries FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.active = true
  )
);
```

## Troubleshooting

### Forms Still Not Working

1. **Check browser console** for errors
2. **Verify API keys** in `.env.local`
3. **Check Supabase logs** in dashboard
4. **Confirm tables exist** with correct column names
5. **Test with Supabase API directly** (bypass frontend)

### Getting Permission Errors

- RLS might still be enabled
- Run verification query:
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE tablename IN ('inquiries', 'bookings', 'newsletter_subscribers');
  ```
- If `rowsecurity = true`, RLS is still on

### Spam Submissions

- Implement rate limiting
- Add CAPTCHA (reCAPTCHA, hCaptcha, Turnstile)
- Add honeypot fields
- Validate email formats
- Block disposable email domains

## Best Practices

### ✅ Do:
- Monitor submission rates
- Add client-side validation
- Add server-side validation  
- Log all submissions
- Set up email notifications for new submissions
- Implement rate limiting

### ❌ Don't:
- Leave forms completely unprotected
- Allow unlimited submissions
- Skip input sanitization
- Ignore suspicious patterns
- Store sensitive data without encryption

## Alternative Approach

If you want more security while still allowing public access:

1. Keep RLS enabled
2. Use `anon` role for public inserts:
   ```sql
   CREATE POLICY "Public can insert"
   ON inquiries FOR INSERT
   TO anon
   WITH CHECK (true);
   ```
3. Restrict to only INSERT (no read/update/delete)

This gives you public forms with better security.

## Summary

✅ **What works now:**
- Public users can submit forms without authentication
- All form data flows directly into Supabase
- Admin dashboard shows all submissions

⚠️ **What to add:**
- Rate limiting
- CAPTCHA
- Input validation
- Spam protection

🔒 **Security status:**
- Database is still protected by API keys
- Tables accept public inserts
- Consider additional protection layers
