/**
 * This file contains the logic for user authentication tasks. These include registration, login, and logout.
 */

const { connectToDB } = require('../config/dbconnect')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 

// This is a helper function that helps with logins and registration.
const findUserByEmail = async (email) => {
    const connection = await connectToDB();
    const [users] = connection.execute(
        'SELECT * FROM Users WHERE email = ?',
        [email]
    );
    await connection.end();
    return users[0];
};

// Another helper function for the logic to create a new user
const createUser = async (username, email, password) => {
    const connection = await connectToDB();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
        'INSERT INTO Users (username, email, hashed_password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
    );
    await connection.end();
};

// User registration request handler.
const handleRegistration = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required to register' });
        }
        
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'The given username already exists in the database' });
        }
        
        await createUser(username, email, password);
        
        // Generate JWT token after successful registration
        const token = jwt.sign(
            { username: username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            message: 'User was registered successfully! Welcome, ' + username,
            token: token
        });
    } catch (err) {
        res.status(500).json({ message: 'Oops! An error occurred while registering the user: ', error: err.message });
    }
};

// Logic to handle a user login request.
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        
        const validPassword = await bcrypt.compare(password, user.hashed_password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        
        // Generate JWT token after successful login
        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '300h' }
        );
        
        res.status(200).json({
            message: 'Login successful',
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

// Handle logout - now invalidates the token
const handleLogout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    handleRegistration,
    handleLogin,
    handleLogout
};