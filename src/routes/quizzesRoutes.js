const express = require('express')
const router = express.Router();

const handleGetQuizzes = async (req,res) => {
    try{}
    catch{}
}

const handleGetQuizzesByID = async (req,res) => {
    try{}
    catch{}
}

const handleQuizSubmit = async(req,res) => {
    try{}
    catch{}
}

router.get('/quizzes', handleGetQuizzes);
router.get('quizzes/:id', handleGetQuizzesByID);
router.post('/:id/submit', handleQuizSubmit);

module.exports = router;