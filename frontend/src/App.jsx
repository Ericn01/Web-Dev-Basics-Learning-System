import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/authContext';
import { Login, Signup, AdminRoute, ProtectedRoute } from './components/Authentication';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import ModulesPage from './components/ModulesPage';
import ModuleDetail from './components/ModuleDetail';
import QuizzesPage from './components/QuizzesPage';
import QuizDetail from './components/QuizDetails';
import ProfilePage from './components/ProfilePage';
import ProgressPage from './components/ProgressPage';
import HttpDemo from './components//HTTPDemo';
import FaqComponent from './components/FaqComponent';
import AdminDashboard from './components/AdminDashboard';
import { ThemeProvider } from './services/themeContext';

import './styling/theme.css';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/modules" element={<ModulesPage />} />
              <Route path="/modules/:id" element={<ModuleDetail />} />
              <Route path="/quizzes" 
                element={
                  <ProtectedRoute>
                    <QuizzesPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/quizzes/:id" element={<QuizDetail/>} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/progress" 
                element={
                  <ProtectedRoute>
                    <ProgressPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/http-demo" element={<HttpDemo />} />
              <Route path="/faq" element={<FaqComponent />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};


export default App
