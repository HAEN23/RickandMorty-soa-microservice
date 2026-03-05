-- Script de inicialización de la base de datos Rick and Morty
-- Se ejecuta automáticamente al crear el contenedor de PostgreSQL

-- Crear tabla de ubicaciones/locations
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    dimension VARCHAR(100),
    api_id INTEGER UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de episodios
CREATE TABLE IF NOT EXISTS episodes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    air_date VARCHAR(100),
    episode_code VARCHAR(20),
    api_id INTEGER UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de personajes (characters)
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    api_id INTEGER UNIQUE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    species VARCHAR(100) NOT NULL,
    type VARCHAR(100),
    gender VARCHAR(50),
    origin_id INTEGER REFERENCES locations(id),
    location_id INTEGER REFERENCES locations(id),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS character_episodes (
    id SERIAL PRIMARY KEY,
    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    episode_id INTEGER NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
    UNIQUE(character_id, episode_id)
);


INSERT INTO locations (name, type, dimension, api_id) VALUES 
    ('Earth (C-137)', 'Planet', 'Dimension C-137', 1),
    ('Citadel of Ricks', 'Space station', 'unknown', 3),
    ('Earth (Replacement Dimension)', 'Planet', 'Replacement Dimension', 20),
    ('unknown', 'unknown', 'unknown', 0)
ON CONFLICT (api_id) DO NOTHING;


INSERT INTO episodes (name, air_date, episode_code, api_id) VALUES 
    ('Pilot', 'December 2, 2013', 'S01E01', 1),
    ('Lawnmower Dog', 'December 9, 2013', 'S01E02', 2),
    ('Anatomy Park', 'December 16, 2013', 'S01E03', 3),
    ('M. Night Shaym-Aliens!', 'January 13, 2014', 'S01E04', 4),
    ('Meeseeks and Destroy', 'January 20, 2014', 'S01E05', 5)
ON CONFLICT (api_id) DO NOTHING;


INSERT INTO characters (api_id, name, status, species, type, gender, origin_id, location_id, image_url) VALUES 
    (1, 'Rick Sanchez', 'Alive', 'Human', '', 'Male', 
     (SELECT id FROM locations WHERE api_id = 1), 
     (SELECT id FROM locations WHERE api_id = 20),
     'https://rickandmortyapi.com/api/character/avatar/1.jpeg'),
    (2, 'Morty Smith', 'Alive', 'Human', '', 'Male',
     (SELECT id FROM locations WHERE api_id = 0),
     (SELECT id FROM locations WHERE api_id = 20),
     'https://rickandmortyapi.com/api/character/avatar/2.jpeg'),
    (3, 'Summer Smith', 'Alive', 'Human', '', 'Female',
     (SELECT id FROM locations WHERE api_id = 1),
     (SELECT id FROM locations WHERE api_id = 20),
     'https://rickandmortyapi.com/api/character/avatar/3.jpeg'),
    (4, 'Beth Smith', 'Alive', 'Human', '', 'Female',
     (SELECT id FROM locations WHERE api_id = 1),
     (SELECT id FROM locations WHERE api_id = 20),
     'https://rickandmortyapi.com/api/character/avatar/4.jpeg'),
    (5, 'Jerry Smith', 'Alive', 'Human', '', 'Male',
     (SELECT id FROM locations WHERE api_id = 1),
     (SELECT id FROM locations WHERE api_id = 20),
     'https://rickandmortyapi.com/api/character/avatar/5.jpeg')
ON CONFLICT (api_id) DO NOTHING;


INSERT INTO character_episodes (character_id, episode_id) VALUES 
    ((SELECT id FROM characters WHERE api_id = 1), (SELECT id FROM episodes WHERE api_id = 1)),
    ((SELECT id FROM characters WHERE api_id = 1), (SELECT id FROM episodes WHERE api_id = 2)),
    ((SELECT id FROM characters WHERE api_id = 1), (SELECT id FROM episodes WHERE api_id = 3)),
    ((SELECT id FROM characters WHERE api_id = 1), (SELECT id FROM episodes WHERE api_id = 4)),
    ((SELECT id FROM characters WHERE api_id = 1), (SELECT id FROM episodes WHERE api_id = 5)),
    -- Morty 
    ((SELECT id FROM characters WHERE api_id = 2), (SELECT id FROM episodes WHERE api_id = 1)),
    ((SELECT id FROM characters WHERE api_id = 2), (SELECT id FROM episodes WHERE api_id = 2)),
    ((SELECT id FROM characters WHERE api_id = 2), (SELECT id FROM episodes WHERE api_id = 3)),
    ((SELECT id FROM characters WHERE api_id = 2), (SELECT id FROM episodes WHERE api_id = 4)),
    ((SELECT id FROM characters WHERE api_id = 2), (SELECT id FROM episodes WHERE api_id = 5)),
    -- Summer 
    ((SELECT id FROM characters WHERE api_id = 3), (SELECT id FROM episodes WHERE api_id = 1)),
    ((SELECT id FROM characters WHERE api_id = 3), (SELECT id FROM episodes WHERE api_id = 3)),
    -- Beth 
    ((SELECT id FROM characters WHERE api_id = 4), (SELECT id FROM episodes WHERE api_id = 1)),
    ((SELECT id FROM characters WHERE api_id = 4), (SELECT id FROM episodes WHERE api_id = 3)),
    -- Jerry 
    ((SELECT id FROM characters WHERE api_id = 5), (SELECT id FROM episodes WHERE api_id = 1)),
    ((SELECT id FROM characters WHERE api_id = 5), (SELECT id FROM episodes WHERE api_id = 3))
ON CONFLICT DO NOTHING;

-- Indices
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name);
CREATE INDEX IF NOT EXISTS idx_characters_status ON characters(status);
CREATE INDEX IF NOT EXISTS idx_characters_species ON characters(species);
CREATE INDEX IF NOT EXISTS idx_characters_api_id ON characters(api_id);
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);
CREATE INDEX IF NOT EXISTS idx_episodes_episode_code ON episodes(episode_code);
CREATE INDEX IF NOT EXISTS idx_character_episodes_character_id ON character_episodes(character_id);
CREATE INDEX IF NOT EXISTS idx_character_episodes_episode_id ON character_episodes(episode_id);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';


CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


DO $$
BEGIN
    RAISE NOTICE 'Base de datos inicializada correctamente con % personajes', (SELECT COUNT(*) FROM characters);
END $$;
