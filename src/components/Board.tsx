import { type ColumnId, type Task, COLUMNS } from '../types';
import { Column as ColumnComp } from './Column';
import './Board.css';

interface BoardProps {
  tasks: Task[];
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (taskId: string) => void;
}

export function Board({ tasks, onMove, onDelete }: BoardProps) {
  return (
    <div className="board">
      {COLUMNS.map((col) => (
        <ColumnComp
          key={col.id}
          columnId={col.id}
          tasks={tasks.filter((t) => t.column === col.id)}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
