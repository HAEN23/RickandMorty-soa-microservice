import express from 'express';
import { config } from './config/env.js';
import { corsMiddleware } from './middlewares/cors.js';
import { errorHandler } from './middlewares/errorHandler.js';
import gatewayRoutes from './routes/gatewayRoutes.js';

const app = express();

//  Middlewares globales
app.use(express.json());
app.use(corsMiddleware);


app.use(gatewayRoutes);

// Manejo de errores 
app.use(errorHandler);

// 4. Inicializar servidor
app.listen(config.port, () => {
  console.log(`API Gateway enrutando de forma segura en http://localhost:${config.port}`);
});