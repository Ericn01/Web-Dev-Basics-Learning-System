const ROLES = {
    USER: 'user',
    ADMIN: 'admin'
};

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking permissions' });
  }
};

const handlePromoteToAdmin = async (req, res) => {
  const connection = await connectToDB();
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    await connection.execute(
      'UPDATE Users SET role = ? WHERE user_id = ?',
      [ROLES.ADMIN, user_id]
    );

    res.json({ message: 'User promoted to admin successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to promote user' });
  } finally {
    await connection.end();
  }
};

module.exports = { isAdmin, handlePromoteToAdmin }
  