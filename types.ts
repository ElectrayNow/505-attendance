export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  UNMARKED = 'Unmarked',
}

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

export interface User {
    id: number;
    username: string;
    name: string;
    role: UserRole;
}

export interface Student {
  id: number;
  name: string;
  avatar: string;
}

export interface Batch {
  id: number;
  name: string;
  instructorId: number;
  schedule: string;
  studentIds: number[];
  totalSessions: number;
  color: string;
  startDate: string; // YYYY-MM-DD
  createdBy: number; // User ID
}

export interface AttendanceRecord {
  studentId: number;
  status: AttendanceStatus;
}

export interface Session {
  id:string;
  batchId: number;
  classNumber: number;
  date: string; // YYYY-MM-DD
  attendance: AttendanceRecord[];
}

export type SortOption = 'name-asc' | 'name-desc' | 'instructor-asc' | 'students-desc';