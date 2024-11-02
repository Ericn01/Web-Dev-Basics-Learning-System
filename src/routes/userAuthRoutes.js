const express = require('express');
const router = express.Router();
const { handleRegistration, handleLogin, handleLogout } = require('../logic/userAuthLogic');
const { authenticateToken } = require('../middleware/authJWT');

// Connecting the user post routes (authentication routes) to the logic functions.
router.post('/webdev-learning/api/register', handleRegistration);
router.post('/webdev-learning/api/login', handleLogin);
router.post('/webdev-learning/api/logout', authenticateToken, handleLogout);

module.exports = router;