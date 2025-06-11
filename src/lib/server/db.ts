import Database from 'better-sqlite3';
import { building } from '$app/environment';
import { config } from './env';

// Don't initialize during build
const db = !building ? new Database(config.dbPath) : null;

if (db) {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
}

export { db }; 