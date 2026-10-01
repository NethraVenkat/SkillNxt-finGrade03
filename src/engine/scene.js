import { useCallback, useEffect, useRef } from 'react';
import { useMotionFreeze } from './motion';
import { preloadImages, preloadStats } from './preload';
import { useSceneDirector } from './SceneDirector';
import { entryBeat, useStoryTransition } from './TransitionManager';
import { useStageLayout } from '../world/Plate';

/* ════════ engine/scene.js — the cinematic scene contract ════════

   Every cinematic scene (or continuous take of scenes) is described by a
   CONTRACT object and brought to life with useCinematicScene(). The hook owns
   everything that must behave the same in every scene; the scene owns only
   what makes it unique — its composition, its direction, its words.

   CONTRACT
     name      'barter'                      — for errors and QA
     script    [beat(...), ...]              — director sheet (engine/beats.js)
     preload   [src, ...]                    — images this scene needs (and only these)
     needs     { beatId: [src, ...] }        — art that must be decoded before a
                                               beat begins (e.g. an actor's entrance)
     direct    (beatId, ctx) → direction     — camera / actors / light / objects /
                                               dialogue / question per beat
   The take (which lesson steps share this world) is declared in
   engine/TransitionManager.js; the hook enters on the right beat.

   LIFECYCLE (what the hook guarantees)
     mount      → stage measured, director created on the entry beat
     preload    → scene images requested + decoded off the main thread (after first paint)
     establish / camera / actors / environment → scene renders direct(beat)
     scripted beats → one director timer; decode gate before `needs` beats
     interaction / question / feedback → hold beats; the scene calls director.goTo()
     completion → the scene calls its onSolved / onAdvance props
     pause      → timer stopped AND in-flight world motion frozen; resume continues
     cleanup    → timer cleared, listeners removed, preload released, freeze undone

   Returns { stageRef, layout, aspect, director, rootProps }.
   Put rootProps on the scene's root <section>. */

function useCinematicScene(contract, { scene, onEnter, onQa } = {}) {
  const [stageRef, { layout, aspect }] = useStageLayout();

  /* preload: this scene's art only; released when the scene unmounts */
  const pre = useRef(null);
  useEffect(() => {
    const all = [...(contract.preload || []), ...Object.values(contract.needs || {}).flat()];
    pre.current = preloadImages(all);
    return () => { pre.current.dispose(); pre.current = null; };
  }, [contract]);

  const gate = useCallback(id => {
    const need = contract.needs && contract.needs[id];
    return !need || !pre.current || need.every(src => pre.current.isReady(src));
  }, [contract]);

  const director = useSceneDirector(contract.script, { start: entryBeat(scene), gate });
  useStoryTransition(scene, director, onEnter);
  useMotionFreeze(stageRef, !director.playing);

  /* Space pauses the film — but never hijacks a focused control */
  useEffect(() => {
    const k = e => {
      if (e.code !== 'Space') return;
      const t = e.target;
      if (t && t.closest && t.closest('button,a,input,textarea,select,[contenteditable]')) return;
      e.preventDefault();
      director.toggle();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [director.toggle]);

  /* dev-only QA: window.__mqDirector, and deep links ?qa=<beat>&hold=<ms>&wrong=1 */
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    window.__mqDirector = director;
    window.__mqPreloadStats = preloadStats;
    return () => { if (window.__mqDirector === director) delete window.__mqDirector; };
  }, [director]);
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    const p = new URLSearchParams(window.location.search);
    const b = p.get('qa');
    if (!b || !contract.script.some(x => x.id === b)) return undefined;   /* a beat of another scene: ignore */
    if (onQa) onQa(b, p);
    director.goTo(b);
    if (!p.get('hold')) return undefined;
    const t = setTimeout(() => director.pause(), +p.get('hold'));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rootProps = {
    ref: stageRef,
    'data-beat': director.beat,
    'data-focus-home': '',          /* Choice hands focus back here when a question leaves */
    tabIndex: -1,
  };
  return { stageRef, layout, aspect, director, rootProps };
}

export { useCinematicScene };
