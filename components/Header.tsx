import React from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-2xl font-bold text-white">
            DanceBatch <span className="text-teal-400">Attendance</span>
          </h1>
        </div>
        {isAuthenticated && (
          <button 
            onClick={onLogout}
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors duration-200 shadow-md flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;