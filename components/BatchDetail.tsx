import React, { useState } from 'react';
import { Batch, Student, Session, AttendanceStatus, User, UserRole } from '../types';
import AddStudentModal from './AddStudentModal';
import ConfirmationModal from './ConfirmationModal';

interface BatchDetailProps {
  batch: Batch;
  students: Student[];
  sessions: Session[];
  currentUser: User | null;
  instructorName: string;
  onBack: () => void;
  onSelectSession: (session: Session) => void;
  onAddStudent: (batchId: number, studentName: string) => void;
  onRemoveStudent: (batchId: number, studentId: number) => void;
  onStartNewClass: (batchId: number) => void;
  onDeleteBatch: (batchId: number) => void;
  onEditBatch: (batch: Batch) => void;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSessionDate: (sessionId: string, newDate: string) => void;
}

const getClassStatus = (session: Session | undefined) => {
    if (!session) {
      return { text: 'Upcoming', color: 'gray', a11y: 'This class has not started yet.' };
    }
    const isUnmarked = session.attendance.every(a => a.status === AttendanceStatus.UNMARKED);
    if (isUnmarked) {
        return { text: 'Pending', color: 'yellow', a11y: 'This class is ready for attendance marking.' };
    }
    return { text: 'Completed', color: 'green', a11y: 'Attendance for this class has been marked.' };
};

const statusColorClasses = {
    gray: 'bg-gray-600 text-gray-200',
    yellow: 'bg-yellow-500 text-white',
    green: 'bg-green-500 text-white',
};

