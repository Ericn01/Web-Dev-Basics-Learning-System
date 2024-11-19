const express = require('express')
const router = express.Router();

const handleGetQuizzes = async (req, res) => {
    try {
        const connection = await conn();

        const [quizzes] = await connection.execute('SELECT * FROM Quizzes');

        if (quizzes.length === 0) {
            return res.status(404).json({ success: false, message: 'No quizzes have been found' });
        }

        const quizData = await Promise.all(
            quizzes.map(async (quiz) => {
                // Fetch questions for this quiz
                const [questions] = await connection.execute(
                    'SELECT * FROM Questions WHERE quiz_id = ?',
                    [quiz.quiz_id]
                );

                const questionsWithOptions = await Promise.all(
                    questions.map(async (question) => {
                        const [options] = await connection.execute(
                            'SELECT * FROM Options WHERE question_id = ?',
                            [question.question_id]
                        );
                        return {
                            ...question,
                            options, // Include options for this question
                        };
                    })
                );

                // Return quiz along with its questions and options
                return {
                    ...quiz,
                    questions: questionsWithOptions,
                };
            })
        );

        await connection.end();

        res.status(200).json({
            success: true,
            message: 'Quizzes fetched successfully',
            data: quizData,
        });
    } catch (err) {
        console.error('An error occurred while fetching quizzes...', err.message);
        res.status(500).json({ success: false, message: 'A server error occurred...' });
    }
};

const handleGetQuizzesByID = async (req,res) => { // To be changed later when person responsible implements questions routes
    try{
        let id = req.params.id;

        const connection = await conn();
        const [rows] = await connection.execute(
            `SELECT
                q.quiz_id,
                q.title AS quiz_title
                qs.question_id
                qs.question_text,
                qs.correct_answer,
                o.option_id,
                o.option_text
            FROM Quizzes q
            LEFT JOIN Questions qs ON q.quiz_id = qs.quiz_id
            LEFT JOIN Options o ON qs.question_id = o.question_id
            WHERE q.quiz_ id = ?
            ORDER BY qs.question_id, o.option_id;`,
            [id]
        );

        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({message: 'Quiz not found with the specified ID'})
        }
        const quiz = {
            quiz_id: rows[0].quiz_id,
            title: rows[0].quiz_title,
            questions: []
        };

        const questionMap = new Map();

        rows.forEach(row => {
            if (!questionMap.has(row.question_id)) {
                const question = {
                    question_id: row.question_id,
                    question_text: row.question_text,
                    correct_answer: row.correct_answer,
                    options: [],
                };
                quiz.questions.push(question);
                questionMap.set(row.question_id, question);
            }
            if (row.option_id) {
                questionMap.get(row.question_id).options.push({
                    option_id: row.option_id,
                    option_text: row.option_text
                });
            }
        });

        res.status(200).json({
            success:true,
            message: `We found quiz with quiz ID ${id}`,
            data: quiz
        });
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

const handleQuizAddQuestion = async(req, res) => {
    try{
        const { id } = req.params;
        const { questions } = req.body;

        if (!questions || !Array.isArray(questions) || questions.length === 0 ) {
            return res.status(400).json({
                success:false,
                message: 'Invalid questions format. Questions should be a non-empty array'
            });
        }

        const connection = await conn();

        const [quizRows] = await connection.execute ('SELECT * FROM Quizzes WHERE quiz_id = ?', [id])
        if (quizRows.length === 0) {
            await connection.end();
            return res.status(404).json({
                success:false,
                message:'Quiz does not exist'
            });
        }

        for (const question of questions) {
            const { question_text, correct_answer, options } = question;

            if (!question_text || !correct_answer || !Array.isArray(options) || options.length < 2) {
                return res.status(400).json({
                    success:false,
                    message: 'Each question must have a question_text, a correct_answer, and atleast two options'
                });
            }
            
            const [insertQuestionResult] = await connection.execute(
                'INSERT INTO Questions (quiz_id, question_text, correct_answer) VALUES (?, ?, ?)',
                [id, question_text, correct_answer]
            );

            const questionId = insertQuestionResult.insertId;

            for (const optionText of options) {
                await connection.execute(
                    'INSERT INTO Options (question_id, option_text) VALUES (?, ?)',
                    [questionId, optionText]
                );
            }

            await connection.end();

            // Send a success response
            res.status(201).json({
                success: true,
                message: 'Questions added successfully.',
            });
        }
    }
    catch (err) {
        console.error('An error occurred while adding questions to the quiz...', err.message);
        res.status(500).json({ success: false, message: 'A server error occurred.' });
    }
}

router.get('/quizzes', handleGetQuizzes);
router.get('quizzes/:id', handleGetQuizzesByID);
router.post('/:id/submit', handleQuizSubmit);
router.post('/quizzes/:id/add', handleQuizAddQuestion);

module.exports = router;