import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Home from './pages/Home'
import Subjects from './pages/Subjects'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Auth from './pages/Auth'
import Leaderboard from './pages/Leaderboard'
import MultiplayerLobby from './pages/MultiplayerLobby'
import Progress from './pages/Progress'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { ThemeProvider, useTheme } from './lib/ThemeContext'
import { Sun, Moon } from 'lucide-react'

function Navbar() {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <nav className="w-full p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white/70 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-r from-lilac to-fuchsia-500 bg-clip-text text-transparent cursor-pointer">
        JHAYN Quiz
      </Link>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">{user.user_metadata?.username || user.email}</span>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          <button onClick={signOut} className="flex items-center gap-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-4 py-2 rounded-full font-medium transition-colors border border-red-200 dark:border-red-900/50 text-sm md:text-base">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          <Link to="/auth" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-5 py-2 rounded-full font-medium transition-colors border border-gray-300 dark:border-gray-700 text-sm md:text-base shadow-md">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#141414] dark:text-white flex flex-col transition-colors duration-300">
          <Navbar />
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col pb-12 pt-6 px-4 sm:px-6 w-full max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
              <Route path="/quiz/:subjectId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/multiplayer-lobby" element={<ProtectedRoute><MultiplayerLobby /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App
