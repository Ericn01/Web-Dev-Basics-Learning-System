const express = require('express')
const router = express.Router();
const { connectToDB } = require('../config/dbconnect')

const handleGetQuizzes = async (req, res) => {
    try {
        const connection = await connectToDB();

        const [quizzes] = await connection.execute('SELECT * FROM Quizzes');

        if (quizzes.length === 0) {
            return res.status(404).json({ success: false, message: 'No quizzes have been found' });
        }

        const quizData = await Promise.all(
            quizzes.map(async (quiz) => {
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
                            options, 
                        };
                    })
                );

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

const handleGetQuizzesByID = async (req, res) => {
    try {
        let id = req.params.id;

        const connection = await connectToDB();
        const [rows] = await connection.execute(
            `SELECT
                q.quiz_id,
                q.title AS quiz_title,
                qs.question_id,
                qs.question_text,
                qs.correct_answer,
                o.option_id,
                o.option_text
            FROM Quizzes q
            LEFT JOIN Questions qs ON q.quiz_id = qs.quiz_id
            LEFT JOIN Options o ON qs.question_id = o.question_id
            WHERE q.quiz_id = ?
            ORDER BY qs.question_id, o.option_id;`,
            [id]
        );

        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Quiz not found with the specified ID' });
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
            success: true,
            message: `We found quiz with quiz ID ${id}`,
            data: quiz
        });
    } catch (err) {
        console.error('An error occurred while finding the quiz with the specified ID', err.message);
        res.status(500).json({ message: 'A server error occurred...' });
    }
};


const handleQuizSubmit = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, user_id } = req.body;

    // Validate answers
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. Answers array is required.',
      });
    }

    const connection = await connectToDB();

    // Get quiz details with validation
    const [quizDetails] = await connection.execute(
      'SELECT module_id FROM Quizzes WHERE quiz_id = ?',
      [id]
    );

    if (quizDetails.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.',
      });
    }

    const module_id = quizDetails[0].module_id;

    // Get questions with validation
    const [questions] = await connection.execute(
      'SELECT question_id, correct_answer FROM Questions WHERE quiz_id = ?',
      [id]
    );

    if (questions.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'No questions found for the specified quiz.',
      });
    }

    // Calculate score
    let score = 0;
    questions.forEach((question) => {
      const userAnswer = answers.find((a) => a.question_id === question.question_id);
      
      // Log user answer and correct answer for debugging
      console.log(`DIRECT FROM BACK questions.forEach((question) Question ID: ${question.question_id}, User Answer: ${userAnswer ? userAnswer.answer : 'N/A'}, Correct Answer: ${question.correct_answer}`);
      
      if (userAnswer && userAnswer.answer === question.correct_answer) {
        score++;
      }
    });
    

    const totalQuestions = questions.length;
    const percentageScore = Math.round((score / totalQuestions) * 100);

    // Update progress
    try {
      await connection.execute(
        `INSERT INTO UserProgress (user_id, module_id, quiz_id, score, completed_at) 
         VALUES (?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
         score = VALUES(score),
         completed_at = NOW()`,
        [user_id, module_id, id, percentageScore]
      );
    } catch (err) {
      console.error('Error updating progress:', err);
      throw new Error('Failed to update progress');
    }

    await connection.end();

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully.',
      data: {
        score: percentageScore,
        totalQuestions,
        correctAnswers: score,
      },
    });
  } catch (err) {
    console.error('An error occurred while submitting the quiz:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'A server error occurred.',
    });
  }
};


const handleQuizAddQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { questions } = req.body;

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid questions format. Questions should be a non-empty array',
            });
        }

        const connection = await connectToDB();

        const [quizRows] = await connection.execute('SELECT * FROM Quizzes WHERE quiz_id = ?', [id]);
        if (quizRows.length === 0) {
            await connection.end();
            return res.status(404).json({
                success: false,
                message: 'Quiz does not exist',
            });
        }

        for (const question of questions) {
            const { question_text, correct_answer, options } = question;

            if (!question_text || !correct_answer || !Array.isArray(options) || options.length < 2) {
                await connection.end(); 
                return res.status(400).json({
                    success: false,
                    message: 'Each question must have a question_text, a correct_answer, and at least two options',
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
        }


        await connection.end();
        return res.status(201).json({
            success: true,
            message: 'Questions added successfully.',
        });
    } catch (err) {
        console.error('An error occurred while adding questions to the quiz...', err.message);
        res.status(500).json({ success: false, message: 'A server error occurred.' });
    }
};


const handleCreateQuiz = async (req, res) => {
    const connection = await connectToDB();
    
    try {
      const  { title, questions } = req.body;  

      // Insert quiz
      const [quizResult] = await connection.execute(
        'INSERT INTO Quizzes (module_id, title) VALUES (?, ?)',
        [parseInt(Math.random() * 5), title] // Module ID really doesn't matter right now - generating a random value between 0-5 for testing
      );
      const quizId = quizResult.insertId;
  
      // Insert questions and their options
      for (const question of questions) {
        const [questionResult] = await connection.execute(
          'INSERT INTO Questions (quiz_id, question_text, correct_answer) VALUES (?, ?, ?)',
          [quizId, question.question_text, question.correct_answer]
        );
        const questionId = questionResult.insertId;
  
        // Insert options
        for (const option of question.options) {
          await connection.execute(
            'INSERT INTO Options (question_id, option_text) VALUES (?, ?)',
            [questionId, option]
          );
        }
      }
  
      res.status(201).json({
        success: true,
        message: 'Quiz created successfully',
        data: { quiz_id: quizId }
      });
  
    } catch (err) {
      console.error('Error creating quiz:', err);
      res.status(500).json({
        success: false,
        message: 'An error occurred while creating the quiz'
      });
    } finally {
      await connection.end();
    }
  };

router.get('/quizzes', handleGetQuizzes);
router.get('/quizzes/:id', handleGetQuizzesByID);
router.post('/quizzes/:id/submit', handleQuizSubmit);
router.post('/quizzes/:id/add', handleQuizAddQuestion);
router.post('/quizzes', handleCreateQuiz) // Add a new quiz route.

module.exports = router;