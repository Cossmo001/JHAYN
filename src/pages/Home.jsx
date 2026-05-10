import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Trophy } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-12 w-full animate-in fade-in duration-700">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Test your ICT skills with <span className="bg-gradient-to-r from-lilac to-fuchsia-400 bg-clip-text text-transparent">JHAYN</span>
        </h1>
        <p className="text-lg text-gray-400">
          Challenging computer-based quizzes, live leaderboards, and detailed performance explanations.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/subjects')}
            className="flex items-center gap-2 bg-gradient-to-r from-lilacDark to-fuchsia-600 hover:from-lilac hover:to-fuchsia-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-xl shadow-fuchsia-900/20 w-full sm:w-auto justify-center"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Playing
          </button>
          
          <button 
            onClick={() => navigate('/leaderboard')}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all w-full sm:w-auto justify-center"
          >
            <Trophy className="w-5 h-5" />
            Leaderboard
          </button>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <FeatureCard 
          icon={<BookOpen className="w-8 h-8 text-blue-400" />}
          title="ICT & Computer focused"
          desc="Diverse questions covering networking, programming, hardware, and modern tech."
          onClick={() => navigate('/subjects')}
        />
        <FeatureCard 
          icon={<Trophy className="w-8 h-8 text-yellow-400" />}
          title="Compete & Learn"
          desc="Head-to-head multiplayer modes, and detailed explanations for every correct answer."
          onClick={() => navigate('/multiplayer-lobby')}
        />
        <FeatureCard 
          icon={<Play className="w-8 h-8 text-green-400" />}
          title="Track your Progress"
          desc="Your scores are safely stored, view your personal improvement over time."
          onClick={() => navigate('/progress')}
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, onClick }) {
  return (
    <button onClick={onClick} className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:border-lilac transition-all text-left group">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4 transform group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-lilac transition-colors">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">{desc}</p>
    </button>
  );
}
