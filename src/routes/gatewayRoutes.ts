import { Router, Request, Response, NextFunction } from 'express';
import { forwardToMicroservice } from '../services/proxyService';

const router = Router();

router.get('/api/character/:name', async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const name = req.params.name as string;
    
    
    const data = await forwardToMicroservice(name);
    
    
    res.status(200).json(data);
  } catch (error) {

    next(error);
  }
});

export default router;