const BatchDetail: React.FC<BatchDetailProps> = ({ batch, students, sessions, currentUser, instructorName, onBack, onSelectSession, onAddStudent, onRemoveStudent, onStartNewClass, onDeleteBatch, onEditBatch, onDeleteSession, onUpdateSessionDate }) => {
  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [studentToConfirmRemove, setStudentToConfirmRemove] = useState<Student | null>(null);
  const [sessionToConfirmRemove, setSessionToConfirmRemove] = useState<Session | null>(null);
  const [isConfirmDeleteBatchOpen, setConfirmDeleteBatchOpen] = useState(false);
  const [editingDateSessionId, setEditingDateSessionId] = useState<string | null>(null);

  const handleAddStudentSubmit = (studentName: string) => {
    onAddStudent(batch.id, studentName);
    setAddStudentModalOpen(false);
  };

  const handleConfirmRemoveStudent = () => {
    if (studentToConfirmRemove) {
        onRemoveStudent(batch.id, studentToConfirmRemove.id);
        setStudentToConfirmRemove(null);
    }
  };

  const handleConfirmRemoveSession = () => {
    if(sessionToConfirmRemove) {
        onDeleteSession(sessionToConfirmRemove.id);
        setSessionToConfirmRemove(null);
    }
  };

  const handleConfirmDeleteBatch = () => {
    onDeleteBatch(batch.id);
    setConfirmDeleteBatchOpen(false);
  }

  const nextClassNumber = sessions.length + 1;
  const classPlaceholders = Array.from({ length: batch.totalSessions }, (_, i) => i + 1);

  return (
    <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700/50">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4 border-b pb-6" style={{ borderColor: `${batch.color}40` }}>
        <button onClick={onBack} className="flex items-center space-x-2 text-teal-300 hover:text-teal-200 transition-colors duration-200 font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Back to Batches</span>
        </button>
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: batch.color }}>{batch.name}</h1>
          <p className="text-indigo-300">{instructorName} - ({batch.schedule})</p>
          <p className="text-sm text-gray-400 mt-1">
            Starts on: {new Date(batch.startDate + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold text-white">Enrolled Students ({students.length})</h2>
                     <button
                        onClick={() => setAddStudentModalOpen(true)}
                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors duration-200 shadow-md flex items-center"
                        >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        Add Student
                    </button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {students.length > 0 ? students.map(student => (
                        <div key={student.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700/70">
                            <div className="flex items-center">
                                <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-4 border-2 border-slate-600"/>
                                <span className="font-medium text-gray-200">{student.name}</span>
                            </div>
                            <button
                                onClick={() => setStudentToConfirmRemove(student)}
                                title={`Remove ${student.name}`}
                                className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-full"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    )) : (
                         <div className="text-center py-8 px-4 bg-slate-800 rounded-lg">
                            <p className="text-gray-400">No students enrolled in this batch.</p>
                            <p className="text-gray-500 mt-2">Click "Add Student" to enroll someone.</p>
                        </div>
                    )}
                </div>
            </div>
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Course Classes</h2>
                    <span className="text-lg font-semibold text-gray-300 bg-slate-700/50 px-3 py-1 rounded-md">{sessions.length} / {batch.totalSessions} Sessions</span>
                 </div>
                 <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {classPlaceholders.map(classNumber => {
                        const session = sessions.find(s => s.classNumber === classNumber);
                        const status = getClassStatus(session);
                        const isNextClass = classNumber === nextClassNumber;

                        if (session) {
                             return (
                                <div key={classNumber} className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700/70 hover:border-teal-500/50 transition-all duration-200 group">
                                    <div className="flex-grow flex items-center cursor-pointer" onClick={() => onSelectSession(session)}>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-lg text-gray-200">Class {classNumber}</p>
                                            {editingDateSessionId === session.id ? (
                                                <input
                                                    type="date"
                                                    defaultValue={session.date}
                                                    onBlur={(e) => {
                                                        if(e.target.value && e.target.value !== session.date) onUpdateSessionDate(session.id, e.target.value);
                                                        setEditingDateSessionId(null);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            if(e.currentTarget.value && e.currentTarget.value !== session.date) onUpdateSessionDate(session.id, e.currentTarget.value);
                                                            setEditingDateSessionId(null);
                                                        } else if (e.key === 'Escape') {
                                                            setEditingDateSessionId(null);
                                                        }
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    autoFocus
                                                    className="bg-slate-700 text-white rounded p-1 text-sm w-36"
                                                />
                                            ) : (
                                                <div 
                                                    className="flex items-center gap-2 group/date"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingDateSessionId(session.id);
                                                    }}
                                                >
                                                    <p className="text-sm text-gray-400 group-hover/date:text-teal-300">
                                                        {new Date(session.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                                                    </p>
                                                    <svg className="w-4 h-4 text-gray-500 opacity-0 group-hover/date:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span title={status.a11y} className={`px-3 py-1 text-xs font-bold rounded-full ${statusColorClasses[status.color]}`}>
                                            {status.text}
                                        </span>
                                        {currentUser?.role === UserRole.ADMIN && (
                                            <button onClick={() => setSessionToConfirmRemove(session)} title="Delete Session" className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        )}
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                </div>
                            )
                        }
                        
                        if (isNextClass) {
                           return (
                                <div key={classNumber} className="flex items-center justify-between bg-slate-800/60 p-4 rounded-lg border-2 border-dashed border-teal-500/50">
                                    <div>
                                        <p className="font-semibold text-lg text-teal-300">Class {classNumber} (Next Up)</p>
                                        <p className="text-sm text-gray-400">Ready to start</p>
                                    </div>
                                    <button
                                      onClick={() => onStartNewClass(batch.id)}
                                      className="bg-teal-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-teal-400 transition-colors duration-200 shadow-md flex items-center"
                                    >
                                      Start Class
                                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </button>
                                </div>
                           )
                        }

                        return (
                            <div key={classNumber} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-800/80 opacity-60">
                                <div>
                                    <p className="font-semibold text-lg text-gray-400">Class {classNumber}</p>
                                    <p className="text-sm text-gray-500">Upcoming</p>
                                </div>
                                <span title={status.a11y} className={`px-3 py-1 text-xs font-bold rounded-full ${statusColorClasses.gray}`}>
                                    Upcoming
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
       </div>

        {currentUser?.role === UserRole.ADMIN && (
            <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end items-center gap-4">
                 <button
                    onClick={() => onEditBatch(batch)}
                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors duration-200 shadow-md flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Edit Batch
                </button>
                <button
                    onClick={() => setConfirmDeleteBatchOpen(true)}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors duration-200 shadow-md flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Delete Batch
                </button>
            </div>
        )}

      {isAddStudentModalOpen && (
        <AddStudentModal 
            onClose={() => setAddStudentModalOpen(false)}
            onAddStudent={handleAddStudentSubmit}
        />
      )}

      {studentToConfirmRemove && (
        <ConfirmationModal
            isOpen={!!studentToConfirmRemove}
            onClose={() => setStudentToConfirmRemove(null)}
            onConfirm={handleConfirmRemoveStudent}
            title="Confirm Student Removal"
            message={`Are you sure you want to remove ${studentToConfirmRemove.name} from this batch? This will also remove them from any future, unmarked classes.`}
            confirmText="Yes, Remove Student"
            confirmButtonVariant="danger"
        />
      )}
      {sessionToConfirmRemove && (
        <ConfirmationModal
            isOpen={!!sessionToConfirmRemove}
            onClose={() => setSessionToConfirmRemove(null)}
            onConfirm={handleConfirmRemoveSession}
            title="Confirm Session Deletion"
            message={`Are you sure you want to delete Class ${sessionToConfirmRemove.classNumber}? This action cannot be undone.`}
            confirmText="Yes, Delete Session"
            confirmButtonVariant="danger"
        />
      )}
      {isConfirmDeleteBatchOpen && (
        <ConfirmationModal
            isOpen={isConfirmDeleteBatchOpen}
            onClose={() => setConfirmDeleteBatchOpen(false)}
            onConfirm={handleConfirmDeleteBatch}
            title="Confirm Batch Deletion"
            message={`Are you sure you want to permanently delete the "${batch.name}" batch? All associated sessions and data will be lost. This action cannot be undone.`}
            confirmText="Yes, Delete Batch"
            confirmButtonVariant="danger"
        />
      )}
    </div>
  );
};

export default BatchDetail;