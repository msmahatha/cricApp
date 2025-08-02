import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import { Match, Player, Ball, WicketDetails, Innings } from '../types/cricket';
import { Play, Square, RotateCcw, Target, Clock } from 'lucide-react';

export default function LiveScoring() {
  const { tournamentId } = useParams();
  const { state } = useTournament();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [currentInningsIndex, setCurrentInningsIndex] = useState(0);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);

  const currentInnings = selectedMatch?.innings[currentInningsIndex];
  const currentOver = currentInnings?.overs[currentInnings.overs.length - 1];

  const scoreRuns = (runs: number) => {
    if (!selectedMatch || !currentInnings) return;

    const newBall: Ball = {
      ballNumber: (currentOver?.balls.length || 0) + 1,
      runs,
      isWide: false,
      isNoBall: false,
      isWicket: false,
      striker: currentInnings.currentBatsmen.striker,
      bowler: currentInnings.currentBowler,
    };

    // Add ball to current over
    // Update scores
    // Handle striker rotation for odd runs
    // Handle over completion
  };

  const recordWicket = (type: WicketDetails['type'], fielder?: Player) => {
    if (!selectedMatch || !currentInnings) return;

    const wicketDetails: WicketDetails = {
      type,
      dismissedPlayer: currentInnings.currentBatsmen.striker,
      fielder,
      bowler: currentInnings.currentBowler,
    };

    // Record wicket
    // Show player selection for new batsman
    setShowWicketModal(false);
    setShowPlayerSelection(true);
  };

  const recordExtra = (type: 'wide' | 'noball', additionalRuns: number = 0) => {
    if (!selectedMatch || !currentInnings) return;

    const newBall: Ball = {
      ballNumber: (currentOver?.balls.length || 0) + 1,
      runs: 1 + additionalRuns,
      isWide: type === 'wide',
      isNoBall: type === 'noball',
      isWicket: false,
      striker: currentInnings.currentBatsmen.striker,
      bowler: currentInnings.currentBowler,
    };

    // Add extra to over without counting as legal ball
    setShowExtrasModal(false);
  };

  if (!selectedMatch) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Match to Score</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.currentTournament?.matches
            .filter(m => m.status === 'upcoming' || m.status === 'live')
            .map((match) => (
              <button
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg">
                    {match.team1.name} vs {match.team2.name}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      match.status === 'live'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {match.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {new Date(match.date).toLocaleDateString()}
                </p>
              </button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedMatch.team1.name} vs {selectedMatch.team2.name}
          </h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="font-medium">LIVE</span>
            </div>
          </div>
        </div>

        {/* Current Score Display */}
        {currentInnings && (
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentInnings.battingTeam.name}
                </h3>
                <div className="text-3xl font-bold">
                  {currentInnings.totalRuns}/{currentInnings.wickets}
                </div>
                <div className="text-sm opacity-90">
                  Overs: {Math.floor(currentInnings.overs.length)}.
                  {currentOver?.balls.filter(b => !b.isWide && !b.isNoBall).length || 0}
                </div>
              </div>

              <div>
                <h4 className="text-sm opacity-90 mb-2">Current Batsmen</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>{currentInnings.currentBatsmen.striker.name} *</span>
                    <span>45 (32)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{currentInnings.currentBatsmen.nonStriker.name}</span>
                    <span>23 (18)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm opacity-90 mb-2">Current Bowler</h4>
                <div className="space-y-1">
                  <div>{currentInnings.currentBowler.name}</div>
                  <div className="text-sm opacity-90">3.2-0-18-1</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scoring Panel */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Scoring Panel</h2>
        
        {/* Run Buttons */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
          {[0, 1, 2, 3, 4, 6].map((runs) => (
            <button
              key={runs}
              onClick={() => scoreRuns(runs)}
              className={`h-16 rounded-lg font-bold text-xl transition-colors ${
                runs === 0
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : runs === 4
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : runs === 6
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {runs}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowWicketModal(true)}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Wicket
          </button>
          <button
            onClick={() => setShowExtrasModal(true)}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Extras
          </button>
          <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-3 rounded-lg font-medium transition-colors">
            Undo Ball
          </button>
          <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-3 rounded-lg font-medium transition-colors">
            End Over
          </button>
        </div>
      </div>

      {/* Current Over Display */}
      {currentOver && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current Over ({currentOver.number + 1})
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentOver.balls.map((ball, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  ball.isWicket
                    ? 'bg-red-500 text-white'
                    : ball.isWide || ball.isNoBall
                    ? 'bg-yellow-500 text-white'
                    : ball.runs === 4
                    ? 'bg-blue-500 text-white'
                    : ball.runs === 6
                    ? 'bg-red-400 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {ball.isWicket ? 'W' : ball.runs}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showWicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Record Wicket</h3>
            <div className="grid grid-cols-2 gap-3">
              {['bowled', 'caught', 'runout', 'stumped', 'lbw', 'hitWicket'].map((type) => (
                <button
                  key={type}
                  onClick={() => recordWicket(type as WicketDetails['type'])}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium capitalize"
                >
                  {type.replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowWicketModal(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showExtrasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Record Extra</h3>
            <div className="space-y-3">
              <button
                onClick={() => recordExtra('wide')}
                className="w-full p-3 border border-gray-200 rounded-lg hover:bg-yellow-50 text-left font-medium"
              >
                Wide Ball (+1 run)
              </button>
              <button
                onClick={() => recordExtra('noball')}
                className="w-full p-3 border border-gray-200 rounded-lg hover:bg-yellow-50 text-left font-medium"
              >
                No Ball (+1 run)
              </button>
            </div>
            <button
              onClick={() => setShowExtrasModal(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}