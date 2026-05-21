import { useState, useMemo, useRef } from 'react';
import { type ColumnId, type Task, type FilterMode, FILTERS } from './types';
import { Board } from './components/Board';
import { pastDaysAgo, daysFromNow, todayStr, formatDateShort, formatTime } from './utils';
import './App.css';

function generateSeedTasks(): Task[] {
  const tasks: Task[] = [];

  const doneTitles = [
    'Review Q1 financial report', 'Update team onboarding docs',
    'Fix login page bug', 'Send proposal to client',
    'Complete security audit', 'Migrate database to new server',
    'Deploy v2.3 to staging', 'Update API documentation',
    'Run user testing session', 'Optimize image assets',
    'Write unit tests for auth module', 'Refactor payment gateway',
    'Set up CI/CD pipeline', 'Conduct code review for PR #142',
    'Create email template for newsletter', 'Update privacy policy page',
    'Fix responsive layout on mobile', 'Set up monitoring alerts',
    'Migrate legacy endpoints', 'Update dependencies to latest',
    'Write integration tests', 'Configure CDN caching',
    'Review design mockups', 'Update SSL certificates',
    'Schedule team retro', 'Archive old project files',
    'Fix pagination bug on search', 'Update error messages',
    'Clean up console logs', 'Set up error tracking',
    'Run load tests', 'Update README with setup guide',
  ];

  const todayTitles = [
    'Finish dashboard redesign', 'Review pull requests',
    'Prepare client presentation', 'Fix navigation dropdown bug',
    'Write API endpoint for reports', 'Update user permissions',
    'Test checkout flow', 'Respond to support tickets',
    'Update project roadmap', 'Refactor user settings page',
    'Add loading states to tables', 'Fix date picker timezone issue',
    'Optimize database queries', 'Review team timesheets',
    'Plan sprint next week',
  ];

  const upcomingTitles = [
    'Build notification system', 'Implement dark mode',
    'Add CSV export feature', 'Create admin dashboard',
    'Set up A/B testing framework', 'Build real-time chat feature',
    'Implement two-factor auth', 'Add file upload progress',
    'Create onboarding wizard', 'Build search autocomplete',
    'Implement webhook system', 'Add bulk import tool',
    'Create reporting dashboard', 'Build in-app notifications',
    'Implement rate limiting', 'Add multi-language support',
    'Create audit log viewer', 'Build API rate monitor',
    'Implement data export tool', 'Add user activity feed',
    'Create email digest system', 'Build analytics dashboard',
    'Implement backup system', 'Add role-based access control',
    'Create subscription management', 'Build invoice generator',
    'Implement caching layer', 'Add push notifications',
    'Create team calendar view', 'Build import validation tool',
    'Implement search indexing', 'Add recurring task support',
  ];

  for (const title of doneTitles) {
    tasks.push({
      id: crypto.randomUUID(), title, column: 'done',
      createdAt: pastDaysAgo(5 + Math.floor(Math.random() * 25)),
      completedAt: pastDaysAgo(Math.floor(Math.random() * 5)),
    });
  }

  for (const title of todayTitles) {
    tasks.push({
      id: crypto.randomUUID(), title, column: 'today',
      createdAt: pastDaysAgo(Math.floor(Math.random() * 3)),
    });
  }

  for (const title of upcomingTitles) {
    const daysAhead = 1 + Math.floor(Math.random() * 30);
    tasks.push({
      id: crypto.randomUUID(), title, column: 'upcoming',
      createdAt: pastDaysAgo(Math.floor(Math.random() * 10)),
      date: daysFromNow(daysAhead),
    });
  }

  return tasks;
}

const HISTORY_SHOW = 6;

function App() {
  const [tasks, setTasks] = useState<Task[]>(generateSeedTasks);
  const [input, setInput] = useState('');
  const [dateInput, setDateInput] = useState(todayStr());
  const [shake, setShake] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [filter, setFilter] = useState<FilterMode>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  function addTask() {
    const trimmed = input.trim();
    if (!trimmed) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      inputRef.current?.focus();
      return;
    }

    const selectedDate = dateInput ? new Date(dateInput + 'T12:00:00') : new Date();
    const now = new Date();

    const isTaskToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();

    const task: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      column: isTaskToday ? 'today' : 'upcoming',
      createdAt: new Date(),
      date: isTaskToday ? undefined : selectedDate,
    };

    setTasks((prev) => [...prev, task]);
    setInput('');
    setDateInput(todayStr());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') addTask();
  }

  function moveTask(taskId: string, toColumn: ColumnId) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, column: toColumn, completedAt: toColumn === 'done' ? new Date() : undefined };
      })
    );
  }

  function deleteTask(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  function completeTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, column: 'done' as ColumnId, completedAt: new Date() } : t
      )
    );
  }

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((t) => t.column !== 'done');
  }, [tasks, filter]);

  const todayCount = tasks.filter((t) => t.column === 'today').length;
  const upcomingCount = tasks.filter((t) => t.column === 'upcoming').length;
  const doneCount = tasks.filter((t) => t.column === 'done').length;

  const doneTasks = useMemo(() => tasks.filter((t) => t.column === 'done'), [tasks]);
  const recentDone = useMemo(
    () => [...doneTasks].sort((a, b) => {
      const da = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const db = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return db - da;
    }).slice(0, showAllHistory ? doneTasks.length : HISTORY_SHOW),
    [doneTasks, showAllHistory]
  );

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-title">Daily Stack</span>
        </div>

        <span className="sidebar-section-label">Views</span>
        <nav className="sidebar-nav">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`sidebar-btn${filter === f.id ? ' sidebar-btn--active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              <span className="sidebar-btn-icon">
                {f.id === 'all' ? '⊞' : f.id === 'today' ? '◎' : '◈'}
              </span>
              <span>{f.label}</span>
              <span className="sidebar-btn-count">
                {f.id === 'all' ? todayCount + upcomingCount
                : f.id === 'today' ? todayCount
                : upcomingCount}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="welcome-msg">
          {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}. Let's sort the pile.
        </div>
        <div className="add-bar">
          <input
            ref={inputRef}
            className={`add-input${shake ? ' add-input--shake' : ''}`}
            type="text"
            placeholder="Add a task…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            className="add-date"
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <button className="add-btn" onClick={addTask}>
            Add
          </button>
        </div>

        <div className="board-section">
          <Board
            tasks={filteredTasks}
            onMove={moveTask}
            onDelete={deleteTask}
            onComplete={completeTask}
          />
        </div>

        {doneTasks.length > 0 && (
          <section className="history-section">
            <div className="history-header">
              <span className="history-title">Recently completed</span>
              <span className="history-count">{doneCount}</span>
            </div>
            <div className="history-list">
              {recentDone.map((task) => (
                <div key={task.id} className="history-item">
                  <span className="history-item-check">✓</span>
                  <span className="history-item-title">{task.title}</span>
                  <span className="history-item-date">
                    {task.completedAt ? formatDateShort(new Date(task.completedAt)) : ''}
                    {' '}
                    {task.completedAt ? formatTime(new Date(task.completedAt)) : ''}
                  </span>
                </div>
              ))}
            </div>
            {doneTasks.length > HISTORY_SHOW && (
              <button
                className="history-toggle"
                onClick={() => setShowAllHistory((v) => !v)}
              >
                {showAllHistory
                  ? 'Show less'
                  : `Show all ${doneCount}`}
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
