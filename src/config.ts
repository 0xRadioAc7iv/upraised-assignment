import env from 'env-var';
import { configDotenv } from 'dotenv';

configDotenv();

export const LOGGING_DIRECTORY = './logs/';

export const NEON_DB_URL = env.get('DATABASE_URL').required().asString();
