import React, { useState } from 'react';
import { User, Mail, Save, UserCog } from 'lucide-react';
import '../styling/Profile.css';
import { useAuth } from '../services/authContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', formData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      setSuccess(null);
    }
  };

  return (
    <div className="profile-container">
      {console.log(user)}
      <header className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information</p>
      </header>

      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>
              <User className="form-icon" />
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>
              <Mail className="form-icon" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>
              <UserCog className="form-icon" />
              Role
            </label>
            <input
              type="input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button type="submit" className="save-button">
                  <Save className="button-icon" />
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                type="button" 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};



export default ProfilePage;