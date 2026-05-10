import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Network, Database, Code, ArrowLeft } from 'lucide-react';

export default function Subjects() {
  const navigate = useNavigate();

  const subjects = [
    { id: 'programming', title: 'Programming', icon: <Code className="w-8 h-8 text-lilac" />, desc: 'Test your logic in JS, Python, and more.' },
    { id: 'networking', title: 'Networking', icon: <Network className="w-8 h-8 text-fuchsia-400" />, desc: 'Protocols, routers, and IP addressing.' },
    { id: 'hardware', title: 'Hardware', icon: <Monitor className="w-8 h-8 text-pink-400" />, desc: 'Components, architecture, and troubleshooting.' },
    { id: 'databases', title: 'Databases', icon: <Database className="w-8 h-8 text-purple-400" />, desc: 'SQL, NoSQL, schema design, and scaling.' }
  ];

  return (
    <div className="flex flex-col items-center pt-16 pb-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full flex items-center justify-between mb-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back Home
        </button>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-lilac to-fuchsia-400 bg-clip-text text-transparent">Select a Subject</h2>
        <div className="w-24"></div> {/* spacer for centering */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {subjects.map(subject => (
          <button 
            key={subject.id}
            onClick={() => navigate(`/quiz/${subject.id}`)}
            className="bg-gray-900 border border-gray-800 p-8 rounded-2xl flex items-start gap-6 text-left hover:bg-gray-800 hover:border-lilacDark transition-all group overflow-hidden relative shadow-lg shadow-black/50"
          >
            {/* Background glowing effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-lilac/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="bg-gray-800/80 p-4 rounded-xl shadow-inner group-hover:bg-gray-900 transition-colors z-10">
              {subject.icon}
            </div>
            <div className="z-10">
              <h3 className="text-2xl font-bold text-gray-100 mb-2 group-hover:text-lilac transition-colors">{subject.title}</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{subject.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
