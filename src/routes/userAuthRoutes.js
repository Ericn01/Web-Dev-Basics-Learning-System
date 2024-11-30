const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authJWT');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectToDB } = require('../config/dbconnect')
const { isAdmin, handlePromoteToAdmin } = require('../middleware/isAdmin');

const handleRegistration = async (req, res) => {
    const { username, email, password } = req.body;
    const connect = await connectToDB();
    try {
      // Input validation
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
  
      // Password validation
      if (password.length < 5) {
        return res.status(400).json({ message: 'Password must be at least 5 characters' });
      }
  
      // Check for existing user
      const [existingUser] = await connect.query(
        'SELECT * FROM Users WHERE email = ? OR username = ?',
        [email, username]
      );
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create user
      const [result] = await connect.query(
        'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
  
      // Generate token
      const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: '24h' });
  
      // Store token
      await connect.query(
        'INSERT INTO tokens (user_id, token) VALUES (?, ?)',
        [result.insertId, token]
      );
  
      res.status(201).json({
        message: 'User created successfully',
        token,
        role: 'user'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const connect = await connectToDB();
    try {
        // Input validation
        if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
        }
    
        // Find user
        const [users] = await connect.query(
        'SELECT * FROM Users WHERE email = ?',
        [email]
        );
    
        if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const user = users[0];
    
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
        // Store token
        await connect.query(
            'INSERT INTO Tokens (user_id, token) VALUES (?, ?)',
            [user.id, token]
        );
    
        res.json({
            token,
            role: user.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


const handleLogout = async (req, res) => {
    const connect = await connectToDB();
    try {
      const token = req.headers.authorization.split(' ')[1];
      await connect.query('DELETE FROM Tokens WHERE token = ?', [token]);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};
// Connecting the user post routes (authentication routes) to the logic functions.
router.post('/register', handleRegistration);
router.post('/login', handleLogin);
router.post('/logout', authenticateToken, handleLogout);
router.post('/admin/promote', authenticateToken, isAdmin, handlePromoteToAdmin);

module.exports = router;