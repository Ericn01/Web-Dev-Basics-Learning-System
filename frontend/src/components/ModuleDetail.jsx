import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styling/ModuleDetails.css';
import api from '../services/api';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await api.get(`/modules/${id}`);
        const moduleData = response.data.data;
        setModule(moduleData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load module details. Please try again later.');
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [id]);

  if (loading) {
    return <div className="loader">Loading module details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!module) {
    return <div className="error-message">Module not found</div>;
  }

  return (
    <div className="module-detail-container">
      <button 
        className="back-button"
        onClick={() => navigate('/modules')}
      >
        <ArrowLeft />
        Back to Modules
      </button>

      <div className="module-header">
        <h1>{module.title}</h1>
        <p className="module-description">{module.description}</p>
      </div>

      <div className="module-content">
        <div dangerouslySetInnerHTML={{ __html: module.content }} />
      </div>
    </div>
  );
};

export default ModuleDetail;