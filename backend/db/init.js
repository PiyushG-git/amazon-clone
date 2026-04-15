const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function initDB() {
    try {
        console.log('Connecting to database...');
        // Execute schema.sql
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql')).toString();
        await db.query(schema);
        console.log('Schema created successfully.');

        // Execute seed.sql
        const seed = fs.readFileSync(path.join(__dirname, 'seed.sql')).toString();
        await db.query(seed);
        console.log('Data seeded successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initDB();
