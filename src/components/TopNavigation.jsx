import React from 'react';
import { I } from './icons';
import { LESSON } from '../data/lessonData';
import { Explore } from '../pages/Explore';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
/* ══════════════ components/TopNavigation.jsx ══════════════ */
const NAV = ["Home","Learn","Play","Explore"];
function TopNav({ view, onNav, onFull, onLogin }) {
  return (
    <header className="topbar">
      <div className="brand"><span className="brand-coin">₹</span><span className="brand-name">{LESSON.brand}</span></div>
      <nav className="mainnav">
        {NAV.map(n => (
          <button key={n} className={view === n.toLowerCase() ? "on" : ""} onClick={() => onNav(n.toLowerCase())}>{n}</button>
        ))}
      </nav>
      <div className="navright">
        <button className="navbtn icon" onClick={onFull} title="Fullscreen (Esc to exit)" aria-label="Fullscreen">{I.full}</button>
        <button className="navbtn login" onClick={onLogin}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>
          Login
        </button>
      </div>
    </header>
  );
}

export { NAV, TopNav };
