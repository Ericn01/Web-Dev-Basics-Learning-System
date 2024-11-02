// Importing mysql2
const mysql = require('mysql2/promise')
require('dotenv').config()

// Setting up database config variables 

// This is the one that will be used in product, but right now I just want to test with a local connection
/** 
const dbConfig = {
    host: process.env.HOST_IP,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    port: process.env.PORT,
}
*/

// This will only work if the local mysql instance is running, the root password has been set to '12345', and the 'createdb.sql' file has been ran in mysql server.
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'WebDevLearning'
};

// Returning a database connection
const connectToDB = async() => {
    return await mysql.createConnection(dbConfig)
}


module.exports = { connectToDB };

