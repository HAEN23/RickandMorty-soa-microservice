import { pool } from '../config/database.js';
import type { Character, CharacterComplete, CreateCharacterDTO, UpdateCharacterDTO, CharacterFilters, Location } from '../models/RickandMorty.model.js';

export class CharacterService {
  // Obtener todos los personajes con paginación y filtros
  async getAllCharacters(page: number = 1, limit: number = 20, filters?: CharacterFilters): Promise<{ characters: CharacterComplete[]; total: number; page: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    const params: any[] = [];
    let paramCount = 1;
    
    if (filters) {
      const conditions: string[] = [];
      if (filters.status) {
        conditions.push(`LOWER(status) = LOWER($${paramCount++})`);
        params.push(filters.status);
      }
      if (filters.species) {
        conditions.push(`LOWER(species) = LOWER($${paramCount++})`);
        params.push(filters.species);
      }
      if (filters.gender) {
        conditions.push(`LOWER(gender) = LOWER($${paramCount++})`);
        params.push(filters.gender);
      }
      if (filters.name) {
        conditions.push(`LOWER(name) LIKE LOWER($${paramCount++})`);
        params.push(`%${filters.name}%`);
      }
      
      if (conditions.length > 0) {
        whereClause = ' WHERE ' + conditions.join(' AND ');
      }
    }
    
    // Contar total de personajes
    const countResult = await pool.query(`SELECT COUNT(*) FROM characters${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Obtener personajes con paginación
    params.push(limit, offset);
    const characterResult = await pool.query(
      `SELECT * FROM characters${whereClause} ORDER BY id LIMIT $${paramCount++} OFFSET $${paramCount++}`,
      params
    );
    
    const characters = await Promise.all(
      characterResult.rows.map((character: any) => this.getCharacterComplete(character.id))
    );
    
    return {
      characters: characters.filter((c: any) => c !== null) as CharacterComplete[],
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Obtener personaje por ID con todos sus datos relacionados
  async getCharacterById(id: number): Promise<CharacterComplete | null> {
    const result = await pool.query('SELECT * FROM characters WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.getCharacterComplete(id);
  }

  // Obtener personaje por nombre
  async getCharacterByName(name: string): Promise<CharacterComplete | null> {
    const result = await pool.query('SELECT * FROM characters WHERE LOWER(name) = LOWER($1)', [name]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.getCharacterComplete(result.rows[0].id);
  }

  // Crear un nuevo personaje (lógica de negocio compleja)
  async createCharacter(data: CreateCharacterDTO): Promise<CharacterComplete> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Crear o obtener location de origen
      let originId = await this.getOrCreateLocation(client, data.origin);
      
      // 2. Crear o obtener location actual
      let locationId = await this.getOrCreateLocation(client, data.location);
      
      // 3. Insertar el personaje
      const characterResult = await client.query(
        `INSERT INTO characters (api_id, name, status, species, type, gender, origin_id, location_id, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          data.api_id || null,
          data.name,
          data.status,
          data.species,
          data.type || '',
          data.gender,
          originId,
          locationId,
          data.image_url || ''
        ]
      );
      
      const character = characterResult.rows[0];
      
      // 4. Asociar episodios si se proporcionan
      if (data.episodes && data.episodes.length > 0) {
        for (const episodeApiId of data.episodes) {
          const episodeResult = await client.query(
            'SELECT id FROM episodes WHERE api_id = $1',
            [episodeApiId]
          );
          
          if (episodeResult.rows.length > 0) {
            await client.query(
              'INSERT INTO character_episodes (character_id, episode_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
              [character.id, episodeResult.rows[0].id]
            );
          }
        }
      }
      
      await client.query('COMMIT');
      
      // Retornar el personaje completo
      const completeCharacter = await this.getCharacterComplete(character.id);
      return completeCharacter!;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Actualizar personaje
  async updateCharacter(id: number, data: UpdateCharacterDTO): Promise<CharacterComplete | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.species !== undefined) {
      fields.push(`species = $${paramCount++}`);
      values.push(data.species);
    }
    if (data.type !== undefined) {
      fields.push(`type = $${paramCount++}`);
      values.push(data.type);
    }
    if (data.gender !== undefined) {
      fields.push(`gender = $${paramCount++}`);
      values.push(data.gender);
    }
    if (data.image_url !== undefined) {
      fields.push(`image_url = $${paramCount++}`);
      values.push(data.image_url);
    }
    
