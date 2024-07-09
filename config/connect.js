require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to the database!");
    connection.release();
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
}

testConnection();

module.exports = pool;
