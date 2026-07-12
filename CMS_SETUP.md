# CMS Setup Instructions

## Overview
Your landing page content is now dynamic and can be edited through the database. All content is stored in Supabase tables.

## Database Tables Created

### 1. **hero_content**
Controls the hero section on the landing page.
- `badge_text` - Badge text (e.g., "East Africa's Premier Safari Operator")
- `headline` - Main headline text
- `headline_highlight` - Highlighted part of headline
- `description` - Hero description text
- `cta_primary_text` - Primary button text
- `cta_primary_link` - Primary button link
- `cta_secondary_text` - Secondary button text
- `background_image` - Hero background image URL
- `active` - Enable/disable this content

### 2. **hero_stats**
Stats displayed in the hero section (e.g., "5 Countries", "15+ Years").
- `value` - Stat value
- `label` - Stat label
- `display_order` - Order of display
- `active` - Enable/disable

### 3. **tours**
Tour packages displayed on the landing page (already exists, now used dynamically).
- All tour fields (title, price, duration, countries, etc.)
- `active` - Show/hide tour
- `featured` - Mark as featured

### 4. **testimonials**
Customer testimonials section.
- `name` - Customer name
- `location` - Customer location
- `avatar` - Avatar image URL
- `rating` - Rating (1-5)
- `text` - Testimonial text
- `tour` - Related tour name
- `display_order` - Order of display
- `active` - Enable/disable

### 5. **trust_stats**
Trust indicators stats bar.
- `value` - Stat value (e.g., "2,500+")
- `label` - Stat label (e.g., "Happy Travelers")
- `display_order` - Order of display
- `active` - Enable/disable

### 6. **partners**
Partner organizations displayed at the bottom.
- `name` - Partner name
- `logo` - Logo URL (optional)
- `display_order` - Order of display
- `active` - Enable/disable

## How to Apply Migration

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/20240202_cms_content.sql`
4. Paste and run the SQL

### Option 2: Supabase CLI
```bash
npx supabase db push
```

## How to Edit Content

### Via Supabase Dashboard:
1. Go to your Supabase project
2. Click "Table Editor"
3. Select the table you want to edit
4. Click on any row to edit
5. Changes appear immediately on the website

### Via SQL:
```sql
-- Update hero content
UPDATE hero_content 
SET headline = 'Your New Headline',
    description = 'Your new description'
WHERE active = true;

-- Add a new testimonial
INSERT INTO testimonials (name, location, avatar, rating, text, tour, display_order)
VALUES ('John Doe', 'New York, USA', 'https://...', 5, 'Amazing experience!', 'Safari Tour', 5);

-- Update a tour
UPDATE tours 
SET price = 4999,
    featured = true
WHERE slug = 'east-africa-grand-safari';
```

## Admin Dashboard

Access the CMS tab in your admin dashboard at `/dashboard` to see an overview of all editable content tables.

## Notes

- Set `active = false` to hide content without deleting it
- Use `display_order` to control the order items appear
- Changes are reflected immediately on the landing page
- All content is cached by Next.js, so you may need to refresh the page
