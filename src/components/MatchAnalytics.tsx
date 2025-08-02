import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Match } from '../types/cricket';
import { Download, TrendingUp, Target, Clock } from 'lucide-react';

interface MatchAnalyticsProps {
  match: Match;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function MatchAnalytics({ match }: MatchAnalyticsProps) {
  // Mock data for demonstration
  const runComparisonData = [
    { team: match.team1.name, runs: 165 },
    { team: match.team2.name, runs: 142 },
  ];

  const runsBreakdownData = [
    { name: 'Singles', value: 45, fill: '#10B981' },
    { name: 'Twos', value: 28, fill: '#3B82F6' },
    { name: 'Threes', value: 12, fill: '#F59E0B' },
    { name: 'Fours', value: 32, fill: '#EF4444' },
    { name: 'Sixes', value: 36, fill: '#8B5CF6' },
    { name: 'Extras', value: 12, fill: '#F97316' },
  ];

  const runRateData = [
    { over: 1, team1: 8, team2: 6 },
    { over: 2, team1: 15, team2: 12 },
    { over: 3, over: 3, team1: 22, team2: 20 },
    { over: 4, team1: 30, team2: 25 },
    { over: 5, team1: 38, team2: 33 },
    { over: 6, team1: 45, team2: 40 },
    { over: 7, team1: 52, team2: 48 },
    { over: 8, team1: 61, team2: 55 },
    { over: 9, team1: 69, team2: 62 },
    { over: 10, team1: 78, team2: 70 },
  ];

  const exportData = () => {
    // Export functionality would be implemented here
    console.log('Exporting match data...');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Match Analytics</h2>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Total Runs Comparison */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-blue-600" />
              Total Runs Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={runComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="runs" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Runs Breakdown */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Runs Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={runsBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {runsBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Run Rate Progression */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Run Rate Progression
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={runRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="over" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="team1"
                stroke="#10B981"
                strokeWidth={3}
                name={match.team1.name}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="team2"
                stroke="#3B82F6"
                strokeWidth={3}
                name={match.team2.name}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Match Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Highest Score</p>
                <p className="text-2xl font-bold">165/7</p>
              </div>
              <Target className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Best Partnership</p>
                <p className="text-2xl font-bold">65 runs</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Most Sixes</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Best Bowling</p>
                <p className="text-2xl font-bold">3/24</p>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}