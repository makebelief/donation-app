import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';

async function getDb() {
  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  return open({
    filename: 'data/database.sqlite',
    driver: sqlite3.Database
  });
}

async function createAdmin() {
  try {
    const db = await getDb();

    // Create users table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
      )
    `);
    
    // Use a simple password for testing
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if admin already exists
    const existingAdmin = await db.get('SELECT id FROM users WHERE email = ?', 'admin@example.com');
    
    if (existingAdmin) {
      // Update the admin's password
      await db.run(`
        UPDATE users 
        SET password = ?, updated_at = datetime('now')
        WHERE email = ?
      `, [hashedPassword, 'admin@example.com']);
      console.log('Admin password updated successfully!');
    } else {
      // Create admin user
      await db.run(`
        INSERT INTO users (email, password, role, created_at, updated_at)
        VALUES (?, ?, 'ADMIN', datetime('now'), datetime('now'))
      `, ['admin@example.com', hashedPassword]);
      console.log('Admin user created successfully!');
    }

    console.log('Email: admin@example.com');
    console.log('Password: admin123');

    // Verify the admin exists
    const admin = await db.get('SELECT * FROM users WHERE email = ?', 'admin@example.com');
    console.log('Admin user in database:', { ...admin, password: '[REDACTED]' });

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin(); 