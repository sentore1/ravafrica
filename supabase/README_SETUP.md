# Complete Database Setup Guide

## 🚀 Quick Start (Run These 4 SQL Files in Order)

Go to your Supabase SQL Editor: https://anvtbcweykeotdllpsht.supabase.co/project/anvtbcweykeotdllpsht/sql

### Step 1: Fix All RLS Policies (Permissions)
**File:** `fix_all_rls_complete.sql`
**Purpose:** Fixes permissions for all tables so data can be read/written correctly
**Time:** ~5 seconds

### Step 2: Add Sample Tours
**File:** `add_sample_tours.sql`
**Purpose:** Adds 8 complete tour packages (Gorilla Trekking, Big Five Safari, etc.)
**Time:** ~2 seconds

### Step 3: Add Sample Testimonials
**File:** `add_testimonials.sql`
**Purpose:** Adds 8 customer testimonials with ratings
**Time:** ~2 seconds

### Step 4: Add Bookings & Inquiries
**File:** `add_sample_bookings_inquiries.sql`
**Purpose:** Adds 10 bookings, 10 inquiries, and 15 newsletter subscribers
**Time:** ~3 seconds

---

## ✅ After Running All Scripts

### Restart Your Dev Server
```bash
# Stop the server (Ctrl+C in terminal)
npm run dev
```

### Check Your Dashboard
Go to: http://localhost:3000/dashboard

You should now see:
- **Overview Tab:** Stats with revenue, bookings, inquiries
- **Bookings Tab:** 10 sample bookings (3 pending, 6 confirmed, 1 completed)
- **Inquiries Tab:** 10 inquiries (5 new, 4 contacted, 1 converted)
- **Tours Tab:** 8 tour packages
- **CMS Tab:** All content editable (Hero Images, Site Settings, Destinations, Experience Categories)

### Check Your Homepage
Go to: http://localhost:3000

You should see:
- Hero carousel (if hero images added)
- Experience Categories (Gorilla Trekking, Big Five Safaris, Primate Tracking)
- Featured Tours (5 featured tours)
- Testimonials section (8 testimonials)

---

## 📊 What Data Was Added

### Tours (8 total)
1. Ultimate Gorilla Trekking Safari - $3,500 ⭐ Featured
2. Classic Big Five Safari - $4,200 ⭐ Featured
3. Primate Discovery Adventure - $3,200 ⭐ Featured
4. East African Cultural Experience - $2,800
5. Wildlife Photography Safari - $5,500
6. Great Migration Witness - $4,800 ⭐ Featured
7. Romantic Honeymoon Safari - $6,200 ⭐ Featured
8. Family Adventure Safari - $3,800

### Testimonials (8 total)
- All 5-star reviews from different countries
- Real-sounding names and detailed feedback
- Associated with specific tours

### Bookings (10 total)
- 3 Pending (need confirmation)
- 6 Confirmed (ready to go)
- 1 Completed (past trip)
- Total revenue: ~$122,000

### Inquiries (10 total)
- 5 New (not yet contacted)
- 4 Contacted (in progress)
- 1 Converted (became a booking)

### Newsletter Subscribers: 15

---

## 🔧 Troubleshooting

### If Tours Don't Show Up
1. Check you ran `fix_all_rls_complete.sql` first
2. Restart dev server
3. Hard refresh browser (Ctrl+Shift+R)

### If Dashboard Shows "Access Denied"
Run this SQL to add your email as admin:
```sql
INSERT INTO admin_users (email)
VALUES ('your-email@gmail.com')
ON CONFLICT DO NOTHING;
```

### If Site Settings Don't Load
1. Check there's exactly 1 row in site_settings
2. Run: `SELECT * FROM site_settings;`
3. If no data, check `fix_all_rls_complete.sql` was successful

---

## 📝 Next Steps

After setup is complete, you can:

1. **Edit Content in CMS:**
   - Go to Dashboard → CMS tab
   - Edit Site Settings (company name, contact info, social media)
   - Edit Destinations (names, taglines)
   - Edit Experience Categories (names, descriptions)
   - Upload images for Hero Section

2. **Manage Bookings:**
   - Go to Bookings tab
   - Confirm pending bookings
   - Mark bookings as completed
   - View customer details

3. **Handle Inquiries:**
   - Go to Inquiries tab
   - Update status (New → Contacted → Converted)
   - Read customer messages

4. **Manage Tours:**
   - View all tours in Tours tab
   - See which tours are featured
   - Check ratings and reviews

---

## 🎯 Summary

Run these 4 files in Supabase SQL Editor:
1. ✅ `fix_all_rls_complete.sql` - Permissions
2. ✅ `add_sample_tours.sql` - Tours  
3. ✅ `add_testimonials.sql` - Testimonials
4. ✅ `add_sample_bookings_inquiries.sql` - Bookings & Inquiries

Then restart your dev server and enjoy your fully functional dashboard!

---

**Having issues?** Check the browser console (F12) for error messages.
