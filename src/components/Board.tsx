import { useMemo } from 'react';
import { type ColumnId, type Task, COLUMNS } from '../types';
import { Column as ColumnComp } from './Column';
import './Board.css';

interface BoardProps {
  tasks: Task[];
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newTitle: string) => void;
}

export function Board({ tasks, onMove, onDelete, onEdit }: BoardProps) {
  const nowTasks = useMemo(() => tasks.filter((t) => t.column === 'now'), [tasks]);
  const soonTasks = useMemo(() => tasks.filter((t) => t.column === 'soon'), [tasks]);
  const laterTasks = useMemo(() => tasks.filter((t) => t.column === 'later'), [tasks]);

  const grouped: Record<ColumnId, Task[]> = { now: nowTasks, soon: soonTasks, later: laterTasks };

  return (
    <div className="board">
      {COLUMNS.map((col) => (
        <ColumnComp
          key={col.id}
          columnId={col.id}
          tasks={grouped[col.id]}
          onMove={onMove}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
