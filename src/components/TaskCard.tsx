import { type Task, type ColumnId, COLUMN_MAP, DRAG_DATA_KEY } from '../types';
import { formatTime } from '../utils';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (id: string) => void;
}

const ORDER: ColumnId[] = ['now', 'soon', 'later'];

export function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const columnInfo = COLUMN_MAP[task.column];
  const idx = ORDER.indexOf(task.column);

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData(DRAG_DATA_KEY, task.id);
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
        <div className="task-card-actions">
          {idx > 0 && (
            <button
              className="task-card-move"
              onClick={() => onMove(task.id, ORDER[idx - 1])}
              aria-label={`Move to ${COLUMN_MAP[ORDER[idx - 1]].label}`}
            >
              ←
            </button>
          )}
          {idx < ORDER.length - 1 && (
            <button
              className="task-card-move"
              onClick={() => onMove(task.id, ORDER[idx + 1])}
              aria-label={`Move to ${COLUMN_MAP[ORDER[idx + 1]].label}`}
            >
              →
            </button>
          )}
          <button
            className="task-card-delete"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            ×
          </button>
        </div>
      </div>
      <div className="task-card-meta">
        <span
          className="task-card-column-tag"
          style={{ background: `${columnInfo.accent}18`, color: columnInfo.accent }}
        >
          {columnInfo.label}
        </span>
        <span className="task-card-timestamp">
          Added {formatTime(task.createdAt)}
        </span>
      </div>
    </div>
  );
}
