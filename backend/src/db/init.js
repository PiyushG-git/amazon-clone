import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function initDB() {
    try {
        console.log('Connecting to database...');
        // Execute schema.sql
        const schema = fs.readFileSync(path.join(__dirname, '../models/schema.sql')).toString();
        await db.query(schema);
        console.log('Schema created successfully.');

        // Execute seed.sql
        const seed = fs.readFileSync(path.join(__dirname, '../models/seed.sql')).toString();
        await db.query(seed);
        console.log('Data seeded successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initDB();