    if (fields.length === 0) {
      return this.getCharacterById(id);
    }
    
    values.push(id);
    
    const result = await pool.query(
      `UPDATE characters SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.getCharacterComplete(id);
  }

  // Eliminar personaje
  async deleteCharacter(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM characters WHERE id = $1 RETURNING id', [id]);
    return result.rows.length > 0;
  }

  // Buscar personajes por especie
  async getCharactersBySpecies(species: string): Promise<CharacterComplete[]> {
    const result = await pool.query(
      'SELECT * FROM characters WHERE LOWER(species) = LOWER($1) ORDER BY id',
      [species]
    );
    
    const characters = await Promise.all(
      result.rows.map((character: any) => this.getCharacterComplete(character.id))
    );
    
    return characters.filter((c: any) => c !== null) as CharacterComplete[];
  }

  // Buscar personajes por estado (alive, dead, unknown)
  async getCharactersByStatus(status: string): Promise<CharacterComplete[]> {
    const result = await pool.query(
      'SELECT * FROM characters WHERE LOWER(status) = LOWER($1) ORDER BY id',
      [status]
    );
    
    const characters = await Promise.all(
      result.rows.map((character: any) => this.getCharacterComplete(character.id))
    );
    
    return characters.filter((c: any) => c !== null) as CharacterComplete[];
  }

  // Obtener estadísticas generales
  async getStats(): Promise<any> {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_characters,
        COUNT(CASE WHEN LOWER(status) = 'alive' THEN 1 END) as alive,
        COUNT(CASE WHEN LOWER(status) = 'dead' THEN 1 END) as dead,
        COUNT(CASE WHEN LOWER(status) = 'unknown' THEN 1 END) as unknown,
        COUNT(DISTINCT species) as total_species,
        COUNT(DISTINCT CASE WHEN LOWER(gender) = 'male' THEN 1 END) as male,
        COUNT(DISTINCT CASE WHEN LOWER(gender) = 'female' THEN 1 END) as female
       FROM characters`
    );
    
    return result.rows[0];
  }

  // Método privado para obtener o crear una location
  private async getOrCreateLocation(client: any, locationData: { name: string; type?: string; dimension?: string }): Promise<number> {
    // Buscar si ya existe
    const existingLocation = await client.query(
      'SELECT id FROM locations WHERE LOWER(name) = LOWER($1)',
      [locationData.name]
    );
    
    if (existingLocation.rows.length > 0) {
      return existingLocation.rows[0].id;
    }
    
    // Crear nueva location
    const result = await client.query(
      'INSERT INTO locations (name, type, dimension) VALUES ($1, $2, $3) RETURNING id',
      [locationData.name, locationData.type || 'unknown', locationData.dimension || 'unknown']
    );
    
    return result.rows[0].id;
  }

  // Método privado para obtener personaje completo con todas sus relaciones
  private async getCharacterComplete(characterId: number): Promise<CharacterComplete | null> {
    // Obtener personaje base
    const characterResult = await pool.query('SELECT * FROM characters WHERE id = $1', [characterId]);
    
    if (characterResult.rows.length === 0) {
      return null;
    }
    
    const character = characterResult.rows[0];
    
    
    const originResult = await pool.query('SELECT * FROM locations WHERE id = $1', [character.origin_id]);
    const origin = originResult.rows[0] || null;
    
    
    const locationResult = await pool.query('SELECT * FROM locations WHERE id = $1', [character.location_id]);
    const location = locationResult.rows[0] || null;
    
    
    const episodesResult = await pool.query(
      `SELECT e.* FROM episodes e
       JOIN character_episodes ce ON e.id = ce.episode_id
       WHERE ce.character_id = $1
       ORDER BY e.episode_code`,
      [characterId]
    );
    
    return {
      ...character,
      origin,
      location,
      episodes: episodesResult.rows
    };
  }
}
