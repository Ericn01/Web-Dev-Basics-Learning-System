const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { dbconnect } = require('./dbconnect.js')

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};


// Register route (POST)
router.post('/webdev-learning/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const [existingUsers] = await dbconnect.execute(
      'SELECT * FROM Users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      await dbconnect.end();
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    await dbconnect.execute(
      'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    await dbconnect.end();
    res.status(201).json({ message: 'User was registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login route (POST)
router.post('/webdev-learning/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [users] = await dbconnect.execute(
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );

    await dbconnect.end();

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Logout route
router.post('/webdev-learning/api/logout', authenticateToken, (req, res) => {
  // Note: In a real implementation, you might want to blacklist the token
  res.json({ message: 'logged out successfully' });
});

// Get user profile (GET)
router.get('/webdev-learning/api/user/profile', authenticateToken, async (req, res) => {
  try {    
    // Get user information
    const [users] = await dbconnect.execute(
      'SELECT username, email FROM Users WHERE user_id = ?',
      [req.user.id]
    );

    // Get user progress
    const [progress] = await dbconnect.execute(
      'SELECT * FROM UserProgress WHERE user_id = ?',
      [req.user.id]
    );

    await connection.end();

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    res.json({
      username: user.username,
      email: user.email,
      progress: progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
});

// Update user profile (PUT)
router.put('/webdev-learning/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    if (!username && !email) {
      return res.status(400).json({ message: 'No update data provided' });
    }
    
    // Check if new username/email conflicts with existing users
    if (username || email) {
      const [existingUsers] = await dbconnect.execute(
        'SELECT * FROM Users WHERE (username = ? OR email = ?) AND user_id != ?',
        [username || '', email || '', req.user.id]
      );

      if (existingUsers.length > 0) {
        await dbconnect.end();
        return res.status(400).json({ message: 'Username or email already exists' });
      }
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    values.push(req.user.id);

    await dbconnect.execute(
      `UPDATE Users SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    await dbconnect.end();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router;