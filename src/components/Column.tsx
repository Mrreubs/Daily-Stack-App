import { useState } from 'react';
import { type ColumnId, type Task, COLUMNS } from '../types';
import { TaskCard } from './TaskCard';
import { OverflowModal } from './OverflowModal';
import './Column.css';

interface ColumnProps {
  columnId: ColumnId;
  tasks: Task[];
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

const MAX_VISIBLE = 3;

export function Column({ columnId, tasks, onMove, onDelete, onComplete }: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const columnInfo = COLUMNS.find((c) => c.id === columnId)!;
  const visible = tasks.slice(0, MAX_VISIBLE);
  const hidden = tasks.length - MAX_VISIBLE;

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
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onMove(taskId, columnId);
    }
  }

  return (
    <div
      className={`column${isDragOver ? ' column--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ '--column-accent': columnInfo.accent } as React.CSSProperties}
    >
      <div className="column-header">
        <div
          className="column-header-icon"
          style={{ background: columnInfo.accent }}
        />
        <span className="column-title">{columnInfo.label}</span>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-task-list">
        {tasks.length === 0 ? (
          <div className="column-empty">
            <span className="column-empty-text">
              {columnId === 'today' ? 'No tasks for today' : 'No upcoming tasks'}
            </span>
          </div>
        ) : (
          <>
            {visible.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onComplete={onComplete}
              />
            ))}
            {hidden > 0 && (
              <button
                className="column-overflow-btn"
                onClick={() => setShowModal(true)}
              >
                View all {tasks.length} tasks →
              </button>
            )}
          </>
        )}
      </div>

      {showModal && (
        <OverflowModal
          columnId={columnId}
          tasks={tasks}
          onClose={() => setShowModal(false)}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}
