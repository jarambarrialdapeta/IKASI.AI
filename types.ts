export interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late';
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

export interface DashboardData {
  classes: ClassGroup[];
  schedule: ScheduleItem[];
  tasks: TaskItem[];
}
