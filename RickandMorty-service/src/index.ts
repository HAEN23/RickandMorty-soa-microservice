import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { checkDatabaseConnection } from './config/database.js';
import characterRoutes from './routes/RickandMorty.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'rickmorty-service',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/v1/character', characterRoutes);

// Manejo de errores
app.use(errorHandler);

// Ruta 404 - debe ir al final
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    const dbConnected = await checkDatabaseConnection();
    
    if (!dbConnected) {
      console.error('No se pudo establecer conexión con la base de datos');
      process.exit(1);
    }
    
    // Iniciar servidor
    app.listen(config.port, () => {
      console.log(` Microservicio de Rick and Morty ejecutándose en puerto ${config.port}`);
      console.log(` Ambiente: ${config.nodeEnv}`);
      console.log(`  Base de datos: Conectada`);
      console.log(` Health check: http://localhost:${config.port}/health`);
      console.log(` API: http://localhost:${config.port}/api/v1/character`);
    });
    
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
