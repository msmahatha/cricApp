import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../contexts/TournamentContext';
import { Tournament, Team, Player } from '../types/cricket';
import { ArrowLeft, ArrowRight, Users, Trophy, Settings } from 'lucide-react';

interface TournamentForm {
  name: string;
  format: 'league' | 'knockout';
  totalTeams: number;
  playersPerTeam: number;
  overLimit: number;
}

export default function CreateTournament() {
  const navigate = useNavigate();
  const { dispatch } = useTournament();
  const [currentStep, setCurrentStep] = useState(1);
  const [tournamentForm, setTournamentForm] = useState<TournamentForm>({
    name: '',
    format: 'league',
    totalTeams: 4,
    playersPerTeam: 11,
    overLimit: 20,
  });
  const [teams, setTeams] = useState<string[]>([]);
  const [players, setPlayers] = useState<{ [teamName: string]: string[] }>({});

  const steps = [
    { number: 1, title: 'Tournament Details', icon: Settings },
    { number: 2, title: 'Team Names', icon: Users },
    { number: 3, title: 'Player Names', icon: Trophy },
  ];

  const handleNextStep = () => {
    if (currentStep === 1) {
      setTeams(Array(tournamentForm.totalTeams).fill(''));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const playerObj: { [teamName: string]: string[] } = {};
      teams.forEach(team => {
        playerObj[team] = Array(tournamentForm.playersPerTeam).fill('');
      });
      setPlayers(playerObj);
      setCurrentStep(3);
    } else {
      createTournament();
    }
  };

  const createTournament = () => {
    const tournamentTeams: Team[] = teams.map((teamName, teamIndex) => ({
      id: `team-${teamIndex}`,
      name: teamName,
      players: players[teamName].map((playerName, playerIndex) => ({
        id: `player-${teamIndex}-${playerIndex}`,
        name: playerName,
        teamId: `team-${teamIndex}`,
      })),
    }));

    const tournament: Tournament = {
      id: `tournament-${Date.now()}`,
      name: tournamentForm.name,
      format: tournamentForm.format,
      totalTeams: tournamentForm.totalTeams,
      playersPerTeam: tournamentForm.playersPerTeam,
      overLimit: tournamentForm.overLimit,
      teams: tournamentTeams,
      matches: generateMatches(tournamentTeams, tournamentForm.format),
      pointsTable: tournamentTeams.map(team => ({
        team,
        played: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
        netRunRate: 0,
      })),
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_TOURNAMENT', payload: tournament });
    dispatch({ type: 'SET_CURRENT_TOURNAMENT', payload: tournament });
    navigate('/');
  };

  const generateMatches = (teams: Team[], format: string) => {
    const matches = [];
    if (format === 'league') {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          matches.push({
            id: `match-${i}-${j}`,
            tournamentId: '',
            team1: teams[i],
            team2: teams[j],
            status: 'upcoming' as const,
            innings: [],
            date: new Date(),
          });
        }
      }
    }
    return matches;
  };

  const updateTeamName = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index] = name;
    setTeams(newTeams);
  };

  const updatePlayerName = (teamName: string, playerIndex: number, name: string) => {
    setPlayers(prev => ({
      ...prev,
      [teamName]: prev[teamName].map((player, index) =>
        index === playerIndex ? name : player
      ),
    }));
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return tournamentForm.name.trim() !== '';
    }
    if (currentStep === 2) {
      return teams.every(team => team.trim() !== '');
    }
    if (currentStep === 3) {
      return Object.values(players).every(teamPlayers =>
        teamPlayers.every(player => player.trim() !== '')
      );
    }
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Tournament</h1>
          <p className="text-gray-600">Set up your cricket tournament in a few easy steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    Step {step.number}
                  </p>
                  <p className="text-xs text-gray-500">{step.title}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Name
              </label>
              <input
                type="text"
                value={tournamentForm.name}
                onChange={(e) =>
                  setTournamentForm(prev => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter tournament name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Format
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['league', 'knockout'].map((format) => (
                  <button
                    key={format}
                    onClick={() =>
                      setTournamentForm(prev => ({ ...prev, format: format as 'league' | 'knockout' }))
                    }
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      tournamentForm.format === format
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold capitalize">{format}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {format === 'league' ? 'Round-robin format' : 'Elimination format'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Teams
                </label>
                <input
                  type="number"
                  min="2"
                  max="16"
                  value={tournamentForm.totalTeams}
                  onChange={(e) =>
                    setTournamentForm(prev => ({ ...prev, totalTeams: parseInt(e.target.value) }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Players per Team
                </label>
                <input
                  type="number"
                  min="5"
                  max="15"
                  value={tournamentForm.playersPerTeam}
                  onChange={(e) =>
                    setTournamentForm(prev => ({ ...prev, playersPerTeam: parseInt(e.target.value) }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Over Limit
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={tournamentForm.overLimit}
                  onChange={(e) =>
                    setTournamentForm(prev => ({ ...prev, overLimit: parseInt(e.target.value) }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Enter Team Names</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team {index + 1}
                  </label>
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => updateTeamName(index, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={`Enter team ${index + 1} name`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Enter Player Names</h3>
            {teams.map((teamName, teamIndex) => (
              <div key={teamIndex} className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">{teamName}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {players[teamName]?.map((player, playerIndex) => (
                    <div key={playerIndex}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Player {playerIndex + 1}
                      </label>
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => updatePlayerName(teamName, playerIndex, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder={`Player ${playerIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep > 1 ? 'Previous' : 'Cancel'}</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={!canProceed()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              canProceed()
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === 3 ? 'Create Tournament' : 'Next'}</span>
            {currentStep < 3 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}