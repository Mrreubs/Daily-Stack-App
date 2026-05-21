import { type Task, COLUMNS } from '../types';
import { formatTime } from '../utils';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const columnInfo = COLUMNS.find((c) => c.id === task.column)!;

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    (e.currentTarget as HTMLElement).classList.add('task-card--dragging');
  }

  function handleDragEnd(e: React.DragEvent) {
    (e.currentTarget as HTMLElement).classList.remove('task-card--dragging');
  }

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-card-top">
        <span className="task-card-title">{task.title}</span>
        <button
          className="task-card-delete"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          ×
        </button>
      </div>
      <div className="task-card-meta">
        <span
          className="task-card-column-tag"
          style={{ background: `${columnInfo.accent}18`, color: columnInfo.accent }}
        >
          {columnInfo.label}
        </span>
        <span className="task-card-timestamp">
          Added {formatTime(new Date(task.createdAt))}
        </span>
      </div>
    </div>
  );
}
