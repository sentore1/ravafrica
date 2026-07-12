-- ============================================================================
-- Add Sample Bookings and Inquiries
-- ============================================================================

-- Check current data
SELECT 'Current Bookings' as info, COUNT(*) as count FROM bookings;
SELECT 'Current Inquiries' as info, COUNT(*) as count FROM inquiries;
SELECT 'Current Newsletter Subscribers' as info, COUNT(*) as count FROM newsletter_subscribers;

-- ============================================================
-- 1. ADD SAMPLE BOOKINGS
-- ============================================================

INSERT INTO bookings (
  full_name, email, phone, country, travelers, travel_date,
  special_requests, tour_title, tour_slug, total_price, status
) VALUES

('John Smith', 'john.smith@email.com', '+1-555-0123', 'United States', 4, '2026-09-15', 
'Celebrating our anniversary, would love a romantic bush dinner', 
'Ultimate Gorilla Trekking Safari', 'ultimate-gorilla-trekking-safari', 14000, 'confirmed'),

('Maria Garcia', 'maria.garcia@email.com', '+34-612-345-678', 'Spain', 2, '2026-10-20',
'First time in Africa, very excited! Any photography tips?',
'Classic Big Five Safari', 'classic-big-five-safari', 8400, 'confirmed'),

('Wei Chen', 'wei.chen@email.com', '+86-138-0000-1234', 'China', 6, '2026-11-05',
'Family trip with 2 children ages 8 and 12',
'Family Adventure Safari', 'family-adventure-safari', 22800, 'pending'),

('Emma Johnson', 'emma.j@email.com', '+44-7700-900123', 'United Kingdom', 2, '2026-08-30',
'Honeymoon trip! Would love extra special touches',
'Romantic Honeymoon Safari', 'romantic-honeymoon-safari', 12400, 'confirmed'),

('Pierre Dubois', 'pierre.dubois@email.com', '+33-6-12-34-56-78', 'France', 1, '2026-12-10',
'Solo traveler, interested in photography workshops',
'Wildlife Photography Safari', 'wildlife-photography-safari', 5500, 'pending'),

('Sarah Williams', 'sarah.w@email.com', '+1-555-0198', 'United States', 3, '2026-09-25',
'Looking forward to seeing the migration!',
'Great Migration Witness', 'great-migration-witness', 14400, 'confirmed'),

('Yuki Tanaka', 'yuki.tanaka@email.com', '+81-90-1234-5678', 'Japan', 2, '2027-01-15',
'Interested in primate conservation programs',
'Primate Discovery Adventure', 'primate-discovery-adventure', 6400, 'pending'),

('Michael Brown', 'michael.b@email.com', '+61-400-123-456', 'Australia', 4, '2026-10-08',
'Would like vegetarian meal options',
'East African Cultural Experience', 'east-african-cultural-experience', 11200, 'confirmed'),

('Anna Schmidt', 'anna.schmidt@email.com', '+49-170-1234567', 'Germany', 2, 'Flexible',
'Flexible dates, prefer July or August',
'Ultimate Gorilla Trekking Safari', 'ultimate-gorilla-trekking-safari', 7000, 'pending'),

('David Lee', 'david.lee@email.com', '+1-555-0176', 'Canada', 5, '2026-11-20',
'Extended family trip, need adjoining rooms',
'Classic Big Five Safari', 'classic-big-five-safari', 21000, 'completed')

ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. ADD SAMPLE INQUIRIES
-- ============================================================

INSERT INTO inquiries (
  full_name, email, phone, destination, travelers, travel_date,
  interests, budget, message, status
) VALUES

('Robert Taylor', 'robert.t@email.com', '+1-555-0145', 'Rwanda', '2-3', 'September 2026',
ARRAY['Gorilla Trekking', 'Cultural Visits'], '$5,000-$7,500',
'Hi, I am interested in gorilla trekking in Rwanda. What is included in the package? Do you provide travel insurance?',
'contacted'),

('Lisa Anderson', 'lisa.a@email.com', '+44-7700-900456', 'Kenya & Tanzania', '4', 'October-November 2026',
ARRAY['Big Five Safari', 'Beach Time'], '$10,000-$15,000',
'Planning a trip for my family. Would like to combine safari with some beach relaxation. Is this possible?',
'new'),

