import React from 'react';
import { Player } from '../types';
import { Button } from './Button';
import { RotateCcw } from 'lucide-react';

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
  return (
    <div className="flex flex-col h-full w-full p-6 text-center animate-in fade-in duration-700">
        <div className="flex-1 flex flex-col items-center justify-center">
            
            <div className="mb-8">
                <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                    The Imposter Was
                </span>
            </div>
            
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-red-500 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                
                <div className="relative flex flex-col items-center">
                     <div className="relative mb-4">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-red-500 to-orange-500 rounded-full blur opacity-75"></div>
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