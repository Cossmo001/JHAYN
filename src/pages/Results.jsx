import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState('');
  
  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-400 text-lg mb-4">No quiz results found.</p>
        <button onClick={() => navigate('/')} className="text-lilac hover:underline">Go Home</button>
      </div>
    );
  }

  const { score, total, answers, questions } = state;
  const percentage = Math.round((score / total) * 100);
  const subjectId = state.subjectId || 'programming'; // fallback

  useEffect(() => {
    // Only attempt save on first mount if logged in
    const saveScore = async () => {
      if (!user) {
        setSaveStatus('Log in to save your score to the leaderboard!');
        return;
      }
      
      setSaveStatus('Saving score...');
      const { error } = await supabase.from('scores').insert([
        { 
          user_id: user.id, 
          subject_id: subjectId, 
          score: score, 
          total: total, 
          percentage: percentage 
        }
      ]);

      if (error) {
        console.error('Error saving score:', error);
        setSaveStatus('Failed to save score.');
      } else {
        setSaveStatus('Score saved to Leaderboard!');
      }
    };
    saveScore();
  }, [user, score, total, percentage, subjectId]);

  return (
    <div className="flex flex-col items-center pt-8 pb-16 w-full max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      
      {/* Score Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center w-full mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lilac/10 to-blue-500/10 opacity-50"></div>
        <h1 className="text-3xl font-bold text-gray-200 mb-6 relative z-10">Quiz Completed!</h1>
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="text-8xl font-black bg-gradient-to-r from-lilac to-fuchsia-500 bg-clip-text text-transparent mb-4">
            {percentage}%
          </div>
          <p className="text-xl text-gray-400 font-medium mb-2">
            You scored <strong className="text-white">{score}</strong> out of <strong className="text-white">{total}</strong>
          </p>
          <p className="text-sm font-semibold text-lilac">
            {saveStatus}
          </p>
        </div>
        
        <div className="relative z-10 flex justify-center gap-4 mt-8">
          <button 
            onClick={() => navigate('/subjects')}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-gray-700 hover:border-gray-500"
          >
            <RotateCcw className="w-5 h-5" /> Retake Test
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-gradient-to-r from-lilacDark to-fuchsia-600 hover:from-lilac hover:to-fuchsia-500 text-white px-6 py-3 rounded-xl font-medium transition-transform transform hover:scale-105 shadow-xl shadow-fuchsia-900/20"
          >
             <Home className="w-5 h-5" /> Home
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-800 pb-4">Phase Review & Correct Answers</h2>
        
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = userAnswer === q.correct;
            
            return (
              <div key={idx} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-900/10 border-green-900/50' : 'bg-red-900/10 border-red-900/50'}`}>
                <div className="flex gap-4 mb-4">
                  <div className="mt-1">
                    {isCorrect ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">{q.text}</h3>
                  </div>
                </div>
                
                <div className="ml-10 space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500 mr-2">Your Answer:</span>
                    <span className={`${isCorrect ? 'text-green-400' : 'text-red-400 font-medium'}`}>
                      {userAnswer !== undefined ? q.options[userAnswer] : 'Skipped'}
                    </span>
                  </div>
                  
                  {!isCorrect && (
                    <div className="text-sm">
                      <span className="text-gray-500 mr-2">Correct Answer:</span>
                      <span className="text-lilac font-medium">{q.options[q.correct]}</span>
                    </div>
                  )}
                  
                  {/* Explanation snippet per requirements */}
                  <div className="mt-4 bg-gray-900/50 p-4 rounded-lg border border-gray-800 text-sm text-gray-300">
                    <span className="font-bold text-gray-500">Note: </span> 
                    This is standard ICT terminology. Reviewing this concept is highly recommended to improve your overall understanding.
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
