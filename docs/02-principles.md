# Software Engineering Principles in Wahala Sorter

This document identifies every software engineering principle used in the app, explains it in plain language, and points to the exact lines where it appears.

---

## 1. Single Responsibility Principle (SRP)

**Plain words:** Every file, function, or component should have exactly one job. If something has more than one reason to change, split it up.

| File | Lines | What it does (one job) |
|---|---|---|
| `src/types.ts` | 1–20 | Defines the shapes of data (Task, ColumnId, etc.) |
| `src/utils.ts` | 1–15 | Formats dates and times |
| `src/index.css` | 1–44 | Defines global colors, fonts, and base styles |
| `src/main.tsx` | 1–10 | Starts the app and renders it into the page |
| `src/App.tsx` | 31–96 | Manages all state and passes it down |
| `src/App.css` | 1–95 | Styles for the top-level layout (header, add bar) |
| `src/components/Board.tsx` | 1–25 | Lays out the three columns on a grid |
| `src/components/Board.css` | 1–12 | Grid layout for the board |
| `src/components/Column.tsx` | 1–70 | Handles one column: renders tasks, manages drag-over state |
| `src/components/Column.css` | 1–70 | Visual styling for a single column |
| `src/components/TaskCard.tsx` | 1–53 | Renders one task card: title, tag, timestamp, drag, delete |
| `src/components/TaskCard.css` | 1–101 | Visual styling for a task card |

**Why it matters:** If a bug appears in the timestamp format, you go straight to `utils.ts:1-7`. If the column highlight is wrong, you go to `Column.tsx`. You never have to hunt across a giant file.

---

## 2. Separation of Concerns

**Plain words:** Different kinds of code live in different files. Data shapes go in one file, logic in another, styling in another, rendering in another.

This is the folder structure itself:

```
src/
  types.ts          ← data shapes (concern: "what things look like")
  utils.ts          ← helpers (concern: "how to format stuff")
  index.css         ← global styles (concern: "how the whole app looks")
  App.tsx           ← state & layout (concern: "what's the app doing")
  App.css           ← app styles (concern: "how the layout looks")
  components/
    Board.tsx        ← concern: "arrange columns"
    Board.css        ← concern: "how the grid looks"
    Column.tsx       ← concern: "one column's behavior"
    Column.css       ← concern: "how one column looks"
    TaskCard.tsx     ← concern: "one task card's behavior"
    TaskCard.css     ← concern: "how one card looks"
```

**Why it matters:** You can change the color of all columns by editing one CSS file (`index.css` lines 17–19) without touching any TypeScript. You can change the timestamp format in `utils.ts` without touching any component. Each concern is isolated.

---

## 3. Composition

**Plain words:** Build big things by sticking small things together. Like Lego — a house is made of bricks, windows, and a roof, each made separately.

```
App
├── Header (logo + subtitle)
├── Add bar (input + button)
└── Board
    ├── Column ("Now")
    │   ├── TaskCard
    │   └── TaskCard
    ├── Column ("Soon")
    │   ├── TaskCard
    │   └── TaskCard
    └── Column ("Later")
        └── TaskCard
```

**Exact lines:**

- **App uses Board:** `App.tsx:87-91` — `<Board tasks={tasks} onMove={moveTask} onDelete={deleteTask} />`
- **Board uses Column:** `Board.tsx:14-22` — `{COLUMNS.map((col) => <ColumnComp ... />)}`
- **Column uses TaskCard:** `Column.tsx:59-65` — `{tasks.map((task) => <TaskCard ... />)}`

**Why it matters:** You can change how a TaskCard looks without touching Column or Board. You can add a new column type without rewriting anything. Each piece is independent and reusable.

---

## 4. Immutability

**Plain words:** Never change (mutate) data directly. Instead, make a copy with the change applied. Like rewriting a shopping list instead of erasing items — you keep the original safe.

**Line-by-line examples:**

