import { Student, Batch, Session, AttendanceStatus, User, UserRole } from './types';

export const BATCH_COLORS = [
  '#2dd4bf', // teal-400
  '#818cf8', // indigo-400
  '#f472b6', // pink-400
  '#fb923c', // orange-400
  '#a78bfa', // violet-400
  '#34d399', // emerald-400
];

export const INITIAL_USERS: User[] = [
    { id: 1, username: 'admin', name: 'Admin User', role: UserRole.ADMIN },
    { id: 2, username: 'neha', name: 'Neha', role: UserRole.TEACHER },
    { id: 3, username: 'raj', name: 'Raj', role: UserRole.TEACHER },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Bob Williams', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Diana Miller', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: 'Ethan Davis', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 6, name: 'Fiona Garcia', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 7, name: 'George Rodriguez', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: 8, name: 'Hannah Wilson', avatar: 'https://i.pravatar.cc/150?u=8' },
  { id: 9, name: 'Ian Martinez', avatar: 'https://i.pravatar.cc/150?u=9' },
  { id: 10, name: 'Jane Anderson', avatar: 'https://i.pravatar.cc/150?u=10' },
  { id: 11, name: 'Kyle Taylor', avatar: 'https://i.pravatar.cc/150?u=11' },
  { id: 12, name: 'Laura Moore', avatar: 'https://i.pravatar.cc/150?u=12' },
];

const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 1,
    name: 'Hip-Hop Beginners',
    instructorId: 2, // Neha
    schedule: 'Mon, Wed - 6:00 PM',
    studentIds: [1, 2, 3, 4, 9, 11],
    totalSessions: 8,
    color: BATCH_COLORS[0],
    startDate: threeDaysAgo.toISOString().split('T')[0],
    createdBy: 1, // Admin
  },
  {
    id: 2,
    name: 'Contemporary Flow',
    instructorId: 3, // Raj
    schedule: 'Tue, Thu - 7:30 PM',
    studentIds: [5, 6, 7, 8, 10, 12],
    totalSessions: 12,
    color: BATCH_COLORS[1],
    startDate: threeDaysAgo.toISOString().split('T')[0],
    createdBy: 1, // Admin
  },
  {
    id: 3,
    name: 'Salsa Fusion',
    instructorId: 2, // Neha
    schedule: 'Fri - 8:00 PM',
    studentIds: [1, 3, 5, 7, 9, 11],
    totalSessions: 8,
    color: BATCH_COLORS[2],
    startDate: new Date().toISOString().split('T')[0],
    createdBy: 1, // Admin
  },
   {
    id: 4,
    name: 'Ballet Basics',
    instructorId: 3, // Raj
    schedule: 'Sat - 10:00 AM',
    studentIds: [2, 4, 6, 8, 10, 12],
    totalSessions: 12,
    color: BATCH_COLORS[3],
    startDate: new Date().toISOString().split('T')[0],
    createdBy: 1, // Admin
  },
];

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date();
twoDaysAgo.setDate(today.getDate() - 2);

export const INITIAL_SESSIONS: Session[] = [
    // Batch 1
    {
        id: 'session-1-1',
        batchId: 1,
        classNumber: 1,
        date: twoDaysAgo.toISOString().split('T')[0],
        attendance: [
            { studentId: 1, status: AttendanceStatus.PRESENT },
            { studentId: 2, status: AttendanceStatus.PRESENT },
            { studentId: 3, status: AttendanceStatus.ABSENT },
            { studentId: 4, status: AttendanceStatus.PRESENT },
            { studentId: 9, status: AttendanceStatus.LATE },
            { studentId: 11, status: AttendanceStatus.PRESENT },
        ],
    },
    {
        id: 'session-1-2',
        batchId: 1,
        classNumber: 2,
        date: yesterday.toISOString().split('T')[0],
        attendance: [1, 2, 3, 4, 9, 11].map(id => ({ studentId: id, status: AttendanceStatus.UNMARKED })),
    },
     // Batch 2
    {
        id: 'session-2-1',
        batchId: 2,
        classNumber: 1,
        date: yesterday.toISOString().split('T')[0],
        attendance: [
            { studentId: 5, status: AttendanceStatus.PRESENT },
            { studentId: 6, status: AttendanceStatus.PRESENT },
            { studentId: 7, status: AttendanceStatus.PRESENT },
            { studentId: 8, status: AttendanceStatus.PRESENT },
            { studentId: 10, status: AttendanceStatus.ABSENT },
            { studentId: 12, status: AttendanceStatus.PRESENT },
        ],
    }
];