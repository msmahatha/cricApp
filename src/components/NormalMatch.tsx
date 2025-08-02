import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import { Match, Player, Ball, WicketDetails, Innings, Over } from '../types/cricket';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Target, 
  Clock, 
  Users, 
  ArrowLeftRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function NormalMatch() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useTournament();
  
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [currentInningsIndex, setCurrentInningsIndex] = useState(0);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [showBowlerSelection, setShowBowlerSelection] = useState(false);
  const [selectedWicketType, setSelectedWicketType] = useState<WicketDetails['type'] | null>(null);
  const [newBatsman, setNewBatsman] = useState<Player | null>(null);
  const [newBowler, setNewBowler] = useState<Player | null>(null);
  const [matchStarted, setMatchStarted] = useState(false);

  // Mock match data for demonstration
  useEffect(() => {
    if (state.currentTournament && state.currentTournament.matches.length > 0) {
      const match = state.currentTournament.matches[0];
      setSelectedMatch({
        ...match,
        innings: matchStarted ? [{
          id: 'innings-1',
          battingTeam: match.team1,
          bowlingTeam: match.team2,
          overs: [],
          totalRuns: 0,
          wickets: 0,
          extras: 0,
          currentBatsmen: {
            striker: match.team1.players[0],
            nonStriker: match.team1.players[1]
          },
          currentBowler: match.team2.players[0],
          isCompleted: false
        }] : []
      });
    }
  }, [state.currentTournament, matchStarted]);

  const currentInnings = selectedMatch?.innings[currentInningsIndex];
  const currentOver = currentInnings?.overs[currentInnings.overs.length - 1];
  const ballsInCurrentOver = currentOver?.balls.filter(b => !b.isWide && !b.isNoBall).length || 0;

  const startMatch = () => {
    setMatchStarted(true);
  };

  const scoreRuns = (runs: number) => {
    if (!selectedMatch || !currentInnings) return;

    const newBall: Ball = {
      ballNumber: ballsInCurrentOver + 1,
      runs,
      isWide: false,
      isNoBall: false,
      isWicket: false,
      striker: currentInnings.currentBatsmen.striker,
      bowler: currentInnings.currentBowler,
    };

    // Create new over if needed
    let updatedOvers = [...currentInnings.overs];
    if (!currentOver || ballsInCurrentOver >= 6) {
      const newOver: Over = {
        number: updatedOvers.length,
        bowler: currentInnings.currentBowler,
        balls: [newBall],
        runs: runs,
        wickets: 0
      };
      updatedOvers.push(newOver);
    } else {
      updatedOvers[updatedOvers.length - 1] = {
        ...currentOver,
        balls: [...currentOver.balls, newBall],
        runs: currentOver.runs + runs
      };
    }

    // Handle striker rotation for odd runs
    let newStriker = currentInnings.currentBatsmen.striker;
    let newNonStriker = currentInnings.currentBatsmen.nonStriker;
    
    if (runs % 2 === 1) {
      newStriker = currentInnings.currentBatsmen.nonStriker;
      newNonStriker = currentInnings.currentBatsmen.striker;
    }

    // Update innings
    const updatedInnings = {
      ...currentInnings,
      overs: updatedOvers,
      totalRuns: currentInnings.totalRuns + runs,
      currentBatsmen: {
        striker: newStriker,
        nonStriker: newNonStriker
      }
    };

    // Update match
    const updatedMatch = {
      ...selectedMatch,
      innings: selectedMatch.innings.map((innings, index) =>
        index === currentInningsIndex ? updatedInnings : innings
      )
    };

    setSelectedMatch(updatedMatch);

    // Check if over is complete
    if (ballsInCurrentOver + 1 >= 6) {
      setShowBowlerSelection(true);
    }
  };

  const recordWicket = (type: WicketDetails['type'], fielder?: Player) => {
    if (!selectedMatch || !currentInnings) return;

    const wicketDetails: WicketDetails = {
      type,
      dismissedPlayer: currentInnings.currentBatsmen.striker,
      fielder,
      bowler: currentInnings.currentBowler,
    };

    const newBall: Ball = {
      ballNumber: ballsInCurrentOver + 1,
      runs: 0,
      isWide: false,
      isNoBall: false,
      isWicket: true,
      wicketDetails,
      striker: currentInnings.currentBatsmen.striker,
      bowler: currentInnings.currentBowler,
    };

    // Update over
    let updatedOvers = [...currentInnings.overs];
    if (!currentOver || ballsInCurrentOver >= 6) {
      const newOver: Over = {
        number: updatedOvers.length,
        bowler: currentInnings.currentBowler,
        balls: [newBall],
        runs: 0,
        wickets: 1
      };
      updatedOvers.push(newOver);
    } else {
      updatedOvers[updatedOvers.length - 1] = {
        ...currentOver,
        balls: [...currentOver.balls, newBall],
        wickets: currentOver.wickets + 1
      };
    }

    // Update innings
    const updatedInnings = {
      ...currentInnings,
      overs: updatedOvers,
      wickets: currentInnings.wickets + 1
    };

    const updatedMatch = {
      ...selectedMatch,
      innings: selectedMatch.innings.map((innings, index) =>
        index === currentInningsIndex ? updatedInnings : innings
      )
    };

    setSelectedMatch(updatedMatch);
    setShowWicketModal(false);
    setShowPlayerSelection(true);
  };

  const recordExtra = (type: 'wide' | 'noball', additionalRuns: number = 0) => {
    if (!selectedMatch || !currentInnings) return;

    const newBall: Ball = {
      ballNumber: ballsInCurrentOver + 1,
      runs: 1 + additionalRuns,
      isWide: type === 'wide',
      isNoBall: type === 'noball',
      isWicket: false,
      striker: currentInnings.currentBatsmen.striker,
      bowler: currentInnings.currentBowler,
    };

    // Update over (extras don't count as legal balls)
    let updatedOvers = [...currentInnings.overs];
    if (!currentOver) {
      const newOver: Over = {
        number: updatedOvers.length,
        bowler: currentInnings.currentBowler,
        balls: [newBall],
        runs: 1 + additionalRuns,
        wickets: 0
      };
      updatedOvers.push(newOver);
    } else {
      updatedOvers[updatedOvers.length - 1] = {
        ...currentOver,
        balls: [...currentOver.balls, newBall],
        runs: currentOver.runs + 1 + additionalRuns
      };
    }

    const updatedInnings = {
      ...currentInnings,
      overs: updatedOvers,
      totalRuns: currentInnings.totalRuns + 1 + additionalRuns,
      extras: currentInnings.extras + 1 + additionalRuns
    };

    const updatedMatch = {
      ...selectedMatch,
      innings: selectedMatch.innings.map((innings, index) =>
        index === currentInningsIndex ? updatedInnings : innings
      )
    };

    setSelectedMatch(updatedMatch);
    setShowExtrasModal(false);
  };

  const swapBatsmen = () => {
    if (!selectedMatch || !currentInnings) return;

    const updatedInnings = {
      ...currentInnings,
      currentBatsmen: {
        striker: currentInnings.currentBatsmen.nonStriker,
        nonStriker: currentInnings.currentBatsmen.striker
      }
    };

    const updatedMatch = {
      ...selectedMatch,
      innings: selectedMatch.innings.map((innings, index) =>
        index === currentInningsIndex ? updatedInnings : innings
      )
    };

    setSelectedMatch(updatedMatch);
  };

  const selectNewBatsman = (player: Player) => {
    if (!selectedMatch || !currentInnings) return;

    const updatedInnings = {
      ...currentInnings,
      currentBatsmen: {
        ...currentInnings.currentBatsmen,
        striker: player
      }
    };

    const updatedMatch = {
      ...selectedMatch,
      innings: selectedMatch.innings.map((innings, index) =>
        index === currentInningsIndex ? updatedInnings : innings
      )
    };

    setSelectedMatch(updatedMatch);
    setShowPlayerSelection(false);
  };

  const selectNewBowler = (player: Player) => {
    if (!selectedMatch || !currentInnings) return;

    const updatedInnings = {
      ...currentInnings,
      currentBowler: player,
      currentBatsmen: {
        striker: currentInnings.currentBatsmen.nonStriker,
        nonStriker: currentInnings.currentBatsmen.striker
      }
    };

    const updatedMatch = {
      ...selectedMatch,
      innings: selectedMatch.innings.map((innings, index) =>
        index === currentInningsIndex ? updatedInnings : innings
      )
    };

    setSelectedMatch(updatedMatch);
    setShowBowlerSelection(false);
  };

  if (!selectedMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Match Selected</h2>
          <p className="text-gray-600 mb-6">Please select a match from the tournament to start scoring.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!matchStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Play className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Match</h2>
            <p className="text-gray-600">Ready to begin the cricket match?</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">{selectedMatch.team1.name}</span>
              <span className="text-gray-500">vs</span>
              <span className="font-semibold text-gray-900">{selectedMatch.team2.name}</span>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {new Date(selectedMatch.date).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={startMatch}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Match</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Match Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedMatch.team1.name} vs {selectedMatch.team2.name}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="font-medium">LIVE</span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back to Dashboard
              </button>
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
                  <div className="text-4xl font-bold">
                    {currentInnings.totalRuns}/{currentInnings.wickets}
                  </div>
                  <div className="text-sm opacity-90">
                    Overs: {currentInnings.overs.length > 0 ? currentInnings.overs.length - 1 : 0}.{ballsInCurrentOver}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm opacity-90 mb-2">Current Batsmen</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        {currentInnings.currentBatsmen.striker.name}
                        <Target className="w-3 h-3 ml-1" />
                      </span>
                      <span>45* (32)</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scoring Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Scoring Panel</h2>
            
            {/* Run Buttons */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
              {[0, 1, 2, 3, 4, 6].map((runs) => (
                <button
                  key={runs}
                  onClick={() => scoreRuns(runs)}
                  className={`h-16 rounded-lg font-bold text-xl transition-all transform hover:scale-105 ${
                    runs === 0
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : runs === 4
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                      : runs === 6
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                  }`}
                >
                  {runs}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => setShowWicketModal(true)}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Wicket</span>
              </button>
              <button
                onClick={() => setShowExtrasModal(true)}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Clock className="w-4 h-4" />
                <span>Extras</span>
              </button>
              <button
                onClick={swapBatsmen}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Swap</span>
              </button>
              <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <RotateCcw className="w-4 h-4" />
                <span>Undo</span>
              </button>
            </div>
          </div>

          {/* Current Over Display */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Current Over ({(currentInnings?.overs.length || 0) + 1})
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Array.from({ length: 6 }, (_, index) => {
                const ball = currentOver?.balls[index];
                return (
                  <div
                    key={index}
                    className={`h-12 rounded-lg flex items-center justify-center text-sm font-bold ${
                      ball
                        ? ball.isWicket
                          ? 'bg-red-500 text-white'
                          : ball.isWide || ball.isNoBall
                          ? 'bg-yellow-500 text-white'
                          : ball.runs === 4
                          ? 'bg-blue-500 text-white'
                          : ball.runs === 6
                          ? 'bg-red-400 text-white'
                          : 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {ball
                      ? ball.isWicket
                        ? 'W'
                        : ball.isWide
                        ? `W${ball.runs > 1 ? ball.runs - 1 : ''}`
                        : ball.isNoBall
                        ? `NB${ball.runs > 1 ? ball.runs - 1 : ''}`
                        : ball.runs
                      : index + 1}
                  </div>
                );
              })}
            </div>
            
            {/* Over Summary */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span>Runs: {currentOver?.runs || 0}</span>
                <span>Wickets: {currentOver?.wickets || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showWicketModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Record Wicket</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['bowled', 'caught', 'runout', 'stumped', 'lbw', 'hitWicket'].map((type) => (
                  <button
                    key={type}
                    onClick={() => recordWicket(type as WicketDetails['type'])}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 text-sm font-medium capitalize transition-colors"
                  >
                    {type.replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowWicketModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showExtrasModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Record Extra</h3>
              <div className="space-y-3 mb-4">
                <button
                  onClick={() => recordExtra('wide')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 text-left font-medium transition-colors"
                >
                  Wide Ball (+1 run)
                </button>
                <button
                  onClick={() => recordExtra('noball')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 text-left font-medium transition-colors"
                >
                  No Ball (+1 run)
                </button>
              </div>
              <button
                onClick={() => setShowExtrasModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showPlayerSelection && currentInnings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select New Batsman</h3>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {currentInnings.battingTeam.players
                  .filter(p => 
                    p.id !== currentInnings.currentBatsmen.striker.id && 
                    p.id !== currentInnings.currentBatsmen.nonStriker.id
                  )
                  .map((player) => (
                    <button
                      key={player.id}
                      onClick={() => selectNewBatsman(player)}
                      className="w-full p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 text-left font-medium transition-colors"
                    >
                      {player.name}
                    </button>
                  ))}
              </div>
              <button
                onClick={() => setShowPlayerSelection(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showBowlerSelection && currentInnings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select New Bowler</h3>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {currentInnings.bowlingTeam.players
                  .filter(p => p.id !== currentInnings.currentBowler.id)
                  .map((player) => (
                    <button
                      key={player.id}
                      onClick={() => selectNewBowler(player)}
                      className="w-full p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 text-left font-medium transition-colors"
                    >
                      {player.name}
                    </button>
                  ))}
              </div>
              <button
                onClick={() => setShowBowlerSelection(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}