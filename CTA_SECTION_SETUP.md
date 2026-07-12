# CTA Section Setup Guide

## Overview
I've added a new Call-to-Action (CTA) section to your landing page, positioned below the testimonials section. This section showcases a featured destination with a compelling call-to-action to encourage bookings.

## What Was Created

### 1. Database Table (`supabase/create_cta_section.sql`)
A new `cta_section` table with the following fields:
- **Rating section**: rating, total_guests
- **Main content**: title, description
- **Featured destination**: destination_image, destination_name, destination_description, destination_rating, destination_location
- **CTA section**: cta_text, button_text, button_link, phone_numbers (array)
- **Status**: active (boolean)

### 2. React Component (`src/components/cta-section.tsx`)
A beautiful, responsive component featuring:
- Left side: Image card with destination info overlay
- Right side: Rating badge, title, description, and CTA buttons
- Phone number links with icons
- Hover effects and smooth transitions
- Fully responsive design

### 3. Updated Landing Page (`src/app/page.tsx`)
- Imports the new CTASection component
- Fetches data from the `cta_section` table
- Displays the section below testimonials

## Setup Instructions

### Step 1: Create the Database Table
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Open the file: `supabase/create_cta_section.sql`
4. Copy all the SQL code
5. Paste it in the SQL Editor
6. Click "Run" to execute

This will:
- Create the `cta_section` table
- Insert default data with Uganda's Rwenzori Mountains
- Set up Row Level Security (RLS) policies
- Allow public read access
- Restrict write access to admin users only

### Step 2: Verify the Setup
After running the SQL:
1. Refresh your website at `http://localhost:3000`
2. Scroll down past the testimonials section
3. You should see the new CTA section with:
   - A beautiful destination image card (Rwenzori Mountains)
   - Rating badge (4.9 stars)
   - Compelling headline
   - Description text
   - "Enquire Now" button
   - Phone numbers with clickable links

## How to Manage Content (CMS)

### Option 1: Via Supabase Dashboard (Current Method)
1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. Find the `cta_section` table
4. Click on the row to edit
5. Update any fields:
   - **rating**: Number (e.g., 4.9)
   - **total_guests**: Text (e.g., "132,485 guests travelled")
   - **title**: Main headline
   - **description**: Subheading text
   - **destination_image**: URL to image (use Supabase Storage or external URL)
   - **destination_name**: Name of featured location
   - **destination_description**: Short description
   - **destination_rating**: Rating text (e.g., "5 stars - 12,340 Excellent")
   - **destination_location**: Flight route (e.g., "Kigali (KGL) - Entebbe (EBB)")
   - **cta_text**: Call-to-action text
   - **button_text**: Button label (default: "Enquire Now")
   - **button_link**: URL for the button (default: "/contact")
   - **phone_numbers**: Array of phone numbers (e.g., {"+250785519481", ""})
   - **active**: Toggle to show/hide the section
6. Click "Save"

### Option 2: Via Admin Dashboard (To Be Added)
I can add a dedicated CTA Section management panel to your admin dashboard if needed. Let me know!

## Customization Tips

### Change the Destination
1. Update `destination_image` with a URL to a new image
2. Change `destination_name` to the new location
3. Update `destination_description` with details about the new place
4. Adjust `destination_rating` and `destination_location` accordingly

### Change Colors
Edit `src/components/cta-section.tsx`:
- Primary color: `#401316` (dark brown/red)
- Accent color: `hsl(152,45%,25%)` (green)
- Background: `from-[hsl(40,20%,97%)] to-white`

### Add More Phone Numbers
In Supabase, edit the `phone_numbers` field:
```sql
UPDATE cta_section 
SET phone_numbers = ARRAY['+250785519481', '', '+250700000000']
WHERE id = 'your-id-here';
```

### Hide the Section Temporarily
```sql
UPDATE cta_section SET active = false WHERE id = 'your-id-here';
```

## Image Recommendations

For best results:
- **Destination Image**: 800x600px or larger
- **Format**: JPEG or WebP (for faster loading)
- **Aspect Ratio**: 4:3 or 16:10
- **Content**: Landscape photos with clear focal points work best

### Uploading Images to Supabase Storage

1. Go to Supabase Dashboard → Storage
2. Create a bucket called `images` (if not exists)
3. Upload your image
4. Set it to public
5. Copy the public URL
6. Paste it in the `destination_image` field

## Testing

After setup, test the following:
1. ✅ Section displays correctly on desktop
2. ✅ Section is responsive on mobile
3. ✅ "Enquire Now" button links to contact page
4. ✅ Phone numbers are clickable (opens phone dialer)
5. ✅ Image loads properly
6. ✅ Rating badge shows correct stars
7. ✅ Setting `active = false` hides the section

## Troubleshooting

### Section Not Showing
- Check that `active = true` in the database
- Verify the SQL was executed successfully
- Check browser console for errors
- Refresh the page with Ctrl+F5 (hard refresh)

### Image Not Loading
- Verify the image URL is accessible
- Check if the URL starts with `http://` or `https://`
- Try using an Unsplash URL as a test: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`

### Phone Numbers Not Clickable
- Ensure phone numbers start with `+` and country code
- Format: `+250785519481` (no spaces or dashes)

## Next Steps

1. **Run the SQL file** to create the table
2. **Refresh your website** to see the new section
3. **Customize the content** in Supabase Dashboard
4. **Upload custom images** if needed
5. **Test on mobile devices** to ensure responsiveness

Need help? Check the console for errors or review the component code in `src/components/cta-section.tsx`.
