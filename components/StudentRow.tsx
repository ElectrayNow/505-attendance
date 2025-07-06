import React from 'react';
import { Student, AttendanceStatus } from '../types';

interface StudentRowProps {
  student: Student;
  status: AttendanceStatus;
  onStatusChange: (status: AttendanceStatus) => void;
}

const getStatusButtonClass = (buttonStatus: AttendanceStatus, activeStatus: AttendanceStatus): string => {
  const baseClasses = 'px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out transform hover:scale-105';
  
  if (buttonStatus === activeStatus) {
    switch (buttonStatus) {
      case AttendanceStatus.PRESENT:
        return `${baseClasses} bg-green-500 text-white shadow-lg`;
      case AttendanceStatus.ABSENT:
        return `${baseClasses} bg-red-500 text-white shadow-lg`;
      case AttendanceStatus.LATE:
        return `${baseClasses} bg-yellow-500 text-white shadow-lg`;
      default:
        return `${baseClasses} bg-slate-600 text-slate-300`;
    }
  }
  return `${baseClasses} bg-slate-700/50 text-slate-300 hover:bg-slate-600`;
};

const StudentRow: React.FC<StudentRowProps> = ({ student, status, onStatusChange }) => {
  return (
    <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700/70 hover:border-indigo-500/50 transition-colors duration-200">
      <div className="flex items-center">
        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-4 border-2 border-slate-600"/>
        <span className="font-medium text-gray-200">{student.name}</span>
      </div>
      <div className="flex space-x-2">
        {(Object.values(AttendanceStatus) as AttendanceStatus[]).filter(s => s !== AttendanceStatus.UNMARKED).map(s => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={getStatusButtonClass(s, status)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentRow;