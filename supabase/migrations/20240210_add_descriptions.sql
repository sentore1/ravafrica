-- Add description column if it doesn't exist
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS description TEXT;

-- Update all destination descriptions

UPDATE destinations 
SET description = 'Rwanda, known as the "Land of a Thousand Hills," is a remarkable East African destination that has transformed into one of the continent''s premier safari locations. This small but stunning country offers an intimate wildlife experience, most notably the rare opportunity to trek through misty volcanic mountains to encounter endangered mountain gorillas in their natural habitat. Beyond gorillas, Rwanda boasts diverse ecosystems including the ancient Nyungwe Forest with its chimpanzees and canopy walks, the savannah plains of Akagera National Park home to the Big Five, and the serene shores of Lake Kivu. With its clean cities, welcoming people, and commitment to conservation, Rwanda provides a safe, accessible, and deeply moving safari experience that combines wildlife encounters with cultural immersion and breathtaking landscapes.'
WHERE slug = 'rwanda';

UPDATE destinations 
SET description = 'Uganda, aptly named the "Pearl of Africa" by Winston Churchill, is a wildlife paradise offering some of the most diverse safari experiences on the continent. Home to over half of the world''s remaining mountain gorillas in Bwindi Impenetrable Forest, Uganda provides unparalleled primate encounters including chimpanzee tracking in Kibale Forest. The country''s ten national parks showcase incredible biodiversity, from the thundering Murchison Falls to the tree-climbing lions of Queen Elizabeth National Park. With the snow-capped Rwenzori Mountains, the source of the Nile, and abundant birdlife exceeding 1,000 species, Uganda combines adventure, wildlife, and natural beauty in a warm and welcoming atmosphere that makes every visitor feel at home.'
WHERE slug = 'uganda';

UPDATE destinations 
SET description = 'Kenya is the birthplace of the safari and remains Africa''s most iconic wildlife destination. The legendary Masai Mara hosts the annual Great Migration, where millions of wildebeest and zebra cross crocodile-infested rivers in one of nature''s greatest spectacles. Beyond the Mara, Kenya offers diverse landscapes from the elephant herds of Amboseli against the backdrop of Mount Kilimanjaro, to the flamingo-filled lakes of the Great Rift Valley, and the pristine beaches of the Indian Ocean coast. With world-class lodges, experienced guides, rich Maasai culture, and excellent infrastructure, Kenya delivers the quintessential African safari experience that has captivated travelers for over a century.'
WHERE slug = 'kenya';

UPDATE destinations 
SET description = 'Tanzania is home to Africa''s most spectacular wildlife destinations and natural wonders. The vast Serengeti plains host the greatest wildlife show on Earth—the Great Migration—while the Ngorongoro Crater offers the world''s highest concentration of predators in a stunning volcanic caldera. Mount Kilimanjaro, Africa''s highest peak, beckons adventurers, and the spice island of Zanzibar provides the perfect beach retreat after safari. With Tarangire''s elephant herds, Lake Manyara''s tree-climbing lions, and the remote wilderness of Selous and Ruaha, Tanzania offers unmatched diversity. This is where safari dreams come true, combining world-class wildlife viewing with breathtaking landscapes and rich cultural heritage.'
WHERE slug = 'tanzania';

UPDATE destinations 
SET description = 'Burundi, the "Heart of Africa," is East Africa''s best-kept secret, offering authentic and crowd-free experiences for adventurous travelers. Nestled along the shores of Lake Tanganyika, the world''s second-deepest lake, Burundi provides stunning lakeside scenery, excellent snorkeling, and fresh-water beaches. The country''s Kibira National Park protects pristine montane rainforest home to chimpanzees and colobus monkeys, while Rusizi National Park offers hippo and bird watching. Experience the famous Drummers of Burundi, explore the cultural capital of Gitega, and discover the source of the Nile. With warm hospitality, untouched nature, and rich traditions, Burundi offers an off-the-beaten-path adventure that few travelers experience.'
WHERE slug = 'burundi';
