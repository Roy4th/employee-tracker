const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.mysql_password,
    database: 'employeedb'
});

module.exports = db;