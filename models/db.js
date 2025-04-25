const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "imanou",
  database: "todo_app",
});

module.exports = pool;
