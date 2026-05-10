import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('overall');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      let query = supabase
        .from('scores')
        .select('*, profiles(username, team_name)')
        .limit(100);
        
      if (filter !== 'overall' && filter !== 'teams') {
        query = query.eq('subject_id', filter);
      }

      const { data, error } = await query;
      if (!error && data) {
        if (filter === 'teams') {
          // Aggregate by team
          const teamAggs = {};
          data.forEach(s => {
            const t = s.profiles?.team_name;
            if (t) {
              if (!teamAggs[t]) teamAggs[t] = { score: 0, count: 0 };
              teamAggs[t].score += s.percentage;
              teamAggs[t].count += 1;
            }
          });
          const teamData = Object.keys(teamAggs).map(t => ({
            id: t,
            isTeamRow: true,
            teamName: t,
            percentage: Math.round(teamAggs[t].score / teamAggs[t].count)
          })).sort((a,b) => b.percentage - a.percentage);
          setScores(teamData.slice(0, 20));
        } else {
          // Normal sorted individual
          const sorted = data.sort((a,b) => b.percentage - a.percentage).slice(0, 20);
          setScores(sorted);
        }
      }
      setLoading(false);
    };

    fetchLeaderboard();

    const channel = supabase.channel('scores-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scores' },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  return (
    <div className="flex flex-col items-center pt-10 pb-16 w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-500">
      <div className="w-full flex items-center justify-between mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-2 rounded-full shadow-lg">
          <Trophy className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Rankings</h2>
        </div>
        <div className="w-24"></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 w-full mb-8 z-10 relative">
        {['overall', 'teams', 'programming', 'networking', 'hardware', 'databases'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors border ${
              filter === f 
              ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/20' 
              : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center text-gray-500 h-32 flex items-center justify-center">
            No scores posted yet. Be the first!
          </div>
        ) : (
          <div className="flex flex-col gap-3 relative z-10 w-full">
            {/* Header row */}
            <div className="grid grid-cols-12 px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-5">Player</div>
              <div className="col-span-3 text-center">Subject</div>
              <div className="col-span-2 text-right">Score</div>
            </div>

            {scores.map((s, idx) => (
              <div 
                key={s.id} 
                className={`grid grid-cols-12 items-center p-4 rounded-2xl border transition-all ${
                  idx === 0 
                  ? 'bg-gradient-to-r from-amber-100 to-yellow-50 dark:from-yellow-900/40 dark:to-amber-900/20 border-yellow-300 dark:border-yellow-700/50 transform scale-[1.02] shadow-md' 
                  : idx === 1
                  ? 'bg-gray-100 dark:bg-gray-800/80 border-gray-300 dark:border-gray-700'
                  : idx === 2
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/40'
                  : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="col-span-2 text-center font-black text-xl text-gray-400">
                  #{idx + 1}
                </div>
                <div className="col-span-5 font-bold text-gray-900 dark:text-gray-100 text-lg truncate pr-2">
                  {s.isTeamRow ? s.teamName : (s.profiles?.username || 'Unknown Player')}
                  {s.isTeamRow && <span className="ml-2 text-xs bg-lilac/20 text-lilac px-2 py-1 rounded-full uppercase">Team</span>}
                </div>
                <div className="col-span-3 text-center text-sm font-medium text-gray-500 bg-black/5 dark:bg-white/5 py-1 px-2 rounded-lg">
                  {s.isTeamRow ? 'All Subjects' : s.subject_id}
                </div>
                <div className="col-span-2 text-right font-black text-2xl bg-gradient-to-r from-lilac to-fuchsia-500 bg-clip-text text-transparent">
                  {s.percentage}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
