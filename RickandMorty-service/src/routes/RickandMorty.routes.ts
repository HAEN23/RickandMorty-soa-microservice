import { Router } from 'express';
import { CharacterController } from '../controllers/RickandMortycontroller.js';

const router = Router();
const characterController = new CharacterController();


router.get('/', (req, res) => characterController.getAllCharacters(req, res));
router.get('/stats', (req, res) => characterController.getStats(req, res));
router.get('/species/:species', (req, res) => characterController.getCharactersBySpecies(req, res));
router.get('/status/:status', (req, res) => characterController.getCharactersByStatus(req, res));
router.get('/name/:name', (req, res) => characterController.getCharacterByName(req, res));
router.get('/:id', (req, res) => characterController.getCharacterById(req, res));
router.post('/', (req, res) => characterController.createCharacter(req, res));
router.put('/:id', (req, res) => characterController.updateCharacter(req, res));
router.delete('/:id', (req, res) => characterController.deleteCharacter(req, res));

export default router;
