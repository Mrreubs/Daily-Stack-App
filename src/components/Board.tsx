import { type ColumnId, type Task } from '../types';
import { Column as ColumnComp } from './Column';
import './Board.css';

interface BoardProps {
  tasks: Task[];
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export function Board({ tasks, onMove, onDelete, onComplete }: BoardProps) {
  return (
    <div className="board">
      <ColumnComp
        columnId="today"
        tasks={tasks.filter((t) => t.column === 'today')}
        onMove={onMove}
        onDelete={onDelete}
        onComplete={onComplete}
      />
      <ColumnComp
        columnId="upcoming"
        tasks={tasks.filter((t) => t.column === 'upcoming')}
        onMove={onMove}
        onDelete={onDelete}
        onComplete={onComplete}
      />
    </div>
  );
}
