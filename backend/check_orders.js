import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'amazon_clone',
  password: 'password',
  port: 5432,
});

async function check() {
    try {
        const res = await pool.query('SELECT id, status FROM orders');
        console.log(JSON.stringify(res.rows));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}
check();
