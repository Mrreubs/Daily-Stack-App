import { useState } from 'react';
import { type ColumnId, type Task } from './types';
import { Board } from './components/Board';
import { pastDaysAgo, daysFromNow } from './utils';
import './App.css';

function generateSeedTasks(): Task[] {
  const tasks: Task[] = [];

  const doneTitles = [
    'Review Q1 financial report',
    'Update team onboarding docs',
    'Fix login page bug',
    'Send proposal to client',
    'Complete security audit',
    'Migrate database to new server',
    'Deploy v2.3 to staging',
    'Update API documentation',
    'Run user testing session',
    'Optimize image assets',
    'Write unit tests for auth module',
    'Refactor payment gateway',
    'Set up CI/CD pipeline',
    'Conduct code review for PR #142',
    'Create email template for newsletter',
    'Update privacy policy page',
    'Fix responsive layout on mobile',
    'Set up monitoring alerts',
    'Migrate legacy endpoints',
    'Update dependencies to latest',
    'Write integration tests',
    'Configure CDN caching',
    'Review design mockups',
    'Update SSL certificates',
    'Schedule team retro',
    'Archive old project files',
    'Fix pagination bug on search',
    'Update error messages',
    'Clean up console logs',
    'Set up error tracking',
    'Run load tests',
    'Update README with setup guide',
  ];

  const todayTitles = [
    'Finish dashboard redesign',
    'Review pull requests',
    'Prepare client presentation',
    'Fix navigation dropdown bug',
    'Write API endpoint for reports',
    'Update user permissions',
    'Test checkout flow',
    'Respond to support tickets',
    'Update project roadmap',
    'Refactor user settings page',
    'Add loading states to tables',
    'Fix date picker timezone issue',
    'Optimize database queries',
    'Review team timesheets',
    'Plan sprint next week',
  ];

  const upcomingTitles = [
    'Build notification system',
    'Implement dark mode',
    'Add CSV export feature',
    'Create admin dashboard',
    'Set up A/B testing framework',
    'Build real-time chat feature',
    'Implement two-factor auth',
    'Add file upload progress',
    'Create onboarding wizard',
    'Build search autocomplete',
    'Implement webhook system',
    'Add bulk import tool',
    'Create reporting dashboard',
    'Build in-app notifications',
    'Implement rate limiting',
    'Add multi-language support',
    'Create audit log viewer',
    'Build API rate monitor',
    'Implement data export tool',
    'Add user activity feed',
    'Create email digest system',
    'Build analytics dashboard',
    'Implement backup system',
    'Add role-based access control',
    'Create subscription management',
    'Build invoice generator',
    'Implement caching layer',
    'Add push notifications',
    'Create team calendar view',
    'Build import validation tool',
    'Implement search indexing',
    'Add recurring task support',
  ];

  for (const title of doneTitles) {
    tasks.push({
      id: crypto.randomUUID(),
      title,
      column: 'done',
      createdAt: pastDaysAgo(5 + Math.floor(Math.random() * 25)),
      completedAt: pastDaysAgo(Math.floor(Math.random() * 5)),
    });
  }

  for (const title of todayTitles) {
    tasks.push({
      id: crypto.randomUUID(),
      title,
      column: 'today',
      createdAt: pastDaysAgo(Math.floor(Math.random() * 3)),
    });
  }

  for (const title of upcomingTitles) {
    const daysAhead = 1 + Math.floor(Math.random() * 30);
    tasks.push({
      id: crypto.randomUUID(),
      title,
      column: 'upcoming',
      createdAt: pastDaysAgo(Math.floor(Math.random() * 10)),
      date: daysFromNow(daysAhead),
    });
  }

  return tasks;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(generateSeedTasks);

  function addTask(title: string, column: ColumnId) {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      column,
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, task]);
  }

  function moveTask(taskId: string, toColumn: ColumnId) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated: Task = { ...t, column: toColumn };
        if (toColumn === 'done') {
          updated.completedAt = new Date();
        }
        return updated;
      })
    );
  }

  function deleteTask(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  const doneCount = tasks.filter((t) => t.column === 'done').length;
  const todayCount = tasks.filter((t) => t.column === 'today').length;
  const upcomingCount = tasks.filter((t) => t.column === 'upcoming').length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <h1 className="app-title">Daily Stack</h1>
          <p className="app-tagline">Sort the pile. Win the day.</p>
        </div>
        <div className="app-stats">
          <div className="app-stat">
            <span className="app-stat-number" style={{ color: '#10B981' }}>{doneCount}</span>
            <span className="app-stat-label">Done</span>
          </div>
          <div className="app-stat">
            <span className="app-stat-number" style={{ color: '#3B82F6' }}>{todayCount}</span>
            <span className="app-stat-label">Today</span>
          </div>
          <div className="app-stat">
            <span className="app-stat-number" style={{ color: '#8B5CF6' }}>{upcomingCount}</span>
            <span className="app-stat-label">Upcoming</span>
          </div>
        </div>
      </header>
      <Board
        tasks={tasks}
        onAdd={addTask}
        onMove={moveTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

export default App;
