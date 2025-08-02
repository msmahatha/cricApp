export interface Player {
  id: string;
  name: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Tournament {
  id: string;
  name: string;
  format: 'league' | 'knockout';
  totalTeams: number;
  playersPerTeam: number;
  overLimit: number;
  teams: Team[];
  matches: Match[];
  pointsTable: PointsTableEntry[];
  createdAt: Date;
}

export interface Match {
  id: string;
  tournamentId: string;
  team1: Team;
  team2: Team;
  status: 'upcoming' | 'live' | 'completed';
  innings: Innings[];
  result?: MatchResult;
  venue?: string;
  date: Date;
}

export interface Innings {
  id: string;
  battingTeam: Team;
  bowlingTeam: Team;
  overs: Over[];
  totalRuns: number;
  wickets: number;
  extras: number;
  currentBatsmen: {
    striker: Player;
    nonStriker: Player;
  };
  currentBowler: Player;
  isCompleted: boolean;
}

export interface Over {
  number: number;
  bowler: Player;
  balls: Ball[];
  runs: number;
  wickets: number;
}

export interface Ball {
  ballNumber: number;
  runs: number;
  isWide: boolean;
  isNoBall: boolean;
  isWicket: boolean;
  wicketDetails?: WicketDetails;
  striker: Player;
  bowler: Player;
}

export interface WicketDetails {
  type: 'bowled' | 'caught' | 'runout' | 'stumped' | 'lbw' | 'hitWicket';
  dismissedPlayer: Player;
  fielder?: Player;
  bowler?: Player;
}

export interface MatchResult {
  winner: Team;
  margin: string;
  manOfTheMatch?: Player;
}

export interface PointsTableEntry {
  team: Team;
  played: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  netRunRate: number;
}

export interface PlayerStats {
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  wickets: number;
  ballsBowled: number;
  runsConceded: number;
}