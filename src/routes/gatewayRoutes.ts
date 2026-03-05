import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { config } from '../config/env.js';

const router = Router();


router.get('/api/v1/character', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get(config.microserviceUrl, { params: req.query });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Proxy GET /api/v1/character/stats
router.get('/api/v1/character/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get(`${config.microserviceUrl}/stats`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Proxy GET /api/v1/character/species/:species
router.get('/api/v1/character/species/:species', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get(`${config.microserviceUrl}/species/${req.params.species}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Proxy GET /api/v1/character/status/:status
router.get('/api/v1/character/status/:status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get(`${config.microserviceUrl}/status/${req.params.status}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Proxy GET /api/v1/character/:id - Obtener por ID
router.get('/api/v1/character/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get(`${config.microserviceUrl}/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Proxy POST /api/v1/character - Crear personaje
router.post('/api/v1/character', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.post(config.microserviceUrl, req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Proxy PUT /api/v1/character/:id - Actualizar personaje
router.put('/api/v1/character/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.put(`${config.microserviceUrl}/${req.params.id}`, req.body);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

// Proxy DELETE /api/v1/character/:id - Eliminar personaje
router.delete('/api/v1/character/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.delete(`${config.microserviceUrl}/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
});

export default router;