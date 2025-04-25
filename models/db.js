const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "sql111.infinityfree.com",
  user: "if0_38832491",
  password: "VuxB88EhoP",
  database: "if0_38832491_green_it",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
