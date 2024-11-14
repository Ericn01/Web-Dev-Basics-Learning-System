const express = require('express');
const router = express.Router();
const { handleRegistration, handleLogin, handleLogout } = require('../logic/userAuthLogic');
// const { authenticateToken } = require('../middleware/authJWT');

// Connecting the user post routes (authentication routes) to the logic functions.
router.post('/register', handleRegistration);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);

module.exports = router;