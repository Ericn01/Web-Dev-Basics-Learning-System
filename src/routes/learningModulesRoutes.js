const express = require('express');
const router = express.Router();

const handleGetModules = async (req,res) => {
    try {}
    catch {}
}

const handleGetModulesByID = async (req,res) => {
    try{}
    catch{}
}

router.get('/modules', handleGetModules);
router.get('/modules/:id', handleGetModulesByID)

module.exports  = router;