import { useState, useRef, useEffect } from 'react';
import { type Task, type ColumnId, COLUMN_MAP, DRAG_DATA_KEY } from '../types';
import { formatTime } from '../utils';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (id: string) => void;
  onEdit: (taskId: string, newTitle: string) => void;
}

const ORDER: ColumnId[] = ['now', 'soon', 'later'];

export function TaskCard({ task, onMove, onDelete, onEdit }: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const columnInfo = COLUMN_MAP[task.column];
  const idx = ORDER.indexOf(task.column);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startEditing() {
    setEditValue(task.title);
    setEditing(true);
  }

  function submitEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, trimmed);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitEdit();
    } else if (e.key === 'Escape') {
      setEditing(false);
    }
  }

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
        {editing ? (
          <input
            ref={inputRef}
            className="task-card-edit-input"
            type="text"
            maxLength={200}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={submitEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="task-card-title" onDoubleClick={startEditing} title="Double-click to edit">
            {task.title}
          </span>
        )}
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
