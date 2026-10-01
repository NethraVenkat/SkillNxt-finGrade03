import { useEffect, useLayoutEffect, useState } from 'react';

/* ════════ engine/motion.js — shared motion vocabulary ════════
   One set of easings and durations so camera, actors and objects move with
   the same "hand". Everything animates transform/opacity only. */

const EASE = {
  settle: 'cubic-bezier(.22,.7,.25,1)',   /* camera arriving on a subject */
  drift:  'cubic-bezier(.35,.1,.3,1)',    /* slow push-in / pull-out */
  track:  'cubic-bezier(.45,.05,.35,1)',  /* lateral follow */
  snap:   'cubic-bezier(.2,.9,.25,1)',    /* reaction cut-in */
  walk:   'cubic-bezier(.4,.1,.35,1)',
  heavy:  'cubic-bezier(.55,.05,.45,1)',  /* tired / reluctant movement */
};

const DUR = {
  quick: 450,
  beat: 900,
  walk: 1900,
  slowWalk: 2600,
};

/* live prefers-reduced-motion flag; listener is removed on unmount */
function useReducedMotion() {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [reduced, setReduced] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on));
  }, []);
  return reduced;
}

/* Freeze the filmed world while the director is paused.
   Camera moves, walks, poses, gestures and light are CSS transitions/animations;
   the browser exposes each as an Animation object, so pausing them holds every
   in-flight movement exactly where it is, and play() continues from that point.
   Only the world layers are frozen — questions, buttons and the teacher panel
   stay responsive. `selector` picks the frozen layers inside the scene root. */
function useMotionFreeze(rootRef, paused, selector = '.world-layer, .env') {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!paused || !root) return undefined;
    const held = [];
    root.querySelectorAll(selector).forEach(layer => {
      if (!layer.getAnimations) return;
      layer.getAnimations({ subtree: true }).forEach(a => {
        if (a.playState === 'running') { a.pause(); held.push(a); }
      });
    });
    return () => held.forEach(a => { if (a.playState === 'paused') a.play(); });
  }, [paused, rootRef, selector]);
}

export { DUR, EASE, useMotionFreeze, useReducedMotion };
