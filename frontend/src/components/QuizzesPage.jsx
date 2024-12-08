import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, CheckCircle, Clock } from 'lucide-react';
import '../styling/Quizzes.css';
import api from '../services/api';
import CreateQuizForm from './CreateQuizForm';
import { useAuth } from '../services/authContext';

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const { user } = useAuth();


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

  // Helper function to find quiz progress
  const getQuizProgress = (quizId) => {
    return user.progress.find(progress => progress.quiz_id === quizId);
  };

  const handleCheckmarkClick = (e, quiz) => {
    e.preventDefault(); // Prevent Link navigation
    setSelectedQuiz(quiz);
  };

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
        {quizzes.map((quiz) => {
          const progress = getQuizProgress(quiz.quiz_id);
          
          return (
            <Link
              to={`/quizzes/${quiz.quiz_id}`}
              key={quiz.quiz_id}
              className="quiz-card"
            >
              {/* Show completion status if quiz has been taken */}
              {progress && (
                <button
                  onClick={(e) => handleCheckmarkClick(e, quiz)}
                  className="completion-button"
                >
                  <CheckCircle />
                </button>
              )}
        
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
                <p className="module-tag">Module {quiz.module_id}</p>
              </div>
            </Link>
          );
        })}
      <button
        className="add-quiz"
        onClick={() => setShowCreateModal(true)}
      >
        + Create a quiz
      </button>
      </div>


      {showCreateModal && (
        <CreateQuizForm 
          moduleId={1} 
          onClose={() => setShowCreateModal(false)} 
        />
      )}

      {selectedQuiz && (
        <QuizCompletionModal
          quiz={selectedQuiz}
          progress={getQuizProgress(selectedQuiz.quiz_id)}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  );
};

export default QuizzesPage;


const QuizCompletionModal = ({ quiz, progress, onClose }) => {
  if (!quiz || !progress) return null;

  const completionDate = new Date(progress.completed_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Quiz Completion Details</h2>
        </div>
        <div className="completion-details">
          <div className="quiz-header">
            <h3>{quiz.title}</h3>
            <p className="module-tag">Module {quiz.module_id}</p>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Completion Date:</span>
              <span className="detail-value">{completionDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Score:</span>
              <span className="detail-value score">{progress.score}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Questions:</span>
              <span className="detail-value">{quiz.questions?.length || 0}</span>
            </div>
          </div>
        </div>
        <div className="button-container">
          <button className="button button-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};