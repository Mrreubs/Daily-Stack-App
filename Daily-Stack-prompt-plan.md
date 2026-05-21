# Wahala Sorter — AI Build Prompt Plan

> "Sort the pile. Win the day."

---

## ROLE

You are a senior frontend engineer and product designer. Build a complete, working single-page React application called **Wahala Sorter** — a drag-and-drop daily priority board built for Lagos builders who need to sort their chaos fast.

---

## WHAT TO BUILD

A single-page React app with three Kanban-style columns: **Now**, **Soon**, and **Later**. Users can add tasks, drag them between columns, and delete them. No backend. All state lives in memory (React `useState`).

---

## FUNCTIONAL REQUIREMENTS

1. **Three columns** — `Now`, `Soon`, `Later` — displayed side-by-side on desktop, stacked on mobile.
2. **Add a task** — A text input (with a submit button or Enter key) at the top of each column, OR a single global input that defaults to `Now`. Task titles must not be empty.
3. **Task card** displays:
   - Task title
   - The column it currently lives in (as a small badge)
   - Timestamp of when it was added (e.g. `"Added 2:34 PM"`)
4. **Drag and drop** — Tasks can be dragged from any column and dropped into any other column. Use the **native HTML5 Drag API** (`draggable`, `onDragStart`, `onDragOver`, `onDrop`). No external DnD library needed.
5. **Delete** — Each task card has an `×` button that removes it from state.
6. **Column task count** — Each column header shows how many tasks it currently holds (e.g. `Now (3)`).

---

## DATA MODEL

```ts
interface Task {
  id: string;           // crypto.randomUUID() or Date.now().toString()
  title: string;
  column: 'now' | 'soon' | 'later';
  createdAt: Date;
}
```

State: `const [tasks, setTasks] = useState<Task[]>([])`

---

## DESIGN DIRECTION — "Lagos Workdesk"

Flat design. Calm. Focused. Not a toy. This is a tool someone opens at 7am before the generator goes off.

### Colour Palette

| Swatch | Hex | Role |
|--------|-----|------|
| Background | `#F5F0E8` | Warm off-white, like ruled paper |
| Now accent | `#D94F3D` | Urgent red-orange |
| Soon accent | `#E8A838` | Amber |
| Later accent | `#4A7C6F` | Muted teal |
| Card background | `#FFFFFF` | Clean white |
| Body text | `#1A1A1A` | Near-black |
| Muted text | `#888888` | Timestamps, badges |
| Border | `#E0D9CE` | Subtle warm grey |

### Typography

- **Headings:** `Syne` (Google Fonts) — bold, editorial
- **Timestamps & badges:** `DM Mono` — grounded, functional
- **Body/task text:** `system-ui` fallback stack

### Layout

- Max width `1100px`, centered
- Columns equal width, `gap: 24px`, `padding: 24px`
- Column header: accent color left-border (`4px solid`) + column name in `Syne` bold + count badge
- Task card: `border-radius: 6px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`, `padding: 12px 14px`
- Active drag target column gets a subtle dashed border highlight

### Micro-interactions

- Card being dragged: `opacity: 0.5`, `cursor: grabbing`
- Drop zone when dragging over: highlight border color matches column accent
- Delete button only visible on card hover (`opacity: 0` → `opacity: 1` on `:hover`)
- New card fades in with a quick `opacity 0→1` transition (150ms)

### Header

- App title: `WAHALA SORTER` in `Syne`, large, bold, left-aligned
- Tagline beneath: `"Sort the pile. Win the day."` in small muted text

---

## STACK

- React (functional components, hooks only)
- TypeScript
- Tailwind CSS **or** plain CSS-in-JS via `style` props / a `<style>` tag — your choice, but the design must match the spec above
- No external DnD library
- No backend, no localStorage — memory only

---

## FILE STRUCTURE (suggested)

```
src/
  App.tsx          ← root component, holds state
  components/
    Board.tsx      ← renders 3 columns
    Column.tsx     ← column header + task list + add input + drop zone
    TaskCard.tsx   ← individual card with drag, delete, timestamp
  types.ts         ← Task interface + column types
  utils.ts         ← formatTime helper
```

---

## EDGE CASES TO HANDLE

- Empty input → do not add task, shake the input field subtly
- Dropping a task onto its own column → no-op, no state change
- Long task titles → truncate with `...` at 2 lines (`-webkit-line-clamp: 2`)
- Mobile: columns stack vertically; drag-and-drop degrades gracefully (or show a "tap to move" fallback)

---

## SEED DATA (optional, for demo)

Pre-populate with 3 sample tasks so the board isn't empty on load:

```ts
{ title: "Reply Emeka's message", column: 'now' }
{ title: "Review the invoice", column: 'soon' }
{ title: "Recharge DSTV", column: 'later' }
```

---

## DELIVERABLE

A fully working React app. Every feature above must function. The board should feel calm, fast, and purposeful — like a tool built for real life, not a portfolio demo.



seperate css from components

the name should be Daily Stack