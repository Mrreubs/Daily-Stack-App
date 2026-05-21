import { useState, useMemo, useRef, useEffect } from 'react';
import { type ColumnId, type Task, type FilterMode, NAV_ITEMS } from './types';
import { Board } from './components/Board';
import { IconAllTasks, IconToday, IconUpcoming, IconHistory } from './icons';
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

const navIcon: Record<FilterMode, () => React.JSX.Element> = {
  all: IconAllTasks,
  today: IconToday,
  upcoming: IconUpcoming,
  history: IconHistory,
};

function App() {
  const [tasks, setTasks] = useState<Task[]>(generateSeedTasks);
  const [input, setInput] = useState('');
  const [dateInput, setDateInput] = useState(todayStr());
  const [shake, setShake] = useState(false);
  const [filter, setFilter] = useState<FilterMode>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const quotes = [
    '“The secret of getting ahead is getting started.” — Mark Twain',
    '“You don\'t have to be extreme, just consistent.” — Unknown',
    '“Small daily improvements over time lead to stunning results.” — Robin Sharma',
    '“Do something today that your future self will thank you for.” — Unknown',
    '“The best time to plant a tree was 20 years ago. The second best time is now.” — Chinese Proverb',
    '“The pain you feel today will be the strength you feel tomorrow.” — Unknown',
    '“Don\'t break the chain.” — Jerry Seinfeld',
    '“Your future is created by what you do today, not tomorrow.” — Robert Kiyosaki',
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % quotes.length);
        setQuoteFade(true);
      }, 400);
    }, 8000);
    return () => clearInterval(id);
  }, [quotes.length]);

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

  const boardTasks = useMemo(() => {
    if (filter === 'history') return [];
    if (filter === 'all') return tasks;
    return tasks.filter((t) => t.column === filter);
  }, [tasks, filter]);

  const todayCount = tasks.filter((t) => t.column === 'today').length;
  const upcomingCount = tasks.filter((t) => t.column === 'upcoming').length;
  const doneCount = tasks.filter((t) => t.column === 'done').length;

  const doneTasks = useMemo(
    () => tasks.filter((t) => t.column === 'done')
      .sort((a, b) => {
        const da = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const db = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return db - da;
      }),
    [tasks]
  );

  function navCount(id: FilterMode): number {
    switch (id) {
      case 'all': return todayCount + upcomingCount;
      case 'today': return todayCount;
      case 'upcoming': return upcomingCount;
      case 'history': return doneCount;
    }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-title">Daily Stack</span>
        </div>

        <span className="sidebar-section-label">Views</span>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = navIcon[item.id];
            return (
              <button
                key={item.id}
                className={`sidebar-btn${filter === item.id ? ' sidebar-btn--active' : ''}`}
                onClick={() => setFilter(item.id)}
              >
                <span className="sidebar-btn-icon"><Icon /></span>
                <span>{item.label}</span>
                <span className="sidebar-btn-count">{navCount(item.id)}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="main-content">
        {filter !== 'history' ? (
          <>
            <div className="welcome-bar">
              <span className="welcome-msg">
                {clock.getHours() < 12 ? 'Good morning' : clock.getHours() < 17 ? 'Good afternoon' : 'Good evening'}. Let's sort the pile.
              </span>
              <span className="welcome-clock">
                {clock.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                {' · '}
                {clock.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            </div>

            <div className={`quote-card${quoteFade ? ' quote-card--visible' : ''}`}>
              <svg className="quote-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              <span className="quote-text">{quotes[quoteIndex]}</span>
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
                tasks={boardTasks}
                onMove={moveTask}
                onDelete={deleteTask}
                onComplete={completeTask}
              />
            </div>
          </>
        ) : (
          <div className="history-view">
            <div className="history-view-header">
              <span className="history-view-title">Completed tasks</span>
              <span className="history-view-count">{doneCount}</span>
            </div>
            <div className="history-view-list">
              {doneTasks.length === 0 ? (
                <div className="history-view-empty">No completed tasks yet</div>
              ) : (
                doneTasks.map((task) => (
                  <div key={task.id} className="history-item">
                    <span className="history-item-check">✓</span>
                    <span className="history-item-title">{task.title}</span>
                    <span className="history-item-date">
                      {task.completedAt ? formatDateShort(new Date(task.completedAt)) : ''}
                      {' '}
                      {task.completedAt ? formatTime(new Date(task.completedAt)) : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
