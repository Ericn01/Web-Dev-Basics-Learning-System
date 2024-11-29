import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import '../styling/QuizDetails.css';
import api from '../services/api';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        const quizData = response.data.data;
        setQuiz(quizData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post(`/quizzes/${id}/submit`, {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          answer
        }))
      });
      setScore(response.data.score);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
    }
  };

  if (loading) {
    return <div className="loader">Loading quiz...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!quiz) {
    return <div className="error-message">Quiz not found</div>;
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="quiz-detail-container">
      <button 
        className="back-button"
        onClick={() => navigate('/quizzes')}
      >
        <ArrowLeft />
        Back to Quizzes
      </button>

      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>

      {!submitted ? (
        <div className="quiz-content">
          <div className="question-container">
            <h2>{currentQuestionData.text}</h2>
            <div className="options-container">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${
                    answers[currentQuestionData.question_id] === option ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestionData.question_id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button
              className="nav-button"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Previous
            </button>
            {currentQuestion === quiz.questions.length - 1 ? (
              <button 
                className="submit-button"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== quiz.questions.length}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                className="nav-button"
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <div className="score-display">
            <h2>Quiz Complete!</h2>
            <p className="score">Your Score: {score}%</p>
          </div>
          <button 
            className="retry-button"
            onClick={() => navigate('/quizzes')}
          >
            Back to Quizzes
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizDetail;