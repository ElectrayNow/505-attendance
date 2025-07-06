import React, { useState } from 'react';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (name: string) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAddStudent }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddStudent(name.trim());
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 text-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700 transform transition-all duration-300 ease-out scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-300">Add New Student</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-300 mb-2">Student Name</label>
                <input
                    type="text"
                    id="studentName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Jane Doe"
                    required
                    autoFocus
                />
            </div>
            <div className="mt-6 flex justify-end">
                 <button
                    type="submit"
                    className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500 transition-colors duration-200 shadow-md disabled:bg-gray-500"
                    disabled={!name.trim()}
                >
                    Add Student
                </button>
            </div>
        </form>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddStudentModal;