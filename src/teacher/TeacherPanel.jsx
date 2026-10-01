import React, { useEffect, useState } from 'react';
import './teacher.css';

/* ════════ teacher/TeacherPanel.jsx — the teacher's instrument ════════
   A single small tab in the corner; opens to objective / question / expected
   answer (hidden until the teacher reveals it — the class can see the screen)
   / cue, plus scene playback. Not rendered in cinema mode. */

function TeacherPanel({ sceneLabel, teacher, playing, onToggle, onReplay }) {
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState(false);
  useEffect(() => { setReveal(false); }, [teacher.question]);
  useEffect(() => {
    if (!open) return undefined;
    const k = e => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); } };
    window.addEventListener('keydown', k, true);
    return () => window.removeEventListener('keydown', k, true);
  }, [open]);

  return (
    <aside className={'tpanel' + (open ? ' open' : '')} aria-label="Teacher guide">
      <div className="tpanel-bar">
        <button className="tpanel-tab" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="tpanel-body">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>
          Teacher
        </button>
        <button className="tpanel-ctl" onClick={onToggle} aria-label={playing ? 'Pause scene' : 'Play scene'} title={playing ? 'Pause (Space)' : 'Play (Space)'}>
          {playing
            ? <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            : <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>}
        </button>
        <button className="tpanel-ctl" onClick={onReplay} aria-label="Replay this scene" title="Replay scene">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 12a8.5 8.5 0 103-6.5"/><path d="M3 4.5V9h4.5"/></svg>
        </button>
      </div>
      {open && (
        <dl className="tpanel-body" id="tpanel-body">
          <p className="tpanel-scene">{sceneLabel}</p>
          <dt>Objective</dt><dd>{teacher.objective}</dd>
          <dt>Question</dt><dd>{teacher.question}</dd>
          <dt>Expected answer</dt>
          <dd>{reveal
            ? teacher.expected
            : <button className="tpanel-reveal" onClick={() => setReveal(true)}>Show answer</button>}</dd>
          {teacher.explain && <React.Fragment><dt>Explain</dt><dd>{teacher.explain}</dd></React.Fragment>}
          <dt>Teacher cue</dt><dd>{teacher.cue}</dd>
          {teacher.takeaway && <React.Fragment><dt>Key takeaway</dt><dd>{teacher.takeaway}</dd></React.Fragment>}
        </dl>
      )}
    </aside>
  );
}

export { TeacherPanel };