| File | Lines | What it does |
|---|---|---|
| `App.tsx` | 46 | `setTasks((prev) => [...prev, task])` — Makes a **new array** copying all old tasks + the new one. Never pushes into the old array. |
| `App.tsx` | 55-59 | `prev.map((t) => t.id === taskId ? { ...t, column: toColumn } : t)` — If the task matches, makes a **copy** of the task object (`{...t}`) and changes only `column`. If it doesn't match, returns the original untouched. |
| `App.tsx` | 63 | `prev.filter((t) => t.id !== taskId)` — Returns a **new array** without the deleted task. Never uses `splice` or mutation. |
| `App.tsx` | 23-28 | `generateSeedTasks` returns a **new array** of new objects every time it's called. No shared references. |

**Why it matters:** React relies on immutability to detect changes. If you mutate the old array directly (`tasks.push(newTask)`), React won't know to re-render. Immutability also prevents bugs where two parts of the code accidentally share and corrupt the same data.

---

## 5. Type Safety (TypeScript)

**Plain words:** We tell the computer exactly what kind of data is allowed. "This variable can only be 'now', 'soon', or 'later' — nothing else." The computer checks our work before the app even runs.

| File | Lines | What it does |
|---|---|---|
| `types.ts` | 1 | `export type ColumnId = 'now' \| 'soon' \| 'later'` — A column can only be one of these three strings. Typing `'tomorrow'` would be an error. |
| `types.ts` | 3-8 | `export interface Task { id: string; title: string; column: ColumnId; createdAt: Date }` — Every task must have exactly these four fields of these exact types. |
| `App.tsx` | 32 | `useState<Task[]>(generateSeedTasks)` — TypeScript checks that `generateSeedTasks` actually returns `Task[]`. |
| `App.tsx` | 50 | `handleKeyDown(e: React.KeyboardEvent)` — The parameter can only be a keyboard event, not a mouse event. |
| `App.tsx` | 54 | `moveTask(taskId: string, toColumn: ColumnId)` — `toColumn` must be `'now'`, `'soon'`, or `'later'`. |
| `Board.tsx` | 5-9 | `interface BoardProps { tasks: Task[]; onMove: ...; onDelete: ... }` — The Board can only receive these exact props of these exact types. |
| `TaskCard.tsx` | 43 | `style={{ background: \`${columnInfo.accent}18\`, color: columnInfo.accent }}` — TypeScript ensures `accent` is a string (not a number or boolean). |

**Why it matters:** Many bugs are caught at build time instead of at runtime. If you pass a number where a string is expected, TypeScript yells at you before anyone opens the app.

---

## 6. Declarative UI (React's core idea)

**Plain words:** Instead of telling the computer *how* to update the screen step by step, you just describe *what* the screen should look like for a given state. React figures out the rest.

**Exact lines:**

```tsx
// App.tsx:66-92
return (
  <div className="app">
    {tasks.length === 0 ? (
      <span>Nothing yet</span>
    ) : (
      tasks.map(...)
    )}
  </div>
);
```

The function says: "If there are no tasks, show 'Nothing yet'. Otherwise, show the tasks." It doesn't say "first clear the div, then loop, then append children." React handles the *how*.

Same pattern in:
- `Column.tsx:53-66` — `{tasks.length === 0 ? <Empty /> : tasks.map(...)}`
- `Column.tsx:39-45` — `className={isDragOver ? 'column column--drag-over' : 'column'}`

**Why it matters:** Declarative code is easier to read, reason about, and debug. There's no "what did the screen look like 3 steps ago?" mental load.

---

## 7. DRY — Don't Repeat Yourself

**Plain words:** If the same value or logic appears in more than one place, pull it into one shared spot.

**Exact lines:**

