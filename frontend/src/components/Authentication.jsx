import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Github, ArrowLeft } from 'lucide-react';
import { useAuth } from '../services/authContext';
import '../styling/Authentication.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submit handler triggered");
    console.log("PreventDefault executed");
  
    setError(null);
    setIsLoading(true);
  
    try {
      console.log("Sending form data:", formData);
      const response = await login(formData);
      console.log("Login response received:", response);
  
      if (response.role === 'admin') {
        console.log("Navigating to admin dashboard");
        navigate('/admin/dashboard');
      } else {
        console.log("Navigating to modules");
        navigate('/modules');
      }
    } catch (err) {
      console.error("Error in login:", err);
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
      console.log("Loading state reset");
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft />
          </button>
          <h1>Welcome Back</h1>
          <p>Continue your learning journey</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="social-auth">
          <div className="divider">Or continue with</div>
          <button className="github-button">
            <Github /> Continue with GitHub
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const validatePassword = (password) => {
    return password.length >= 5;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    console.log("Sending registration data:", formData);

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      await signup(formData);
      navigate('/modules');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft />
          </button>
          <h1>Create Account</h1>
          <p>Start your learning journey today</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              pattern=".{5,}"
              title="Password must be at least 5 characters"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button" 
            disabled={isLoading || !validatePassword(formData.password)}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="social-auth">
          <div className="divider">Or continue with</div>
          <button className="github-button">
            <Github /> Continue with GitHub
          </button>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};


export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not loading and either not authenticated or not admin, redirect
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }
  // Only render children if user is authenticated and is admin
  return isAuthenticated && isAdmin ? children : null;
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};