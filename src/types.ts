export type ColumnId = 'done' | 'today' | 'upcoming';

export interface Task {
  id: string;
  title: string;
  column: ColumnId;
  createdAt: Date;
  date?: Date;
  completedAt?: Date;
}

export interface ColumnInfo {
  id: ColumnId;
  label: string;
  accent: string;
  description: string;
}

export const COLUMNS: ColumnInfo[] = [
  { id: 'done', label: 'Done', accent: '#10B981', description: 'Completed tasks' },
  { id: 'today', label: 'Today', accent: '#3B82F6', description: 'Tasks for today' },
  { id: 'upcoming', label: 'Upcoming', accent: '#8B5CF6', description: 'Future tasks' },
];
