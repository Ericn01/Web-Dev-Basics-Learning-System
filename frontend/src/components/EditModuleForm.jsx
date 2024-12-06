import React, { useState } from 'react';
import api from '../services/api';
import '../styling/ModalScreen.css';

const EditModuleForm = ({ module, onClose }) => {
  const [formData, setFormData] = useState({
    title: module.title,
    module_description: module.module_description,
    content: module.content,
    banner_image_path: module.banner_image_path || ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/modules/${module.module_id}`, formData);
      onClose();
      window.location.reload(); // Refresh to show updates
    } catch (err) {
      setError('Failed to update module');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-title">Edit Module</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="form-container">
          <label for='module-title' className='modal-label'> Change Title </label>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
            name="module-title"
            id="module-title"
          />
          <label for='module-description' className='modal-label'> Change Description </label>
          <textarea
            placeholder="Description"
            value={formData.module_description}
            onChange={(e) => setFormData({ ...formData, module_description: e.target.value })}
            className="form-textarea"
            name="module-description"
            id="module-description"
          />
          <label for='module-content' className='modal-label'> Change Content</label>
          <textarea
            placeholder="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="form-textarea"
            name="module-content"
            id="module-content"
          />
          <label for='module-banner-path' className='modal-label'> Change Banner Path </label>
          <input
            type="text"
            placeholder="Banner Image Path"
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModuleForm;