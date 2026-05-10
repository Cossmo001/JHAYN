import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPlayed: 0, avgScore: 0 });
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Fetch user specific progress from supabase (placeholder for now)
    const fetchProgress = async () => {
      setStats({ totalPlayed: 5, avgScore: 7.2 });
    };
    fetchProgress();
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center pt-8 pb-12 w-full animate-in fade-in duration-500">
      <div className="w-full flex items-center justify-between mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back Dashboard
        </button>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-lilac to-fuchsia-400 bg-clip-text text-transparent">Track Your Progress</h2>
        <div className="w-32"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-6">
          <div className="bg-blue-900/30 p-4 rounded-xl">
            <Target className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Total Quizzes</p>
            <h3 className="text-3xl font-black text-white">{stats.totalPlayed}</h3>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-6">
          <div className="bg-green-900/30 p-4 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Average Score</p>
            <h3 className="text-3xl font-black text-white">{stats.avgScore} / 10</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Areas to Improve
          </h3>
          <ul className="space-y-4 flex-1">
            <li className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
              <span className="font-medium text-gray-300">Networking (Subnetting)</span>
              <span className="text-red-400 font-bold">40% Accuracy</span>
            </li>
            <li className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
              <span className="font-medium text-gray-300">Databases (SQL Joins)</span>
              <span className="text-yellow-400 font-bold">60% Accuracy</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
            <BookOpen className="w-5 h-5 text-lilac" /> Recent History
          </h3>
          <ul className="space-y-4 flex-1">
            <li className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
              <div>
                <p className="font-medium text-gray-300">Programming Basics</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
              <span className="text-green-400 font-bold bg-green-900/20 px-3 py-1 rounded-full">8/10</span>
            </li>
            <li className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl">
              <div>
                <p className="font-medium text-gray-300">Hardware Components</p>
                <p className="text-xs text-gray-500">1 week ago</p>
              </div>
              <span className="text-yellow-400 font-bold bg-yellow-900/20 px-3 py-1 rounded-full">6/10</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
