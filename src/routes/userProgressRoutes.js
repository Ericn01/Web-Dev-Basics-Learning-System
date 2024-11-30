const express = require('express');
const router = express.Router();
const { connectToDB } = require('../config/dbconnect.js')
const { authenticateToken } = require('../middleware/authJWT');

// Getting progress of logged-in user across modules

const getProgress = async () => {
    try {
        const connection = await connectToDB();
        const [progress] = await connection.execute(
            `SELECT 
                u.username, 
                p.progress_id,
                p.module_id,
                p.quiz_id,
                p.score,
                p.completed_at 
                FROM Users u 
                JOIN UserProgress p ON u.user_id = p.user_id 
                WHERE u.user_id = ?`,
            [user_id] 
        );

        const formattedProgress = {
            modules_completed: [],
            quizzes_completed: [],
            scores: {},
            recent_activity: []
        };

        progress.forEach(entry => {
            if (entry.module_id && !formattedProgress.modules_completed.includes(entry.module_id)) {
                formattedProgress.modules_completed.push(entry.module_id);
            }
            
            if (entry.quiz_id && !formattedProgress.quizzes_completed.includes(entry.quiz_id)) {
                formattedProgress.quizzes_completed.push(entry.quiz_id);
                formattedProgress.scores[`quiz_id_${entry.quiz_id}`] = entry.score;
                
                formattedProgress.recent_activity.push({
                    type: 'quiz',
                    id: entry.quiz_id,
                    score: entry.score,
                    completed_at: entry.completed_at
                });
            }
        });

        await connection.end();
        return formattedProgress;
    } catch (err) {
        throw new Error(`Error fetching progress: ${err.message}`);    }
};

// Updating user progress when completing a module or quiz

const updateModuleProgress = async (userId, moduleId) => {
    try {
        const connection = await connectToDB();
        await connection.execute(
            `INSERT INTO UserProgress (user_id, module_id, completed_at)
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE completed_at = NOW()`,
            [userId, moduleId]
        );
        await connection.end();
    } catch (err) {
        throw new Error(`Error updating module progress: ${err.message}`);
    }
};


// Updating user progress when completing a quiz
const updateQuizProgress = async (userId, moduleId, quizId, score) => {
    try {
        const connection = await connectToDB();
        await connection.execute(
            `INSERT INTO UserProgress (user_id, module_id, quiz_id, score, completed_at)
            VALUES (?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE 
                score = ?,
                completed_at = NOW()`,
            [userId, moduleId, quizId, score, score]
        );
        await connection.end();
    } catch (err) {
        throw new Error(`Error updating quiz progress: ${err.message}`);
    }
};

// Handler for getting user progress
const handleGetProgress = async (req, res) => {
    try {
        const userId = req.user.userId; // From JWT
        const progress = await getProgress(userId);
        res.json({ progress });
    } catch (err) {
        res.status(500).json({ 
            message: 'Error retrieving user progress', 
            error: err.message 
        });
    }
};

// Handler for updating module progress
const handleUpdateModuleProgress = async (req, res) => {
    try {
        const userId = req.user.userId; // From JWT
        const { moduleId } = req.body;

        if (!moduleId) {
            return res.status(400).json({ message: 'Module ID is required' });
        }

        await updateModuleProgress(userId, moduleId);
        res.json({ message: 'Module progress updated successfully' });
    } catch (err) {
        res.status(500).json({ 
            message: 'Error updating module progress', 
            error: err.message 
        });
    }
};

// Handler for updating quiz progress
const handleUpdateQuizProgress = async (req, res) => {
    try {
        const userId = req.user.userId; // From JWT
        const { moduleId, quizId, score } = req.body;

        if (!moduleId || !quizId || score === undefined) {
            return res.status(400).json({ 
                message: 'Module ID, Quiz ID, and score are required' 
            });
        }

        if (score < 0 || score > 100) {
            return res.status(400).json({ 
                message: 'Score must be between 0 and 100' 
            });
        }

        await updateQuizProgress(userId, moduleId, quizId, score);
        res.json({ message: 'Quiz progress updated successfully' });
    } catch (err) {
        res.status(500).json({ 
            message: 'Error updating quiz progress', 
            error: err.message 
        });
    }
};


router.get('/progress', authenticateToken, handleGetProgress);
router.post('/progress/module', authenticateToken, handleUpdateModuleProgress);
router.post('/progress/quiz', authenticateToken, handleUpdateQuizProgress);

module.exports = router;