- **Column names and colors defined once in `types.ts:16-19`:**
  ```ts
  export const COLUMNS: ColumnInfo[] = [
    { id: 'now', label: 'Now', accent: '#D97706' },
    { id: 'soon', label: 'Soon', accent: '#7C3AED' },
    { id: 'later', label: 'Later', accent: '#059669' },
  ];
  ```
  These are used in:
  - **`Board.tsx:14`** — `{COLUMNS.map(...)}` to create the three columns
  - **`Column.tsx:15`** — `COLUMNS.find((c) => c.id === columnId)` to get accent color
  - **`TaskCard.tsx:11`** — `COLUMNS.find((c) => c.id === task.column)` to get the column tag color

  If we add a fourth column, we change **one file** and both Board and TaskCard automatically pick it up.

- **Date/time formatting in `utils.ts:1-7`:**
  `formatTime` is used in `TaskCard.tsx:48`. If we change the format, we edit one function.

**Why it matters:** Every piece of repeated logic is a place where bugs hide. DRY means "fix it once, it's fixed everywhere."

---

## 8. Pure Functions

**Plain words:** A function that always returns the same output for the same input and doesn't change anything outside itself. Like a vending machine — put in the same coins, get the same snack, every time.

| File | Lines | Why it's pure |
|---|---|---|
| `utils.ts` | 1-7 | `formatTime(date)` — Given the same date, always returns the same string. Doesn't modify the date. Doesn't touch files, network, or global state. |
| `utils.ts` | 9-15 | `formatDate(date)` — Same: same input → same output, no side effects. |
| `App.tsx` | 6-29 | `generateSeedTasks()` — Always returns a list of 12 tasks (though with random IDs/times, so it's "effectively pure" for seeding purposes). Doesn't modify anything outside. |
| `App.tsx` | 54-60 | `moveTask(taskId, toColumn)` — Doesn't mutate anything directly. Calls `setTasks` with a transformation function that returns a new array. The inner function `prev.map(...)` is a pure transformation. |

**Why it matters:** Pure functions are predictable, testable, and easy to move around. You never have to wonder "did this function change something behind my back?"

---

## 9. Unidirectional Data Flow (Props Down, Events Up)

**Plain words:** Data flows one way: parent → child (via props). When a child needs to change something, it calls a function that the parent gave it (via a callback prop). Children never change a parent's data directly.

**Exact data flow:**

```
App (owns: tasks, input)
 │
 │  tasks={tasks} ──────────────────── props down
 │  onMove={moveTask} ──────────────── callback down
 │  onDelete={deleteTask} ──────────── callback down
 │
 ▼
Board
 │
 │  columnId, tasks, onMove, onDelete ─ props down
 │
 ├──▶ Column ("Now")
 │     │
 │     │  task, onDelete ───────────── props down
 │     │
 │     └──▶ TaskCard
 │            │
 │            │  user clicks × ─────── onDelete(task.id) ─── events up
 │            │  user drops ────────── onDrop → onMove ───── events up
 │            ▼
 │          App changes state
 │
 ├──▶ Column ("Soon")    ...same pattern
 └──▶ Column ("Later")   ...same pattern
```

**Exact lines for "events up":**

- **Delete:** `TaskCard.tsx:32-34` — `onClick={() => onDelete(task.id)}` → `App.tsx:62-64` — `deleteTask(taskId)`
- **Drop to move:** `Column.tsx:31-36` — `onDrop` reads ID → calls `onMove(taskId, columnId)` → `App.tsx:54-60` — `moveTask(taskId, toColumn)`
- **Enter key:** `App.tsx:50-51` — `handleKeyDown` checks for Enter → calls `addTask()`
- **Type input:** `App.tsx:78-79` — `onChange={(e) => setInput(e.target.value)}` — sends the typed text up to App state

**Why it matters:** With one-way data flow, you always know where data comes from. There's no "which component changed this?" mystery. Debugging is simpler because you follow the arrows.

---

## 10. Encapsulation (Each Component Mind Its Own Business)

**Plain words:** Each component manages its own stuff — its own state, its own styles, its own event handlers. No component messes with another component's internals.

**Exact examples:**

| Component | Encapsulates | Lines |
|---|---|---|
| `Column` | `isDragOver` state — only Column knows if something is hovering over it | `Column.tsx:14` |
| `Column` | `handleDragOver`, `handleDragEnter`, `handleDragLeave`, `handleDrop` — these are Column's private functions | `Column.tsx:17-36` |
| `TaskCard` | `handleDragStart`, `handleDragEnd` — only the card knows how to start/end dragging | `TaskCard.tsx:13-21` |
| `TaskCard` | `columnInfo` — looks up its own column's name and color | `TaskCard.tsx:11` |
| `Board` | The three-column grid — only Board decides how columns are arranged | `Board.tsx:13-23` |
| Each component | Its own CSS file — `.component-name { ... }` — styles are scoped by class name | All `.css` files |

**Why it matters:** If the drag-over highlight is wrong, you fix `Column.tsx` — you don't need to look at `App.tsx` or `TaskCard.tsx`. Encapsulation makes code modular and changes low-risk.

---

## 11. CSS Custom Properties (Theming)

**Plain words:** Define colors once as named variables, then reuse those names everywhere. Like labeling paint cans — use "sky blue" everywhere instead of mixing the exact shade each time.

**Defined in `index.css:3-22`:**
```css
:root {
  --bg: #F5F3EF;
  --accent-now: #D97706;
  --accent-soon: #7C3AED;
  --accent-later: #059669;
  --border: #E8E5E0;
  /* ... etc */
}
```

**Used throughout:**

| File | Lines | Example |
|---|---|---|
| `App.css` | 15, 21, 37, 42, 48, 49, 53, 60 | `color: var(--text-primary)` / `background: var(--accent-now)` |
| `Column.css` | 2, 4, 11, 12, 20, 33 | `background: var(--bg-card)` / `border-color: var(--column-accent)` |
| `TaskCard.css` | 2, 5, 16, 48, 68, 89 | `border: 1px solid var(--border-light)` / `color: var(--danger-text)` |

**Dynamic CSS variable:** `Column.tsx:45` sets a per-column CSS variable:
```tsx
style={{ '--column-accent': columnInfo.accent } as React.CSSProperties}
```
Then `Column.css:11-12` uses it:
```css
.column--drag-over {
  border-color: var(--column-accent);
}
```
Each column gets its own accent color without needing three separate CSS classes.

**Why it matters:** To change the entire app's color scheme, edit the 20 variables in `index.css:4-21`. No hunting through hundreds of CSS lines.

---

## 12. Destructuring (Clean Extraction)

**Plain words:** Instead of writing `props.tasks` and `props.onMove` everywhere, pull the values out by name at the top. Like opening a lunchbox and taking out the sandwich, apple, and juice in one motion.

**Exact lines:**

| File | Lines | Without destructuring | With destructuring |
|---|---|---|---|
| `Board.tsx` | 11 | `function Board(props)` → `props.tasks`, `props.onMove` | `function Board({ tasks, onMove, onDelete })` |
| `Column.tsx` | 13 | `function Column(props)` → `props.columnId`, `props.tasks` | `function Column({ columnId, tasks, onMove, onDelete })` |
| `TaskCard.tsx` | 10 | `function TaskCard(props)` → `props.task`, `props.onDelete` | `function TaskCard({ task, onDelete })` |
| `App.tsx` | 46 | `setTasks(function(prev) { return [...prev, task] })` | `setTasks((prev) => [...prev, task])` — destructuring the parameter |
| `App.tsx` | 79 | `onChange={function(e) { setInput(e.target.value) }}` | `onChange={(e) => setInput(e.target.value)}` |

**Why it matters:** Less repetition means fewer bugs from typing `props.props.props`. The code is shorter and clearer about what each component actually needs.

---

## 13. Early Return / Guard Clause

**Plain words:** Check for "bad" or "empty" conditions at the start of a function and exit immediately. Don't continue processing if there's nothing to do.

**Exact lines:**

```tsx
// App.tsx:36-37
const trimmed = input.trim();
if (!trimmed) return;
```

If the user typed nothing (or only spaces), the function stops immediately. It doesn't waste time creating a task object, generating a UUID, or calling `setTasks`.

**Another example:**
```tsx
// Column.tsx:34-35
const taskId = e.dataTransfer.getData('text/plain');
if (taskId) onMove(taskId, columnId);
```

If no task ID was stored in the drag event (edge case), it doesn't call `onMove`. The `if` guard prevents moving "nothing."

**Why it matters:** Early returns flatten code and reduce nesting. You don't have to read an entire function to understand what happens with empty input — the answer is right at the top.

---

## 14. Responsive Design (Mobile Adapts)

**Plain words:** The app looks good on both a big computer screen and a small phone screen. We use media queries to change the layout when the screen gets narrow.

**Exact lines:**

| File | Lines | What changes on small screens |
|---|---|---|
| `App.css` | 78-94 | `@media (max-width: 640px)` — padding shrinks, input and button stack vertically, both go full width |
| `Board.css` | 8-11 | `@media (max-width: 640px)` — three-column grid becomes single column (tasks stack vertically) |

**Why it matters:** More than half of web traffic is on phones. Without responsive design, users on mobile would see tiny, unusable columns.

---

## 15. Semantic HTML & Accessibility

**Plain words:** Use the right HTML tag for the right job so browsers, screen readers, and keyboards all understand what's what.

**Exact lines:**

| File | Lines | Element | Why this tag |
|---|---|---|---|
| `App.tsx` | 68 | `<header>` | This is a page header — semantic element tells screen readers "this is the top banner" |
| `App.tsx` | 74 | `<input>` | Native text input — keyboards, autofill, and accessibility tools know how to handle it |
| `App.tsx` | 82 | `<button>` | Native button — keyboard-accessible (Tab to focus, Enter/Space to activate) without extra code |
| `TaskCard.tsx` | 33-35 | `aria-label="Delete task"` | Screen readers can't see the × symbol, so this label tells them what the button does |

**Why it matters:** Accessibility isn't optional. `aria-label` on `TaskCard.tsx:35` means a visually impaired person using a screen reader hears "Delete task" instead of "times." Using `<button>` instead of `<div onClick={...}>` means keyboard users can Tab to it and press Enter.

---

## Summary Table

| # | Principle | Where to find it |
|---|---|---|
| 1 | Single Responsibility | Each of the 11 source files has one job |
| 2 | Separation of Concerns | `types.ts` / `utils.ts` / `*.tsx` / `*.css` divide data, logic, rendering, styling |
| 3 | Composition | `App → Board → Column → TaskCard` |
| 4 | Immutability | `App.tsx:46` (`[...prev, task]`), `App.tsx:56` (`{...t, column}`), `App.tsx:63` (`.filter()`) |
| 5 | Type Safety | `types.ts:1-20`, props interfaces throughout |
| 6 | Declarative UI | Every `return (...)` describes what, not how |
| 7 | DRY | `COLUMNS` in `types.ts:16-19` used in 3 files |
| 8 | Pure Functions | `utils.ts:1-15`, `App.tsx:6-29` |
| 9 | Unidirectional Data Flow | Props down (`App → Board → Column → TaskCard`), events up (`onClick → onDelete`, `onDrop → onMove`) |
| 10 | Encapsulation | Each component manages its own state, handlers, and styles |
| 11 | CSS Custom Properties | `index.css:3-22` defines 21 variables, used across all CSS files |
| 12 | Destructuring | `Board.tsx:11`, `Column.tsx:13`, `TaskCard.tsx:10` |
| 13 | Early Return / Guard Clause | `App.tsx:37`, `Column.tsx:35` |
| 14 | Responsive Design | `App.css:78-94`, `Board.css:8-11` |
| 15 | Semantic HTML & Accessibility | `<header>` at `App.tsx:68`, `<button>` at `App.tsx:82`, `aria-label` at `TaskCard.tsx:35` |
