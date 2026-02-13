import React, { useState, useRef, useEffect } from 'react';
import { Player } from '../types';
import { Button } from './Button';
import { Trash2, Plus, Play, UserPlus, HelpCircle, X } from 'lucide-react';
import { MIN_PLAYERS } from '../constants';

interface LobbyProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onStartGame: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({ players, onAddPlayer, onRemovePlayer, onStartGame }) => {
  const [newName, setNewName] = useState('');
  const [showRules, setShowRules] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount for quick start
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newName.trim()) {
      onAddPlayer(newName.trim());
      setNewName('');
      // Keep focus on input for rapid entry
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-6 relative">
      {/* Rules Modal */}
      {showRules && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md p-6 flex flex-col animate-in fade-in duration-200 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">How to Play</h2>
            <button 
              onClick={() => setShowRules(false)}
              className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 text-slate-300">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                1. The Secret Word
              </h3>
              <p className="text-sm">
                Everyone gets the same secret word, except for one person: <strong>The Imposter</strong>.
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                2. The Imposter
              </h3>
              <p className="text-sm">
                The Imposter only knows the <strong>Category</strong> (e.g., "Kitchen"), but not the word (e.g., "Toaster"). They must blend in!
              </p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                3. Interrogation
              </h3>
              <p className="text-sm">
                Ask each other questions to find out who doesn't know the word. But be careful! Don't be too obvious, or the Imposter will guess the word.
              </p>
            </div>
          </div>
          <Button onClick={() => setShowRules(false)} fullWidth className="mt-6">
            Got it!
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between mb-2 pt-4">
        <div className="w-10"></div> {/* Spacer for centering */}
        <div className="text-center">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-sm">
            Imposter
            </h1>
            <p className="text-slate-400 font-medium text-xs tracking-widest uppercase">Social Deduction</p>
        </div>
        <button 
            onClick={() => setShowRules(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-colors"
            title="How to play"
        >
            <HelpCircle size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 -mr-2 mt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
               Crew ({players.length})
            </h2>
            {players.length < MIN_PLAYERS && (
              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full font-medium">
                Need {MIN_PLAYERS - players.length} more
              </span>
            )}
          </div>
          
          <ul className="grid grid-cols-1 gap-3">
            {players.map((player) => (
              <li key={player.id} className="group relative flex items-center justify-between bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                    <img 
                        src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${player.avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                        alt="avatar" 
                        className="relative w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 group-hover:border-indigo-400 transition-colors object-cover"
                    />
                  </div>
                  <span className="font-bold text-lg text-slate-100 group-hover:text-white">{player.name}</span>
                </div>
                <button 
                  onClick={() => onRemovePlayer(player.id)}
                  className="p-3 mr-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  aria-label="Remove player"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
            
            {players.length === 0 && (
              <div className="text-center py-8 px-6 rounded-3xl border-2 border-dashed border-slate-700/50 bg-slate-800/20">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="text-slate-500" size={20}/>
                </div>
                <p className="text-slate-400 font-medium text-sm">No players yet!</p>
              </div>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl p-4 -mx-6 px-6 border-t border-slate-800/50">
        <form onSubmit={handleAdd} className="flex gap-3 mb-4">
            <div className="relative flex-1 group">
                <input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full bg-slate-800 border-2 border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl py-3 pl-4 pr-4 focus:ring-0 focus:border-indigo-500 focus:outline-none transition-all font-medium"
                />
            </div>
            <Button 
            type="submit" 
            disabled={!newName.trim()}
            className="aspect-square flex items-center justify-center !px-0 w-[52px] !rounded-xl"
            >
            <Plus size={28} />
            </Button>
        </form>

        <Button 
            onClick={onStartGame} 
            disabled={players.length < MIN_PLAYERS} 
            fullWidth
            className="flex items-center justify-center gap-2 py-4 text-lg shadow-indigo-500/20"
        >
            <Play size={24} fill="currentColor" />
            Start Game
        </Button>
      </div>
    </div>
  );
};