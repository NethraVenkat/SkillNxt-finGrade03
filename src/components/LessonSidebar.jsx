import React from 'react';
import { I } from './icons';
import { LESSON, SCENES } from '../data/lessonData';
/* ════════ components/LessonSidebar.jsx ════════ */
function Sidebar({ open, index, progress, onPick, onExit, completed }) {
  return (
    /* a closed list is off-screen or zero-width — `inert` keeps its buttons out of the Tab order */
    <aside className={"sidebar" + (open ? " open" : " closed")} inert={open ? undefined : ""}>
      <div className="backrow">
        <button className="backbtn" onClick={onExit}>{I.prev} All 18 scenes</button>
      </div>
      <div className="lesson-head">
        <div className="eyebrow">{LESSON.course}<br/>{LESSON.module}</div>
        <h1 className="lesson-title">{LESSON.title}</h1>
        <div className="lesson-meta">
          {I.clock}<span>{LESSON.minutes} minutes</span>
          <i className="dotsep"/><span>{SCENES.length} scenes</span>
          <i className="dotsep"/><span>{SCENES[index].m}min</span>
        </div>
        <div className="track"><i style={{ width: progress + "%" }}/></div>
      </div>
      <nav className="scenelist">
        {SCENES.map((s,i) => {
          const cur = i === index;
          return (
            <button key={s.n} className={"scene-row" + (cur ? " current" : "")}
              onClick={() => onPick(i)} aria-current={cur ? "step" : undefined}>
              <span className="num">{s.n}</span>
              <span className="mark">{cur ? I.playSm : (completed && completed.includes(i)
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3FD48A" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                : I.coinDot)}</span>
              <span className="txt">
                <span className="t">{s.t}</span>
                <span className="s">{I.clock}{s.m} min</span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export { Sidebar };
