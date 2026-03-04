import cors from 'cors';
import { config } from '../config/env';

export const corsMiddleware = cors({
  origin: config.frontendUrl,
  methods: ['GET'], // Solo lectura
});