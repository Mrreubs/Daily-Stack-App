# Wahala Sorter — Code Audit

This is an honest look at what's wrong (or could be better) in the codebase. Every issue comes with a fix and the reasoning behind it. Think of this as a mentor looking over your shoulder, not a report card.

---

## Vulnerabilities

### 1. Non-null assertion on COLUMNS.find(...) — silent crash risk

**Where:** Column.tsx:15 and TaskCard.tsx:11

```tsx
const columnInfo = COLUMNS.find((c) => c.id === columnId)!;
```

`find(...)` returns `ColumnInfo | undefined`. The `!` (non-null assertion) tells TypeScript "trust me, it's never undefined." But if a task somehow ends up with a column ID that does not exist in COLUMNS (say you add a fourth column to the Task type but forget to update the COLUMNS array), the app crashes with "Cannot read properties of undefined." TypeScript will not warn you because `!` silenced the warning.

**Fix:**
```tsx
const columnInfo = COLUMNS.find((c) => c.id === columnId);
if (!columnInfo) return null;
```

**Why it works:** Instead of crashing the whole app when data is inconsistent, the component returns `null` (renders nothing). A missing column is easier to debug than a white screen. If you ever add a new column type but forget to define its color, you will see a gap on the board rather than a crash.

### 2. No input validation

**Where:** App.tsx:36-37

```tsx
const trimmed = input.trim();
if (!trimmed) return;
```

This only checks for empty input. Nothing stops a user from pasting 10,000 characters, or adding JavaScript as a task title. React escapes XSS in JSX, but layout breaking from long strings is still an issue.

**Fix:**
```tsx
const trimmed = input.trim();
if (!trimmed || trimmed.length > 200) return;
```

**Why it works:** A 200-character cap prevents layout-breaking long titles. Adding `maxLength={200}` on the `<input>` enforces this at the UI level too, giving the user instant feedback instead of a silent ignore.

---

## Performance Traps

### 3. tasks.filter(...) creates three new arrays on every render

**Where:** Board.tsx:18

```tsx
tasks={tasks.filter((t) => t.column === col.id)}
```

Every time the Board renders (every time any state changes in App), `filter` runs three times once for each column. With 12 seed tasks this is invisible. With 1000+ tasks it becomes noticeable.

**Fix:**
```tsx
import { useMemo } from 'react';

export function Board({ tasks, onMove, onDelete }: BoardProps) {
  const byNow = useMemo(() => tasks.filter((t) => t.column === 'now'), [tasks]);
  const bySoon = useMemo(() => tasks.filter((t) => t.column === 'soon'), [tasks]);
  const byLater = useMemo(() => tasks.filter((t) => t.column === 'later'), [tasks]);
  ...
}
```

**Why it works:** `useMemo` only recomputes the filtered arrays when `tasks` actually changes. If something else triggers a re-render (like typing in the input box), the filter does not run it returns the cached array. Columns do not get new array references, so they skip re-rendering too.

### 4. Function references recreated on every render

**Where:** App.tsx:35-64

```tsx
function addTask() { ... }
function moveTask(...) { ... }
function deleteTask(...) { ... }
```

These are defined inside the component body, so brand-new functions are created every render. They get passed through Board, Column, and TaskCard as props. Since they are new references each time, `React.memo` cannot help child components skip re-renders.

**Fix:**
```tsx
import { useCallback } from 'react';

const addTask = useCallback(() => {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 200) return;
  setTasks((prev) => [...prev, { id: crypto.randomUUID(), title: trimmed, column: 'now', createdAt: new Date() }]);
  setInput('');
}, [input]);

const moveTask = useCallback((taskId: string, toColumn: ColumnId) => {
  setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, column: toColumn } : t));
}, []);

const deleteTask = useCallback((taskId: string) => {
  setTasks((prev) => prev.filter((t) => t.id !== taskId));
}, []);
```

**Why it works:** `useCallback` returns the same function reference as long as dependencies have not changed. `moveTask` and `deleteTask` never change (empty dependency array). `addTask` depends on `input` because it reads `input.trim()`, so it only changes when the input text changes. Combined with `React.memo`, this stops cascading re-renders.

### 5. Unnecessary new Date() wrapper

**Where:** TaskCard.tsx:48

```tsx
Added {formatTime(new Date(task.createdAt))}
```

`task.createdAt` is already a `Date` object (the Task interface says `createdAt: Date`). Wrapping it in `new Date(...)` creates a useless copy.

**Fix:**
```tsx
Added {formatTime(task.createdAt)}
```

**Why it works:** Zero reason to wrap a Date in another Date. `formatTime` accepts `Date` objects and `task.createdAt` already is one. Less garbage for the garbage collector.

### 6. Card fade-in animation on drag remount

**Where:** TaskCard.css:11

```css
animation: card-fade-in 0.2s ease-out;
```

When you drag a card to another column, React unmounts it from the source column and mounts it in the target column. The animation runs again causing a distracting re-appearance effect.

**Fix:** Remove the animation from `.task-card` or only apply it to newly created tasks via a state flag.

