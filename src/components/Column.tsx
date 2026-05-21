import { useState, useCallback } from 'react';
import { type ColumnId, type Task, COLUMNS } from '../types';
import { TaskCard } from './TaskCard';
import './Column.css';

interface ColumnProps {
  columnId: ColumnId;
  tasks: Task[];
  onAdd: (title: string, column: ColumnId) => void;
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (taskId: string) => void;
}

export function Column({ columnId, tasks, onAdd, onMove, onDelete }: ColumnProps) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const columnInfo = COLUMNS.find((c) => c.id === columnId)!;

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  }, []);

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed) {
      triggerShake();
      return;
    }
    onAdd(trimmed, columnId);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

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
        <div className="column-header-info">
          <span className="column-title">{columnInfo.label}</span>
          <span className="column-description">{columnInfo.description}</span>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-body">
        {columnId !== 'done' && (
          <div className="column-add-form">
            <input
              className={`column-add-input${shake ? ' column-add-input--shake' : ''}`}
              type="text"
              placeholder="Add a task…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="column-add-btn"
              style={{ background: columnInfo.accent }}
              onClick={handleSubmit}
            >
              Add
            </button>
          </div>
        )}

        <div className="column-task-list">
          {tasks.length === 0 ? (
            <div className="column-empty">
              <span className="column-empty-text">
                {columnId === 'done'
                  ? 'No completed tasks'
                  : columnId === 'today'
                  ? 'No tasks for today'
                  : 'No upcoming tasks'}
              </span>
              <span className="column-empty-hint">
                {columnId === 'done'
                  ? 'Drag tasks here when done'
                  : columnId === 'today'
                  ? 'Add a task or drag from Upcoming'
                  : 'Add tasks with future dates'}
              </span>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
