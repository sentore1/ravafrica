-- ============================================================================
-- Add Sample Tours for RovAfrika Safari Tours
-- ============================================================================

-- Check current tours
SELECT 'Current Tours' as info, COUNT(*) as count FROM tours;

-- Insert sample tours
INSERT INTO tours (
  title, slug, description, short_description, countries, duration, group_size,
  rating, reviews_count, price, image, category, featured, active
) VALUES

-- Tour 1: Gorilla Trekking
('Ultimate Gorilla Trekking Safari', 'ultimate-gorilla-trekking-safari',
'Embark on a life-changing journey to encounter the magnificent mountain gorillas in their natural habitat. This exclusive safari takes you deep into the misty forests of Rwanda and Uganda, where you will have the rare privilege of spending an hour with these gentle giants. Our expert guides will lead you through lush vegetation, sharing insights about gorilla behavior, conservation efforts, and the unique ecosystem they call home.',
'Trek through misty volcanic forests to encounter endangered mountain gorillas in Rwanda and Uganda',
ARRAY['Rwanda', 'Uganda'], '7 days / 6 nights', '2-6 people',
4.9, 127, 3500,
'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=800',
'Gorilla Trekking', true, true),

-- Tour 2: Big Five Safari
('Classic Big Five Safari', 'classic-big-five-safari',
'Experience the ultimate African safari adventure across the legendary Serengeti and Masai Mara. Witness the incredible wildlife spectacle as you search for the Big Five - lions, elephants, buffalo, leopards, and rhinos. Stay in luxury tented camps, enjoy game drives at dawn and dusk, and immerse yourself in the breathtaking landscapes of East Africa. This tour offers unparalleled wildlife viewing opportunities and authentic bush experiences.',
'Witness the Big Five across iconic Serengeti and Masai Mara national parks',
ARRAY['Tanzania', 'Kenya'], '10 days / 9 nights', '4-8 people',
4.8, 203, 4200,
'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
'Big Five Safari', true, true),

-- Tour 3: Primate Tracking
('Primate Discovery Adventure', 'primate-discovery-adventure',
'Discover the incredible diversity of East Africa''s primates on this specialized safari. From the playful golden monkeys to intelligent chimpanzees, experience close encounters with our closest relatives in the animal kingdom. Visit Nyungwe Forest, Kibale National Park, and other primate sanctuaries. This tour combines thrilling tracking experiences with conservation education and cultural interactions with local communities.',
'Track golden monkeys, chimpanzees, and discover East Africa''s incredible primate diversity',
ARRAY['Rwanda', 'Uganda'], '8 days / 7 nights', '2-6 people',
4.7, 89, 3200,
'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800',
'Primate Tracking', true, true),

-- Tour 4: Cultural Safari
('East African Cultural Experience', 'east-african-cultural-experience',
'Immerse yourself in the rich cultural tapestry of East Africa. Visit traditional Masai villages, participate in age-old ceremonies, learn about local customs, and enjoy authentic cuisine. This tour beautifully blends wildlife encounters with meaningful cultural exchanges, offering insights into the diverse ethnic groups of the region. Meet local artisans, attend traditional dances, and contribute to community-based tourism initiatives.',
'Immerse yourself in authentic East African culture with village visits and traditional experiences',
ARRAY['Kenya', 'Tanzania'], '6 days / 5 nights', '4-10 people',
4.6, 74, 2800,
'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800',
'Cultural Safari', false, true),

-- Tour 5: Photography Safari
('Wildlife Photography Safari', 'wildlife-photography-safari',
'Designed specifically for photography enthusiasts, this safari maximizes your opportunities to capture stunning wildlife images. Travel in specially modified vehicles with pop-up roofs and extra equipment storage. Benefit from early morning and late evening game drives during the golden hours. Our guides are trained in wildlife photography and will help position you for the perfect shot. Suitable for all skill levels from beginners to professionals.',
'Capture stunning wildlife photographs with expert guidance and optimal shooting conditions',
ARRAY['Tanzania', 'Kenya'], '12 days / 11 nights', '2-4 people',
4.9, 56, 5500,
'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800',
'Photography Safari', false, true),

-- Tour 6: Great Migration
('Great Migration Witness', 'great-migration-witness',
'Witness one of nature''s most spectacular events - the Great Wildebeest Migration. Time your visit to see millions of wildebeest, zebras, and gazelles as they cross the Mara River, braving crocodile-infested waters in their epic journey. This tour is carefully timed to coincide with the migration patterns, ensuring you experience the full drama of this natural phenomenon. Includes luxury mobile camps that follow the herds.',
'Witness the spectacular Great Migration - millions of wildebeest crossing the Mara River',
ARRAY['Tanzania', 'Kenya'], '9 days / 8 nights', '4-8 people',
5.0, 167, 4800,
'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
'Migration Safari', true, true),

-- Tour 7: Honeymoon Safari
('Romantic Honeymoon Safari', 'romantic-honeymoon-safari',
'Celebrate your love with an unforgettable honeymoon safari in East Africa. Stay in exclusive luxury lodges with private plunge pools, enjoy romantic bush dinners under the stars, and experience thrilling game drives together. This carefully curated package includes special touches like champagne breakfasts in the bush, couples spa treatments, and private sundowner experiences. Create magical memories in one of the world''s most romantic destinations.',
'Celebrate love with exclusive luxury lodges, romantic bush dinners, and unforgettable wildlife encounters',
ARRAY['Tanzania', 'Kenya', 'Rwanda'], '10 days / 9 nights', '2 people',
4.9, 142, 6200,
'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800',
'Honeymoon Safari', true, true),

-- Tour 8: Family Safari
('Family Adventure Safari', 'family-adventure-safari',
'Create lasting family memories on this specially designed safari suitable for all ages. Stay in family-friendly lodges with interconnecting rooms, enjoy educational activities for children, and experience wildlife encounters that will inspire young minds. Our guides are experienced in engaging children with nature through fun activities and storytelling. Includes shorter game drives, cultural visits, and leisure time for families to bond.',
'Family-friendly safari with educational activities and wildlife encounters for all ages',
ARRAY['Kenya', 'Tanzania'], '7 days / 6 nights', '4-10 people',
4.7, 98, 3800,
'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
'Family Safari', false, true)

ON CONFLICT (slug) DO NOTHING;

-- Verify tours were added
SELECT 
  'Tours Added' as info,
  COUNT(*) as total_tours,
  SUM(CASE WHEN featured THEN 1 ELSE 0 END) as featured_tours,
  SUM(CASE WHEN active THEN 1 ELSE 0 END) as active_tours
FROM tours;

-- Show all tours
SELECT 
  'All Tours' as info,
  title,
  string_to_array(array_to_string(countries, ', '), ', ') as countries,
  duration,
  price as price_usd,
  rating,
  CASE WHEN featured THEN '⭐ Featured' ELSE '' END as featured_status
FROM tours
WHERE active = true
ORDER BY featured DESC, rating DESC;
