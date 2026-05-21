# Wahala Sorter — Code Explanation (for a 7-year-old)

Imagine you have a toy box with three shelves: **Now** (things to do right away), **Soon** (things to do a little later), and **Later** (things that can wait). You write your jobs on sticky notes and move them between shelves. Wahala Sorter is exactly that — a computer app that lets you do this on a screen!

---

## Folder Map

```
Wahala Sorter/
├── index.html          ← the front door of our app
├── vite.config.ts      ← tells the computer how to build the app
├── package.json        ← lists toys (libraries) our app needs
├── tsconfig.json       ← rules for writing code
├── docs/
│   └── 01-explanation.md  ← this file!
└── src/
    ├── main.tsx        ← the starting point
    ├── index.css       ← colors & styles for the whole app
    ├── App.tsx         ← the brain (main logic)
    ├── App.css         ← styles for the brain
    ├── types.ts        ← name tags for kinds of data
    ├── utils.ts        ← little helper tools
    └── components/
        ├── Board.tsx   ← the board that holds columns
        ├── Board.css   ← styles for the board
        ├── Column.tsx  ← one shelf / column
        ├── Column.css  ← styles for a column
        ├── TaskCard.tsx ← one sticky note
        └── TaskCard.css ← styles for a sticky note
```

---

## `index.html` — The Front Door

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wahala Sorter</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

This is the **HTML page** that loads in your browser. Think of it as the front door of a house.

- **`<!doctype html>`** — Tells the browser: "Hey, this is an HTML page!"
- **`<html lang="en">`** — Says the page is written in English.
- **`<head>`** — The hidden part with instructions for the browser.
  - **`<meta charset="UTF-8">`** — Lets the page show letters, emojis, and special characters.
  - **`<link rel="icon" ...>`** — Points to a little icon that appears on the browser tab.
  - **`<meta name="viewport" ...>`** — Tells the page to fit nicely on phones and tablets.
  - **`<title>Wahala Sorter</title>`** — The text shown on the browser tab.
- **`<body>`** — The visible part of the page.
  - **`<div id="app"></div>`** — An empty box where our React app will be drawn.
  - **`<script type="module" src="/src/main.tsx">`** — Loads our code (main.tsx) to fill that empty box.

---

## `main.tsx` — The Starting Point

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

This is the **first code that runs**. It's like saying "Let's begin!"

- **`import { StrictMode } from 'react'`** — Brings in a tool that checks if we made any mistakes (like a teacher looking over our shoulder).
- **`import { createRoot } from 'react-dom/client'`** — Brings in the tool that paints React stuff onto the web page.
- **`import App from './App.tsx'`** — Brings in our main app component (the big boss).
- **`import './index.css'`** — Loads the colors and styles for the whole app.
- **`createRoot(document.getElementById('app')!)`** — Finds the empty `<div id="app">` box from index.html. The `!` is like saying "Trust me, it exists!"
- **`.render(...)`** — Draws our app inside that box.
  - **`<StrictMode>`** — Wraps our app in "checking mode" so React can warn us about problems.
  - **`<App />`** — This is our entire app! It's like putting a Lego castle onto a base plate.

---

## `types.ts` — Name Tags for Our Data

```tsx
export type ColumnId = 'now' | 'soon' | 'later';

export interface Task {
  id: string;
  title: string;
  column: ColumnId;
  createdAt: Date;
}

export interface ColumnInfo {
  id: ColumnId;
  label: string;
  accent: string;
}

export const COLUMNS: ColumnInfo[] = [
  { id: 'now', label: 'Now', accent: '#D97706' },
  { id: 'soon', label: 'Soon', accent: '#7C3AED' },
  { id: 'later', label: 'Later', accent: '#059669' },
];
```

This file defines **what kinds of things exist** in our app. Think of it as the rules of a card game.

- **`export type ColumnId = 'now' | 'soon' | 'later'`** — A **ColumnId** can only be `'now'`, `'soon'`, or `'later'`. Nothing else! This is like saying "Your drink can be water, juice, or milk — no soda allowed."
- **`export interface Task { ... }`** — A **Task** is one sticky note. It always has:
  - **`id: string`** — A secret code (like `"abc-123"`) that makes each task unique, so we can find it later.
  - **`title: string`** — The words on the sticky note, like "Feed the cat".
  - **`column: ColumnId`** — Which shelf the task sits on: Now, Soon, or Later.
  - **`createdAt: Date`** — The date & time when the task was made.
