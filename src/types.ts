export type ColumnId = 'now' | 'soon' | 'later';

export interface Task {
  id: string;
  title: string;
  column: ColumnId;
  createdAt: Date;
}

export interface ColumnInfo {
  id: ColumnId;
  label: string;
  accent: string;
}

export const COLUMNS: ColumnInfo[] = [
  { id: 'now', label: 'Now', accent: '#D97706' },
  { id: 'soon', label: 'Soon', accent: '#7C3AED' },
  { id: 'later', label: 'Later', accent: '#059669' },
];
