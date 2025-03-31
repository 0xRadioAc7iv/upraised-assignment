import { drizzle } from 'drizzle-orm/neon-http';
import { NEON_DB_URL } from '../config';

const db = drizzle(NEON_DB_URL);

export { db };
