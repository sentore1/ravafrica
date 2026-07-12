# Image Upload Setup Guide

## What Was Added

The tour form now supports **two ways** to add images:

1. **Upload from your computer** - Click the "Upload Image" button
2. **Enter image URL** - Paste an image URL directly

## Features

- ✅ File upload button with loading state
- ✅ Supports: JPEG, JPG, PNG, GIF, WebP
- ✅ 10MB file size limit
- ✅ Automatic upload to Supabase Storage
- ✅ Real-time image preview
- ✅ Remove image button (X icon on preview)
- ✅ Disabled state during upload to prevent errors

## Setup Required

### 1. Run the Storage Setup SQL

Execute the `setup_storage.sql` file in your Supabase SQL Editor:

```bash
# In Supabase Dashboard -> SQL Editor
# Copy and paste the contents of: supabase/setup_storage.sql
```

This will:
- Create the "images" storage bucket (if it doesn't exist)
- Set it as public (so images are accessible)
- Add RLS policies for authenticated users to upload/delete

### 2. Verify Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. You should see an "images" bucket
4. It should be marked as **Public**

## How It Works

### Upload Flow

1. User clicks "Upload Image" button
2. File picker opens
3. User selects an image file
4. File is uploaded to Supabase Storage (`images` bucket)
5. A unique filename is generated: `tour-{timestamp}.{extension}`
6. Public URL is automatically generated
7. URL is set in the form's image field
8. Preview appears below

### URL Flow

1. User pastes an image URL in the input field
2. Preview appears automatically
3. No upload needed (external image)

## Image Naming Convention

Uploaded images use this format:
- `tour-1720742400000.jpg`
- `tour-1720742401234.png`

This prevents naming conflicts and makes images easy to identify.

## Error Handling

- If upload fails, an alert shows the error message
- If image URL is invalid, preview won't show (graceful failure)
- Upload button is disabled during upload to prevent double-uploads

## Usage in Admin Dashboard

1. Click **Tours** tab
2. Click **Add Tour** or **Edit** button on existing tour
3. In the Image section:
   - Click **Upload Image** to select from computer
   - OR enter a URL in the text field below
4. Preview appears automatically
5. Click **X** button on preview to remove and choose another image

## Storage Limits

- **File Size**: 10MB per image
- **Allowed Types**: JPEG, JPG, PNG, GIF, WebP
- **Public Access**: All images in the bucket are publicly accessible
- **Authentication Required**: Only logged-in users can upload

## Troubleshooting

### Upload Fails with "403 Forbidden"
- Run the `setup_storage.sql` script
- Check that you're logged in as admin
- Verify RLS policies are correct

### Images Don't Display
- Check that the bucket is set to "Public"
- Verify the URL is correct
- Check browser console for CORS errors

### "Bucket not found" Error
- The "images" bucket doesn't exist
- Run `setup_storage.sql` to create it

## Next Steps (Optional Enhancements)

Consider adding:
- Image compression before upload
- Multiple image upload for tour galleries
- Drag-and-drop upload
- Crop/resize functionality
- Progress bar for large uploads
