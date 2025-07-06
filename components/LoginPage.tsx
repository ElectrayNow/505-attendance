import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Logo: React.FC = () => (
    <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto mb-4">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgb(45, 212, 191)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgb(99, 102, 241)', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <path fill="url(#logoGradient)" d="M50,5A45,45,0,1,1,5,50,45,45,0,0,1,50,5Zm0,8A37,37,0,1,0,87,50,37,37,0,0,0,50,13Z" />
        <path fill="url(#logoGradient)" d="M50,25a9,9,0,0,0-9,9,4,4,0,0,1-8,0,17,17,0,0,1,34,0,4,4,0,0,1-8,0A9,9,0,0,0,50,25Z" transform="rotate(15 50 50)" />
        <path fill="url(#logoGradient)" d="M69.5,58a9,9,0,0,0-12.2-1.2,4,4,0,0,1-4.6-6.3,17,17,0,0,1,23,2.3,4,4,0,0,1-4.6,6.3A9,9,0,0,0,69.5,58Z" transform="rotate(15 50 50)" />
        <path fill="url(#logoGradient)" d="M30.5,58A9,9,0,0,1,42.7,56.8a4,4,0,0,1,4.6,6.3,17,17,0,0,0-23,2.3,4,4,0,0,0,4.6-6.3A9,9,0,0,1,30.5,58Z" transform="rotate(15 50 50)" />
    </svg>
);


const LoginPage: React.FC<LoginPageProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username);
    
    // In a real app, password would be hashed. For demo, it's a simple check.
    // The password for all demo users is 'dance123'.
    if (user && password === 'dance123') {
      setError('');
      onLogin(user);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
        <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 max-w-sm w-full">
            <Logo />
            <h1 className="text-3xl font-bold text-white mb-2">
                DanceBatch <span className="text-teal-400">Attendance</span>
            </h1>
            <p className="text-gray-400 mb-8">Your attendance tracker, linked to Google Sheets.</p>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., admin or neha"
                        required
                        autoComplete="username"
                    />
                </div>
                <div>
                    <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="dance123"
                        required
                        autoComplete="current-password"
                    />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors duration-200 shadow-md"
                >
                    Login
                </button>
            </form>
        </div>
    </div>
  );
};

export default LoginPage;