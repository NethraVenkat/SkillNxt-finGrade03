import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './banknote.css';

/* ════════ currency/InteractiveBanknote.jsx — a note you can pick up ════════
   Blueprint §17. The supplied front/back artwork is mounted on a thin 3D card:
   two faces (backface hidden) plus four paper edges, so turning it shows real
   thickness. Faces are never crossfaded — the card physically rotates.

     drag  horizontal → rotateY, vertical → rotateX; release → damped settle
           to the nearest face
     tap   → physical 180° flip (and back again)
     keys  ← → turn · ↑ ↓ tilt · Enter/Space flip · Esc put back
     focusOnOpen  picked up by keyboard → the card takes focus
     from  DOMRect of the note on the table: the card flies up from there, and
           flies back there when put down (skipped under reduced motion)

   Drag writes the transform straight to the element — no React render per
   pointer move. React state changes only when the visible face changes. */

const EDGE = 0.9;          /* paper thickness, % of card width (slightly generous so it reads) */

function InteractiveBanknote({ note, front, back, from, getHome, reduced, onClose, onFace, closeRef, focusOnOpen }) {
  const flyRef = useRef(null), cardRef = useRef(null);
  const rot = useRef({ x: 0, y: 0 });
  const drag = useRef(null);
  const [face, setFace] = useState('front');

  const apply = (ms, ease) => {
    const el = cardRef.current; if (!el) return;
    el.style.transition = ms && !reduced ? 'transform ' + ms + 'ms ' + (ease || 'cubic-bezier(.2,1.25,.35,1)') : 'none';
    el.style.transform = 'rotateX(' + rot.current.x + 'deg) rotateY(' + rot.current.y + 'deg)';
    const f = ((Math.round(rot.current.y / 180) % 2) + 2) % 2 === 1 ? 'back' : 'front';
    setFace(p => (p === f ? p : f));
  };
  useEffect(() => { if (onFace) onFace(face); }, [face, onFace]);

  /* picked up with the keyboard: the note itself takes focus (arrows turn it) */
  useEffect(() => { if (focusOnOpen && cardRef.current) cardRef.current.focus({ preventScroll: true }); }, [focusOnOpen]);

  /* fly up from the table */
  useLayoutEffect(() => {
    const el = flyRef.current;
    if (!el || !from || reduced || !el.animate) return undefined;
    const to = el.getBoundingClientRect();
    const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    const s = Math.max(0.05, from.width / to.width);
    const a = el.animate([
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ') rotateX(52deg)', offset: 0 },
      { transform: 'translate(' + dx * 0.35 + 'px,' + (dy * 0.35 - to.height * 0.12) + 'px) scale(' + (s + (1 - s) * 0.6) + ') rotateX(18deg)', offset: 0.55 },
      { transform: 'none', offset: 1 },
    ], { duration: 760, easing: 'cubic-bezier(.3,.7,.25,1)' });
    return () => a.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* put back: fly down to where the note lies, then hand control back */
  const closing = useRef(false);
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const el = flyRef.current, home = getHome && getHome();
    if (!el || !home || reduced || !el.animate) { onClose(); return; }
    rot.current = { x: 0, y: Math.round(rot.current.y / 360) * 360 };   /* land face up */
    apply(420, 'ease-out');
    const to = el.getBoundingClientRect();
    const dx = (home.left + home.width / 2) - (to.left + to.width / 2);
    const dy = (home.top + home.height / 2) - (to.top + to.height / 2);
    const s = Math.max(0.05, home.width / to.width);
    const a = el.animate([{ transform: 'none' },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ') rotateX(52deg)' }],
      { duration: 560, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' });
    a.onfinish = () => onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getHome, onClose, reduced]);
  useEffect(() => { if (closeRef) closeRef.current = close; }, [close, closeRef]);

  const flip = () => { rot.current = { x: 0, y: rot.current.y + 180 }; apply(900, 'cubic-bezier(.45,.05,.3,1)'); };

  const down = e => {
    if (e.button != null && e.button !== 0) return;
    drag.current = { px: e.clientX, py: e.clientY, x: rot.current.x, y: rot.current.y, moved: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = e => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.px, dy = e.clientY - d.py;
    d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
    rot.current = { y: d.y + dx * 0.55, x: Math.max(-55, Math.min(55, d.x - dy * 0.45)) };
    apply(0);
  };
  const up = () => {
    const d = drag.current; if (!d) return;
    drag.current = null;
    if (d.moved < 6) { flip(); return; }                           /* a tap flips */
    rot.current = { x: 0, y: Math.round(rot.current.y / 180) * 180 }; /* settle on a face */
    apply(650);
  };
  const key = e => {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'ArrowRight') { rot.current.y += k === 'ArrowLeft' ? -30 : 30; apply(300, 'ease-out'); }
    else if (k === 'ArrowUp' || k === 'ArrowDown') { rot.current.x = Math.max(-45, Math.min(45, rot.current.x + (k === 'ArrowUp' ? 15 : -15))); apply(300, 'ease-out'); }
    else if (k === 'Enter' || k === ' ') flip();
    else if (k === 'Escape') { e.stopPropagation(); close(); return; }
    else return;
    e.preventDefault(); e.stopPropagation();
  };
  /* keyboard turning leaves the card at an angle; settle it when focus leaves */
  const blur = () => { rot.current = { x: 0, y: Math.round(rot.current.y / 180) * 180 }; apply(500); };

  return (
    <div className="bn" style={{ '--edge': EDGE + '%' }}>
      <div className="bn-fly" ref={flyRef}>
        <div className="bn-card" ref={cardRef} tabIndex={0} role="img"
          aria-label={'₹' + note.v + ' note, ' + face + ' side. Drag or use arrow keys to turn it, Enter to flip, Escape to put it back.'}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key} onBlur={blur}>
          <span className="bn-face bn-front"><img src={front} alt="" draggable="false"/></span>
          <span className="bn-face bn-back"><img src={back} alt="" draggable="false"/></span>
          <span className="bn-edge bn-edge-t"/><span className="bn-edge bn-edge-b"/>
          <span className="bn-edge bn-edge-l"/><span className="bn-edge bn-edge-r"/>
        </div>
      </div>
      <div className="bn-caption">
        <span className="bn-name"><b>₹{note.v}</b> note · {face}</span>
        <span className="bn-hint">Drag to turn · tap to flip</span>
        <span className="bn-actions">
          <button type="button" onClick={flip}>Flip</button>
          <button type="button" onClick={close}>Put back</button>
        </span>
      </div>
    </div>
  );
}

export { InteractiveBanknote };
