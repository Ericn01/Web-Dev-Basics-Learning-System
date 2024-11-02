const express = require('express');
const router = express.Router();
const { handleGetProfile, handleUpdateProfile } = require('../logic/userLogic');
const { authenticateToken } = require('../middleware/authJWT')

// Get and update user profile routes.
router.get('/user/profile', authenticateToken, handleGetProfile);
router.put('/user/profile', authenticateToken, handleUpdateProfile);

module.exports = router;