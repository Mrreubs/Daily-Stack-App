import type { Task } from './types';

const STORAGE_KEY = 'wahala-sorter-tasks';

export function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function loadTasks(): Task[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const tasks = JSON.parse(raw) as Task[];
    return tasks.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
  } catch {
    return null;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    /* storage full or unavailable */
  }
}
