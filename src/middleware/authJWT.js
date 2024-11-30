const jwt = require('jsonwebtoken');
const { connectToDB } = require('../config/dbconnect.js');
// Middleware to verify the json web token
const authenticateToken = async (req, res, next) => {
    const connect = await connectToDB();
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [rows] = await connect.execute('SELECT * FROM Tokens WHERE token = ?', [token]);
      
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const [user] = await connect.execute(
        'SELECT user_id, username, email, user_role FROM Users WHERE user_id = ?',
        [decoded.user_id]
      );

      if (user.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user[0];
      next();

    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
  

  module.exports = { authenticateToken }

