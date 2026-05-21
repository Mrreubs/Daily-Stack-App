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

export const COLUMN_MAP: Record<ColumnId, ColumnInfo> = {
  now: { id: 'now', label: 'Now', accent: '#D97706' },
  soon: { id: 'soon', label: 'Soon', accent: '#7C3AED' },
  later: { id: 'later', label: 'Later', accent: '#059669' },
};

export const COLUMNS: ColumnInfo[] = Object.values(COLUMN_MAP);

export const DRAG_DATA_KEY = 'application/wahala-task-id';
