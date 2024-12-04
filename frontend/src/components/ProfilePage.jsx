import React, { useState, useEffect } from "react";
import { User, Mail, Save, UserCog } from "lucide-react";
import "../styling/Profile.css";
import { useAuth } from "../services/authContext";
import api from "../services/api";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!isEditing) {
      console.log("Form submission prevented: Not in editing mode.");
      return;
    }
    setError(null);
    setSuccess(null);
  
    console.log("Submitting form data:", formData); // Log form data for debugging
  
    try {
      const response = await api.put("/user/profile", formData, {
        headers: {
          "Content-Type": "application/json", // Ensure correct headers are sent
        },
      });
  
      console.log("API response:", response);
  
      if (response.status === 204) {
        console.log("Received 204 No Content: Update successful with no return data.");
        setSuccess("Profile updated successfully!");
      } else if (response.status === 200) {
        console.log("Update successful with response data:", response.data);
        updateUser(response.data); // Update user context with returned data
        setSuccess("Profile updated successfully!");
      } else {
        console.error("Unexpected response status:", response.status);
        setError(`Unexpected status code: ${response.status}`);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        setError(error.response.data?.message || "Failed to update profile");
      } else {
        setError("Network error or server not reachable");
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information</p>
      </header>
      {user ? (
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
                type="text"
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
              ) : null}
            </div>
          </form>
          {!isEditing && (
            <div className="edit-action">
              <button
                type="button"
                className="edit-button"
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>Loading profile...</div>
      )}
    </div>
  );
};

export default ProfilePage;
