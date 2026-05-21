import { useState } from 'react';
import { type ColumnId, type Task, COLUMN_MAP, DRAG_DATA_KEY } from '../types';
import { TaskCard } from './TaskCard';
import './Column.css';

interface ColumnProps {
  columnId: ColumnId;
  tasks: Task[];
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newTitle: string) => void;
}

export function Column({ columnId, tasks, onMove, onDelete, onEdit }: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const columnInfo = COLUMN_MAP[columnId];

  if (!columnInfo) return null;

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData(DRAG_DATA_KEY);
    if (taskId) onMove(taskId, columnId);
  }

  return (
    <div
      className={`column${isDragOver ? ' column--drag-over' : ''}`}
      id={`column-${columnId}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ '--column-accent': columnInfo.accent } as React.CSSProperties}
    >
      <div className="column-header">
        <h2 className="column-header-title">
          <div className="column-header-icon" style={{ background: columnInfo.accent }} />
          <span className="column-title">{columnInfo.label}</span>
        </h2>
        <span className="column-count" aria-label={`${tasks.length} tasks in ${columnInfo.label}`}>
          {tasks.length}
        </span>
      </div>

      <ul className="column-task-list" aria-label={`${columnInfo.label} tasks`}>
        {tasks.length === 0 ? (
          <li className="column-empty">
            <span className="column-empty-text">No tasks</span>
          </li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="column-task-item">
              <TaskCard
                task={task}
                onMove={onMove}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
