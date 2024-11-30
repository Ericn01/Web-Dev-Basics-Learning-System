/**
 * This file contains the logic for user authentication tasks. These include registration, login, and logout.
 */

const { connectToDB } = require('../config/dbconnect')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 

// This is a helper function that helps with logins and registration.
const findUserByEmail = async (email) => {
    const connection = await connectToDB();
    try {
      const [users] = await connection.execute(
        'SELECT * FROM Users WHERE email = ?',
        [email]
      );
      return users[0];
    } finally {
      await connection.end();
    }
  };
  

// Another helper function for the logic to create a new user
const createUser = async (username, email, password, role = ROLES.USER) => {
    const connection = await connectToDB();
    try {
      // Start transaction
      await connection.beginTransaction();
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.execute(
        'INSERT INTO Users (username, email, hashed_password, role, is_active) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role]
      );
      
      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
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
        
        const userId = await createUser(username, email, password);
        
        // Generate JWT token after successful registration
        const token = jwt.sign(
        {
            userId,
            username,
            role: 'user'
        },
        process.env.JWT_SECRET,
        { expiresIn: '300h' }
        );
        
        res.status(201).json({
            message: 'User was registered successfully! Welcome, ' + username,
            token
        });
    } catch (err) {
        res.status(500).json({ message: 'Oops! An error occurred while registering the user: ', error: err.message });
    }
};

// Logic to handle a user login request.
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.hashed_password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT token after successful login
        const token = jwt.sign(
            { userId: user.user_id,
                username: user.username,
                role: user.role
             },
            process.env.JWT_SECRET,
            { expiresIn: '300h' }
        );
        
        res.status(200).json({
            message: 'Login successful',
            token
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
    handleLogout,
};