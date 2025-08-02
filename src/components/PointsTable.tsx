import React from 'react';
import { Tournament } from '../types/cricket';

interface PointsTableProps {
  tournament: Tournament;
}

export default function PointsTable({ tournament }: PointsTableProps) {
  const sortedTable = [...tournament.pointsTable].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.netRunRate - a.netRunRate;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Pos</th>
            <th className="px-4 py-3 text-left font-medium">Team</th>
            <th className="px-4 py-3 text-center font-medium">P</th>
            <th className="px-4 py-3 text-center font-medium">W</th>
            <th className="px-4 py-3 text-center font-medium">L</th>
            <th className="px-4 py-3 text-center font-medium">T</th>
            <th className="px-4 py-3 text-center font-medium">Pts</th>
            <th className="px-4 py-3 text-center font-medium">NRR</th>
          </tr>
        </thead>
        <tbody>
          {sortedTable.map((entry, index) => (
            <tr
              key={entry.team.id}
              className={`border-b border-gray-200 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-green-50 transition-colors`}
            >
              <td className="px-4 py-3 font-semibold text-gray-900">{index + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{entry.team.name}</td>
              <td className="px-4 py-3 text-center text-gray-700">{entry.played}</td>
              <td className="px-4 py-3 text-center text-green-600 font-medium">{entry.won}</td>
              <td className="px-4 py-3 text-center text-red-600 font-medium">{entry.lost}</td>
              <td className="px-4 py-3 text-center text-gray-700">{entry.tied}</td>
              <td className="px-4 py-3 text-center font-bold text-blue-600">{entry.points}</td>
              <td className="px-4 py-3 text-center text-gray-700">
                {entry.netRunRate > 0 ? '+' : ''}{entry.netRunRate.toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}