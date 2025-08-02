import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Tournament, Match, Team, Player } from '../types/cricket';

interface TournamentState {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  currentMatch: Match | null;
  loading: boolean;
  error: string | null;
}

type TournamentAction =
  | { type: 'SET_TOURNAMENTS'; payload: Tournament[] }
  | { type: 'SET_CURRENT_TOURNAMENT'; payload: Tournament | null }
  | { type: 'SET_CURRENT_MATCH'; payload: Match | null }
  | { type: 'ADD_TOURNAMENT'; payload: Tournament }
  | { type: 'UPDATE_TOURNAMENT'; payload: Tournament }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: TournamentState = {
  tournaments: [],
  currentTournament: null,
  currentMatch: null,
  loading: false,
  error: null,
};

const TournamentContext = createContext<{
  state: TournamentState;
  dispatch: React.Dispatch<TournamentAction>;
} | null>(null);

function tournamentReducer(state: TournamentState, action: TournamentAction): TournamentState {
  switch (action.type) {
    case 'SET_TOURNAMENTS':
      return { ...state, tournaments: action.payload };
    case 'SET_CURRENT_TOURNAMENT':
      return { ...state, currentTournament: action.payload };
    case 'SET_CURRENT_MATCH':
      return { ...state, currentMatch: action.payload };
    case 'ADD_TOURNAMENT':
      return { ...state, tournaments: [...state.tournaments, action.payload] };
    case 'UPDATE_TOURNAMENT':
      return {
        ...state,
        tournaments: state.tournaments.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
        currentTournament: state.currentTournament?.id === action.payload.id
          ? action.payload
          : state.currentTournament,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tournamentReducer, initialState);

  return (
    <TournamentContext.Provider value={{ state, dispatch }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}