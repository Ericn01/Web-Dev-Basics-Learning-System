import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Calendar } from 'lucide-react';
import '../styling/ModuleComponent.css';

const ModuleDisplay = ({ module }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="module-card">
      <div className="module-header">
        {module.banner_image_path && (
          <div className="banner-container">
            <img
              src={module.banner_image_path}
              alt={module.title}
              className="banner-image"
            />
            <div className="banner-overlay" />
          </div>
        )}
        
        <div className="header-content">
          <div className="date-container">
            <Calendar className="calendar-icon" />
            <span>{formatDate(module.created_at)}</span>
          </div>
          
          <h2 className="module-title">{module.title}</h2>
          <p className="module-description">{module.module_description}</p>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="toggle-button"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="chevron-icon" />
                Hide Content
              </>
            ) : (
              <>
                <ChevronRight className="chevron-icon" />
                Show Content
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="module-content">
          <div 
            className="content-html"
            dangerouslySetInnerHTML={{ __html: module.content }}
          />
        </div>
      )}
    </div>
  );
};

const ModulesPage = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetchModules();
    }, []);
  
    const fetchModules = async () => {
      try {
        const response = await fetch('http://localhost:3000/webdev-learning/api/modules');
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const result = await response.json();
        console.log(result)
        if (result.success) {
          setModules(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) {
      return <div className="loading">Loading modules...</div>;
    }
  
    if (error) {
      return <div className="error">Error: {error}</div>;
    }
  
    return (
      <div className="modules-page">
        <div className="modules-container">
          <h1 className="page-title">Learning Modules</h1>
          {modules.length > 0 ? (
            modules.map(module => (
              <ModuleDisplay key={module.module_id} module={module} />
            ))
          ) : (
            <p className="no-modules">No modules available</p>
          )}
        </div>
    </div>
  );
};

export default ModulesPage;