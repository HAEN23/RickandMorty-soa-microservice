import express from 'express';
import { config } from './config/env';
import { corsMiddleware } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import gatewayRoutes from './routes/gatewayRoutes';

const app = express();

//  Middlewares globales
app.use(express.json());
app.use(corsMiddleware);


app.use(gatewayRoutes);

// Manejo de errores 
app.use(errorHandler);

// 4. Inicializar servidor
app.listen(config.port, () => {
  console.log(`🛡️  API Gateway enrutando de forma segura en http://localhost:${config.port}`);
});