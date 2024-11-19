const express = require('express');
const router = express.Router();

// The logic for this function will be to either return an item list by name (if a name query param is provided), or all items if none is provided
const handleGetFAQs = async (req, res) => {
    try {
        const connection = await conn();

        [rows] = await connection.execute('SELECT * FROM FAQs');
        await connection.end();
        if (rows.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Showing all items from the table',
                data: rows
            });
        } else {
            res.status(404).json({ message: 'No item have been found' });
        }
    }
    
    catch(err) {
        console.error(
            req.query.item_name ? 'An error occurred while querying for FAQs: ' : err.message
        );
        res.status(500).json({ message: 'A server error occured...'})
    }
};



// Add new feedback through user submission
const handleAddNewItem = async (req, res) => {
    try{
        const {user_id, feedback } = req.body; 

        // Adding some input validation
        if (!user_id || !feedback){
            return res.status(400).json({
                sucess: false,
                message: `Your POST request is missing a required field. The new feedback's user id or feedback is empty`});
        };

        // Validating the quantity and price to make sure that they're positive values
        if (user_id < 0){
            return res.status(400).json({
                success: false,
                message: `User id most be a positive number.`});
        };

        const connection = await conn(); // Establishing a database connection 

        await connection.execute(
            'INSERT INTO Items (item_name, quantity, price, supplier_id) VALUES (?, ?, ?, ?)', [item_name, quantity, price, supplier_id] // Prepared statement
        );

        await connection.end();
        res.status(201).json({
            success: true,
            message: 'Item added successfully',
            data: {
                item_name,
                quantity,
                price,
                supplier_id
            }
        });
    } catch (err){
        console.error('An error occured while adding the new item: ', err);
        res.status(500).json({message: 'A server error occured...'});
    }
}

router.get('/faqs', handleGetFAQs); 
router.post('/feedback', handleAddNewItem)

module.exports = router;



