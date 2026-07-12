-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Allow public access to read images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
