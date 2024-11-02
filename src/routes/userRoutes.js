const express = require('express');
const router = express.Router();
const { handleGetProfile, handleUpdateProfile, handleGetAllUserProfiles } = require('../logic/userLogic');
const { authenticateToken } = require('../middleware/authJWT')

// Get and update user profile routes.
router.get('/user/profile', authenticateToken, handleGetProfile);
router.put('/user/profile', authenticateToken, handleUpdateProfile);
router.get('/user/profiles', handleGetAllUserProfiles)

module.exports = router;