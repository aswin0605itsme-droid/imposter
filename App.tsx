import React, { useState, useEffect } from 'react';
import { Player, GamePhase, GameState } from './types';
import { Lobby } from './components/Lobby';
import { RoleReveal } from './components/RoleReveal';
import { GameRunning } from './components/GameRunning';
import { GameReveal } from './components/GameReveal';
import { generateGameWord } from './services/geminiService';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.LOBBY,
    players: [],
    category: '',
    secretWord: '',
    currentPlayerIndex: 0,
    timeRemaining: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialize with empty array to avoid hydration issues, but could load from local storage
  useEffect(() => {
    // Optional: Load previous players from local storage
  }, []);

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      // Use a timestamp + random string for ID to ensure compatibility in non-secure contexts
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      name,
      isImposter: false,
      avatarSeed: Math.random()
    };
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  const removePlayer = (id: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const startGame = async () => {
    setIsLoading(true);
    
    // 1. Get Word from Gemini
    const { word, category } = await generateGameWord();

    // 2. Assign Imposter
    const players = [...gameState.players];
    // Reset any previous imposter status
    players.forEach(p => p.isImposter = false);
    
    const imposterIndex = Math.floor(Math.random() * players.length);
    const updatedPlayers = players.map((p, i) => ({
      ...p,
      isImposter: i === imposterIndex
    }));

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      secretWord: word,
      category: category,
      phase: GamePhase.ASSIGNMENT,
      currentPlayerIndex: 0
    }));
    
    setIsLoading(false);
  };

  const nextPlayer = () => {
    setGameState(prev => {
      // Check if we are at the last player
      if (prev.currentPlayerIndex >= prev.players.length - 1) {
        return { ...prev, phase: GamePhase.PLAYING };
      }
      return { ...prev, currentPlayerIndex: prev.currentPlayerIndex + 1 };
    });
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, phase: GamePhase.REVEAL }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      phase: GamePhase.LOBBY,
      secretWord: '',
      category: '',
      currentPlayerIndex: 0
    }));
  };

  // Render Logic
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden relative font-sans">
      {/* Background Elements - More Colorful */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[60%] bg-cyan-600/20 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col h-full max-w-lg mx-auto w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen gap-6">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 rounded-full animate-pulse"></div>
                <Loader2 className="relative animate-spin text-indigo-400" size={64} />
            </div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 font-bold text-xl animate-pulse">
                Summoning the AI...
            </p>
          </div>
        ) : (
          <>
            {gameState.phase === GamePhase.LOBBY && (
              <Lobby 
                players={gameState.players} 
                onAddPlayer={addPlayer} 
                onRemovePlayer={removePlayer}
                onStartGame={startGame}
              />
            )}

            {gameState.phase === GamePhase.ASSIGNMENT && (
              <RoleReveal 
                currentPlayer={gameState.players[gameState.currentPlayerIndex]}
                secretWord={gameState.secretWord}
                category={gameState.category}
                onNext={nextPlayer}
                isLastPlayer={gameState.currentPlayerIndex === gameState.players.length - 1}
              />
            )}

            {gameState.phase === GamePhase.PLAYING && (
              <GameRunning 
                players={gameState.players}
                onEndGame={endGame}
                category={gameState.category}
              />
            )}

            {gameState.phase === GamePhase.REVEAL && (
              <GameReveal 
                players={gameState.players}
                imposter={gameState.players.find(p => p.isImposter)}
                secretWord={gameState.secretWord}
                category={gameState.category}
                onPlayAgain={resetGame}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}