import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, PenBoxIcon } from 'lucide-react';
import '../styling/Modules.css';
import api from '../services/api';
import CreateModuleForm from './CreateModuleForm';
import EditModuleForm from './EditModuleForm';

const ModulesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

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

  const handleEditClick = (e, module) => {
    e.preventDefault(); // Prevent navigation from Link
    setEditingModule(module);
  };

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
            <button onClick={(e) => handleEditClick(e, module)} className="module-edit">
              <PenBoxIcon/>
            </button>
          </Link>
        ))}
        <button 
          className="add-module"
          onClick={() => setShowCreateModal(true)}
        >
          + Add a New Module
        </button>
      </div>
      {showCreateModal && (
        <CreateModuleForm onClose={() => setShowCreateModal(false)} />
      )}
      
      {editingModule && (
        <EditModuleForm 
          module={editingModule} 
          onClose={() => setEditingModule(null)} 
        />
      )}
    </div>
  );
};

export default ModulesPage;