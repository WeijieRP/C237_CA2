// db.js
import mysql from 'mysql2/promise'; // Using promise version

const pool = mysql.createPool({
  host: 'localhost',   // Your MySQL server
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
