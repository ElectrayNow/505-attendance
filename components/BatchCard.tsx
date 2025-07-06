import React from 'react';
import { Batch } from '../types';

interface BatchCardProps {
  batch: Batch;
  instructorName: string;
  onSelect: () => void;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch, instructorName, onSelect }) => {
  return (
    <div 
      className="bg-slate-800/60 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-slate-700/50"
      style={{ borderTop: `4px solid ${batch.color}`}}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: batch.color }}>{batch.name}</h2>
        <p className="text-indigo-300 font-medium mb-1">Instructor: {instructorName}</p>
        <p className="text-gray-400 mb-4">{batch.schedule}</p>
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="text-gray-300">{batch.studentIds.length} Students</span>
            </div>
            <button
                onClick={onSelect}
                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors duration-200 shadow-md"
            >
                View Sessions
            </button>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;