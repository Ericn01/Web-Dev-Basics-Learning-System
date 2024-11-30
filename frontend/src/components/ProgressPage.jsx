import React, { useState, useEffect } from 'react';
import { Award, BookOpen, CheckCircle } from 'lucide-react';
import '../styling/ProgressPage.css';
import api from '../services/api';

const ProgressPage = () => {
  const [progress, setProgress] = useState({
    modules_completed: [],
    quizzes_completed: [],
    scores: {},
    recent_activity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/progress');
        setProgress(response.data.progress);
        setLoading(false);
      } catch (err) {
        setError('Failed to load progress data');
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const calculateAverageScore = () => {
    const scores = Object.values(progress.scores);
    if (scores.length === 0) return 'No scores yet';
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    return `${average.toFixed(1)}%`;
};

  if (loading) {
    return <div className="loader">Loading progress...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="progress-container">
      <header className="progress-header">
        <h1>Learning Progress</h1>
        <p>Track your journey through web development</p>
      </header>

      <div className="progress-content">
        <div className="progress-summary">
          <div className="progress-stat">
            <BookOpen className="stat-icon" />
            <div className="stat-info">
              <h3>Modules Completed</h3>
              <p>{progress?.modules_completed?.length || 0} modules</p>
            </div>
          </div>
          <div className="progress-stat">
            <CheckCircle className="stat-icon" />
            <div className="stat-info">
              <h3>Quizzes Completed</h3>
              <p>{progress?.quizzes_completed?.length || 0} quizzes</p>
            </div>
          </div>
          <div className="progress-stat">
            <Award className="stat-icon" />
            <div className="stat-info">
              <h3>Average Score</h3>
              <p>
                {progress?.scores ? 
                  `${Object.values(progress.scores).reduce((a, b) => a + b, 0) / 
                    Object.values(progress.scores).length}%` : 
                  'No scores yet'}
              </p>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {progress.recent_activity.length > 0 ? (
              <div className="activity-list">
                  {progress.recent_activity.map((activity) => (
                      <div key={`${activity.type}_${activity.id}`} className="activity-item">
                          <CheckCircle className="activity-icon" />
                          <div className="activity-info">
                              <h3>{activity.type === 'quiz' ? 'Quiz' : 'Module'} Completed</h3>
                              {activity.score && <p>Score: {activity.score}%</p>}
                              <p className="activity-date">
                                  {new Date(activity.completed_at).toLocaleDateString()}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
            <p className="no-activity">No recent activity to show</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;