- **`export interface ColumnInfo { ... }`** — A **ColumnInfo** tells us about a column:
  - **`id: ColumnId`** — The column's secret name (`'now'`, `'soon'`, or `'later'`).
  - **`label: string`** — The name we show to people ("Now", "Soon", "Later").
  - **`accent: string`** — A color code (like `#D97706` for amber) used to color the column.
- **`export const COLUMNS: ColumnInfo[] = [...]`** — A list of all three columns. This is our "column recipe book." The `const` means this list never changes.
  - **`{ id: 'now', label: 'Now', accent: '#D97706' }`** — Now column is amber/orange.
  - **`{ id: 'soon', label: 'Soon', accent: '#7C3AED' }`** — Soon column is purple.
  - **`{ id: 'later', label: 'Later', accent: '#059669' }`** — Later column is green.

---

## `utils.ts` — Little Helper Tools

```tsx
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
```

These are **tiny helpers** that make dates and times look pretty. Like a friend who wraps presents for you.

- **`export function formatTime(date: Date): string`**
  - Takes a date (like the one stored in your task) and turns it into a nice time string like `"3:45 PM"`.
  - **`date.toLocaleTimeString('en-US', {...})`** — Asks JavaScript to format the time the American way.
  - **`hour: 'numeric'`** — Show the hour without a leading zero (so `3` not `03`).
  - **`minute: '2-digit'`** — Always show two digits for minutes (`45` not `5`).
  - **`hour12: true`** — Use AM/PM instead of 24-hour time.

- **`export function formatDate(date: Date): string`**
  - Takes a date and turns it into something like `"Mon, Apr 21"`.
  - **`weekday: 'short'`** — Show the day of the week shortened (`"Mon"`).
  - **`month: 'short'`** — Show the month shortened (`"Apr"`).
  - **`day: 'numeric'`** — Show the day number (`21`).

---

## `index.css` — Colors & Styles for Everything

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #F5F3EF;
  --bg-card: #FFFFFF;
  --bg-input: #FFFFFF;
  --bg-hover: #F0EDE8;
  --bg-active: #FFF7ED;
  --text-primary: #1C1917;
  --text-secondary: #78716C;
  --text-muted: #A8A29E;
  --text-hint: #D6D3D0;
  --border: #E8E5E0;
  --border-light: #F0EDE8;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.06);
  --accent-now: #D97706;
  --accent-soon: #7C3AED;
  --accent-later: #059669;
  --danger-bg: #FEF2F2;
  --danger-text: #EF4444;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background: var(--accent-now);
  color: #FFFFFF;
}
```

This is our **color palette and base rules**, like deciding what colors to paint your room.

- **`@import url(...)`** — Downloads two fancy fonts from Google: **Inter** (for normal text) and **JetBrains Mono** (for numbers/code, like the timestamps).

- **`:root { ... }`** — A special box where we define our **color names** (called CSS variables). These are like crayon labels:
  - **`--bg: #F5F3EF`** — Page background is a warm cream.
  - **`--bg-card: #FFFFFF`** — Cards (columns, tasks) have a white background.
  - **`--text-primary: #1C1917`** — Main text is a dark, warm brown/black.
  - **`--text-muted: #A8A29E`** — Less important text is a lighter gray.
  - **`--accent-now: #D97706`** — The "Now" accent color is amber (like a traffic light that says GO).
  - **`--accent-soon: #7C3AED`** — The "Soon" accent color is purple.
  - **`--accent-later: #059669`** — The "Later" accent color is green.
  - **`--danger-bg: #FEF2F2`** — A pinkish background used when you hover on the delete button.
  - **`--danger-text: #EF4444`** — Red text for the delete hover.

- **`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`** — This is a **reset rule**. It says "All boxes should measure their size including their padding and border." It also removes all default spacing so we start from zero.

- **`body { ... }`** — Rules for the whole page:
  - **`font-family: 'Inter', ...`** — Use Inter font, and if that fails, use the computer's built-in font.
  - **`background: var(--bg)`** — Use our cream background color.
  - **`color: var(--text-primary)`** — Use our dark brown text color.
  - **`min-height: 100vh`** — The page should be at least as tall as the screen (100% of the viewport height).
  - **`-webkit-font-smoothing: antialiased`** — Make text look smooth and not jagged (like smoothing a rough edge with sandpaper).

- **`::selection { background: var(--accent-now); color: #FFFFFF; }`** — When you select/highlight text with your mouse, it becomes amber on white instead of the usual blue.

