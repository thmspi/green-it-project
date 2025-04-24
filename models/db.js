const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Ammouna1012",
  database: "todo_app",
});

module.exports = pool;
