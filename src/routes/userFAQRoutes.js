const express = require('express');
const router = express.Router();
const { connectToDB } = require('../config/dbconnect')

const handleGetFAQs = async (req, res) => {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute('SELECT question, answer FROM FAQs');
        await connection.end();

        if (rows.length > 0) {
            res.status(200).json({
                success: true,
                message: 'Showing all items from the table',
                data: rows
            });
        } else {
            res.status(404).json({ success: false, message: 'No items have been found' });
        }
    } catch (err) {
        console.error('An error occurred while querying for FAQs: ', err.message);
        res.status(500).json({ success: false, message: 'A server error occurred...' });
    }
};


const handleAddNewFeedback = async (req, res) => {
    try {
        const { user_id, feedback_text } = req.body;

        if (!user_id || !feedback_text) {
            return res.status(400).json({
                success: false,
                message: 'Your POST request is missing a required field. The user ID or feedback text is empty.',
            });
        }

        if (user_id < 1) {
            return res.status(400).json({
                success: false,
                message: 'User ID must be a positive number.',
            });
        }

        const connection = await connectToDB();

        await connection.execute(
            'INSERT INTO Feedback (user_id, feedback_text) VALUES (?, ?)', 
            [user_id, feedback_text] 
        );

        await connection.end();

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