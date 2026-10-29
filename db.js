const mysql = require('mysql2')

// create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',    // your host (default: localhost)
    user: 'root',         // your MySQL username
    password: 'password', // your MySQL password
    database: 'collegeDB'    // your database name
});

// check database connection

db.connect((err) => {
    if (err) {
         console.log('Database connection failed:', err.message);
        return;
    } else {
        console.log('connected to MySQL database');
    }
});

module.exports = db;