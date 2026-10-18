import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentFormPage from './pages/AssessmentFormPage';
import ReportDetailsPage from './pages/ReportDetailsPage';
import { Activity, Shield, LogOut, User as UserIcon } from 'lucide-react';

// Protected Route for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-400">Loading BioSentra...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Route wrapper for guest/public or optional login pages
const PublicNavbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-teal-400 font-bold text-xl">
          <Activity className="h-6 w-6 stroke-[2.5]" />
          <span>BioSentra AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-teal-400 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-teal-400 transition-colors">Contact</Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-teal-400 transition-colors">Dashboard</Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-slate-300 flex items-center gap-1.5">
                <UserIcon className="h-4 w-4 text-teal-400" />
                Hi, {user?.name}
              </span>
              <button 
                onClick={logout}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium border border-slate-700 bg-slate-900 px-3 py-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg text-slate-950 font-semibold shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const MainApp = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/assessment" element={<AssessmentFormPage />} />
          <Route path="/report/:id" element={<ReportDetailsPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} BioSentra AI. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-600 justify-center">
            <Shield className="h-3 w-3" /> Intelligent Disease Screening Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </Router>
  );
}

export default App;
