import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { Button } from './Button';
import { Clock, AlertCircle } from 'lucide-react';
import { DEFAULT_ROUND_TIME } from '../constants';

interface GameRunningProps {
  players: Player[];
  onEndGame: () => void;
  category: string;
}

export const GameRunning: React.FC<GameRunningProps> = ({ players, onEndGame, category }) => {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_ROUND_TIME);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    let interval: number;
    if (timerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setTimerActive(!timerActive);

  return (
    <div className="flex flex-col h-full w-full p-4">
      {/* Header Info */}
      <div className="flex justify-center mb-6">
        <div className="bg-indigo-900/30 backdrop-blur-md px-6 py-2 rounded-full border border-indigo-500/30 flex flex-col items-center">
            <span className="text-indigo-300 text-[10px] uppercase font-bold tracking-widest">Current Category</span>
            <span className="text-white font-bold text-lg">{category}</span>
        </div>
      </div>

      {/* Timer Section */}
      <div className="flex-1 flex flex-col items-center justify-start py-4">
        <div 
            onClick={toggleTimer}
            className={`cursor-pointer relative w-64 h-64 rounded-full flex flex-col items-center justify-center border-[6px] transition-all duration-500 shadow-2xl ${
                timeLeft < 60 
                    ? 'border-red-500/60 bg-red-900/10 shadow-red-500/20 animate-pulse' 
                    : 'border-indigo-500/40 bg-slate-800/50 shadow-indigo-500/20'
            }`}
        >
             <Clock size={28} className={`mb-3 ${timeLeft < 60 ? 'text-red-400' : 'text-indigo-400'}`} />
             <span className={`text-7xl font-mono font-black tracking-tighter ${timeLeft < 60 ? 'text-red-100' : 'text-white'}`}>
                {formatTime(timeLeft)}
             </span>
             <div className="absolute bottom-10 px-4 py-1 rounded-full bg-slate-900/50 border border-slate-700/50">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {timerActive ? 'Tap to Pause' : 'Tap to Resume'}
                </span>
             </div>
        </div>

        {/* Players Grid */}
        <div className="w-full mt-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Active Players</h3>
            <div className="flex flex-wrap justify-center gap-3">
                {players.map(p => (
                    <div key={p.id} className="flex flex-col items-center">
                        <img 
                            src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${p.avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                            alt={p.name}
                            className="w-10 h-10 rounded-full border border-slate-600 bg-slate-700 object-cover"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 font-medium max-w-[60px] truncate text-center">{p.name}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-auto mb-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex gap-3 items-start">
             <AlertCircle size={20} className="text-indigo-400 shrink-0 mt-0.5" />
             <p className="text-slate-300 text-sm leading-relaxed">
                <strong className="text-white">Time to interrogate!</strong> Ask questions to find who doesn't know the word. If you are the Imposter, pretend you know it!
            </p>
        </div>
      </div>

      <Button onClick={onEndGame} variant="danger" fullWidth className="py-4 shadow-red-900/20 text-lg">
        Stop & Vote
      </Button>
    </div>
  );
};