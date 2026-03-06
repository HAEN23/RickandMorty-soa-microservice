import { Request, Response } from 'express';
import { CharacterService } from '../services/RickandMorty.service.js';

const characterService = new CharacterService();

export class CharacterController {
  //  Obtener todos los personajes con pag inación y filtros
  async getAllCharacters(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const filters = {
        status: req.query.status as string,
        species: req.query.species as string,
        gender: req.query.gender as string,
        name: req.query.name as string
      };
      
      const result = await characterService.getAllCharacters(page, limit, filters);
      
      res.status(200).json({
        success: true,
        data: result.characters,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit
        }
      });
    } catch (error) {
      console.error('Error al obtener personajes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener personajes',
        error: (error as Error).message
      });
    }
  }

  //Obtener personaje por ID
  async getCharacterById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }
      
      const character = await characterService.getCharacterById(id);
      
      if (!character) {
        res.status(404).json({
          success: false,
          message: 'Personaje no encontrado'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: character
      });
    } catch (error) {
      console.error('Error al obtener personaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener personaje',
        error: (error as Error).message
      });
    }
  }

  // Obtener personaje por nombre
  async getCharacterByName(req: Request, res: Response): Promise<void> {
    try {
      const name = req.params.name as string;
      const character = await characterService.getCharacterByName(name);
      
      if (!character) {
        res.status(404).json({
          success: false,
          message: `Personaje "${name}" no encontrado`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: character
      });
    } catch (error) {
      console.error('Error al obtener personaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener personaje',
        error: (error as Error).message
      });
    }
  }

  // Crear nuevo personaje
  async createCharacter(req: Request, res: Response): Promise<void> {
    try {
      const characterData = req.body;
      
      // Validación básica
      if (!characterData.name || !characterData.status || !characterData.species || !characterData.gender) {
        res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos: name, status, species, gender'
        });
        return;
      }
      
      if (!characterData.origin || !characterData.location) {
        res.status(400).json({
          success: false,
          message: 'Debe especificar origin y location'
        });
        return;
      }
      
const character = await characterService.createCharacter(characterData);
      
      res.status(201).json({
        success: true,
        message: 'Personaje creado exitosamente',
        data: character
      });
    } catch (error: any) {
      console.error('Error al crear personaje:', error);
      
      if (error.code === '23505') { 
        res.status(409).json({
          success: false,
          message: 'Ya existe un personaje con ese api_id o nombre'
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Error al crear personaje',
        error: error.message
      });
    }
  }

  // PUT /api/v1/character/:id - Actualizar personaje
  async updateCharacter(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }
      
      const updateData = req.body;
      const character = await characterService.updateCharacter(id, updateData);
      
      if (!character) {
        res.status(404).json({
          success: false,
          message: 'Personaje no encontrado'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Personaje actualizado exitosamente',
        data: character
      });
    } catch (error) {
      console.error('Error al actualizar personaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar personaje',
        error: (error as Error).message
      });
    }
  }

  // DELETE /api/v1/character/:id - Eliminar personaje
  async deleteCharacter(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
        return;
      }
      
      const deleted = await characterService.deleteCharacter(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Personaje no encontrado'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Personaje eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar personaje:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar personaje',
        error: (error as Error).message
      });
    }
  }

  // GET /api/v1/character/species/:species - Obtener personajes por especie
  async getCharactersBySpecies(req: Request, res: Response): Promise<void> {
    try {
      const species = req.params.species as string;
      const characters = await characterService.getCharactersBySpecies(species);
      
      res.status(200).json({
        success: true,
        data: characters,
        count: characters.length
      });
    } catch (error) {
      console.error('Error al obtener personajes por especie:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener personajes por especie',
        error: (error as Error).message
      });
    }
  }

  // GET /api/v1/character/status/:status - Obtener personajes por estado
  async getCharactersByStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = req.params.status as string;
      const characters = await characterService.getCharactersByStatus(status);
      
      res.status(200).json({
        success: true,
        data: characters,
        count: characters.length
      });
    } catch (error) {
      console.error('Error al obtener personajes por estado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener personajes por estado',
        error: (error as Error).message
      });
    }
  }

  // GET /api/v1/character/stats - Obtener estadísticas generales
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await characterService.getStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: (error as Error).message
      });
    }
  }
}
