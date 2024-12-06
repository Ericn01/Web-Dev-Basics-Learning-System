import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styling/ModalScreen.css';

const CreateQuizForm = ({ moduleId, onClose }) => {
  const [step, setStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: '',
    module_id: moduleId,
    questions: [
      {
        question_text: '',
        correct_answer: '',
        options: ['', '', '', '']  
      }
    ]
  });

  const [error, setError] = useState('');

  const addQuestion = () => {
    if (quizData.questions.length < 10) {
      setQuizData({
        ...quizData,
        questions: [
          ...quizData.questions,
          {
            question_text: '',
            correct_answer: '',
            options: ['', '', '', '']
          }
        ]
      });
    }
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes', quizData);
      onClose();
      window.location.reload();
    } catch (err) {
      setError('Failed to create quiz');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-title">Create New Quiz</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit} className="form-container">
          {step === 1 && (
            <div>
              <input
                type="text"
                placeholder="Quiz Title"
                value={quizData.title}
                onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                className="form-input"
                required
              />
              <button
                type="button"
                className="button button-primary"
                onClick={() => setStep(2)}
              >
                Next: Add Questions
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-container">
                  <h3>Question {qIndex + 1}</h3>
                  <input
                    type="text"
                    placeholder="Question Text"
                    value={question.question_text}
                    onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                    className="form-input"
                    required
                  />
                  
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="option-container">
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        className="form-input"
                        required
                      />
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correct_answer === option}
                        onChange={() => updateQuestion(qIndex, 'correct_answer', option)}
                        required
                      />
                      <label>Correct Answer</label>
                    </div>
                  ))}
                </div>
              ))}

              <div className="button-container">
                {quizData.questions.length < 10 && (
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={addQuestion}
                  >
                    Add Another Question
                  </button>
                )}
                <button type="submit" className="button button-primary">
                  Create Quiz
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateQuizForm;