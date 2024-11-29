import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import '../styling/Modules.css';
import api from '../services/api';

const ModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await api.get('/modules');
        const modules = response.data.data;
        setModules(modules);
        setLoading(false);
      } catch (err) {
        setError('Failed to load modules. Please try again later.');
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return <div className="loader">Loading modules...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="modules-container">
      <header className="modules-header">
        <h1>Learning Modules</h1>
        <p>Start your journey through web development fundamentals</p>
      </header>

      <div className="modules-grid">
        {modules.map((module) => (
          <Link 
            to={`/modules/${module.module_id}`} 
            key={module.module_id}
            className="module-card"
          >
            <div className="module-icon">
              <BookOpen />
            </div>
            <div className="module-content">
              <h2>{module.title}</h2>
              <p>{module.description}</p>
            </div>
            <ChevronRight className="module-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ModulesPage;