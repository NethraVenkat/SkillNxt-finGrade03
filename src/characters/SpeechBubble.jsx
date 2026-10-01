import React from 'react';
import './speechBubble.css';

/* ════════ characters/SpeechBubble.jsx — dialogue that lives in the world ════════
   Anchored above the speaker's head (stage units), clamped inside the frame,
   tail pointing back at the speaker. 'dim' keeps a line readable but quiet
   once someone else is talking. `em` segments get the teaching highlight.
   floor (cqh from the ground): never sit lower than this — lets a short
   speaker's line clear taller actors' faces.
   beside: 'left' puts the line beside the face instead of above the head.
   centerX: place the bubble at this x (e.g. frame centre when the camera zooms
   in); the tail still points at the speaker. */

function SpeechBubble({ speaker, width, show, dim, em, lines, id, size, floor = 0, beside, centerX }) {
  const pos = speaker;
  const half = width / 2;
  const x = Math.max(half + 1.5, Math.min(100 - half - 1.5, centerX != null ? centerX : pos.x));
  const tail = Math.max(14, Math.min(86, 50 + ((pos.x - x) / width) * 100));
  /* beside="left": the line sits left of the speaker's face, tail pointing at it —
     for speakers standing high in the frame, where above-the-head has no room */
  const place = beside === 'left'
    ? { left: (pos.x - (pos.gap != null ? pos.gap : 6)) + 'cqw', bottom: (pos.y + pos.h * 0.66) + 'cqh', '--bw': width + 'cqw' }
    : { left: x + 'cqw', bottom: Math.max(pos.y + pos.h + 1.8, floor) + 'cqh', '--bw': width + 'cqw', '--tail': tail + '%' };
  return (
    <div id={id} className={'bubble' + (size ? ' bubble-' + size : '') + (beside ? ' beside-' + beside : '') + (show ? ' on' : '') + (dim ? ' dim' : '') + (em ? ' em' : '')}
      style={place}
      aria-hidden={!show}>
      {lines.map((l, i) => (
        typeof l === 'string'
          ? <span key={i} className="bubble-line">{l}</span>
          : <span key={i} className="bubble-line">{l.map((seg, j) => (
              <span key={j} className={seg.em ? 'bubble-em' : undefined}>{seg.t}</span>))}</span>
      ))}
    </div>
  );
}

export { SpeechBubble };
