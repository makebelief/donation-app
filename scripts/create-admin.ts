import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { createInterface } from 'readline';

const db = new Database('donation.db');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  try {
    const email = await askQuestion('Enter admin email: ');
    const password = await askQuestion('Enter admin password: ');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the admin user
    db.prepare(`
      INSERT INTO users (email, password, role, created_at, updated_at)
      VALUES (?, ?, 'ADMIN', datetime('now'), datetime('now'))
    `).run(email, hashedPassword);

    console.log('Admin user created successfully!');
    console.log('You can now log in at /login');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    rl.close();
    db.close();
  }
}

createAdmin(); 