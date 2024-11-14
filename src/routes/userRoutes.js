const express = require('express');
const router = express.Router();
const { handleGetProfile, handleUpdateProfile, handleGetAllUserProfiles } = require('../logic/userLogic');
// const { authenticateToken } = require('../middleware/authJWT') We don't need authentication right now

// Get and update user profile routes.
router.get('/user/profile', handleGetProfile);
router.put('/user/profile', handleUpdateProfile);
router.get('/user/profiles', handleGetAllUserProfiles) // This is more so a testing route.

module.exports = router;