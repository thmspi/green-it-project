const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: " ", // Mettre votre mdp SQL ici
  database: "todo_app",
});

module.exports = pool;