---

## `App.tsx` — The Brain of the App

```tsx
import { useState } from 'react';
import { type ColumnId, type Task } from './types';
import { Board } from './components/Board';
import './App.css';

function generateSeedTasks(): Task[] {
  const titles = [
    'Fix login page bug', 'Review pull requests',
    'Send proposal to client', 'Update API documentation',
    'Respond to support tickets', 'Plan sprint next week',
    'Build notification system', 'Implement dark mode',
    'Add CSV export feature', 'Create admin dashboard',
    'Set up A/B testing framework', 'Implement two-factor auth',
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
```

This is the **boss** — it manages everything. It's like the command center of a space rocket.

### The Imports

- **`import { useState } from 'react'`** — `useState` is a **hook** (a special React tool) that lets us remember things. Like a sticky note that the computer doesn't forget.
- **`import { type ColumnId, type Task } from './types'`** — Brings in our type definitions so TypeScript knows what a ColumnId and Task look like.
- **`import { Board } from './components/Board'`** — Brings in the Board component (the thing that holds all columns).
- **`import './App.css'`** — Loads the styles for this component.

### `generateSeedTasks()` — Making Sample Tasks

This function creates **fake tasks** to show when you first open the app. Like toys already placed on the shelf when you open the box.

- **`const titles = [...]`** — A list of 12 pretend task names.
- **`const columns: ColumnId[] = ['now', 'soon', 'later']`** — The three column names, stored in order.
- **`return titles.map((title, i) => ({...}))`** — For each title, create a task object:
  - **`id: crypto.randomUUID()`** — Give it a unique ID using the computer's built-in random ID generator.
  - **`title`** — Use the title from our list.
  - **`column: columns[i % 3]`** — Cycle through `now`, `soon`, `later`, `now`, `soon`, `later`... so tasks are evenly spread.
  - **`createdAt: new Date(Date.now() - Math.random() * 86400000 * 7)`** — Set the creation date to some random time within the last 7 days. `86400000` is the number of milliseconds in one day.

### `function App()` — The Main Component

This is the **main app function**. It returns a description of what the screen should look like.

#### State (Memory)

- **`const [tasks, setTasks] = useState<Task[]>(generateSeedTasks)`**
  - `useState` creates a piece of memory. Think of it as a box that holds our task list.
  - **`tasks`** — The current list of tasks (read from the box).
  - **`setTasks`** — A function to put new tasks into the box (update them).
  - **`useState<Task[]>(generateSeedTasks)`** — Start with the result of `generateSeedTasks()` (the sample tasks).

- **`const [input, setInput] = useState('')`**
  - **`input`** — What the user has typed in the text box (starts as empty `''`).
  - **`setInput`** — Changes what we remember the user typed.

#### Functions (Actions)

- **`function addTask()`**
  1. **`const trimmed = input.trim()`** — Take what the user typed and remove spaces from front and back.
  2. **`if (!trimmed) return;`** — If the box is empty (nothing typed), stop right there.
  3. **Make a new task object** with a random ID, the typed title, column set to `'now'`, and the current date/time.
  4. **`setTasks((prev) => [...prev, task])`** — Take the old list (`prev`), make a copy, and add the new task at the end. The `...` (spread operator) is like saying "take everything that was there and copy it here."
  5. **`setInput('')`** — Clear the text box so the user can type another task.

- **`function handleKeyDown(e: React.KeyboardEvent)`**
  - This runs **every time the user presses a key** while typing.
  - **`if (e.key === 'Enter') addTask();`** — If the key was Enter, add the task. This lets you press Enter instead of clicking the Add button.

- **`function moveTask(taskId: string, toColumn: ColumnId)`**
  - Moves a task from one column to another.
  - **`setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, column: toColumn } : t))`**
    - Look at every task in the list.
    - If the task's ID matches the one we want to move, make a **copy** of it (`...t`) but change its `column` to the new column.
    - If it doesn't match, leave it as is.

- **`function deleteTask(taskId: string)`**
  - Removes a task forever.
  - **`setTasks((prev) => prev.filter((t) => t.id !== taskId))`**
    - `filter` is like a sieve: keep only the tasks whose ID is NOT the one we want to delete.
    - The deleted task falls through the sieve and is gone.

#### The Return (What You See)

