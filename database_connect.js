// Importing mysql2
const mysql = require('mysql2')
require('dotenv').config()

// Setting up database config variables 
const dbconnect = mysql.createPool({
    host: process.env.HOST_IP,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    port: process.env.PORT,
}).promise();

// Query some data (test)
async function getUsers() {
    const [results] = await dbconnect.query("SELECT * FROM Users")
    return results;
}

const users = getUsers();
console.log(users)

