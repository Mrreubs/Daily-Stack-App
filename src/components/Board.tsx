import { type ColumnId, type Task, COLUMNS } from '../types';
import { Column } from './Column';
import './Board.css';

interface BoardProps {
  tasks: Task[];
  onAdd: (title: string, column: ColumnId) => void;
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (taskId: string) => void;
}

export function Board({ tasks, onAdd, onMove, onDelete }: BoardProps) {
  return (
    <div className="board">
      {COLUMNS.map((col) => (
        <Column
          key={col.id}
          columnId={col.id}
          tasks={tasks.filter((t) => t.column === col.id)}
          onAdd={onAdd}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
