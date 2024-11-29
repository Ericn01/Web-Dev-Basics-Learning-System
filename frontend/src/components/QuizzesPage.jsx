import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, CheckCircle, Clock } from 'lucide-react';
import '../styling/Quizzes.css';
import api from '../services/api';

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/quizzes');
        const quizzesData = response.data.data;
        console.log(quizzesData)
        setQuizzes(quizzesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load quizzes. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <div className="loader">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="quizzes-container">
      <header className="quizzes-header">
        <h1>Module Quizzes</h1>
        <p>Test your knowledge of web development concepts</p>
      </header>

      <div className="quizzes-grid">
        {quizzes.map((quiz) => (
          <Link 
            to={`/quizzes/${quiz.quiz_id}`} 
            key={quiz.quiz_id}
            className="quiz-card"
          >
            <div className="quiz-icon">
              <PenTool />
            </div>
            <div className="quiz-content">
              <h2>{quiz.title}</h2>
              <div className="quiz-meta">
                <span className="quiz-questions">
                  <Clock className="meta-icon" />
                  {quiz.questions?.length || 0} questions
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuizzesPage;