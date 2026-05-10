import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Shield, ArrowLeft, Globe, Lock, Swords, User, Trophy, Activity, Copy } from 'lucide-react';

export default function MultiplayerLobby() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [view, setView] = useState('main'); // main, create, publicLobbies, insideLobby, userProfile
  const [lobbyType, setLobbyType] = useState('public');
  const [createLobbyName, setCreateLobbyName] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedLobby, setExpandedLobby] = useState(null);
  
  const mockUsers = {
    '1': { name: 'Alice', rank: 'Gold II', accuracy: '78%', best: 'Networking' },
    '2': { name: 'Bob', rank: 'Silver I', accuracy: '64%', best: 'Databases' },
    '3': { name: 'Charlie', rank: 'Platinum III', accuracy: '89%', best: 'Programming' },
    '4': { name: 'You', rank: 'Unranked', accuracy: '0%', best: 'N/A' }
  };

  const publicLobbies = [];

  const joinedLobbies = [];

  if (view === 'userProfile' && selectedUser) {
    const u = mockUsers[selectedUser];
    return (
      <div className="flex flex-col items-center pt-16 w-full animate-in fade-in duration-300">
        <div className="w-full max-w-lg flex items-center justify-between mb-8">
          <button onClick={() => setView('insideLobby')} className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Back to Lobby
          </button>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-lg shadow-xl flex flex-col items-center text-center">
          <div className="bg-lilac/20 p-6 rounded-full mb-4">
            <User className="w-16 h-16 text-lilac" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{u.name}</h2>
          <div className="flex items-center gap-2 text-yellow-400 mb-6 bg-yellow-400/10 px-4 py-2 rounded-full">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{u.rank}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Overall Accuracy</p>
              <p className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Activity className="w-5 h-5 text-green-400" /> {u.accuracy}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Best Subject</p>
              <p className="text-xl font-bold text-fuchsia-400">{u.best}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="flex flex-col items-center pt-16 w-full animate-in fade-in duration-300">
        <h2 className="text-3xl font-bold mb-8">Create a New Lobby</h2>
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
          
          <label className="block text-gray-400 mb-2 font-medium">Lobby Name</label>
          <input 
            type="text" 
            placeholder="e.g. Cosmos Lobby" 
            value={createLobbyName}
            onChange={(e) => setCreateLobbyName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-lilac mb-6"
          />

          <label className="block text-gray-400 mb-2 font-medium">Lobby Visibility</label>
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setLobbyType('public')}
              className={`flex-1 py-3 rounded-xl flex justify-center items-center gap-2 border transition-all ${lobbyType === 'public' ? 'bg-lilac/20 border-lilac text-lilac' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
            >
              <Globe className="w-5 h-5" /> Public
            </button>
            <button 
              onClick={() => setLobbyType('private')}
              className={`flex-1 py-3 rounded-xl flex justify-center items-center gap-2 border transition-all ${lobbyType === 'private' ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
            >
              <Lock className="w-5 h-5" /> Private
            </button>
          </div>
          <button 
            disabled={!createLobbyName.trim()}
            onClick={() => setView('insideLobby')} 
            className={`w-full font-bold py-3 rounded-xl transition-all ${createLobbyName.trim() ? 'bg-gradient-to-r from-lilac to-fuchsia-500 hover:opacity-90 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
          >
            Create Space
          </button>
          <button onClick={() => setView('main')} className="w-full mt-4 text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (view === 'publicLobbies') {
    return (
      <div className="flex flex-col items-center pt-8 w-full animate-in fade-in duration-300">
        <div className="w-full max-w-3xl flex items-center mb-8">
          <button onClick={() => setView('main')} className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h2 className="text-3xl font-bold mx-auto text-lilac">Public Spaces</h2>
          <div className="w-20"></div>
        </div>
        <div className="w-full max-w-3xl space-y-4">
          {publicLobbies.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No public lobbies available right now.</p>
          ) : (
            publicLobbies.map(lobby => (
              <div key={lobby.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-lilac transition-all">
                <div 
                  className="p-6 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedLobby(expandedLobby === lobby.id ? null : lobby.id)}
                >
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{lobby.name}</h4>
                    <p className="text-gray-400 text-sm">{lobby.players.length} / {lobby.max} Players • {lobby.stats}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setView('insideLobby'); }} className="bg-lilac hover:bg-lilacDark text-white px-6 py-2 rounded-lg font-bold transition-colors">
                    Join
                  </button>
                </div>
                {expandedLobby === lobby.id && (
                  <div className="bg-gray-800/50 p-6 border-t border-gray-800 animate-in slide-in-from-top-2 duration-300">
                    <h5 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Group Members</h5>
                    {lobby.players.length === 0 ? <p className="text-gray-500 italic">Empty Lobby</p> : (
                      <div className="flex flex-wrap gap-2">
                        {lobby.players.map(pid => (
                           <div key={pid} className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm">
                             <User className="w-3 h-3 text-lilac" /> {mockUsers[pid]?.name}
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === 'insideLobby') {
    return (
      <div className="flex flex-col items-center pt-8 w-full animate-in fade-in duration-300">
        <div className="w-full max-w-4xl flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{createLobbyName || 'Cosmos Lobby'}</h2>
            <div className="flex items-center gap-4 text-sm">
               <span className="bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded border border-blue-900/50">{lobbyType === 'private' ? 'Private' : 'Public'}</span>
               {lobbyType === 'private' && (
                 <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded text-gray-300 border border-gray-800">
                   Code: <strong className="text-white tracking-widest">X7Y9Z1</strong>
                   <button onClick={() => { navigator.clipboard.writeText('X7Y9Z1'); alert('Code copied to clipboard!'); }} className="text-gray-500 hover:text-white transition-colors" title="Copy Code">
                     <Copy className="w-4 h-4" />
                   </button>
                 </div>
               )}
            </div>
          </div>
          <button onClick={() => setView('main')} className="bg-red-900/40 text-red-400 hover:bg-red-900/60 px-4 py-2 rounded-lg transition-colors border border-red-900/50 h-fit">
            Leave Space
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-h-[500px] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-300 mb-4 border-b border-gray-800 pb-2 flex justify-between">
              <span>Players (1)</span>
              <span className="text-sm font-normal text-fuchsia-400 bg-fuchsia-400/10 px-2 py-0.5 rounded cursor-pointer hover:bg-fuchsia-400/20">Group Stats</span>
            </h3>
            <ul className="space-y-3">
              <li 
                onClick={() => { setSelectedUser('4'); setView('userProfile'); }}
                className="flex justify-between items-center bg-gray-800/50 hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-700"
              >
                <div className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full"></div> <span className="text-white font-medium">You (Host)</span></div>
                <Trophy className="w-4 h-4 text-gray-500" />
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            {lobbyType === 'private' && (
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col items-center text-center">
               <h3 className="text-lg font-bold text-white mb-2">Invite Others</h3>
               <p className="text-sm text-gray-400 mb-4">Share your lobby code so others can join this private space.</p>
               <button onClick={() => { navigator.clipboard.writeText('X7Y9Z1'); alert('Code copied to clipboard!'); }} className="bg-gray-800 hover:bg-gray-700 text-white w-full py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-700">
                 <Copy className="w-4 h-4" /> Share Code
               </button>
            </div>
            )}

            <div className="bg-fuchsia-900/20 border border-fuchsia-900/50 p-6 rounded-2xl flex flex-col items-center text-center">
              <Swords className="w-10 h-10 text-fuchsia-400 mb-2" />
              <h3 className="text-xl font-bold text-white mb-2">Compete</h3>
              <p className="text-sm text-gray-400 mb-4">Challenge another active lobby to a live face-off!</p>
              <button className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white w-full py-3 rounded-xl font-bold transition-colors shadow-lg shadow-fuchsia-900/20">
                Find Opponent Lobby
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // default / main view
  return (
    <div className="flex flex-col items-center pt-8 pb-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full flex items-center justify-between mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back Home
        </button>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-lilac to-fuchsia-400 bg-clip-text text-transparent">Multiplayer Hub</h2>
        <div className="w-24"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Lobbies You've Joined */}
        <div className="col-span-1 md:col-span-2 bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
               <Shield className="w-5 h-5 text-lilac" /> Your Active Lobbies
             </h3>
          </div>
          {joinedLobbies.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">You haven't joined any lobbies yet.</p>
          ) : (
            <div className="space-y-3">
              {joinedLobbies.map(lobby => (
                 <div key={lobby.id} className="bg-gray-800/50 hover:bg-gray-800 border border-gray-800 p-4 rounded-xl flex items-center justify-between transition-colors cursor-pointer" onClick={() => setView('insideLobby')}>
                   <div>
                     <h4 className="font-bold text-white">{lobby.name}</h4>
                     <p className="text-sm text-gray-400">{lobby.type === 'private' ? `Code: ${lobby.code}` : 'Public'}</p>
                   </div>
                   <button className="text-lilac hover:text-white font-medium text-sm transition-colors">Enter</button>
                 </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
           <button onClick={() => setView('create')} className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-lilac text-white p-6 rounded-2xl transition-all shadow-lg flex flex-col items-center justify-center gap-3 w-full h-full text-center group">
             <div className="bg-gray-800 p-3 rounded-full group-hover:scale-110 transition-transform">
               <Plus className="w-6 h-6 text-lilac" />
             </div>
             <div>
               <h3 className="font-bold text-lg mb-1">Create Space</h3>
               <p className="text-xs text-gray-400">Host a new public or private lobby.</p>
             </div>
           </button>
           
           <button onClick={() => setView('publicLobbies')} className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-fuchsia-400 text-white p-6 rounded-2xl transition-all shadow-lg flex flex-col items-center justify-center gap-3 w-full h-full text-center group">
             <div className="bg-gray-800 p-3 rounded-full group-hover:scale-110 transition-transform">
               <Globe className="w-6 h-6 text-fuchsia-400" />
             </div>
             <div>
               <h3 className="font-bold text-lg mb-1">Browse Public</h3>
               <p className="text-xs text-gray-400">Find and join open lobby spaces.</p>
             </div>
           </button>
        </div>
      </div>

      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center shadow-lg">
        <h3 className="text-xl font-bold text-gray-100 mb-2">Join with Code</h3>
        <p className="text-sm text-gray-400 mb-6">Received an invite? Enter the 6-digit code below.</p>
        <div className="flex gap-2 w-full">
           <input 
             type="text" 
             placeholder="e.g. 123456" 
             value={joinCode}
             onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
             className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl text-center text-xl tracking-widest focus:outline-none focus:border-fuchsia-400"
             maxLength={6}
           />
           <button 
             disabled={joinCode.length !== 6}
             onClick={() => setView('insideLobby')} 
             className={`px-6 py-3 rounded-xl font-semibold transition-all ${joinCode.length === 6 ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
           >
             Join
           </button>
        </div>
      </div>
      
    </div>
  );
}
