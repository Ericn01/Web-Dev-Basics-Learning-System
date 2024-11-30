const jwt = require('jsonwebtoken');

// Middleware to verify the json web token
const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token);
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [rows] = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);
      
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const [user] = await pool.query(
        'SELECT id, username, email, role FROM users WHERE id = ?',
        [decoded.userId]
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

