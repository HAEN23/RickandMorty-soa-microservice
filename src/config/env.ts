import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  microserviceUrl: process.env.MICROSERVICE_URL || 'http://localhost:3002/api/v1/character',
};