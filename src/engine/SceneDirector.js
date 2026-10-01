import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from './motion';

/* ════════ engine/SceneDirector.js — beat timeline ════════
   A scene is a list of beats (engine/beats.js): { id, kind, ms, rm, hold }.
   Timed beats advance by themselves; hold beats wait for the scene
   (an answer, a Continue). Under prefers-reduced-motion `rm` is used.

   Exactly one timeout exists at any moment. It is cleared on pause, reset,
   goTo and unmount — nothing keeps running after the scene is gone.

   gate(nextBeatId) → boolean: before advancing into a beat, the director asks
   whether that beat is ready (e.g. an entering actor's art is decoded). If not,
   it re-checks every 100 ms — through the same single timer, so pause and
   cancel still apply — for at most GATE_MAX ms, then goes on regardless: a
   missing image must never stall the lesson. */

const GATE_STEP = 100;
const GATE_MAX = 1500;

function useSceneDirector(script, { start, gate } = {}) {
  const reduced = useReducedMotion();
  const indexOf = useCallback(id => {
    const i = script.findIndex(b => b.id === id);
    if (i < 0) throw new Error('SceneDirector: unknown beat "' + id + '"');
    return i;
  }, [script]);

  const [st, setSt] = useState(() => ({ i: start ? indexOf(start) : 0, playing: true, epoch: 0 }));
  const timer = useRef(null);
  const clock = useRef({ startedAt: 0, dur: 0, remaining: null, waited: 0 });
  const gateRef = useRef(gate);
  gateRef.current = gate;

  const beat = script[st.i];

  useEffect(() => {
    if (!st.playing || beat.hold) return undefined;
    const full = reduced && beat.rm != null ? beat.rm : beat.ms;
    const arm = ms => {
      clock.current = { ...clock.current, startedAt: performance.now(), dur: ms, remaining: null };
      timer.current = setTimeout(fire, ms);
    };
    const fire = () => {
      timer.current = null;
      const next = script[st.i + 1];
      const g = gateRef.current;
      if (next && g && !g(next.id) && clock.current.waited < GATE_MAX) {
        clock.current.waited += GATE_STEP;
        arm(GATE_STEP);
        return;
      }
      clock.current.waited = 0;
      setSt(s => (s.i < script.length - 1 ? { ...s, i: s.i + 1 } : s));
    };
    arm(clock.current.remaining != null ? clock.current.remaining : full);
    return () => { clearTimeout(timer.current); timer.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.i, st.playing, st.epoch, beat, reduced, script]);

  /* remaining time of the current step, captured at the moment of pausing */
  const capture = () => {
    const c = clock.current;
    clock.current = { ...c, remaining: Math.max(0, c.dur - (performance.now() - c.startedAt)) };
  };
  const pause = useCallback(() => {
    setSt(s => { if (!s.playing) return s; capture(); return { ...s, playing: false }; });
  }, []);
  const play = useCallback(() => setSt(s => (s.playing ? s : { ...s, playing: true })), []);
  const toggle = useCallback(() => setSt(s => { if (s.playing) capture(); return { ...s, playing: !s.playing }; }), []);
  const goTo = useCallback(id => {
    clock.current = { ...clock.current, remaining: null, waited: 0 };
    setSt(s => ({ i: indexOf(id), playing: true, epoch: s.epoch + 1 }));
  }, [indexOf]);
  const next = useCallback(() => {
    clock.current = { ...clock.current, remaining: null, waited: 0 };
    setSt(s => ({ ...s, i: Math.min(s.i + 1, script.length - 1), epoch: s.epoch + 1 }));
  }, [script.length]);
  const reset = useCallback(id => goTo(id || script[0].id), [goTo, script]);

  /* at('x') → current beat is x or later; handy for "stays visible from here on" */
  const at = useCallback(id => st.i >= indexOf(id), [st.i, indexOf]);
  const between = useCallback((a, b) => st.i >= indexOf(a) && st.i <= indexOf(b), [st.i, indexOf]);

  /* dev-only: count live directors so lifecycle QA can prove there is one */
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    window.__mqDirectorCount = (window.__mqDirectorCount || 0) + 1;
    return () => { window.__mqDirectorCount -= 1; };
  }, []);

  return useMemo(() => ({
    beat: beat.id, kind: beat.kind, index: st.i, epoch: st.epoch, playing: st.playing, reduced,
    play, pause, toggle, goTo, next, reset, at, between,
  }), [beat.id, beat.kind, st.i, st.epoch, st.playing, reduced, play, pause, toggle, goTo, next, reset, at, between]);
}

export { useSceneDirector };
