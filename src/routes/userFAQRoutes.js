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
const handleAddNewFeedback = async (req, res) => {
    try {
        const { user_id, feedback_text } = req.body;

        // Adding some input validation
        if (!user_id || !feedback_text) {
            return res.status(400).json({
                success: false,
                message: 'Your POST request is missing a required field. The user ID or feedback text is empty.',
            });
        }

        // Validating user_id to make sure it's a positive number
        if (user_id < 1) {
            return res.status(400).json({
                success: false,
                message: 'User ID must be a positive number.',
            });
        }

        // Create a database connection
        const connection = await conn(); // Assuming `conn` is a function to create a DB connection

        // Prepare and execute the insert query
        await connection.execute(
            'INSERT INTO Feedback (user_id, feedback_text) VALUES (?, ?)', 
            [user_id, feedback_text] // Use parameterized queries to prevent SQL injection
        );

        await connection.end(); // Close the database connection

        // Respond with a success message
        res.status(201).json({
            success: true,
            message: 'Feedback added successfully.',
            data: { user_id, feedback_text },
        });

    } catch (err) {
        console.error('An error occurred while adding the new feedback: ', err);
        res.status(500).json({
            success: false,
            message: 'A server error occurred while adding feedback.',
        });
    }
}


router.get('/faqs', handleGetFAQs); 
router.post('/feedback', handleAddNewFeedback)

module.exports = router;



