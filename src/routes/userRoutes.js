const express = require('express');
const router = express.Router();
const { handleGetProfile, handleUpdateProfile } = require('../logic/userLogic');
const { authenticateToken } = require('../middleware/authJWT')

// 
router.get('/webdev-learning/api/user/profile', authenticateToken, handleGetProfile);
router.put('/webdev-learning/api/user/profile', authenticateToken, handleUpdateProfile);

module.exports = router;