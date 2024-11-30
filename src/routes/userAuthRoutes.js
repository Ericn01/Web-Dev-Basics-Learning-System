const express = require('express');
const router = express.Router();
const { handleRegistration, handleLogin, handleLogout } = require('../logic/userAuthLogic');
const { authenticateToken } = require('../middleware/authJWT');
const { isAdmin, handlePromoteToAdmin } = require('../middleware/isAdmin');

// Connecting the user post routes (authentication routes) to the logic functions.
router.post('/register', handleRegistration);
router.post('/login', authenticateToken, handleLogin);
router.post('/logout', authenticateToken, handleLogout);
router.post('/admin/promote', authenticateToken, isAdmin, handlePromoteToAdmin);

module.exports = router;