import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3002,
  databaseUrl: process.env.DATABASE_URL || 'postgres://rickmorty_user:rickmorty_pass@localhost:5432/rickmorty_db',
  nodeEnv: process.env.NODE_ENV || 'development',
};
