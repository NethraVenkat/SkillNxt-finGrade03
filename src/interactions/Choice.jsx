import React, { useEffect, useLayoutEffect, useRef } from 'react';
import './interactions.css';

/* ════════ interactions/Choice.jsx — the class answers a question ════════
   Screen-space, low in the frame, between the actors — never a centred card.
   The parent owns the answer state so the world (actors, light, camera) can
   respond to it; this component only reports picks.

   answer: { pick: id|null, attempt: n } */

function Choice({ id, question, choices, answer, feedback, onPick, onContinue, continueLabel }) {
  const correct = choices.find(c => c.correct);
  const solved = answer.pick === correct.id;
  const wrong = answer.pick && !solved;
  const qRef = useRef(null);
  const contRef = useRef(null);
  const rootRef = useRef(null);

  /* when the question leaves the frame while it holds keyboard focus, hand focus
     back to the scene (layout cleanup runs before the node is removed) */
  useLayoutEffect(() => () => {
    const r = rootRef.current;
    if (r && r.contains(document.activeElement)) {
      const home = r.closest('[data-focus-home]');
      if (home) home.focus({ preventScroll: true });
    }
  }, []);

  /* move keyboard focus with the story: to the question when it arrives,
     to Continue once it is answered — but never steal focus from a pointer user */
  useEffect(() => {
    const kb = document.documentElement.dataset.mqInput === 'key';
    if (kb && qRef.current) qRef.current.focus();
  }, []);
  useEffect(() => {
    const kb = document.documentElement.dataset.mqInput === 'key';
    if (solved && kb && contRef.current) contRef.current.focus();
  }, [solved]);

  return (
    <div ref={rootRef} className={'choice' + (solved ? ' solved' : '')} role="group" aria-labelledby={id + '-q'}>
      <p className="choice-q" id={id + '-q'} ref={qRef} tabIndex={-1}>{question}</p>
      <div className="choice-opts">
        {choices.map((c, i) => {
          const isPick = answer.pick === c.id;
          const cls = 'choice-opt' + (isPick && c.correct ? ' right' : '') + (isPick && !c.correct ? ' wrong' : '');
          return (
            <button key={c.id} className={cls}
              onClick={() => onPick(c.id)} disabled={solved && !c.correct}
              aria-pressed={isPick}>
              {/* the inner row re-mounts per attempt to replay the nudge; the button keeps focus */}
              <span className="choice-opt-in" key={isPick && !c.correct ? answer.attempt : 0}>
                <b aria-hidden="true">{String.fromCharCode(65 + i)}</b>
                <span>{c.label}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className={'choice-fb' + (solved ? ' ok' : wrong ? ' retry' : '')} aria-live="polite">
        {solved ? feedback.correct : wrong ? feedback.retry : ''}
      </p>
      {solved && onContinue && (
        <button ref={contRef} className="choice-next" onClick={onContinue}>
          {continueLabel}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.8"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      )}
    </div>
  );
}

/* remembers whether the teacher is driving with keyboard or pointer, so focus
   can follow the story for keyboard users only */
function useInputModality() {
  useEffect(() => {
    const root = document.documentElement;
    const key = e => { if (e.key === 'Tab' || e.key.startsWith('Arrow') || e.key === ' ' || e.key === 'Enter') root.dataset.mqInput = 'key'; };
    const ptr = () => { root.dataset.mqInput = 'pointer'; };
    window.addEventListener('keydown', key, true);
    window.addEventListener('pointerdown', ptr, true);
    return () => { window.removeEventListener('keydown', key, true); window.removeEventListener('pointerdown', ptr, true); };
  }, []);
}

export { Choice, useInputModality };
