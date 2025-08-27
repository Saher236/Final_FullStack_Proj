// server/seed.js
const bcrypt = require('bcrypt');
const createDB = require('./db');
const pool = createDB();

async function seedUsers() {
  await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  const users = [
    { username: 'saher',  password: 'saher',  role: 'admin', email: 'saher@example.com',  first_name: 'Saher',  last_name: 'Jammal' },
    { username: 'kareem', password: 'kareem', role: 'admin', email: 'kareem@example.com', first_name: 'Kareem', last_name: 'Hussien' },
  ];

  for (const u of users) {
    const password_hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users
         (username, email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [u.username, u.email, password_hash, u.first_name, u.last_name, u.role]
    );
    console.log(`Seeded user: ${u.username}`);
  }

  console.log('\nusers table has been reset and seeded.');
  process.exit(0);
}

seedUsers().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
