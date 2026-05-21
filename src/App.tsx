import { useState } from 'react';
import { type ColumnId, type Task } from './types';
import { Board } from './components/Board';
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

  function addTask() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      column: 'now',
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, task]);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') addTask();
  }

  function moveTask(taskId: string, toColumn: ColumnId) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, column: toColumn } : t
      )
    );
  }

  function deleteTask(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">Wahala Sorter</span>
        <span className="app-subtitle">Sort the pile. Win the day.</span>
      </header>

      <div className="add-bar">
        <input
          className="add-input"
          type="text"
          placeholder="Add a task…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-btn" onClick={addTask}>
          Add
        </button>
      </div>

      <Board
        tasks={tasks}
        onMove={moveTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

export default App;