- **`<div className="app">`** — The main wrapper. `className` is React's way of saying `class` in HTML.
- **`<header className="app-header">`** — The top of the page.
  - **`<span className="app-logo">Wahala Sorter</span>`** — The app name, big and bold.
  - **`<span className="app-subtitle">Sort the pile. Win the day.</span>`** — A small motto below.
- **`<div className="add-bar">`** — The bar where you add new tasks.
  - **`<input className="add-input" type="text" placeholder="Add a task…"`** — A text box.
    - **`value={input}`** — The current text in the box comes from our `input` state.
    - **`onChange={(e) => setInput(e.target.value)}`** — Every time the user types, update our memory. `e` is the event, `e.target` is the input box, `e.target.value` is what's typed.
    - **`onKeyDown={handleKeyDown}`** — When a key is pressed down, run our `handleKeyDown` function (which checks for Enter).
  - **`<button className="add-btn" onClick={addTask}>Add</button>`** — The Add button. When clicked, runs `addTask()`.
- **`<Board tasks={tasks} onMove={moveTask} onDelete={deleteTask} />`** — The Board component.
  - **`tasks={tasks}`** — Give the board our list of tasks (a **prop**, like handing a toy to a friend).
  - **`onMove={moveTask}`** — Give the board our "move task" function so it can call it.
  - **`onDelete={deleteTask}`** — Give the board our "delete task" function.

### `export default App`

Makes our App available to other files (like `main.tsx` that needs to draw it).

---

## `App.css` — Styles for the App

```css
.app {
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
}

.app-header {
  margin-bottom: 1.5rem;
}

.app-logo {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.app-subtitle {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-left: 0.75rem;
  font-weight: 400;
}

.add-bar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-input {
  flex: 1;
  max-width: 24rem;
  padding: 0.625rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.9rem;
  background: var(--bg-input);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.add-input:focus {
  border-color: var(--accent-now);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-now) 12%, transparent);
}

.add-input::placeholder {
  color: var(--text-muted);
}

.add-btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--accent-now);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap;
}

.add-btn:hover {
  opacity: 0.9;
}

.add-btn:active {
  transform: scale(0.97);
}

@media (max-width: 640px) {
  .app { padding: 1.25rem 1rem; }
  .add-bar { flex-wrap: wrap; }
  .add-input { max-width: 100%; width: 100%; }
  .add-btn { width: 100%; }
}
```

This file **paints the app's main layout**.

- **`.app`** — The main container:
  - **`max-width: 64rem`** — Don't get wider than 64rem (about 1024 pixels), like a max-width belt.
  - **`margin: 0 auto`** — Center the container on the page. `auto` means "let the computer figure out equal space on left and right."
  - **`padding: 2rem 1.5rem`** — Add space inside: 2rem on top/bottom, 1.5rem on left/right.
  - **`min-height: 100vh`** — At least as tall as the screen.

- **`.app-header`** — Space below the header: **`margin-bottom: 1.5rem`**.

- **`.app-logo`** — The big title:
  - **`font-size: 1.35rem`** — 1.35 times the base font size.
  - **`font-weight: 800`** — Very bold (800 is like "extra black" thickness).
  - **`color: var(--text-primary)`** — Dark brown color from our palette.
  - **`letter-spacing: -0.03em`** — Squish letters slightly closer together.

- **`.app-subtitle`** — The motto:
  - **`font-size: 0.82rem`** — Smaller than normal text.
  - **`color: var(--text-muted)`** — Light gray color.
  - **`margin-left: 0.75rem`** — Space between the logo and the motto.

- **`.add-bar`** — The row with the text box and button:
  - **`display: flex`** — Put items side by side in a row (like magnets that line up).
  - **`gap: 0.5rem`** — Space of 0.5rem between items.
  - **`align-items: center`** — Make them line up in the middle vertically.
  - **`margin-bottom: 1.5rem`** — Space below the bar.

- **`.add-input`** — The text input:
  - **`flex: 1`** — Take up as much space as available (but not more than max-width).
  - **`max-width: 24rem`** — Don't grow wider than 24rem.
  - **`padding: 0.625rem 1rem`** — Space inside: 0.625rem top/bottom, 1rem left/right.
  - **`border: 1px solid var(--border)`** — A thin, light-gray border.
  - **`border-radius: 0.5rem`** — Slightly rounded corners.
  - **`outline: none`** — Don't show the default blue outline when focused (we use a custom one).
  - **`transition: border-color 0.15s, box-shadow 0.15s`** — When border or shadow changes, animate smoothly over 0.15 seconds.

