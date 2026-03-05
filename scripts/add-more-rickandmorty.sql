
INSERT INTO episodes (name, air_date, episode_code, api_id) VALUES 
    ('Raising Gazorpazorp', 'March 10, 2014', 'S01E07', 7),
    ('Rixty Minutes', 'March 17, 2014', 'S01E08', 8),
    ('Something Ricked This Way Comes', 'March 24, 2014', 'S01E09', 9),
    ('Close Rick-counters of the Rick Kind', 'April 7, 2014', 'S01E10', 10)
ON CONFLICT (api_id) DO NOTHING;


INSERT INTO characters (api_id, name, status, species, type, gender, origin_id, location_id, image_url) VALUES 
    (47, 'Birdperson', 'Alive', 'Alien', 'Bird-Person', 'Male',
     (SELECT id FROM locations WHERE api_id = 0),
     (SELECT id FROM locations WHERE api_id = 20),
     'https://rickandmortyapi.com/api/character/avatar/47.jpeg')
ON CONFLICT (api_id) DO NOTHING;


INSERT INTO characters (api_id, name, status, species, type, gender, origin_id, location_id, image_url) VALUES 
    (242, 'Mr. Meeseeks', 'Alive', 'Humanoid', 'Meeseeks', 'Male',
     (SELECT id FROM locations WHERE api_id = 0),
     (SELECT id FROM locations WHERE api_id = 1),
     'https://rickandmortyapi.com/api/character/avatar/242.jpeg')
ON CONFLICT (api_id) DO NOTHING;


INSERT INTO characters (api_id, name, status, species, type, gender, origin_id, location_id, image_url) VALUES 
    (331, 'Squanchy', 'Alive', 'Alien', 'Cat-Person', 'Male',
     (SELECT id FROM locations WHERE api_id = 0),
     (SELECT id FROM locations WHERE api_id = 20),
     'https://rickandmortyapi.com/api/character/avatar/331.jpeg')
ON CONFLICT (api_id) DO NOTHING;


INSERT INTO character_episodes (character_id, episode_id) VALUES 
    ((SELECT id FROM characters WHERE api_id = 47), (SELECT id FROM episodes WHERE api_id = 1)),
    ((SELECT id FROM characters WHERE api_id = 242), (SELECT id FROM episodes WHERE api_id = 5)),
    ((SELECT id FROM characters WHERE api_id = 331), (SELECT id FROM episodes WHERE api_id = 10))
ON CONFLICT DO NOTHING;

SELECT 'Personajes adicionales agregados correctamente' as message;