**Why it works:** Animations are for new items, not rearranged items. By skipping the animation on drag-moves, the UI feels snappy during drag and polished when adding. The user's eye does not chase fading cards during drag operations.

---

## Accessibility Misses

### 7. Input has no associated label

**Where:** App.tsx:74-81

```tsx
<input className="add-input" type="text" placeholder="Add a task..." />
```

Placeholder text disappears when the user types. Screen readers may announce just "edit text" with no context. Clicking a label should focus the input, but there is no label.

**Fix:**
```tsx
<label htmlFor="new-task" className="sr-only">New task</label>
<input id="new-task" className="add-input" type="text" placeholder="Add a task..." />
```

Where `.sr-only` is:
```css
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
```

**Why it works:** Screen readers announce "New task, edit text" when the input receives focus. The label can be visually hidden but still accessible. Placeholders are not labels they disappear.

### 8. Drag-and-drop is keyboard-inaccessible

**Where:** Column.tsx:39-45 and TaskCard.tsx:24-28

The HTML5 Drag and Drop API only works with a mouse or touch. Keyboard users, switch users, and voice-control users cannot move tasks. They can only delete them.

**Fix (short-term):** Add direction buttons on each card for moving between columns.

**Fix (long-term):** Replace HTML5 drag with `@dnd-kit/sortable` which supports keyboard reordering (arrow keys) out of the box.

**Why it works:** If you cannot move tasks with a keyboard, you cannot use the app's core feature. Even simple directional buttons unlock the app for everyone.

### 9. Color contrast fails WCAG AA

**Where:** index.css:11

```css
--text-muted: #A8A29E;
```

On the background `--bg: #F5F3EF`, `#A8A29E` has a contrast ratio of roughly 2.8:1. WCAG AA requires 4.5:1 for normal text and 3:1 for large text. Timestamps and empty-state text will be hard to read.

**Fix:**
```css
--text-muted: #8C8883;
--text-hint: #B0ACA7;
```

**Why it works:** Darkening `--text-muted` to `#8C8883` pushes contrast above 4.5:1 against the cream background. Subtle change, big readability win.

### 10. No aria-live region for dynamic content

When a task is added or deleted, there is no announcement for screen readers. A blind user types a task, presses Enter, and gets no confirmation.

**Fix:**
```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {tasks.length} tasks total
</div>
```

**Why it works:** `aria-live="polite"` tells the screen reader to announce changes when idle. The user hears "14 tasks total" whenever the task list changes giving them confirmation.

### 11. No form element

**Where:** App.tsx:73-85

The input and button are in a `<div>`, not a `<form>`. This means no implicit form submission, no form role for screen readers, and no `onSubmit` handler.

**Fix:**
```tsx
<form className="add-bar" onSubmit={(e) => { e.preventDefault(); addTask(); }}>
  <input ... />
  <button type="submit" className="add-btn">Add</button>
</form>
```

Then remove the `onKeyDown` handler on the input (Enter submits the form natively).

**Why it works:** Screen readers announce the form role. Enter submits natively no JavaScript needed. One `onSubmit` handler replaces both the click and keydown handlers.

### 12. Column count not labeled for screen readers

**Where:** Column.tsx:50

```tsx
<span className="column-count">{tasks.length}</span>
```

A screen reader announces "3" with no context.

**Fix:**
```tsx
<span className="column-count" aria-label={`${tasks.length} tasks in ${columnInfo.label}`}>
  {tasks.length}
</span>
```

**Why it works:** The user hears "14 tasks in Now" instead of just "14". Visual users still see the compact number.

---

## Software Engineering Principles Violated

### 13. Hardcoded old repo name in vite.config.ts

**Where:** vite.config.ts:6

```ts
base: '/Daily-Stack-App/',
```

This is from the old repo name. If you rename the GitHub repo to Wahala-Sorter, GitHub Pages serves the app at `/Wahala-Sorter/`. All assets will 404.

**Fix:** Change to `base: '/Wahala-Sorter/'` after renaming the repo.

**Why it works:** The `base` in Vite prefixes all asset URLs. If it does not match the repo name, the browser looks for assets in the wrong place and gets 404s.

### 14. Dead code formatDate is exported but never used

**Where:** utils.ts:9-15

```tsx
export function formatDate(date: Date): string { ... }
```

Defined and exported but never imported by any component.

**Fix:** Delete it.

**Why it works:** Dead code increases cognitive load. Every new developer reads it and wonders "where is this used? Do I need to update it?" Deleting removes the question. Git history preserves it if needed later.

### 15. Dead CSS variables shadow-sm and bg-active are never used

**Where:** index.css:8 and index.css:15

```css
--bg-active: #FFF7ED;
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
```

Left over from the previous version (Daily Stack). Never referenced in any current CSS file.

**Fix:** Remove them.

**Why it works:** Orphan variables suggest untidy code. Clean theme = maintainable theme. Every line someone has to mentally skip is a cost for no benefit.

### 16. Magic string text/plain repeated in two files

