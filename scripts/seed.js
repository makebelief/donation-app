import { seedDatabase } from '../src/lib/seed.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Seeding database...');
seedDatabase();
console.log('Database seeding completed.'); 