import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../../data');
try {
    if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
    }
} catch (error) {
    console.error('Error creating data directory:', error);
}

// Initialize database
const dbPath = path.join(dataDir, 'donation.db');
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Load and execute schema if it hasn't been loaded yet
try {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    sqlite.exec(schema);
} catch (error) {
    console.error('Error loading or executing schema:', error);
}

// Database wrapper
export const db = {
    query: <T>(sql: string, params: any[] = []): T[] => {
        try {
            const stmt = sqlite.prepare(sql);
            return stmt.all(...params) as T[];
        } catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    },
    queryOne: <T>(sql: string, params: any[] = []): T | undefined => {
        try {
            const stmt = sqlite.prepare(sql);
            return stmt.get(...params) as T;
        } catch (error) {
            console.error('Database queryOne error:', error);
            return undefined;
        }
    },
    execute: (sql: string, params: any[] = []): void => {
        try {
            const stmt = sqlite.prepare(sql);
            stmt.run(...params);
        } catch (error) {
            console.error('Database execute error:', error);
        }
    }
};

// Helper functions for projects
export const getProjects = () => {
  return sqlite.all('SELECT * FROM projects ORDER BY created_at DESC');
};

export const getProject = (id: number) => {
  return sqlite.get('SELECT * FROM projects WHERE id = ?', id);
};

export const createProject = (project: { title: string; description: string; target_amount: number }) => {
  const { title, description, target_amount } = project;
  return sqlite.run('INSERT INTO projects (title, description, target_amount) VALUES (?, ?, ?)', title, description, target_amount);
};

// Helper functions for donations
export const createDonation = (donation: { 
  project_id: number; 
  amount: number; 
  phone_number: string;
}) => {
  const { project_id, amount, phone_number } = donation;
  return sqlite.run('INSERT INTO donations (project_id, amount, phone_number) VALUES (?, ?, ?)', project_id, amount, phone_number);
};

export const updateDonationStatus = (id: number, status: string, mpesa_receipt?: string) => {
  return sqlite.run('UPDATE donations SET status = ?, mpesa_receipt = ? WHERE id = ?', status, mpesa_receipt, id);
};

export const getDonationsByProject = (project_id: number) => {
  return sqlite.all('SELECT * FROM donations WHERE project_id = ? ORDER BY timestamp DESC', project_id);
};

export const updateProjectAmount = (project_id: number, amount: number) => {
  return sqlite.run('UPDATE projects SET raised_amount = raised_amount + ? WHERE id = ?', amount, project_id);
};

export default sqlite; 