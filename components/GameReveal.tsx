import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { Button } from './Button';
import { RotateCcw, Timer, Fingerprint, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameRevealProps {
  players: Player[];
  imposter: Player | undefined;
  secretWord: string;
  category: string;
  onPlayAgain: () => void;
}

export const GameReveal: React.FC<GameRevealProps> = ({ 
  players, 
  imposter, 
  secretWord, 
  category, 
  onPlayAgain 
}) => {
  const [phase, setPhase] = useState<'VOTING' | 'RESULT'>('VOTING');
  const [timeLeft, setTimeLeft] = useState(60);
  const [votes, setVotes] = useState<Record<string, number>>({});

  // Timer logic
  useEffect(() => {
    if (phase === 'VOTING' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [phase, timeLeft]);

  // Confetti logic (only fires on RESULT)
  useEffect(() => {
    if (phase === 'RESULT') {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ef4444', '#f59e0b', '#ec4899']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ef4444', '#f59e0b', '#ec4899']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [phase]);

  const handleVote = (playerId: string) => {
    setVotes(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1
    }));
  };

  const getVoteCount = (playerId: string) => votes[playerId] || 0;

  // VOTING PHASE UI
  if (phase === 'VOTING') {
    return (
      <div className="flex flex-col h-full w-full p-4 animate-in fade-in duration-500">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 mb-2">
            <Timer className={timeLeft < 10 ? "text-red-400" : "text-indigo-400"} size={20} />
            <span className={`font-mono text-xl font-bold ${timeLeft < 10 ? "text-red-400" : "text-white"}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Who is the Imposter?</h2>
          <p className="text-slate-400 text-sm">Tap a player to cast a vote against them.</p>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 content-start pb-4">
          {players.map(player => {
            const voteCount = getVoteCount(player.id);
            return (
              <button
                key={player.id}
                onClick={() => handleVote(player.id)}
                className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                  voteCount > 0 
                    ? 'bg-red-500/10 border-red-500/50' 
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <div className="relative mb-2">
                   <img 
                      src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${player.avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                      alt={player.name} 
                      className="w-16 h-16 rounded-full bg-slate-700 object-cover"
                   />
                   {voteCount > 0 && (
                     <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg animate-in zoom-in">
                       <span className="text-white font-bold">{voteCount}</span>
                     </div>
                   )}
                </div>
                <span className="font-bold text-slate-200 text-sm truncate w-full text-center">{player.name}</span>
                
                {/* Fingerprint icon as 'vote' action indicator */}
                <div className="mt-2 text-slate-600">
                  <Fingerprint size={20} />
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center mb-4">
           <p className="text-xs text-slate-400">
             Majority vote determines who gets ejected. If it's the Imposter, Citizens win!
           </p>
        </div>

        <Button onClick={() => setPhase('RESULT')} fullWidth className="py-4 text-lg shadow-indigo-900/20">
          Reveal Truth
        </Button>
      </div>
    );
  }

  // RESULT PHASE CALCULATION
  const sortedByVotes = [...players].sort((a, b) => getVoteCount(b.id) - getVoteCount(a.id));
  const mostVotedPlayer = sortedByVotes[0];
  const maxVotes = getVoteCount(mostVotedPlayer.id);
  const isTie = sortedByVotes.filter(p => getVoteCount(p.id) === maxVotes).length > 1;
  const caughtImposter = !isTie && mostVotedPlayer.isImposter && maxVotes > 0;

  // RESULT PHASE UI
  return (
    <div className="flex flex-col h-full w-full p-6 text-center animate-in fade-in duration-700">
        <div className="flex-1 flex flex-col items-center justify-center">
            
            {/* Result Status Header */}
            <div className="mb-6 animate-in slide-in-from-top-4 duration-700 delay-100">
               {caughtImposter ? (
                 <div className="flex flex-col items-center gap-2">
                   <div className="bg-emerald-500/20 text-emerald-300 p-3 rounded-full mb-2 ring-1 ring-emerald-500/50">
                      <Check size={32} strokeWidth={3} />
                   </div>
                   <h2 className="text-3xl font-black text-emerald-400 uppercase tracking-tight">Crew Wins!</h2>
                   <p className="text-emerald-200/70 text-sm font-medium">The imposter was caught.</p>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-2">
                   <div className="bg-red-500/20 text-red-300 p-3 rounded-full mb-2 ring-1 ring-red-500/50">
                      <X size={32} strokeWidth={3} />
                   </div>
                   <h2 className="text-3xl font-black text-red-400 uppercase tracking-tight">Imposter Wins!</h2>
                   <p className="text-red-200/70 text-sm font-medium">
                     {maxVotes === 0 ? "No one was voted out." : isTie ? "Vote was a tie." : "Wrong person ejected."}
                   </p>
                 </div>
               )}
            </div>

            <div className="mb-8">
                <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                    The Imposter Was
                </span>
            </div>
            
            <div className="relative mb-12">
                <div className={`absolute inset-0 blur-3xl opacity-30 rounded-full animate-pulse ${caughtImposter ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                
                <div className="relative flex flex-col items-center">
                     <div className="relative mb-4">
                        <div className={`absolute -inset-1 bg-gradient-to-tr rounded-full blur opacity-75 ${caughtImposter ? 'from-emerald-500 to-teal-500' : 'from-red-500 to-orange-500'}`}></div>
                        {imposter && (
                            <img 
                                src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${imposter.avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                                alt="Imposter" 
                                className="relative w-48 h-48 rounded-full border-4 border-slate-900 bg-slate-800 object-cover"
                            />
                        )}
                     </div>
                    <h2 className="text-4xl font-black text-white drop-shadow-lg">
                        {imposter?.name || "Unknown"}
                    </h2>
                </div>
            </div>

            <div className="w-full bg-indigo-900/20 p-8 rounded-3xl border border-indigo-500/20 backdrop-blur-sm">
                <div className="flex flex-col gap-1 mb-6">
                    <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest">The Secret Word</h3>
                    <p className="text-4xl font-black text-white">{secretWord}</p>
                </div>
                
                <div className="h-px bg-indigo-500/20 w-1/2 mx-auto mb-6"></div>
                
                <div className="flex flex-col gap-1">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Category</h3>
                    <p className="text-xl font-bold text-slate-200">{category}</p>
                </div>
            </div>
        </div>

      <Button onClick={onPlayAgain} fullWidth className="mt-8 flex items-center justify-center gap-2 py-4 text-lg">
        <RotateCcw size={22} />
        Play Again
      </Button>
    </div>
  );
};