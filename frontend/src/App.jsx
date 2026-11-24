import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Internal Website Pages
import Dashboard from './pages/Dashboard';
import TechnicalHub from './pages/TechnicalHub';
import SkillsHub from './pages/SkillsHub';
import CodingHub from './pages/CodingHub';
import CareerHub from './pages/CareerHub';
import ProjectHub from './pages/ProjectHub';
import Topic from './pages/Topic';
import Quiz from './pages/Quiz';
import Projects from './pages/Projects';
import Progress from './pages/Progress';
import Help from './pages/Help';
import Community from './pages/Community';
import Info from './pages/Info';
import AdminDashboard from './pages/AdminDashboard';
import DeveloperToolsPage from './pages/DeveloperToolsPage';
import FloatingAiChatbot from './components/FloatingAiChatbot';

// Main authenticated application shell with Sidebar, Navbar, Footer, and AI Chatbot
function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Animated Black & Royal Blue Aurora Dynamic Background */}
      <div className="aurora-ambient-container" aria-hidden="true">
        <div className="aurora-beam aurora-beam-1" />
        <div className="aurora-beam aurora-beam-2" />
        <div className="aurora-beam aurora-beam-3" />
        <div className="aurora-beam aurora-beam-4" />
        <div className="aurora-cyber-grid" />
        <div className="aurora-vignette" />
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="main-content">
          {children}
          <Footer />
        </main>
      </div>

      {/* Floating AI Career & Roadmap Advisor */}
      <FloatingAiChatbot />
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
        }}
      >
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Verifying session...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Entry Root: Always show Login page first when not authenticated; redirect to Admin or Student Dashboard when logged in */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'} replace />}
      />

      {/* Public Authentication Pages (Clean, focused UI without internal navigation) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Internal Website Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Technical Hub */}
      <Route
        path="/technical-hub"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TechnicalHub />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/technical-skills" element={<Navigate to="/technical-hub" replace />} />

      {/* Skills Hub */}
      <Route
        path="/skills-hub"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SkillsHub />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Coding Hub */}
      <Route
        path="/coding-hub"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CodingHub />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Developer Tools */}
      <Route
        path="/developer-tools"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DeveloperToolsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/developer-tools/:toolId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DeveloperToolsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/tools" element={<Navigate to="/developer-tools" replace />} />
      <Route
        path="/tools/:toolId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DeveloperToolsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Career Hub */}
      <Route
        path="/career-hub"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CareerHub />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Project Hub */}
      <Route
        path="/project-hub"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProjectHub />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      {/* Project Management (Admin only) */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute adminOnly={true}>
            <MainLayout>
              <Projects />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/management-hub" element={<Navigate to="/projects" replace />} />

      {/* Topic & Quiz Reader */}
      <Route
        path="/topic/:topicSlug"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Topic />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:topicSlug"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Quiz />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Progress & Analytics */}
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Progress />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Community, Help & Info */}
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Community />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Help />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/info"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Info />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard — Protected + Admin Role only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback route: Always redirect unauthenticated users to /login, and authenticated to /dashboard */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ProgressProvider>
            <AppRoutes />
          </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
