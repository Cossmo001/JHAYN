import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn({ email, password });
        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        // Sign Up Flow
        const { error } = await signUp({ 
          email, 
          password,
          options: {
            data: {
              username: username,
              team_name: teamName || null
            }
          }
        });
        if (error) throw error;
        alert('Success! Please verify your email to log in (if email confirmations are enabled on your Supabase project).');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 w-full h-full bg-gradient-to-bl from-lilac/5 to-transparent pointer-events-none"></div>
        
        <h2 className="text-3xl font-bold text-gray-100 mb-2 relative z-10">
          {isLogin ? 'Welcome Back' : 'Join JHAYN'}
        </h2>
        <p className="text-gray-400 mb-8 relative z-10">
          {isLogin ? 'Login to continue your ICT journey.' : 'Register to compete and earn your spot on the leaderboard.'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-lilac rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-colors outline-none"
                  placeholder="cool_dev_99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Team Name (Optional)</label>
                <input 
                  type="text" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-lilac rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-colors outline-none"
                  placeholder="Alpha Coders"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-lilac rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-colors outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-lilac rounded-xl px-4 py-3 text-gray-900 dark:text-white transition-colors outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-lilac to-fuchsia-600 hover:from-lilacDark hover:to-fuchsia-500 text-white font-bold py-3 rounded-xl mt-4 transition-transform transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-lilac transition-colors text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
