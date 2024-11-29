import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  Code, 
  Users, 
  Medal, 
  ArrowRight, 
  Github,
  ChevronRight,
  Mail,
  Lock,
  User,
  CheckCircle
} from 'lucide-react';
import '../styling/Home.css';
import api from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [hasAccount, setHasAccount] = useState(false);

  const handleAuthClick = () => {
    navigate(hasAccount ? 'login' : 'signup');
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedEmail = localStorage.getItem('userEmail');
    if (token) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail || '');
    }

    const checkExistingAccount = async (email) => {
      try {
        const response = await api.post('/check-account', { email });
        setHasAccount(response.data.exists);
      } catch (error) {
        console.error('Error checking account:', error);
      }
    };

    if (savedEmail) {
      checkExistingAccount(savedEmail);
    }
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    
    try {
      const endpoint = hasAccount ? '/login' : '/register';
      const response = await api.post(endpoint, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userEmail', formData.email);
      setIsLoggedIn(true);
      setUserEmail(formData.email);
      setIsModalOpen(false);
      setFormData({ email: '', password: '', username: '' });

      // Redirect to modules page after successful login/signup
      navigate('/modules');
    } catch (error) {
      setError(error.response?.data?.message || 'Authentication failed');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      setIsLoggedIn(false);
      setUserEmail('');
      setHasAccount(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setFormData({...formData, email});
    
    if (isValidEmail(email)) {
      try {
        const response = await api.post('/check-account', { email });
        setHasAccount(response.data.exists);
      } catch (error) {
        console.error('Error checking account:', error);
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const modulesList = [
    { number: 1, title: 'HTML Fundamentals', description: 'Master the building blocks of web pages' },
    { number: 2, title: 'CSS Basics', description: 'Style your web pages with confidence' },
    { number: 3, title: 'Layouts & Responsive Design', description: 'Create beautiful, responsive layouts' },
    { number: 4, title: 'HTTP GET & POST', description: 'Learn how to communicate with web servers' }
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Learn HTML & CSS to go from Zero to Hero</h1>
          <p>Start your web development journey with interactive lessons, real-world projects, and expert guidance.</p>
          <button 
            className="cta-button"
            onClick={() => isLoggedIn ? navigate('/modules') : setIsModalOpen(true)}
          >
            Start Learning Now <ArrowRight className="arrow-icon" />
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <h3>10K+</h3>
            <p>Active Learners</p>
          </div>
          <div className="stat-card">
            <h3>100+</h3>
            <p>Interactive Lessons</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Practice Projects</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose TagStart?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Book className="feature-icon" />
            <h3>Interactive Learning</h3>
            <p>Learn by testing your knowledge as you complete quizzes. Level up as you learn more!</p>
          </div>
          <div className="feature-card">
            <Users className="feature-icon" />
            <h3>Community Support</h3>
            <p>Interact with quizzes by adding your feedback, and see what others have to say about it.</p>
          </div>
          <div className="feature-card">
            <Medal className="feature-icon" />
            <h3>Project-Based</h3>
            <p>Build real-world projects that you can add to your portfolio.</p>
          </div>
        </div>
      </section>

      <section className="curriculum-section">
        <h2>Learning Path</h2>
        <div className="modules-grid">
          {modulesList.map((module) => (
            <div key={module.number} className="module-card">
              <div className="module-number">{module.number}</div>
              <div className="module-content">
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
              <ChevronRight className="module-arrow" />
            </div>
          ))}
        </div>
      </section>

     </div>
  );
};

export default HomePage;