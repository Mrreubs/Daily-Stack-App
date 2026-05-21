import { type Task } from '../types';
import { formatTime, formatDateShort } from '../utils';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function TaskCard({ task, onDelete, onComplete }: TaskCardProps) {
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
        <button
          className="task-card-checkbtn"
          onClick={() => onComplete(task.id)}
          aria-label="Mark done"
        >
          ◯
        </button>
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
        {task.column === 'upcoming' && task.date && (
          <span className="task-card-date">
            {formatDateShort(new Date(task.date))}
          </span>
        )}
        <span className="task-card-timestamp">
          Added {formatTime(new Date(task.createdAt))}
        </span>
      </div>
    </div>
  );
}
