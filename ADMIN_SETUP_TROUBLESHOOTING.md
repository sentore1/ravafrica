# Admin Access Troubleshooting Guide

## Problem: Can't Access Dashboard with RovAfrika.safars@gmail.com

### Step-by-Step Solution

---

## Step 1: Verify Email in Admin Users Table

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `anvtbcweykeotdllpsht`
3. Click **SQL Editor** → **New query**
4. Run this query:

```sql
SELECT * FROM admin_users WHERE email = 'RovAfrika.safars@gmail.com';
```

**Expected Result:** You should see one row with the email

**If Empty:** The email is not in the admin_users table. Run this:

```sql
INSERT INTO admin_users (email) 
VALUES ('RovAfrika.safars@gmail.com')
ON CONFLICT (email) DO NOTHING;
```

---

## Step 2: Check if User Account Exists

Run this query in Supabase SQL Editor:

```sql
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'RovAfrika.safars@gmail.com';
```

**If Empty:** You haven't created an account yet. Follow Step 3 below.

**If email_confirmed_at is NULL:** You need to verify your email. Check your inbox for the verification link.

---

## Step 3: Create Account (If Not Created)

1. **Go to**: `http://localhost:3000/sign-up`

2. **Fill in the form**:
   - Full Name: `RovAfrika Admin` (or any name)
   - Email: `RovAfrika.safars@gmail.com`
   - Password: Create a strong password

3. **Click "Sign up"**

4. **Check your email** at RovAfrika.safars@gmail.com

5. **Click the verification link** in the email from Supabase

---

## Step 4: Verify Email (If Not Verified)

If you already signed up but didn't verify:

1. Check your email inbox for `RovAfrika.safars@gmail.com`
2. Look for an email from Supabase with subject like "Confirm Your Email"
3. Click the link in that email
4. You'll be redirected to your site

**If you can't find the verification email:**

Run this in Supabase SQL Editor to manually verify:

```sql
-- MANUAL EMAIL VERIFICATION (use with caution)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'RovAfrika.safars@gmail.com';
```

---

## Step 5: Sign In and Access Dashboard

1. **Go to**: `http://localhost:3000/sign-in`

2. **Enter**:
   - Email: `RovAfrika.safars@gmail.com`
   - Password: Your password

3. **Click "Sign in"**

4. You should be automatically redirected to `/dashboard`

---

## Common Issues and Solutions

### Issue 1: "Access Denied" on Dashboard

**Cause:** Email not in admin_users table

**Solution:** Run this SQL:
```sql
INSERT INTO admin_users (email) 
VALUES ('RovAfrika.safars@gmail.com')
ON CONFLICT (email) DO NOTHING;
```

### Issue 2: Redirected to Sign In Page

**Cause:** Not logged in or session expired

**Solution:** 
1. Clear browser cookies
2. Sign in again at `/sign-in`

### Issue 3: "Invalid Credentials" When Signing In

**Cause:** Wrong password or account doesn't exist

**Solution:** 
1. Try "Forgot Password" link
2. Or create a new account at `/sign-up`

### Issue 4: Email Not Verified

**Cause:** Didn't click verification link

**Solution:** 
1. Check spam folder
2. Or manually verify with SQL (see Step 4)

---

## Quick Verification Script

Run this complete script in Supabase SQL Editor:

```sql
-- Check admin status
SELECT 
  (SELECT COUNT(*) FROM admin_users WHERE email = 'RovAfrika.safars@gmail.com') as in_admin_table,
  (SELECT COUNT(*) FROM auth.users WHERE email = 'RovAfrika.safars@gmail.com') as account_exists,
  (SELECT email_confirmed_at FROM auth.users WHERE email = 'RovAfrika.safars@gmail.com') as email_verified;

-- If any value is 0 or NULL, there's an issue
```

**Interpretation:**
- `in_admin_table`: Should be 1 (email is in admin list)
- `account_exists`: Should be 1 (account was created)
- `email_verified`: Should have a timestamp (email was verified)

---

## Still Having Issues?

If you've followed all steps and still can't access:

1. **Check browser console** (F12) for any errors
2. **Check Supabase logs** in your dashboard
3. **Verify environment variables** in `.env.local`:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. **Restart your development server**: 
   ```bash
   npm run dev
   ```

---

## Test Everything Works

Once you have access, test these features:
- ✅ View bookings
- ✅ Manage inquiries  
- ✅ Edit tours
- ✅ Update CMS settings
- ✅ Sign out and sign back in

---

## Security Note

Never share:
- Your admin password
- Your Supabase service key
- Your .env.local file
