const express = require('express');
const router = express.Router();
const { conn } = require('../config/db')

const handleGetModules = async (req,res) => {
    try {}
    catch {}
}

const handleGetModulesByID = async (req,res) => {
    try{
        let id = req.params.id;

        const connection = await conn();
        const [rows] = await connection.execute(
            'SELECT * FROM Modules WHERE module_id = ?', [id]
        );
        await connection.end();
        if (rows.length > 0) {
            const { module_id, title, module_description, content, banner_image_path, created_at } = rows[0];
            res.status(200).json({
                success: true,
                message: `We found the following module with module ID ${id}`,
                data: {module_id, title, module_description, content, banner_image_path}
            });
        } else {
            res.status(404).json({message: 'Module not found'})
        }
    }
    catch(err){
        console.error('An error occured while finding the module with the specified ID', err.message);
        res.status(500).json({message: 'A server error occured...'});
    }
}

router.get('/modules', handleGetModules);
router.get('/modules/:id', handleGetModulesByID)

module.exports  = router;