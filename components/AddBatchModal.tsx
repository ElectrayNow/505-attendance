import React, { useState, useEffect } from 'react';
import { Batch, User } from '../types';
import { BATCH_COLORS } from '../constants';

interface AddBatchModalProps {
  onClose: () => void;
  onSave: (batchData: Omit<Batch, 'id' | 'studentIds' | 'createdBy'>, id?: number) => void;
  instructors: User[];
  existingBatch?: Batch | null;
}

const AddBatchModal: React.FC<AddBatchModalProps> = ({ onClose, onSave, instructors, existingBatch }) => {
  const [name, setName] = useState('');
  const [instructorId, setInstructorId] = useState<number | ''>('');
  const [schedule, setSchedule] = useState('');
  const [totalSessions, setTotalSessions] = useState(8);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [color, setColor] = useState(BATCH_COLORS[0]);

  const isEditing = !!existingBatch;

  useEffect(() => {
    if (isEditing) {
        setName(existingBatch.name);
        setInstructorId(existingBatch.instructorId);
        setSchedule(existingBatch.schedule);
        setTotalSessions(existingBatch.totalSessions);
        setStartDate(existingBatch.startDate);
        setColor(existingBatch.color);
    }
  }, [existingBatch, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && instructorId && schedule.trim()) {
      onSave({ name, instructorId: Number(instructorId), schedule, totalSessions, startDate, color }, existingBatch?.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 text-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 border border-slate-700 transform transition-all duration-300 ease-out scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-300">{isEditing ? 'Edit Batch' : 'Create New Batch'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="batchName" className="block text-sm font-medium text-gray-300 mb-2">Batch Name</label>
                <input
                    type="text" id="batchName" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Hip-Hop Advanced" required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="instructorId" className="block text-sm font-medium text-gray-300 mb-2">Instructor</label>
                    <select
                        id="instructorId" value={instructorId} onChange={(e) => setInstructorId(Number(e.target.value))}
                        className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="" disabled>Select an instructor</option>
                        {instructors.map(inst => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-gray-300 mb-2">Schedule</label>
                    <input
                        type="text" id="schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)}
                        className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Sat, Sun - 2:00 PM" required
                    />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <input
                        type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="totalSessions" className="block text-sm font-medium text-gray-300 mb-2">Total Sessions</label>
                    <select
                        id="totalSessions"
                        value={totalSessions}
                        onChange={(e) => setTotalSessions(Number(e.target.value))}
                        className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value={8}>8 Sessions</option>
                        <option value={12}>12 Sessions</option>
                    </select>
                </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Batch Color</label>
                 <div className="flex gap-3">
                    {BATCH_COLORS.map(c => (
                        <button
                            type="button"
                            key={c}
                            onClick={() => setColor(c)}
                            className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`}
                            style={{ backgroundColor: c }}
                            aria-label={`Select color ${c}`}
                        />
                    ))}
                 </div>
            </div>
            <div className="mt-6 flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors duration-200 shadow-md"
                >
                    Cancel
                </button>
                 <button
                    type="submit"
                    className="text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md disabled:bg-gray-500"
                    style={{ backgroundColor: color }}
                    disabled={!name.trim() || !instructorId || !schedule.trim()}
                >
                    {isEditing ? 'Save Changes' : 'Create Batch'}
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

export default AddBatchModal;