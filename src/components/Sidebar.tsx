import { useState, useEffect } from 'react';
import { type ColumnId, COLUMNS } from '../types';
import './Sidebar.css';

export function Sidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function scrollToColumn(columnId: ColumnId) {
    const el = document.getElementById(`column-${columnId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setOpen(false);
  }

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}
      <button
        className="sidebar-hamburger"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
      >
        <span className="sidebar-hamburger-line" />
        <span className="sidebar-hamburger-line" />
        <span className="sidebar-hamburger-line" />
      </button>
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">WS</div>
          <div>
            <div className="sidebar-name">Wahala Sorter</div>
            <div className="sidebar-subtitle">Sort the pile. Win the day.</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-group">
            <span className="sidebar-group-label">Main</span>
            <a
              className="sidebar-item sidebar-item--active"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setOpen(false);
              }}
            >
              <svg className="sidebar-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Board
            </a>
          </div>
          <div className="sidebar-group">
            <span className="sidebar-group-label">Columns</span>
            {COLUMNS.map((col) => (
              <button
                key={col.id}
                className="sidebar-item"
                onClick={() => scrollToColumn(col.id)}
              >
                <span className="sidebar-item-dot" style={{ background: col.accent }} />
                {col.label}
              </button>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
