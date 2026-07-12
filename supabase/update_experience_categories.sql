-- ============================================================================
-- Update Experience Categories Text
-- ============================================================================

-- First, let's see what we have
SELECT 
  'Current Experience Categories' as info,
  id,
  name,
  description,
  display_order
FROM experience_categories
ORDER BY display_order;

-- Update Gorilla Trekking (example)
UPDATE experience_categories
SET 
  name = 'Gorilla Trekking',  -- Change this text
  description = 'Trek through misty volcanic forests to encounter endangered mountain gorillas in their natural habitat'  -- Change this text
WHERE name ILIKE '%gorilla%';

-- Update Big Five Safaris (example)
UPDATE experience_categories
SET 
  name = 'Big Five Safaris',  -- Change this text
  description = 'Witness lions, elephants, buffalo, leopards, and rhinos across iconic national parks'  -- Change this text
WHERE name ILIKE '%big five%';

-- Update Primate Tracking (example)
UPDATE experience_categories
SET 
  name = 'Primate Tracking',  -- Change this text
  description = 'From golden monkeys to chimpanzees, discover East Africa''s incredible primate diversity'  -- Change this text
WHERE name ILIKE '%primate%';

-- Verify the changes
SELECT 
  'Updated Experience Categories' as info,
  id,
  name,
  description,
  display_order
FROM experience_categories
ORDER BY display_order;
