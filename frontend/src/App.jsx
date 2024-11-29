import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/authContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import ModulesPage from './components/ModulesPage';
import ModuleDetail from './components/ModuleDetail';
import QuizzesPage from './components/QuizzesPage';
import QuizDetail from './components/QuizDetails';
import ProfilePage from './components/ProfilePage';
import ProgressPage from './components/ProgressPage';
//import HttpDemo from './pages/HttpDemo';
import FaqComponent from './components/FaqComponent';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/modules/:id" element={<ModuleDetail />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/quizzes/:id" element={<QuizDetail />} />
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
            { /* <Route path="/http-demo" element={<HttpDemo />} /> */ }
            <Route path="/faq" element={<FaqComponent />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};


export default App
