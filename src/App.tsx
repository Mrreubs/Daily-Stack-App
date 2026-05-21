import { useState, useCallback, useMemo } from 'react';
import { type ColumnId, type Task, COLUMNS } from './types';
import { Board } from './components/Board';
import { Sidebar } from './components/Sidebar';
import './App.css';

function generateSeedTasks(): Task[] {
  const titles = [
    'Fix login page bug',
    'Review pull requests',
    'Send proposal to client',
    'Update API documentation',
    'Respond to support tickets',
    'Plan sprint next week',
    'Build notification system',
    'Implement dark mode',
    'Add CSV export feature',
    'Create admin dashboard',
    'Set up A/B testing framework',
    'Implement two-factor auth',
  ];

  const columns: ColumnId[] = ['now', 'soon', 'later'];
  return titles.map((title, i) => ({
    id: crypto.randomUUID(),
    title,
    column: columns[i % 3],
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 7),
  }));
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(generateSeedTasks);
  const [input, setInput] = useState('');
  const [targetColumn, setTargetColumn] = useState<ColumnId>('now');

  const addTask = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || trimmed.length > 200) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      column: targetColumn,
      createdAt: new Date(),
    };

    setTasks((prev) => [task, ...prev]);
    setInput('');
  }, [input, targetColumn]);

  const moveTask = useCallback((taskId: string, toColumn: ColumnId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, column: toColumn } : t
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const taskCount = useMemo(() => tasks.length, [tasks]);

  return (
    <>
      <Sidebar />
      <div className="app">
      <header className="app-header">
        <h1 className="app-logo">Wahala Sorter</h1>
        <span className="app-subtitle">Sort the pile. Win the day.</span>
      </header>

      <form className="add-bar" onSubmit={(e) => { e.preventDefault(); addTask(); }}>
        <label htmlFor="new-task" className="sr-only">New task</label>
        <input
          id="new-task"
          className="add-input"
          type="text"
          placeholder="Add a task…"
          maxLength={200}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="column-picker" role="radiogroup" aria-label="Target column">
          {COLUMNS.map((col) => (
            <label
              key={col.id}
              className={`column-picker-label${targetColumn === col.id ? ' column-picker-label--active' : ''}`}
              style={targetColumn === col.id ? { background: col.accent, color: '#FFFFFF' } : {}}
            >
              <input
                type="radio"
                name="column"
                value={col.id}
                checked={targetColumn === col.id}
                onChange={() => setTargetColumn(col.id)}
                className="column-picker-radio"
              />
              {col.label}
            </label>
          ))}
        </div>
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {taskCount} tasks total
      </div>

      <Board
        tasks={tasks}
        onMove={moveTask}
        onDelete={deleteTask}
      />
    </div>
    </>
  );
}

export default App;
