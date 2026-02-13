import React, { useState } from 'react';
import { Player } from '../types';
import { Button } from './Button';
import { Ghost, User, CheckCircle2 } from 'lucide-react';

interface RoleRevealProps {
  currentPlayer: Player;
  secretWord: string;
  category: string;
  onNext: () => void;
  isLastPlayer: boolean;
}

export const RoleReveal: React.FC<RoleRevealProps> = ({ 
  currentPlayer, 
  secretWord, 
  category, 
  onNext,
  isLastPlayer
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // If the user hasn't revealed yet
  if (!isRevealed) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col justify-center items-center w-full">
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
                <img 
                    src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${currentPlayer.avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                    alt="avatar" 
                    className="relative w-40 h-40 rounded-full border-4 border-slate-800 shadow-2xl bg-slate-700 object-cover"
                />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-300 mb-2">
                Pass device to
            </h2>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-indigo-100 to-white mb-8 tracking-tight">
                {currentPlayer.name}
            </h1>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <p className="text-slate-400 font-medium">
                    Make sure no one else is looking at the screen!
                </p>
            </div>
        </div>
        
        <Button onClick={() => setIsRevealed(true)} fullWidth className="py-5 text-xl shadow-xl shadow-indigo-900/20">
          Tap to Reveal Role
        </Button>
      </div>
    );
  }

  // If role is revealed
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center animate-in zoom-in-95 duration-300">
      <div className="w-full flex-1 flex flex-col justify-center">
        <h2 className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-6">
            Confidential
        </h2>
        
        <div className={`relative overflow-hidden rounded-3xl p-8 mb-8 shadow-2xl border-2 transition-all duration-500 ${
            currentPlayer.isImposter 
                ? 'bg-gradient-to-br from-red-900/80 to-slate-900 border-red-500/30' 
                : 'bg-gradient-to-br from-emerald-900/80 to-slate-900 border-emerald-500/30'
        }`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            {currentPlayer.isImposter ? (
                 <div className="relative flex flex-col items-center gap-6 z-10">
                    <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center ring-4 ring-red-500/20">
                        <Ghost size={48} className="text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-red-400 tracking-tight mb-2">IMPOSTER</h3>
                        <p className="text-red-200/70 font-medium">
                            You don't know the secret word.
                        </p>
                    </div>
                    <div className="w-full h-px bg-red-500/30"></div>
                    <div className="w-full">
                        <span className="text-xs text-red-300/60 uppercase font-bold tracking-wider mb-1 block">Your Hint</span>
                        <div className="bg-slate-900/40 rounded-xl py-3 border border-red-500/20">
                            <span className="text-xl font-bold text-red-100">{category}</span>
                        </div>
                         <p className="text-xs text-red-300/40 mt-2 font-medium">
                            Use this hint to fake your knowledge!
                        </p>
                    </div>
                 </div>
            ) : (
                <div className="relative flex flex-col items-center gap-6 z-10">
                     <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center ring-4 ring-emerald-500/20">
                        <User size={48} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-emerald-400 tracking-tight mb-2">CITIZEN</h3>
                        <p className="text-emerald-200/70 font-medium">
                            Find the imposter among you.
                        </p>
                    </div>
                    
                    <div className="w-full bg-slate-900/40 rounded-2xl p-5 border border-emerald-500/20 mt-2">
                        <span className="text-xs text-emerald-400/60 uppercase font-bold tracking-wider mb-2 block">Secret Word</span>
                        <span className="text-3xl font-black text-white tracking-wide">{secretWord}</span>
                    </div>
                    
                     <div className="mt-2">
                        <span className="text-sm text-emerald-400/60">Category: </span>
                        <span className="text-emerald-100 font-medium">{category}</span>
                    </div>
                </div>
            )}
        </div>
      </div>

      <Button 
            onClick={() => {
                setIsRevealed(false);
                onNext();
            }} 
            variant="secondary"
            fullWidth
            className="py-4 font-bold text-lg"
        >
          {isLastPlayer ? "Everybody Ready? Start!" : "Hide & Pass to Next Player"}
        </Button>
    </div>
  );
};