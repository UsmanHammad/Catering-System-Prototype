// db.js
// Connects to the MySQL instance bundled with XAMPP.
// Default XAMPP MySQL credentials: host localhost, port 3306, user "root", empty password.
// If you set a root password in XAMPP's phpMyAdmin, put it in DB_PASSWORD below.

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",              // <-- set this if your XAMPP MySQL root user has a password
  database: "catering_system", // <-- must match the DB created by db/schema.sql
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
