// Importing mysql2
const mysql = require('mysql2/promise')
require('dotenv').config()

// Setting up the database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DBPASSWORD,
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

// Returning a database connection
const connectToDB = () => {
    return mysql.createPool(dbConfig);
}


module.exports = { connectToDB };

