import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
async function testConnection() {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to the database');
      connection.release();
    } catch (error) {
      console.error('Error connecting to the database:', error.message);
    }
  }
  
  testConnection();
  


export default pool;