import { EASE } from './motion';

/* ════════ engine/camera.js — cinematic shots as CSS transforms ════════
   A shot = scale + a focus point (x, y in % of the stage, y from the top).
   The camera never reveals the edge of the world: translation is clamped
   so the scaled layer always covers the frame. */

const SHOT = {
  WIDE: 'WIDE', MEDIUM: 'MEDIUM', CLOSE: 'CLOSE',
  PUSH_IN: 'PUSH_IN', PULL_OUT: 'PULL_OUT', TRACK: 'TRACK', REACTION: 'REACTION',
};

const PRESET = {
  WIDE:     { s: 1,    dur: 1800, ease: EASE.settle },
  MEDIUM:   { s: 1.28, dur: 1600, ease: EASE.settle },
  CLOSE:    { s: 1.7,  dur: 1500, ease: EASE.settle },
  PUSH_IN:  { s: 1.4,  dur: 3800, ease: EASE.drift },   /* slow, deliberate approach */
  PULL_OUT: { s: 1,    dur: 2600, ease: EASE.drift },
  TRACK:    { s: 1.3,  dur: 1700, ease: EASE.track },   /* keep scale, follow laterally */
  REACTION: { s: 1.55, dur: 650,  ease: EASE.snap },    /* quick cut-in on a face */
};

/* frame('CLOSE', {x:30, y:40}, {s:1.9}) → camera description */
function frame(type, focus = { x: 50, y: 50 }, over = {}) {
  const p = PRESET[type];
  if (!p) throw new Error('camera: unknown shot ' + type);
  return { type, s: over.s || p.s, x: focus.x, y: focus.y, dur: over.dur || p.dur, ease: over.ease || p.ease };
}

const clamp = (v, lim) => Math.max(-lim, Math.min(lim, v));

/* transform for one world layer. depth < 1 moves less than the subject
   layer (background parallax); `bleed` is how far the layer overhangs the
   frame on each side, in %, which buys extra room before clamping.
   `coupled`: the layer moves by depth × the SUBJECT layer's clamped offset, so
   when an off-centre shot hits the subject clamp the ground does not keep
   sliding under the actors' feet (never exceeds this layer's own limit). */
function layerStyle(cam, depth = 1, reduced = false, bleed = 0, coupled = false) {
  const s = 1 + (cam.s - 1) * depth;
  const lim = 50 * s - 50 + bleed * s;
  const subj = 50 * cam.s - 50;
  const tx = coupled ? clamp(-cam.s * (cam.x - 50), subj) * depth : clamp(-cam.s * (cam.x - 50) * depth, lim);
  const ty = coupled ? clamp(-cam.s * (cam.y - 50), subj) * depth : clamp(-cam.s * (cam.y - 50) * depth, lim);
  return {
    transform: 'translate3d(' + tx.toFixed(3) + '%,' + ty.toFixed(3) + '%,0) scale(' + s.toFixed(4) + ')',
    transition: reduced ? 'none' : 'transform ' + cam.dur + 'ms ' + cam.ease,
  };
}

export { SHOT, frame, layerStyle };
