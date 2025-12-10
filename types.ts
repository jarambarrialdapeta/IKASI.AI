export interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late';
  photoUrl?: string; // New field for avatar
}

export interface ClassGroup {
  id: string;
  name: string;
  averageGrade: number;
  students: Student[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  room: string;
  color: string;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'work' | 'coordination' | 'event';
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: 'ulermena' | 'idazmena' | 'gramatika' | 'lexikoa' | 'kalkulu_mentala' | 'aritmetika' | 'buruketak';
  status: 'draft' | 'published';
  date: string;
}

export interface DashboardData {
  classes: ClassGroup[];
  schedule: ScheduleItem[];
  tasks: TaskItem[];
}

// New Types for Student Details
export interface StudentStats {
  subject: string;
  grade: number;
  avgTimeSpent: number; // in minutes
  completedExercises: number;
}

export interface StudentDetail extends Student {
  evolution: { month: string; grade: number }[];
  weaknesses: string[];
  strengths: string[];
  statsBySubject: StudentStats[];
  teacherNotes: string;
}

// New Type for Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'exam' | 'holiday' | 'assignment' | 'meeting';
}