- **`.add-input:focus`** — When the input is clicked/selected:
  - **`border-color: var(--accent-now)`** — Change border to amber.
  - **`box-shadow: 0 0 0 3px color-mix(...)`** — Add a 3px amber glow around it, but very faint (12% opacity).

- **`.add-input::placeholder`** — The ghost text inside the box before you type: **`color: var(--text-muted)`** (light gray).

- **`.add-btn`** — The Add button:
  - **`padding: 0.625rem 1.25rem`** — Space inside the button.
  - **`border: none`** — No border.
  - **`border-radius: 0.5rem`** — Rounded corners.
  - **`background: var(--accent-now)`** — Amber background.
  - **`color: #FFFFFF`** — White text.
  - **`font-weight: 600`** — Semi-bold.
  - **`cursor: pointer`** — Change the mouse to a pointing hand when hovering.
  - **`white-space: nowrap`** — Don't wrap the text to a new line even if the button is narrow.

- **`.add-btn:hover`** — When the mouse hovers over the button: **`opacity: 0.9`** (slightly transparent).
- **`.add-btn:active`** — When the button is being clicked: **`transform: scale(0.97)`** (squishes it a tiny bit, like pushing a real button).

- **`@media (max-width: 640px)`** — **Mobile rules**. If the screen is narrower than 640px:
  - Less padding on the app.
  - Input and button stack vertically (`flex-wrap: wrap`).
  - Input takes full width.
  - Button takes full width.

---

## `Board.tsx` — The Board Holding Columns

```tsx
import { type ColumnId, type Task, COLUMNS } from '../types';
import { Column as ColumnComp } from './Column';
import './Board.css';

interface BoardProps {
  tasks: Task[];
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (taskId: string) => void;
}

export function Board({ tasks, onMove, onDelete }: BoardProps) {
  return (
    <div className="board">
      {COLUMNS.map((col) => (
        <ColumnComp
          key={col.id}
          columnId={col.id}
          tasks={tasks.filter((t) => t.column === col.id)}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
```

The Board is like a **tray that holds three shelves**. It splits tasks between columns.

### Props (things passed in)

- **`interface BoardProps`** describes the props:
  - **`tasks: Task[]`** — All the tasks in the app.
  - **`onMove: (taskId: string, toColumn: ColumnId) => void`** — A function to move a task (passed from App).
  - **`onDelete: (taskId: string) => void`** — A function to delete a task (passed from App).

### `export function Board({ tasks, onMove, onDelete }: BoardProps)`

- **`{ tasks, onMove, onDelete }`** — Destructuring: pulling these values out of the props object, like taking specific toys out of a toy box.

- **`{COLUMNS.map((col) => (...))}`** — Go through our column recipe book and for each column, create a `ColumnComp`.
  - **`key={col.id}`** — A special React thing: helps React know which column is which when things change.
  - **`columnId={col.id}`** — Pass the column's ID (now, soon, or later).
  - **`tasks={tasks.filter((t) => t.column === col.id)}`** — Give the column only its own tasks. `filter` is like a door: only tasks whose column matches the current one can go through.
  - **`onMove={onMove}`** and **`onDelete={onDelete}`** — Pass the move and delete functions down.

### `export` — Makes this component available for others to use.

---

## `Board.css` — Board Styles

```css
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: start;
}

@media (max-width: 640px) {
  .board {
    grid-template-columns: 1fr;
  }
}
```

