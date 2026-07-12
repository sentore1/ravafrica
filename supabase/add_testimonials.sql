-- ============================================================================
-- Add Sample Testimonials
-- ============================================================================

-- First, check current testimonials
SELECT 'Current Testimonials' as info, COUNT(*) as count FROM testimonials;

-- Insert sample testimonials
INSERT INTO testimonials (name, location, avatar, rating, text, tour, active, display_order) VALUES
('Sarah Johnson', 'United States', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 5, 
'An absolutely incredible experience! The gorilla trekking was the highlight of my life. Our guide was knowledgeable and made us feel safe throughout the journey. RovAfrika exceeded all expectations!', 
'Gorilla Trekking Safari', true, 1),

('Michael Chen', 'Singapore', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', 5, 
'RovAfrika exceeded all our expectations. From the Big Five safaris to the cultural experiences, every moment was perfectly organized. The attention to detail was remarkable. Highly recommended!', 
'Big Five Safari', true, 2),

('Emma Thompson', 'United Kingdom', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', 5, 
'The primate tracking tour was amazing! Seeing chimpanzees in their natural habitat was unforgettable. The team was professional and passionate about conservation. Worth every penny!', 
'Primate Tracking Tour', true, 3),

('David Martinez', 'Spain', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', 5, 
'Best safari company in East Africa! The accommodations were excellent, the food was delicious, and our guide knew everything about the wildlife. An experience we will never forget!', 
'East Africa Explorer', true, 4),

('Lisa Anderson', 'Australia', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', 5, 
'A trip of a lifetime! RovAfrika made our honeymoon magical. The sunset over the Serengeti and the gorilla encounter in Rwanda are memories we will cherish forever.', 
'Honeymoon Safari Package', true, 5),

('James O''Brien', 'Ireland', 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', 5, 
'Exceptional service from start to finish. The custom itinerary perfectly matched our interests, and the guides were friendly and knowledgeable. Already planning our next trip with RovAfrika!', 
'Custom Safari Experience', true, 6),

('Yuki Tanaka', 'Japan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki', 5, 
'Professional, friendly, and incredibly knowledgeable guides. The wildlife photography opportunities were endless. RovAfrika made our African dream come true!', 
'Photography Safari', true, 7),

('Sophie Dubois', 'France', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', 5, 
'What an adventure! The cultural village visits combined with the wildlife safaris gave us a complete East African experience. Everything was seamlessly organized.', 
'Cultural & Wildlife Tour', true, 8)
ON CONFLICT DO NOTHING;

-- Verify the testimonials were added
SELECT 
  'Testimonials Added' as info,
  COUNT(*) as total_testimonials
FROM testimonials;

-- Show all testimonials
SELECT 
  'All Testimonials' as info,
  name,
  location,
  rating,
  LEFT(text, 60) || '...' as preview,
  tour
FROM testimonials
WHERE active = true
ORDER BY display_order;