**Where:** TaskCard.tsx:14 and Column.tsx:34

```tsx
e.dataTransfer.setData('text/plain', task.id);
const taskId = e.dataTransfer.getData('text/plain');
```

A bare string with no name explaining why it is there. Change one but not the other and drag-and-drop breaks silently.

**Fix:**
```tsx
// In types.ts
export const DRAG_DATA_KEY = 'application/wahala-task-id';
```

Then import and use it in both files.

**Why it works:** A named constant is a single source of truth. Change it once and both files update. The format `application/wahala-task-id` (MIME-like custom type) is also more descriptive than `text/plain`.

### 17. Props drilling through Board

**Where:** Board.tsx:19-20

Board receives `onMove` and `onDelete` just to pass them straight to Column, which passes `onDelete` straight to TaskCard. Data flows through components that do not use it.

**Fix (for this scale):** It is fine for 3 levels. If the tree grows deeper, use React Context:
```tsx
const TaskCtx = React.createContext(...);
// App provides, TaskCard consumes directly
```

**Why it works:** Context lets TaskCard access `onDelete` without Board or Column having to carry it. But for 3 levels of nesting, explicit props are clearer than context. Do not refactor until the drilling reaches 4-5 levels.

### 18. Old app name in package.json

**Where:** package.json:2

```json
"name": "daily-stack-app"
```

Does not affect functionality but is misleading.

**Fix:** Change to `"wahala-sorter"`.

**Why it works:** Consistency. The package name should match the app. Minor but a sign of a tidy codebase.

### 19. No error boundaries

**Where:** main.tsx:6-9

```tsx
createRoot(document.getElementById('app')!).render(<StrictMode><App /></StrictMode>);
```

If any component throws an error during rendering, React unmounts the entire tree. The user sees a blank screen.

**Fix:**
```tsx
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? <div>Something went wrong. Reload.</div> : this.props.children;
  }
}
```
Then wrap `<App />` in `<ErrorBoundary>`.

**Why it works:** Error boundaries catch rendering errors and show a fallback UI instead of crashing the whole app. One corrupt task object cannot take down the entire app.

### 20. COLUMNS not type-checked against ColumnId

**Where:** types.ts:1 vs types.ts:16-19

```tsx
export type ColumnId = 'now' | 'soon' | 'later';

export const COLUMNS = [ { id: 'now', ... }, { id: 'soon', ... }, { id: 'later', ... } ];
```

TypeScript does not enforce that COLUMNS covers every value of ColumnId. If you add `'urgent'` to ColumnId but forget to add it to COLUMNS, there is no compiler error until the app crashes at runtime.

**Fix:**
```tsx
export const COLUMNS = [
  { id: 'now', label: 'Now', accent: '#D97706' },
  { id: 'soon', label: 'Soon', accent: '#7C3AED' },
  { id: 'later', label: 'Later', accent: '#059669' },
] as const satisfies { id: ColumnId; label: string; accent: string }[];
```

**Why it works:** `satisfies` checks that every item conforms to the expected shape. If ColumnId gains a new value not in COLUMNS, TypeScript produces a compile-time error. The bug surfaces at `tsc` time not in production.

---

## Summary

| # | Issue | Category | Severity | Lines |
|---|---|---|---|---|
| 1 | Non-null assertion crash risk | Vulnerability | High | Column.tsx:15, TaskCard.tsx:11 |
| 2 | No input length validation | Vulnerability | Low | App.tsx:36-37 |
| 3 | Filter recreates arrays on every render | Performance | Medium | Board.tsx:18 |
| 4 | Function references recreated every render | Performance | Low | App.tsx:35-64 |
| 5 | Unnecessary new Date() wrapper | Performance | Low | TaskCard.tsx:48 |
| 6 | Card animation on drag remount | Performance | Low | TaskCard.css:11 |
| 7 | Input has no label | Accessibility | High | App.tsx:74-81 |
| 8 | DnD not keyboard accessible | Accessibility | Critical | Column.tsx:39-45 |
| 9 | Color contrast fails WCAG AA | Accessibility | High | index.css:11 |
| 10 | No aria-live for dynamic content | Accessibility | Medium | (missing) |
| 11 | No form element | Accessibility | Medium | App.tsx:73-85 |
| 12 | Column count not labeled | Accessibility | Low | Column.tsx:50 |
| 13 | Hardcoded old repo base path | Principle Violation | High | vite.config.ts:6 |
| 14 | Dead code (formatDate) | Principle Violation | Low | utils.ts:9-15 |
| 15 | Dead CSS variables | Principle Violation | Low | index.css:8,15 |
| 16 | Magic string text/plain | Principle Violation | Low | TaskCard.tsx:14, Column.tsx:34 |
| 17 | Props drilling | Principle Violation | Low | Board.tsx:19-20 |
| 18 | Old package name | Principle Violation | Low | package.json:2 |
| 19 | No error boundaries | Principle Violation | High | main.tsx:6-9 |
| 20 | COLUMNS not type-checked against ColumnId | Principle Violation | Medium | types.ts:1,16-19 |
