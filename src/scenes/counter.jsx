import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MoneyBody, RIM } from '../currency/MoneyBody';
import './scene13.css';
import './scene15.css';
import './scene16.css';
import '../interactions/interactions.css';
import './counter.css';

/* ════════ scenes/counter.jsx — Rupi's money counter (Scenes 09–11) ════════
   The same long wooden counter at the edge of the village market that Scenes
   13–18 are filmed at, so the money lessons live in one physical place:
     Counter     the table (2D trapezoid + apron — Scene 13's construction)
     Piece       a supplied coin / note on a 3D body, standing, lying or held up
     Board       a slate board hung on two ropes over the counter (chalk writing)
     Tag         a small wooden label resting on the counter in front of a piece
     CounterAsk  the class's answers: wooden tags on the table's front edge
   Solid colours, borders and transforms only — no filter, no blur, no backdrop-filter. */

function Counter({ table }) {
  return (
    <div className="c13-table" style={{ '--apron': table.apron + 'cqh', '--top': table.top + 'cqh' }} aria-hidden="true">
      <div className="c13-surface"><i/><i/><i/><i/><span className="c13-farshade"/></div>
      <div className="c13-apron">{[1, 2, 3, 4, 5].map(k => <i key={k} style={{ left: (k * 100 / 6) + '%' }}/>)}</div>
    </div>
  );
}

/* one piece of money.
   state: 'off' (waiting outside, offset by `from`) | 'stand' | 'laid' (lying on the table) | 'held' (lifted towards the class)
   size: coin diameter / note width, in cqh.  turning: one slow full turn.  drag: the class can turn it by hand. */
