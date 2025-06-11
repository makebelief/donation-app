import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const dbPath = process.env.DB_PATH || join(__dirname, '../../../donation.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    target_amount INTEGER,
    raised_amount INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    amount INTEGER,
    phone_number TEXT,
    mpesa_receipt TEXT,
    status TEXT DEFAULT 'pending',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  );
`);

// Helper functions for projects
export const getProjects = () => {
  return db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
};

export const getProject = (id) => {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
};

export const createProject = (project) => {
  const { title, description, target_amount } = project;
  const stmt = db.prepare(
    'INSERT INTO projects (title, description, target_amount) VALUES (?, ?, ?)'
  );
  return stmt.run(title, description, target_amount);
};

// Helper functions for donations
export const createDonation = (donation) => {
  const { project_id, amount, phone_number } = donation;
  const stmt = db.prepare(
    'INSERT INTO donations (project_id, amount, phone_number) VALUES (?, ?, ?)'
  );
  return stmt.run(project_id, amount, phone_number);
};

export const updateDonationStatus = (id, status, mpesa_receipt) => {
  const stmt = db.prepare(
    'UPDATE donations SET status = ?, mpesa_receipt = ? WHERE id = ?'
  );
  return stmt.run(status, mpesa_receipt, id);
};

export const getDonationsByProject = (project_id) => {
  return db.prepare('SELECT * FROM donations WHERE project_id = ? ORDER BY timestamp DESC').all(project_id);
};

export const updateProjectAmount = (project_id, amount) => {
  const stmt = db.prepare(
    'UPDATE projects SET raised_amount = raised_amount + ? WHERE id = ?'
  );
  return stmt.run(amount, project_id);
};

export default db; 