('Carlos Rodriguez', 'carlos.r@email.com', '+34-612-987-654', 'Uganda', '2', 'December 2026',
ARRAY['Primate Tracking', 'Hiking'], '$3,000-$5,000',
'Interested in chimpanzee trekking. What is the success rate? Also, what fitness level is required?',
'contacted'),

('Sophie Martin', 'sophie.m@email.com', '+33-6-98-76-54-32', 'Tanzania', '2', 'Honeymoon - Flexible',
ARRAY['Romantic Experiences', 'Wildlife'], '$8,000-$12,000',
'Planning our honeymoon! Looking for something romantic with great wildlife viewing. Open to suggestions!',
'new'),

('Hans Mueller', 'hans.mueller@email.com', '+49-170-9876543', 'Kenya', '1', 'August 2026',
ARRAY['Photography', 'Big Five Safari'], 'Flexible',
'Professional photographer looking for the best wildlife photography safari. Need guidance on equipment and timing.',
'converted'),

('Jennifer White', 'jennifer.w@email.com', '+1-555-0167', 'Rwanda & Uganda', '6', 'July 2027',
ARRAY['Gorilla Trekking', 'Cultural Visits', 'Hiking'], '$15,000-$20,000',
'Multi-generational family trip. Ages range from 65 to 12. Need accessibility considerations for elderly parents.',
'contacted'),

('Ahmed Hassan', 'ahmed.h@email.com', '+971-50-123-4567', 'Tanzania', '8', 'January 2027',
ARRAY['Cultural Visits', 'Big Five Safari'], '$20,000+',
'Corporate team building trip. Need luxury accommodations and private guides. Can you arrange?',
'new'),

('Emily Thompson', 'emily.t@email.com', '+61-400-987-654', 'Kenya', '3', 'September 2026',
ARRAY['Migration', 'Hot Air Balloon'], '$12,000-$18,000',
'Would love to see the Great Migration and do a hot air balloon ride. What are the best dates?',
'contacted'),

('Marco Rossi', 'marco.rossi@email.com', '+39-333-1234567', 'Uganda', '2', 'March 2027',
ARRAY['Primate Tracking', 'Bird Watching'], '$4,000-$6,000',
'Avid birder interested in Uganda. Can we combine chimpanzee trekking with birding expeditions?',
'new'),

('Patricia Clark', 'patricia.c@email.com', '+1-555-0189', 'Kenya & Tanzania', '2', 'June 2027',
ARRAY['Big Five Safari', 'Beach Time', 'Cultural Visits'], '$10,000-$15,000',
'First trip to Africa! Want to experience everything. How many days would you recommend?',
'new')

ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. ADD NEWSLETTER SUBSCRIBERS
-- ============================================================

INSERT INTO newsletter_subscribers (email, subscribed) VALUES
('subscriber1@email.com', true),
('subscriber2@email.com', true),
('subscriber3@email.com', true),
('subscriber4@email.com', true),
('subscriber5@email.com', true),
('subscriber6@email.com', true),
('subscriber7@email.com', true),
('subscriber8@email.com', true),
('subscriber9@email.com', true),
('subscriber10@email.com', true),
('subscriber11@email.com', true),
('subscriber12@email.com', true),
('subscriber13@email.com', true),
('subscriber14@email.com', true),
('subscriber15@email.com', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- VERIFICATION
-- ============================================================
SELECT '========================================' as divider;
SELECT 'SAMPLE DATA ADDED!' as status;
SELECT '========================================' as divider;

SELECT 'Bookings:' as type, COUNT(*) as total, 
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
FROM bookings;

SELECT 'Inquiries:' as type, COUNT(*) as total,
  SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
  SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
  SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted
FROM inquiries;

SELECT 'Newsletter:' as type, COUNT(*) as total_subscribers
FROM newsletter_subscribers WHERE subscribed = true;

SELECT 'Total Revenue:' as metric, 
  '$' || SUM(total_price)::text as amount
FROM bookings WHERE status IN ('confirmed', 'completed');

SELECT '========================================' as divider;
