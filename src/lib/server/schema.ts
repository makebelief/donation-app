import { db } from './db';
import fs from 'fs';
import path from 'path';

export function loadSchema() {
  if (!db) return;

  try {
    const schema = fs.readFileSync(path.join(process.cwd(), 'src/lib/server/schema.sql'), 'utf8');
    db.exec(schema);
    console.log('Database schema loaded successfully');
  } catch (error) {
    console.error('Error loading database schema:', error);
  }
} 