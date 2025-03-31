import env from 'env-var';
import { configDotenv } from 'dotenv';

configDotenv();

export const LOGGING_DIRECTORY = './logs/';

export const NEON_DB_URL = env.get('DATABASE_URL').required().asString();

export const JWT_ACCESS_TOKEN_SECRET = env
  .get('JWT_ACCESS_TOKEN_SECRET')
  .required()
  .asString();

export const JWT_REFRESH_TOKEN_SECRET = env
  .get('JWT_REFRESH_TOKEN_SECRET')
  .required()
  .asString();
