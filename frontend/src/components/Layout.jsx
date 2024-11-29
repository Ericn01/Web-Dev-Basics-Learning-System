import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { 
  Book, 
  Code,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Award,
  Home,
  BookOpen,
  PenTool,
  HelpCircle,
  Terminal
} from 'lucide-react';
import '../styling/LayoutStyles.css';

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/modules', label: 'Learning Modules', icon: BookOpen },
    { path: '/quizzes', label: 'Quizzes', icon: PenTool },
    { path: '/http-demo', label: 'HTTP Demo', icon: Terminal },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  const authNavigationItems = [
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/progress', label: 'Progress', icon: Award },
  ];

  return (
    <div className="layout-container">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-left">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="menu-toggle"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="logo">
              <Code className="logo-icon" />
              <span className="logo-text">TagStart</span>
            </div>
          </div>

          <div className="nav-right">
            {isAuthenticated ? (
              <div className="user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="user-menu-button"
                >
                  <User className="user-icon" />
                  <span className="username">{user?.username}</span>
                  <ChevronDown className="chevron-icon" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <User className="dropdown-icon" />
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <LogOut className="dropdown-icon" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button
                  onClick={() => navigate('/login')}
                  className="login-button"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="signup-button"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
          
          {isAuthenticated && (
            <div className="auth-nav">
              {authNavigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;