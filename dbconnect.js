// Importing mysql2
const mysql = require('mysql2/promise')
require('dotenv').config()

// Setting up database config variables 

// This is the one that will be used in product, but right now I just want to test with a local connection
/** 
const dbconnect = mysql.createPool({
    host: process.env.HOST_IP,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE, 
    port: process.env.PORT,
}).promise();
*/

const dbconnect = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: ''
})

// Query some data (test)
async function getUsers() {
    const [results] = await dbconnect.query("SELECT * FROM Users")
    return results;
}

const users = getUsers();
console.log(users)

module.exports = { dbconnect };

