import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, Plus, BarChart3, Play } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/create-tournament', label: 'Create', icon: Plus },
    { path: '/normal-match', label: 'Match', icon: Play },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-lg border-b-2 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CricketPro</span>
            </Link>
            
            <div className="flex space-x-4">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}