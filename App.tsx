import React, { useState, useMemo, useCallback } from 'react';
import { Batch, Student, Session, AttendanceStatus, SortOption, User, UserRole } from './types';
import { INITIAL_BATCHES, INITIAL_STUDENTS, INITIAL_SESSIONS, INITIAL_USERS } from './constants';
// <--- MISSING #1: Imports for the backend URL and toast notifications
import { APPS_SCRIPT_URL, showToast } from './config'; 
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import BatchCard from './components/BatchCard';
import BatchDetail from './components/BatchDetail';
import AttendanceGrid from './components/AttendanceGrid';
import AddBatchModal from './components/AddBatchModal';

type View = 'login' | 'batches' | 'batchDetail' | 'attendance';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);

  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('name-asc');
  const [isBatchModalOpen, setBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  // <--- MISSING #2: State to track the saving process for user feedback
  const [isSaving, setIsSaving] = useState(false); 

  const selectedBatch = useMemo(() => {
    if (!selectedBatchId) return null;
    return batches.find(b => b.id === selectedBatchId) || null;
  }, [batches, selectedBatchId]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('batches');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setSelectedBatchId(null);
    setSelectedSession(null);
  };

  const handleSelectBatch = (batchId: number) => {
    setSelectedBatchId(batchId);
    setView('batchDetail');
  };

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    setView('attendance');
  };

  const handleBackToBatches = () => {
    setSelectedBatchId(null);
    setView('batches');
  };
  
  const handleBackToBatchDetail = () => {
    setSelectedSession(null);
    setView('batchDetail');
  };

  // <--- MISSING #3: The entire implementation to send data to the backend.
  // This is the most important missing piece.
  const handleSaveAttendance = async (updatedSession: Session) => {
    if (!selectedBatch || !updatedSession) {
      showToast("Error: No batch or session selected.", 'error');
      return;
    }
    
    // 1. Update local state immediately for a responsive UI
    setSessions(prevSessions => prevSessions.map(s => s.id === updatedSession.id ? updatedSession : s));
    
    // 2. Check if the script URL is configured
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'PASTE_YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE') {
      showToast("Backend not configured. Data not saved to Sheet.", 'error');
      console.error("APPS_SCRIPT_URL is not set in config.ts. Attendance data is only saved locally.");
      return;
    }

    setIsSaving(true);
    
    // 3. Prepare the data payload for the Google Apps Script
    const payload = {
      batchName: selectedBatch.name,
      sessionDate: updatedSession.date,
      classNumber: updatedSession.classNumber,
      attendance: updatedSession.attendance,
      students: students.filter(student => 
        updatedSession.attendance.some(a => a.studentId === student.id)
      ),
    };

    // 4. Send the data to the backend
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        showToast('Attendance saved to Google Sheet!', 'success');
      } else {
        throw new Error(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Error saving to Google Sheet:', error);
      showToast(`Error saving to Sheet: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStudent = useCallback((batchId: number, studentName: string) => {
    const newStudentId = Math.max(...students.map(s => s.id), 0) + 1;
    const newStudent: Student = {
      id: newStudentId,
      name: studentName,
      avatar: `https://i.pravatar.cc/150?u=${newStudentId}`
    };
    
    setStudents(prev => [...prev, newStudent]);
    setBatches(prev => prev.map(b => 
      b.id === batchId 
        ? { ...b, studentIds: [...b.studentIds, newStudentId] }
        : b
    ));
    setSessions(prevSessions => prevSessions.map(s => {
        if (s.batchId === batchId && s.attendance.every(a => a.status === AttendanceStatus.UNMARKED)) {
            return {
                ...s,
                attendance: [...s.attendance, { studentId: newStudentId, status: AttendanceStatus.UNMARKED }]
            };
        }
        return s;
    }));
  }, [students]);

  const handleRemoveStudentFromBatch = useCallback((batchId: number, studentId: number) => {
    setBatches(prevBatches => prevBatches.map(b =>
      b.id === batchId
        ? { ...b, studentIds: b.studentIds.filter(id => id !== studentId) }
        : b
    ));

    setSessions(prevSessions => prevSessions.map(session => {
      if (session.batchId === batchId) {
        const isUnmarked = session.attendance.every(a => a.status === AttendanceStatus.UNMARKED);
        if (isUnmarked) {
          return {
            ...session,
            attendance: session.attendance.filter(a => a.studentId !== studentId)
          };
        }
      }
      return session;
    }));
  }, []);
  
  const handleStartNewClass = useCallback((batchId: number) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const existingSessionsCount = sessions.filter(s => s.batchId === batchId).length;
    if (existingSessionsCount >= batch.totalSessions) {
      showToast("Cannot start new class: maximum sessions reached.", 'error');
      return;
    }

    const newClassNumber = existingSessionsCount + 1;
    const newSession: Session = {
      id: `session-${batchId}-${Date.now()}`,
      batchId: batchId,
      classNumber: newClassNumber,
      date: new Date().toISOString().split('T')[0],
      attendance: batch.studentIds.map(studentId => ({
        studentId,
        status: AttendanceStatus.UNMARKED,
      }))
    };
    
    setSessions(prev => [...prev, newSession]);
    setSelectedSession(newSession);
    setView('attendance');
  }, [batches, sessions]);

  const handleSaveBatch = useCallback((batchData: Omit<Batch, 'id' | 'studentIds' | 'createdBy'>, id?: number) => {
    if (currentUser?.role !== 'admin') {
        alert("You do not have permission to create or edit batches.");
        return;
    }
    if (id) { // Editing
        setBatches(prev => prev.map(b => b.id === id ? { ...b, ...batchData } : b));
    } else { // Adding
        const newBatch: Batch = {
            ...batchData,
            id: Math.max(...batches.map(b => b.id), 0) + 1,
            studentIds: [],
            createdBy: currentUser.id,
        };
        setBatches(prev => [...prev, newBatch]);
    }
    setBatchModalOpen(false);
    setEditingBatch(null);
  }, [currentUser, batches]);

  const handleDeleteBatch = useCallback((batchId: number) => {
    if (currentUser?.role !== 'admin') {
        alert("You do not have permission to delete batches.");
        return;
    }
    setBatches(prev => prev.filter(b => b.id !== batchId));
    setSessions(prev => prev.filter(s => s.batchId !== batchId));
    handleBackToBatches();
  }, [currentUser]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  }, []);

  const handleUpdateSessionDate = useCallback((sessionId: string, newDate: string) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, date: newDate } : s));
  }, []);
  
  const handleOpenEditBatchModal = (batch: Batch) => {
      setEditingBatch(batch);
      setBatchModalOpen(true);
  }

  const studentsForSelectedBatch = useMemo(() => {
    if (!selectedBatch) return [];
    return students.filter(student => selectedBatch.studentIds.includes(student.id));
  }, [selectedBatch, students]);
  
  const sessionsForSelectedBatch = useMemo(() => {
      if(!selectedBatch) return [];
      return sessions
        .filter(s => s.batchId === selectedBatch.id)
        .sort((a, b) => a.classNumber - b.classNumber);
  }, [selectedBatch, sessions]);
  
  const instructors = useMemo(() => INITIAL_USERS.filter(u => u.role === UserRole.TEACHER), []);
  
  const visibleBatches = useMemo(() => {
      if (!currentUser) return [];
      if (currentUser.role === UserRole.ADMIN) {
          return batches;
      }
      return batches.filter(b => b.instructorId === currentUser.id);
  }, [batches, currentUser]);

  const sortedBatches = useMemo(() => {
    const sortable = [...visibleBatches];
    sortable.sort((a, b) => {
      const instructorA = INITIAL_USERS.find(u => u.id === a.instructorId)?.name || '';
      const instructorB = INITIAL_USERS.find(u => u.id === b.instructorId)?.name || '';
      
      switch (sortOrder) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'instructor-asc':
          return instructorA.localeCompare(instructorB);
        case 'students-desc':
          return b.studentIds.length - a.studentIds.length;
        default:
          return 0;
      }
    });
    return sortable;
  }, [visibleBatches, sortOrder]);


  const renderView = () => {
    switch(view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} users={INITIAL_USERS} />;
      // ... (rest of the cases are the same)
      case 'batchDetail':
        if (!selectedBatch) return null;
        const instructor = INITIAL_USERS.find(u => u.id === selectedBatch.instructorId);
        return (
          <BatchDetail 
            batch={selectedBatch}
            students={studentsForSelectedBatch}
            sessions={sessionsForSelectedBatch}
            instructorName={instructor?.name || 'Unassigned'}
            onBack={handleBackToBatches}
            onSelectSession={handleSelectSession}
            onAddStudent={handleAddStudent}
            onRemoveStudent={handleRemoveStudentFromBatch}
            onStartNewClass={handleStartNewClass}
            currentUser={currentUser}
            onDeleteBatch={handleDeleteBatch}
            onEditBatch={() => handleOpenEditBatchModal(selectedBatch)}
            onDeleteSession={handleDeleteSession}
            onUpdateSessionDate={handleUpdateSessionDate}
          />
        );
      case 'attendance':
        if (!selectedBatch || !selectedSession) return null;
        const studentsForSession = students.filter(student => 
          selectedSession.attendance.some(a => a.studentId === student.id)
        );
        return (
          <AttendanceGrid 
            batch={selectedBatch} 
            session={selectedSession}
            students={studentsForSession} 
            onBack={handleBackToBatchDetail} 
            onSave={handleSaveAttendance}
            // <--- MISSING: Passing the isSaving prop to the grid
            isSaving={isSaving} 
          />
        );
      default:
        // Render batches view by default if view is not login/detail/attendance
        return (
          <div>
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-indigo-400">
                Your Dance Batches
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort-batches" className="text-gray-300 font-medium">Sort by:</label>
                        <select
                            id="sort-batches"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOption)}
                            className="bg-slate-700 text-white p-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="instructor-asc">Instructor (A-Z)</option>
                            <option value="students-desc">Students (Most First)</option>
                        </select>
                    </div>
                    {currentUser?.role === UserRole.ADMIN && (
                        <button
                            onClick={() => { setEditingBatch(null); setBatchModalOpen(true); }}
                            className="bg-teal-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-teal-400 transition-colors duration-200 shadow-md flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Add Batch
                        </button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedBatches.map(batch => {
                const instructor = INITIAL_USERS.find(u => u.id === batch.instructorId);
                return (
                    <BatchCard 
                      key={batch.id} 
                      batch={batch}
                      instructorName={instructor?.name || 'Unassigned'}
                      onSelect={() => handleSelectBatch(batch.id)} 
                    />
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-gray-100">
      <Header isAuthenticated={!!currentUser} onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-8">
        {renderView()}
        {isBatchModalOpen && (
            <AddBatchModal
                onClose={() => { setBatchModalOpen(false); setEditingBatch(null); }}
                onSave={handleSaveBatch}
                instructors={instructors}
                existingBatch={editingBatch}
            />
        )}
      </main>
    </div>
  );
};

export default App;
