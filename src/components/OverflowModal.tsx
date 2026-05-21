import { type Task, type ColumnId } from '../types';
import { TaskCard } from './TaskCard';
import './OverflowModal.css';

interface OverflowModalProps {
  columnId: ColumnId;
  tasks: Task[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export function OverflowModal({ columnId, tasks, onClose, onDelete, onComplete }: OverflowModalProps) {
  const label = columnId === 'today' ? 'Today' : 'Upcoming';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">All {label} tasks</span>
          <span className="modal-count">{tasks.length}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onComplete={onComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
