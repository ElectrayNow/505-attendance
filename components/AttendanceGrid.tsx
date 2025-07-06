import React, { useState, useEffect, useMemo } from 'react';
import { Batch, Student, AttendanceRecord, AttendanceStatus, Session } from '../types';
import StudentRow from './StudentRow';
import Spinner from './Spinner';
import { saveAttendanceToSheet } from '../services/sheetService';

interface AttendanceGridProps {
  batch: Batch;
  session: Session;
  students: Student[];
  onBack: () => void;
  onSave: (updatedSession: Session) => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const AttendanceGrid: React.FC<AttendanceGridProps> = ({ batch, session, students, onBack, onSave }) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(session.attendance);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const hasChanges = useMemo(() => {
    return JSON.stringify(session.attendance) !== JSON.stringify(attendance);
  }, [session.attendance, attendance]);

  useEffect(() => {
    setAttendance(session.attendance);
    setSaveStatus('idle'); // Reset save status when session changes
  }, [session]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance(prev => prev.map(record =>
      record.studentId === studentId ? { ...record, status } : record
    ));
    setSaveStatus('idle');
  };
  
  const handleSave = async () => {
    setSaveStatus('saving');
    setErrorMessage('');
    
    try {
      const studentData = attendance.map(att => {
          const student = students.find(s => s.id === att.studentId);
          return { id: student?.id || 0, name: student?.name || 'Unknown' };
      });

      await saveAttendanceToSheet({
          batchName: batch.name,
          sessionDate: session.date,
          classNumber: session.classNumber,
          attendance: attendance,
          students: studentData,
      });

      onSave({ ...session, attendance });
      setSaveStatus('saved');
    } catch (error) {
        console.error("Error saving to Google Sheet:", error);
        setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred.");
        setSaveStatus('error');
    }
  };

  const getSaveButtonContent = () => {
    switch(saveStatus) {
        case 'saving': return <><Spinner /> Saving...</>;
        case 'saved': return '✓ Saved to Google Sheets';
        case 'error': return '✗ Save Failed';
        default: return 'Save to Google Sheets';
    }
  }
  
  return (
    <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700/50">
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <button onClick={onBack} className="flex items-center space-x-2 text-teal-300 hover:text-teal-200 transition-colors duration-200 font-semibold mb-4 md:mb-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span>Back to Batch Details</span>
        </button>
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{batch.name} - Class {session.classNumber}</h1>
          <p className="text-indigo-300">Session Date: {new Date(session.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {students.map(student => {
          const record = attendance.find(a => a.studentId === student.id);
          return (
            <StudentRow 
              key={student.id} 
              student={student} 
              status={record?.status || AttendanceStatus.UNMARKED} 
              onStatusChange={(status) => handleStatusChange(student.id, status)}
            />
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saveStatus === 'saving' || saveStatus === 'saved'}
          className={`font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto
            ${saveStatus === 'error' ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-500'}
          `}
        >
          {getSaveButtonContent()}
        </button>
        {saveStatus === 'error' && <p className="text-red-400 text-sm">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AttendanceGrid;