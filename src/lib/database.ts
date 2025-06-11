import sqlite3 from 'sqlite3';
import { Database as SQLiteDatabase, open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';

// Database interface
interface DatabaseInstance extends SQLiteDatabase {
  get(sql: string, ...params: any[]): Promise<any>;
  all(sql: string, ...params: any[]): Promise<any[]>;
  run(sql: string, ...params: any[]): Promise<{ lastID: number; changes: number }>;
  exec(sql: string): Promise<void>;
}

// Ensure the data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'database.sqlite');

// Initialize database connection
async function initializeDatabase(): Promise<DatabaseInstance> {
  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Open database connection
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    // Read and execute schema.sql
    const schema = await fs.readFile(
      path.join(process.cwd(), 'src', 'lib', 'schema.sql'),
      'utf-8'
    );

    // Split schema into individual statements and execute them
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    for (const statement of statements) {
      await db.run(statement);
    }

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Database wrapper class
class Database {
  private static instance: Database | null = null;
  private db: DatabaseInstance | null = null;

  private constructor() {}

  static async getInstance(): Promise<Database> {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.db = await initializeDatabase();
    }
    return Database.instance;
  }

  async get(sql: string, ...params: any[]): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    try {
      return await this.db.get(sql, ...params);
    } catch (error) {
      console.error('Database get error:', error);
      throw error;
    }
  }

  async all(sql: string, ...params: any[]): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    try {
      return await this.db.all(sql, ...params);
    } catch (error) {
      console.error('Database all error:', error);
      throw error;
    }
  }

  async run(sql: string, ...params: any[]): Promise<{ lastID: number; changes: number }> {
    if (!this.db) throw new Error('Database not initialized');
    try {
      return await this.db.run(sql, ...params);
    } catch (error) {
      console.error('Database run error:', error);
      throw error;
    }
  }

  async exec(sql: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    try {
      return await this.db.exec(sql);
    } catch (error) {
      console.error('Database exec error:', error);
      throw error;
    }
  }

  async transaction<T>(callback: (db: DatabaseInstance) => Promise<T>): Promise<T> {
    if (!this.db) throw new Error('Database not initialized');
    try {
      await this.db.run('BEGIN TRANSACTION');
      const result = await callback(this.db);
      await this.db.run('COMMIT');
      return result;
    } catch (error) {
      if (this.db) await this.db.run('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    }
  }
}

// Initialize and export singleton instance
const dbInstance = await Database.getInstance();
export const db = {
  get: (...args: Parameters<typeof dbInstance.get>) => dbInstance.get(...args),
  all: (...args: Parameters<typeof dbInstance.all>) => dbInstance.all(...args),
  run: (...args: Parameters<typeof dbInstance.run>) => dbInstance.run(...args),
  exec: (...args: Parameters<typeof dbInstance.exec>) => dbInstance.exec(...args),
  transaction: <T>(callback: (db: DatabaseInstance) => Promise<T>) => dbInstance.transaction(callback)
}; 