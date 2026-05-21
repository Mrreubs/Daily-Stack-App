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
}

export const COLUMNS: ColumnInfo[] = [
  { id: 'today', label: 'Today', accent: '#3B82F6' },
  { id: 'upcoming', label: 'Upcoming', accent: '#8B5CF6' },
];

export type FilterMode = 'all' | 'today' | 'upcoming' | 'history';

export interface NavItem {
  id: FilterMode;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'all', label: 'Active Tasks' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'history', label: 'History' },
];
