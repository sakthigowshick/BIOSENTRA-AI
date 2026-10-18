import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    const result = await login(email, password);
    setSubmitting(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl text-left">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-teal-950/50 border border-teal-500/30 rounded-xl text-teal-400 mb-3">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-xs mt-1">Sign in to view your health screening reports</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-teal-500" /> Email Address
            </label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none transition-colors"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-teal-500" /> Password
            </label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full flex items-center justify-center gap-1.5 bg-teal-400 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition-colors mt-6 shadow-lg shadow-teal-500/10"
          >
            {submitting ? "Signing In..." : (
              <>
                <span>Sign In</span>
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
          New to BioSentra?{" "}
          <Link to="/register" className="text-teal-400 font-semibold hover:underline flex inline-flex items-center gap-0.5 ml-1">
            Create account <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
