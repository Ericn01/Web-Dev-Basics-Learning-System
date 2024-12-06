const express = require('express');
const router = express.Router();
const { connectToDB } = require('../config/dbconnect')

const handleGetModules = async (req, res) => {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute('SELECT * FROM Modules');
        await connection.end();
        if (rows.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Modules retrieved successfully',
                data: rows // Send all rows of data
            });
        } else {
            res.status(404).json({ message: 'No modules found' });
        }
    } catch (err) {
        console.error('Error retrieving modules:', err);
        res.status(500).json({ message: 'A server error occurred' });
    }
};

const handleGetModulesByID = async (req,res) => {
    try{
        let id = req.params.id;

        const connection = await connectToDB();
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

const handleAddModule = async (req,res) => {
    try{
        let { title, module_description, content, banner_image_path } = req.body;

        // Make sure that the necessary content isn't missing
        if (!title || !module_description || !content) {
            return res.status(400).json({
            success: false,
            message: 'Please fill out all required fields: title, description, and content',
            });
        }
    
        // Validate input lengths based on schema
        if (title.length > 50 || module_description.length > 255) {
            return res.status(400).json({
            success: false,
            message: 'Title or description exceeds maximum length',
            });
        }
        const connection = await connectToDB();

        const [result] = await connection.execute(
            `INSERT INTO Modules (title, module_description, content, banner_image_path)
            VALUES (?, ?, ?, ?)`, [title, module_description, content, banner_image_path || null]   
        );

        if (result.insertId){
            res.status(200).json({
                success: true,
                message: `The module has been added successfully.`,
                data: {module_id: result.insertId, 
                    title, module_description, content, banner_image_path}
            });
        } 
        await connection.end()
    }
    catch(err){
        console.error('An error creating the new module', err.message);
        res.status(500).json({
            success: false,
            message: 'An error occured while creating the module'});
    }
}

// Edit Module Route
const handleEditModule = async (req, res) => {
    try {
      const { module_id } = req.params;
      const { title, module_description, content, banner_image_path } = req.body;
  
      // Validate that at least one field is being updated
      if (!title && !module_description && !content && !banner_image_path) {
        return res.status(400).json({
          success: false,
          message: 'Please provide at least one field to update'
        });
      }
  
      // Validate input lengths if provided
      if (title && title.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Title exceeds maximum length of 50 characters'
        });
      }
  
      if (module_description && module_description.length > 255) {
        return res.status(400).json({
          success: false,
          message: 'Description exceeds maximum length of 255 characters'
        });
      }
  
      const connection = await connectToDB();
  
      // Build dynamic UPDATE query based on provided fields
      const updates = [];
      const values = [];
  
      if (title) {
        updates.push('title = ?');
        values.push(title);
      }
      if (module_description) {
        updates.push('module_description = ?');
        values.push(module_description);
      }
      if (content) {
        updates.push('content = ?');
        values.push(content);
      }
      if (banner_image_path) {
        updates.push('banner_image_path = ?');
        values.push(banner_image_path);
      }
  
      // Add module_id to values array
      values.push(module_id);
  
      const [result] = await connection.execute(
        `UPDATE Modules 
         SET ${updates.join(', ')}
         WHERE module_id = ?`,
        values
      );
  
      await connection.end();
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Module not found'
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Module updated successfully',
        data: {
          module_id,
          ...req.body
        }
      });
    } catch (err) {
      console.error('Error updating module:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the module',
      });
    }
  };
  

router.get('/modules', handleGetModules);
router.get('/modules/:id', handleGetModulesByID);
router.put('/modules/:id', handleEditModule);
router.post('/modules', handleAddModule);

module.exports  = router;