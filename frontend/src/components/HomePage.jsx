import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  Users, 
  Medal, 
  ArrowRight, 
  ChevronRight,
  Code,
  Layout, 
  Play
} from 'lucide-react';
import '../styling/Home.css';
import api from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();

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

  const modulesList = [
    { number: 1, title: 'HTML Basics', description: 'Learn how to create simple web pages' },
    { number: 2, title: 'Semantic HTML', description: 'Improve your web pages by providing clear tags.' },
    { number: 3, title: 'CSS Basics', description: 'Style your web pages with confidence' },
    { number: 4, title: 'HTTP Methods', description: 'Learn how to communicate with web servers' }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Master the Building Blocks of the Web!</h1>
          <p>Learn HTML, CSS, and HTTP methods through hands-on modules and quizzes designed for absolute beginners.</p>
        </div>
        <LivePreview />
        <button 
            className="cta-button"
            onClick={() => navigate('/signup')}
          >
            Start Learning Today! <ArrowRight className="arrow-icon" />
        </button>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose TagStart?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Book className="feature-icon" />
            <h3>Interactive Modules</h3>
            <p>Learn through interactive lessons tailored to beginners.</p>
          </div>
          <div className="feature-card">
            <Users className="feature-icon" />
            <h3>Quizzes & Challenges</h3>
            <p>Test your knowledge and learn from others' feedback.</p>
          </div>
          <div className="feature-card">
            <Medal className="feature-icon" />
            <h3>Progress Tracking</h3>
            <p>See how far you've come and what's next on your learning path.</p>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
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

// Live Code Preview Section that's integrated with the home page
const LivePreview = () => {
  const [htmlCode, setHtmlCode] = useState(
    `<div class="welcome-message">
        <h1>Hello World!</h1>
        <p>Start editing to see your changes live!</p>
      </div>`
    );
    
  const [cssCode, setCssCode] = useState(
      `
      body{
        background-color: 
      }
      .welcome-message {
        text-align: center;
        padding: 2rem;
        font-family: system-ui, sans-serif;
      }
      
      h1 {
        color: #fefefe;
        margin-bottom: 1rem;
      }
      
      p {
        color: navy;
      }`
    );

  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    setPreviewContent(`
      <style>${cssCode}</style>
      ${htmlCode}
    `);
  }, [htmlCode, cssCode]);
  
  return (
    <div className="live-preview">
      <h2>
        <Code className="icon" />
        Interactive Code Editor
      </h2>
      <div className="code-playground">
        <div className="editor-container">
          <div className="editor-header">
            <Layout className="icon" />
            <span>HTML</span>
          </div>
          <textarea
            className="code-editor"
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder="Write your HTML here..."
            spellCheck="false"
          />
        </div>
        
        <div className="editor-container">
          <div className="editor-header">
            <Code className="icon" />
            <span>CSS</span>
          </div>
          <textarea
            className="code-editor"
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            placeholder="Write your CSS here..."
            spellCheck="false"
          />
        </div>
      </div>
      
      <div className="preview-container">
        <div className="preview-header">
          <Play className="icon" />
          <span>Live Preview</span>
        </div>
        <div className="preview-window">
          <iframe
            title="Live Preview"
            sandbox="allow-scripts"
            srcDoc={previewContent}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
