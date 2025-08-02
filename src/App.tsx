import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TournamentProvider } from './contexts/TournamentContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CreateTournament from './components/CreateTournament';
import LiveScoring from './components/LiveScoring';
import MatchAnalytics from './components/MatchAnalytics';
import NormalMatch from './components/NormalMatch';

function App() {
  return (
    <TournamentProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-tournament" element={<CreateTournament />} />
            <Route path="/scoring/:tournamentId" element={<LiveScoring />} />
            <Route path="/normal-match/:matchId?" element={<NormalMatch />} />
            <Route path="/analytics" element={
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Match Analytics</h2>
                <p className="text-gray-600">Complete a match to view detailed analytics</p>
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </TournamentProvider>
  );
}

export default App;