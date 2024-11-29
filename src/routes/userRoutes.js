const express = require('express');
const router = express.Router();
const { getProtectedProfile, updateProtectedProfile, handleGetAllUserProfiles } = require('../logic/userLogic');
// const { authenticateToken } = require('../middleware/authJWT') We don't need authentication right now

// Get and update user profile routes.
router.get('/user/profile', getProtectedProfile);
router.put('/user/profile', updateProtectedProfile);
router.get('/user/profiles', handleGetAllUserProfiles) // This is more so a testing route.

module.exports = router;