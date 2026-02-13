export interface Player {
  id: string;
  name: string;
  isImposter: boolean;
  avatarSeed: number; // For generating consistent random avatars
}

export enum GamePhase {
  LOBBY = 'LOBBY',
  LOADING = 'LOADING',
  ASSIGNMENT = 'ASSIGNMENT', // Passing the phone around
  PLAYING = 'PLAYING',
  REVEAL = 'REVEAL'
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  category: string;
  secretWord: string;
  currentPlayerIndex: number; // For assignment phase
  timeRemaining: number; // In seconds
}

export interface WordGenerationResult {
  category: string;
  word: string;
}