- **`.board`** — Uses CSS Grid:
  - **`display: grid`** — Arranges items in a grid (like an egg carton).
  - **`grid-template-columns: repeat(3, 1fr)`** — Make 3 equal-width columns. `1fr` means "one fraction of the available space."
  - **`gap: 1rem`** — Space between grid items.
  - **`align-items: start`** — Each column starts at the top of its cell (so short columns don't stretch).

- **`@media (max-width: 640px)`** — On small screens: **`grid-template-columns: 1fr`** — stack columns vertically (one column per row).

---

## `Column.tsx` — One Shelf

```tsx
import { useState } from 'react';
import { type ColumnId, type Task, COLUMNS } from '../types';
import { TaskCard } from './TaskCard';
import './Column.css';

interface ColumnProps {
  columnId: ColumnId;
  tasks: Task[];
  onMove: (taskId: string, toColumn: ColumnId) => void;
  onDelete: (taskId: string) => void;
}

export function Column({ columnId, tasks, onMove, onDelete }: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const columnInfo = COLUMNS.find((c) => c.id === columnId)!;

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
    if (taskId) onMove(taskId, columnId);
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
        <div className="column-header-icon" style={{ background: columnInfo.accent }} />
        <span className="column-title">{columnInfo.label}</span>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-task-list">
        {tasks.length === 0 ? (
          <div className="column-empty">
            <span className="column-empty-text">No tasks</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

A Column is one **shelf** on the board. It knows how to catch dropped tasks.

### `const [isDragOver, setIsDragOver] = useState(false)`

- **`isDragOver`** — Remembers whether something is being dragged over this column right now (like a basketball hovering above a hoop). Starts as `false`.
- **`setIsDragOver`** — Changes that memory.

### `const columnInfo = COLUMNS.find((c) => c.id === columnId)!`

- Finds the matching column info (name, color) from the COLUMNS list. The `!` at the end says "I'm sure it exists, don't worry."

### Drag-and-Drop Handlers

When you drag a task card, these functions handle what happens:

- **`function handleDragOver(e)`** — Runs **many times** while something is dragged over the column.
  - **`e.preventDefault()`** — "Stop the browser from doing its own thing" (browsers don't allow dropping by default).
  - **`e.dataTransfer.dropEffect = 'move'`** — Show a "moving" cursor icon.

- **`function handleDragEnter(e)`** — Runs **once** when something first enters the column.
  - **`e.preventDefault()`** — Allow the drop.
  - **`setIsDragOver(true)`** — Mark that something is hovering over this column (so we can highlight it).

- **`function handleDragLeave()`** — Runs when the dragged thing **leaves** the column.
  - **`setIsDragOver(false)`** — Remove the highlight.

- **`function handleDrop(e)`** — Runs when the dragged thing is **dropped** (released).
  - **`e.preventDefault()`** — Handle it ourselves.
  - **`setIsDragOver(false)`** — Remove highlight.
  - **`const taskId = e.dataTransfer.getData('text/plain')`** — Read the task's ID from the drag event (we put it there in TaskCard).
  - **`if (taskId) onMove(taskId, columnId)`** — If we got an ID, tell the App to move this task to our column.

### The JSX (What You See)

- **The outer `<div>`**:
  - **`className={`column${isDragOver ? ' column--drag-over' : ''}`}`** — If something is being dragged over, add the `column--drag-over` class which highlights the border.
  - **The drag event handlers** are attached to this div.
  - **`style={{ '--column-accent': columnInfo.accent }}`** — Sets a CSS variable with the column's accent color. Other CSS rules can use this variable.

- **`<div className="column-header">`** — The top bar of the column:
  - **A colored dot** (`column-header-icon`) showing the column's accent color.
  - **The column name** (Now, Soon, or Later).
  - **The task count** (how many tasks are in this column).

- **`<div className="column-task-list">`** — The body where tasks live:
  - **If there are zero tasks**: Show "No tasks" in the center.
  - **If there are tasks**: Loop through them with `tasks.map(...)` and create a `TaskCard` for each one.
    - **`key={task.id}`** — React needs this to keep track of each task.
    - **`task={task}`** — Pass the task data.
    - **`onDelete={onDelete}`** — Pass the delete function.

---

## `Column.css` — Column Styles

- **`.column`** — A card with white background, rounded corners (`0.75rem`), a light border. Uses flexbox to stack items vertically.
  - **`transition: box-shadow 0.2s, border-color 0.2s`** — Smooth animation when highlighting.
- **`.column--drag-over`** — When something is being dragged over: the border changes to the column's accent color, and a faint colored glow appears around it.
- **`.column-header`** — The top bar: padding, flexbox row with small gap, light bottom border.
- **`.column-header-icon`** — A small 0.5rem × 0.5rem circle (the colored dot).
- **`.column-title`** — Small bold text.
- **`.column-count`** — A tiny counter badge with monospace font, light gray background, rounded corners. Pushed to the right with `margin-left: auto`.
- **`.column-task-list`** — The area where task cards sit. Has padding, flexbox column with small gap, minimum height of 4rem so it doesn't collapse when empty.
- **`.column-empty`** — Centered text shown when column has no tasks.
- **`.column-empty-text`** — Gray, medium-weight text.

---

## `TaskCard.tsx` — One Sticky Note

```tsx
import { type Task, COLUMNS } from '../types';
import { formatTime } from '../utils';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const columnInfo = COLUMNS.find((c) => c.id === task.column)!;

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('text/plain', task.id);
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
        <span className="task-card-title">{task.title}</span>
        <button
          className="task-card-delete"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          ×
        </button>
      </div>
      <div className="task-card-meta">
        <span
          className="task-card-column-tag"
          style={{ background: `${columnInfo.accent}18`, color: columnInfo.accent }}
        >
          {columnInfo.label}
        </span>
        <span className="task-card-timestamp">
          Added {formatTime(new Date(task.createdAt))}
        </span>
      </div>
    </div>
  );
}
```

This is one **sticky note** you can drag and delete.

### Props

- **`task: Task`** — The task data (id, title, column, createdAt).
- **`onDelete: (id: string) => void`** — Function to delete this task.

### `const columnInfo = COLUMNS.find((c) => c.id === task.column)!`

- Looks up which column this task belongs to, so we can show its name and color.

### Drag Handlers

- **`function handleDragStart(e)`** — Runs **once** when you start dragging this card.
  - **`e.dataTransfer.setData('text/plain', task.id)`** — Store the task's ID in the drag event. Think of it as putting a name tag on a suitcase.
  - **`e.dataTransfer.effectAllowed = 'move'`** — Say "this is a move, not a copy."
  - **`e.currentTarget.classList.add('task-card--dragging')`** — Add a CSS class to make the card semi-transparent while being dragged.

- **`function handleDragEnd(e)`** — Runs when you stop dragging (drop or cancel).
  - **`e.currentTarget.classList.remove('task-card--dragging')`** — Remove the semi-transparent class.

### The JSX

- **Outer `<div>`**:
  - **`draggable`** — This is the magic word that makes the card draggable! Without it, nothing would happen.
  - **`onDragStart={handleDragStart}`** — Run our setup when dragging starts.
  - **`onDragEnd={handleDragEnd}`** — Run our cleanup when dragging ends.

- **`<div className="task-card-top">`** — Top row:
  - **`<span className="task-card-title">{task.title}</span>`** — The task's text.
  - **`<button className="task-card-delete" onClick={() => onDelete(task.id)}>`** — The × delete button. When clicked, calls `onDelete` with this task's ID.
    - **`aria-label="Delete task"`** — Helpful text for screen readers (for people who can't see the screen).

- **`<div className="task-card-meta">`** — Bottom row (metadata):
  - **Column tag** — A little colored label showing "Now", "Soon", or "Later". The background uses the accent color at 18% opacity (`${accent}18`), and the text uses the full accent color.
  - **Timestamp** — Shows `Added 3:45 PM` by calling our `formatTime` helper.

---

## `TaskCard.css` — Sticky Note Styles

- **`.task-card`** — A white card with rounded corners, light border, slight shadow on hover.
  - **`cursor: grab`** — Show a grabbing hand cursor.
  - **`animation: card-fade-in 0.2s ease-out`** — When the card appears, it fades in and slides up slightly.
- **`.task-card:hover`** — Darker border and shadow (makes the card feel "lifted").
- **`.task-card:active`** — When clicked, change cursor to `grabbing` (closed hand).
- **`.task-card--dragging`** — When being dragged: **`opacity: 0.4`** (faded, like a ghost).
- **`.task-card-top`** — Flexbox row, items start at the top (`align-items: flex-start`), small gap.
- **`.task-card-title`** — Takes remaining space (`flex: 1`), medium weight, breaks long words (`word-break: break-word`).
- **`.task-card-delete`** — A small × button:
  - Hidden by default (`opacity: 0`).
  - Appears when hovering over the card (`.task-card:hover .task-card-delete { opacity: 1 }`).
  - When hovered itself: red background and red text.
- **`.task-card-meta`** — Row below the title: flexbox, small gap, contains the column tag and timestamp.
- **`.task-card-column-tag`** — A tiny colored label with small text (`0.65rem`), bold, with rounded corners.
- **`.task-card-timestamp`** — Monospace font, tiny text (`0.65rem`), light gray color.
- **`@keyframes card-fade-in`** — An animation that runs when a card first appears. It starts invisible and 3px lower, then moves to fully visible and normal position over 0.2 seconds.

---

## `vite.config.ts` — Build Settings

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Daily-Stack-App/',
})
```

