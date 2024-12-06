import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, CheckCircle, Clock, Check } from 'lucide-react';
import '../styling/Quizzes.css';
import api from '../services/api';
import CreateQuizForm from './CreateQuizForm';

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [completedQuizzes, setCompletedQuizzes] = useState(
    quizzes.map((quiz) => ({
      quiz: quiz.quiz_id,
      isCompleted: false
    }))
);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/quizzes');
        const quizzesData = response.data.data;
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
        {completedQuizzes.map((quiz) => {
          if (quiz.isCompleted){
            <Check />
          }
        })}
        {quizzes.map((quiz) => (
          <Link 
            to={`/quizzes/${quiz.quiz_id}`} 
            key={quiz.quiz_id}
            props={setCompletedQuizzes}
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
              <p className='module-tag'> Module {quiz.module_id} </p>
            </div>
          </Link>
        ))}
      </div>
      <button 
          className="add-quiz"
          onClick={() => setShowCreateModal(true)}
        >
          + Create a quiz.
        </button>
        {showCreateModal && (
         <CreateQuizForm moduleId={1} onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default QuizzesPage;