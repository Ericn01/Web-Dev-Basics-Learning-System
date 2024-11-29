// Importing mysql2
const mysql = require('mysql2/promise')
require('dotenv').config()

// Setting up database config variables 

// This is the one that will be used in product, but right now I just want to test with a local connection

const dbConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    port: process.env.PORT,
}

// Returning a database connection
const connectToDB = async() => {
    return await mysql.createConnection(dbConfig)
}


module.exports = { connectToDB };