This tells Vite (the tool that builds our app) how to behave:

- **`import { defineConfig } from 'vite'`** — Bring in Vite's config helper.
- **`import react from '@vitejs/plugin-react'`** — Bring in the React plugin (so Vite understands React code).
- **`export default defineConfig({ plugins: [react()], base: '/Daily-Stack-App/' })`**
  - **`plugins: [react()]`** — Use the React plugin.
  - **`base: '/Daily-Stack-App/'`** — All file paths in the built app will start with `/Daily-Stack-App/`, because it's hosted at that subfolder on GitHub Pages. If you renamed your repo, you'd change this.

---

## `package.json` — Our Toy List

```json
{
  "name": "daily-stack-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "~6.0.2",
    "vite": "^8.0.12"
  },
  "dependencies": {
    "@types/react": "^19.2.15",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  }
}
```

This is the **shopping list** for our app. When you run `npm install`, it goes and downloads all these.

- **`"name": "daily-stack-app"`** — The project name (still from the old name).
- **`"version": "0.0.0"`** — Version number.
- **`"type": "module"`** — Use modern JavaScript modules.
- **`"scripts"`** — Shortcut commands:
  - **`"dev": "vite"`** — Run `npm run dev` to start a local test server.
  - **`"build": "tsc && vite build"`** — Run `npm run build` to build the final app.
  - **`"preview": "vite preview"`** — Preview the built app locally.
