import React from 'react';
import { useTournament } from '../contexts/TournamentContext';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react';
import PointsTable from './PointsTable';

export default function Dashboard() {
  const { state } = useTournament();
  const { tournaments, currentTournament } = state;

  const activeTournaments = tournaments.filter(t => 
    t.matches.some(m => m.status === 'live' || m.status === 'upcoming')
  );

  const completedMatches = currentTournament?.matches.filter(m => m.status === 'completed').length || 0;
  const totalMatches = currentTournament?.matches.length || 0;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Cricket Tournament Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Manage your tournaments and track live matches
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tournaments</p>
              <p className="text-2xl font-bold text-gray-900">{tournaments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeTournaments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Matches</p>
              <p className="text-2xl font-bold text-gray-900">{completedMatches}/{totalMatches}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Tournament */}
      {currentTournament && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentTournament.name}
            </h2>
            <div className="flex space-x-3">
              <Link
                to={`/tournament/${currentTournament.id}/matches`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Matches
              </Link>
              <Link
                to={`/scoring/${currentTournament.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Live Scoring
              </Link>
            </div>
          </div>
          
          <PointsTable tournament={currentTournament} />
        </div>
      )}

      {/* Tournament List */}
      {tournaments.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No tournaments yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first cricket tournament to get started
          </p>
          <Link
            to="/create-tournament"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Create Tournament
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Tournaments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {tournament.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Format: {tournament.format.charAt(0).toUpperCase() + tournament.format.slice(1)}</p>
                  <p>Teams: {tournament.teams.length}</p>
                  <p>Over Limit: {tournament.overLimit}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      // Set as current tournament logic would go here
                    }}
                    className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors"
                  >
                    Select
                  </button>
                  <Link
                    to={`/tournament/${tournament.id}`}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to="/normal-match"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Normal Match
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}