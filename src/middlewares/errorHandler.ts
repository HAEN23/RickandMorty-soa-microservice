import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🚨 Error capturado en el Gateway:", err.message);

  const status = err.response?.status || 500;
  
  if (status === 404) {
    return res.status(404).json({ 
      mensaje: "El Personaje no fue encontrado en nuestros registros." 
    });
  }

  res.status(status).json({
    mensaje: "Error interno del servidor: No pudimos conectar con el Microservicio de datos.",
  });
};