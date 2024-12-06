import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styling/ModalScreen.css';

const CreateModuleForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      title: '',
      module_description: '',
      content: `<div class="module-content">
                  <h1> Module Title</h1>
                  <section class="introduction"></section>
                  <section class="importance">
                   <h2>Subheading</h2>
                     <ul>
                       <li> Point One</li>
                       <li>Point Two </li>
                       <li>Continued...</li>
                      </ul>
                  </section>
                </div>`,
      banner_image_path: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await api.post('/modules', formData);
        onClose();
        navigate(0);
      } catch (err) {
        setError('Failed to create module');
      }
    };
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h2 className="modal-title">Create New Module</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="form-container">
          <label for='module-title' className='modal-label'> Title </label>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              name="module-title"
                id="module-title"
              required
            />
            <label for='module-description' className='modal-label'> Description </label>
            <textarea
              placeholder="Description"
              value={formData.module_description}
              onChange={(e) => setFormData({ ...formData, module_description: e.target.value })}
              className="form-textarea"
              name="module-description"
                id="module-description"
              required
            />
            <label for='module-content' className='modal-label'> Content (HTML)</label>
            <textarea
              placeholder="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="form-textarea"
              name="module-content"
              id="module-content"
              required
            />
            <label for='module-banner-path' className='modal-label'> Banner Path (Optional) </label>
            <input
              type="text"
              placeholder="Banner Image Path (optional)"
              value={formData.banner_image_path}
              onChange={(e) => setFormData({ ...formData, banner_image_path: e.target.value })}
              className="form-input"
              name="module-banner-path"
              id="module-banner-path"
            />
            <div className="button-container">
              <button type="button" onClick={onClose} className="button button-secondary">
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default CreateModuleForm;