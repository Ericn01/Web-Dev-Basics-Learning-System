const express = require('express');
const router = express.Router();
const { handleGetAllUserProfiles, handleGetProfile, handleUpdateProfile } = require('../logic/userLogic');
const { authenticateToken } = require('../middleware/authJWT');

// Get and update user profile routes.
router.get('/user/profile', authenticateToken, handleGetProfile);
router.put('/user/profile', authenticateToken, handleUpdateProfile);
router.get('/user/profiles', handleGetAllUserProfiles) // This is more so a testing route.

module.exports = router;