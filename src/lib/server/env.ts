import { DB_PATH } from '$env/static/private';

export const config = {
  dbPath: DB_PATH || 'data/database.sqlite'
}; 