- **`"dependencies"`** — Things the app needs to run:
  - **`react`** and **`react-dom`** — The React library itself.
  - **`@types/react`** and **`@types/react-dom`** — TypeScript type definitions for React.
  - **`@vitejs/plugin-react`** — The Vite plugin for React.
- **`"devDependencies"`** — Things needed for development:
  - **`typescript`** — TypeScript compiler.
  - **`vite`** — The build tool.

---

## `tsconfig.json` — Code-Writing Rules

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

This tells TypeScript **how strict to be** when checking our code. It's like a teacher's grading rubric.

Key rules:
- **`"target": "ES2020"`** — Compile to modern JavaScript (from 2020).
- **`"lib": ["ES2020", "DOM", "DOM.Iterable"]`** — Allow using browser features and ES2020 features.
- **`"jsx": "react-jsx"`** — Understand React's JSX syntax.
- **`"strict": true`** — Be very strict about checking types.
- **`"noUnusedLocals": true`** — Error if you create a variable but never use it.
- **`"noUnusedParameters": true`** — Error if a function has a parameter it doesn't use.
- **`"include": ["src"]`** — Only check files inside the `src/` folder.

---

## How Everything Connects — The Big Picture

Here's how it all flows:

1. **`index.html`** loads → browser creates an empty `<div id="app">`
2. **`main.tsx`** runs → imports **`App`** and **`./index.css`** → draws `<App />` inside the div
3. **`App.tsx`** runs:
   - Creates memory for **tasks** and **input text**
   - Fills tasks with sample data from `generateSeedTasks()`
   - Renders the **header**, **add bar**, and **Board**
4. **`Board.tsx`** receives all tasks → splits them by column → creates 3 **Column** components
5. **`Column.tsx`** receives its own tasks → creates a **TaskCard** for each one → handles drag-over highlighting
6. **`TaskCard.tsx`** shows the **title**, **column tag**, **timestamp** → handles drag-start (storing ID) → handles delete button

### When You Add a Task

1. Type in the input box → **`onChange`** updates `input` state
2. Click "Add" or press Enter → **`addTask()`** runs:
   - Creates a new Task object with column `'now'`
   - Calls `setTasks` to add it to the list
   - Clears the input
3. React automatically re-renders → the new task appears in the **Now** column

### When You Drag a Task

1. **Start dragging**: `handleDragStart` stores the task ID in the drag event, makes the card semi-transparent
2. **Drag over a column**: `handleDragEnter` highlights the column, `handleDragOver` allows the drop
3. **Drop**: `handleDrop` reads the task ID, calls `onMove(taskId, columnId)` which calls `moveTask` in App
4. **App.moveTask** finds the task by ID and changes its `column` to the new one
5. React re-renders → the task appears in its new column

### When You Delete a Task

1. Click the × button → calls `onDelete(task.id)` → calls `deleteTask` in App
2. **App.deleteTask** filters out the task with that ID
3. The task disappears from the screen forever

---

## Why It's Called "Wahala Sorter"

In Nigerian Pidgin English, **"Wahala"** means trouble or problems. The app helps you **sort through your wahala** — your daily pile of tasks and problems — by putting them into three simple buckets: **Now** (do immediately), **Soon** (do later today/tomorrow), and **Later** (when you get to it).

No fancy features, no distractions. Just type, drag, sort, delete. Useful.