function Piece({ item, at, size, state, from = { dx: 0, dy: 14 }, turning, bright, still = true, delay = 0,
                 label, onPick, disabled, nope, drag, reduced, z }) {
  const coin = item.kind === 'coin';
  const place = state === 'off' ? { x: at.x + from.dx, y: at.y + from.dy } : at;
  const [rot, setRot] = useState(0);
  const [snap, setSnap] = useState(true);
  const grip = useRef(null);
  useEffect(() => { setRot(0); }, [state, item.kind, item.i]);

  const down = e => { if (!drag) return; grip.current = { x: e.clientX, r: rot, moved: 0 }; setSnap(false); e.currentTarget.setPointerCapture(e.pointerId); };
  const move = e => {
    if (!grip.current) return;
    const dx = e.clientX - grip.current.x;
    grip.current.moved = Math.max(grip.current.moved, Math.abs(dx));
    setRot(grip.current.r + dx * 0.6);
  };
  const up = () => {
    if (!grip.current) return;
    const moved = grip.current.moved; grip.current = null; setSnap(true);
    setRot(r => Math.round(r / 180) * 180 + (moved < 5 ? 180 : 0));      /* settle to a face; a tap flips it */
  };

  const cls = 'c13-obj c13-' + item.kind + ' is-' + (state === 'held' ? 'stand' : state) + (state === 'held' ? ' cp-held' : '')
    + (turning ? ' turning' : '') + (bright ? ' bright' : '') + (still && !turning ? ' cp-still' : '')
    + (onPick && !disabled ? ' cp-live' : '') + (drag ? ' cp-drag' : '') + (nope ? ' cp-nope' : '');
  const style = {
    '--w': size + 'cqh', '--rim': RIM[coin ? item.i : 0] || '#8A6E44', zIndex: z,
    transform: 'translate3d(calc(' + place.x + 'cqw - 50%), ' + (-place.y) + 'cqh, 0)',
    transition: reduced ? 'none' : undefined, transitionDelay: reduced ? undefined : delay + 's',
  };
  const body = (
    <React.Fragment>
      <span className="c13-shadow"/>
      <div className="c13-roll" style={{ transform: 'rotateY(' + rot + 'deg)', transition: snap && !reduced ? undefined : 'none' }}>
        <div className="c13-lay"><MoneyBody kind={item.kind} i={item.i} sheen={bright}/></div>
      </div>
      <span className="c13-ring"/>
    </React.Fragment>
  );
  if (!onPick) return <div className={cls} style={style} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>{body}</div>;
  return (
    <button type="button" className={cls} style={style} aria-label={label} aria-disabled={disabled || undefined}
      onClick={() => { if (!disabled && !drag) onPick(); }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      {body}
    </button>
  );
}

/* keep a speech bubble inside the visible frame: the camera may be zoomed off-centre
   (mirrors engine/camera.js layerStyle for the subject layer). x, w in cqw → the bubble's centre x */
function fitX(cam, x, w) {
  const s = cam.s, lim = 50 * s - 50;
  const tx = Math.max(-lim, Math.min(lim, -s * (cam.x - 50)));
  const left = 50 + (-50 - tx) / s, right = 50 + (50 - tx) / s;
  return Math.max(left + w / 2 + 1.5, Math.min(right - w / 2 - 1.5, x));
}

/* a slate board hung over the counter: chalk writing, a wooden frame, two ropes */
function Board({ box, down, children, label }) {
  return (
    <div className={'c16-sign cp-board' + (down ? ' down' : '')} role={label ? 'img' : undefined} aria-label={label}
      style={{ left: (box.x - box.w / 2) + 'cqw', width: box.w + 'cqw', bottom: box.y + 'cqh', height: box.h + 'cqh' }}>
      <span className="c16-rope l"/><span className="c16-rope r"/>
      <div className="cp-slate">{children}</div>
    </div>
  );
}

/* a small wooden label resting on the counter */
function Tag({ at, on, children, gold, wide }) {
  return (
    <span className={'cp-tag' + (on ? ' on' : '') + (gold ? ' gold' : '') + (wide ? ' wide' : '')} aria-hidden={!on}
      style={{ left: at.x + 'cqw', bottom: at.y + 'cqh' }}>{children}</span>
  );
}

/* the class's answers: printed question + wooden tags on the table's front edge.
   tags: [{ id, label, icon }]; picked: ids already chosen (multi) or the right one;
   miss: { id, n } a wrong tag this time; live: answers accepted. `children` sits under the tags (e.g. Continue). */
function CounterAsk({ id, question, kicker, tags = [], picked = [], miss, live = true, onPick, children, grid, inline }) {
  const ref = useRef(null);
  useLayoutEffect(() => () => {
    const r = ref.current;
    if (r && r.contains(document.activeElement)) {
      const home = r.closest('[data-focus-home]');
      if (home) home.focus({ preventScroll: true });
    }
  }, []);
  useEffect(() => {
    if (document.documentElement.dataset.mqInput !== 'key' || !ref.current) return;
    const b = ref.current.querySelector('button:not([aria-disabled="true"])');
    if (b && !ref.current.contains(document.activeElement)) b.focus({ preventScroll: true });
  }, [id]);
  const arrows = e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const bs = [...ref.current.querySelectorAll('.c13-tag')];
    const i = bs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length].focus();
  };
  return (
    <div ref={ref} className={'c13-ask cp-ask' + (grid ? ' grid' : '') + (inline ? ' inline' : '')} role="group"
      aria-labelledby={question ? id + '-q' : undefined} aria-label={question ? undefined : kicker} onKeyDown={arrows}>
      {question && (
        <p className="c13-q" id={id + '-q'}>
          {kicker && <small>{kicker}</small>}
          {question}
        </p>
      )}
      {tags.length > 0 && (
        <div className={'c13-tags cp-tags' + (live ? '' : ' is-waiting')}>
          {tags.map(t => {
            const got = picked.includes(t.id), wrong = miss && miss.id === t.id;
            return (
              <button key={t.id} type="button" aria-disabled={!live || undefined} aria-pressed={got}
                className={'c13-tag' + (got ? ' is-right' : '') + (wrong ? ' is-wrong' : '')}
                onClick={() => live && onPick(t.id)}>
                <span className="c13-tag-in" key={wrong ? miss.n : 0}>
                  {t.icon && <i aria-hidden="true">{t.icon}</i>}<b>{t.label}</b>
                </span>
              </button>
            );
          })}
        </div>
      )}
      {children}
    </div>
  );
}

/* a gold "carry on" button, sitting in the ask area */
function Next({ onClick, children, autoFocus }) {
  const ref = useRef(null);
  useEffect(() => {
    if (autoFocus && document.documentElement.dataset.mqInput === 'key' && ref.current) ref.current.focus({ preventScroll: true });
  }, [autoFocus]);
  return (
    <button ref={ref} type="button" className="choice-next cp-next" onClick={onClick}>
      {children}
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.8"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
    </button>
  );
}

export { Board, Counter, CounterAsk, Next, Piece, Tag, fitX };
