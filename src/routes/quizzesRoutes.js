const express = require('express')
const router = express.Router();

const handleGetQuizzes = async (req,res) => {
    try{
        const connection = await conn();
        const [rows] = await connection.execute('SELECT * From Quizzes');
        await connection.end();
        if (rows.length > 0) {
            const { quiz_id, module_id, title } = rows[0];
            res.status(200).json({
                success: true,
                message: `We found the following quiz with quiz ID ${id}`,
                data: {quiz_id, module_id, title}
            });
        } else {
            res.status(404).json({message: 'No quzzes have been found'})
        }
    }
    catch(err){
        console.error('An error occured while fetching all quizzes...', err.message);
        res.status(500).json({message: 'A server error occured...'});
    }
}

const handleGetQuizzesByID = async (req,res) => { // To be changed later when person responsible implements questions routes
    try{
        let id = req.params.id;

        const connection = await conn();
        const [rows] = await connection.execute(
            'SELECT * FROM Quizzes WHERE quiz_id = ?', [id]
        );
        await connection.end();
        if (rows.length > 0) {
            const { quiz_id, module_id, title } = rows[0];
            res.status(200).json({
                success: true,
                message: `We found the following quiz with quiz ID ${id}`,
                data: {quiz_id, module_id, title}
            });
        } else {
            res.status(404).json({message: 'Module not found'})
        }
    }
    catch(err){
        console.error('An error occured while finding the quiz with the specified ID', err.message);
        res.status(500).json({message: 'A server error occured...'});
    }
}

const handleQuizSubmit = async(req,res) => {
    try{}
    catch{}
}

router.get('/quizzes', handleGetQuizzes);
router.get('quizzes/:id', handleGetQuizzesByID);
router.post('/:id/submit', handleQuizSubmit);

module.exports = router;