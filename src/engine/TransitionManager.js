import { useEffect, useRef } from 'react';

/* ════════ engine/TransitionManager.js — story-driven scene changes ════════
   Some scenes are one continuous take (the same world stays mounted and the
   camera carries us across). The registry says which; the hook tells the
   director which beat to enter on:
     • arriving from the previous scene of the same take → its bridge beat
     • arriving any other way (menu, Back, deep link)    → its cold-open beat
   The shell asks isContinuous() so it never lays a generic wipe over a
   choreographed transition. */

const TAKES = [
  /* 02 → 03: the market film carries straight on into "before money" */
  { scenes: [2, 3], entry: { 2: { cold: 's2-slate' }, 3: { cold: 's3-bridge', from2: 's3-turn' } } },
  { scenes: [4], entry: { 4: { cold: 's4-establish' } } },
  { scenes: [5, 6, 7, 8], entry: {
    5: { cold: 's5-establish' },
    6: { cold: 's6-bridge', from5: 's6-bridge' },
    7: { cold: 's7-recall', from6: 's7-recall' },
    8: { cold: 's8-follow', from7: 's8-follow' },
  } },
  { scenes: [9], entry: { 9: { cold: 's9-establish' } } },
  { scenes: [10], entry: { 10: { cold: 's10-establish' } } },
  { scenes: [11], entry: { 11: { cold: 's11-coin' } } },
  { scenes: [12], entry: { 12: { cold: 's12-establish' } } },
  /* 13 → 18: each opens on the previous scene's last frame (a match cut), so no wipe between them */
  { scenes: [13, 14, 15, 16, 17, 18], entry: { 13: { cold: 's13-establish' }, 14: { cold: 's14-bridge' }, 15: { cold: 's15-bridge' }, 16: { cold: 's16-bridge' }, 17: { cold: 's17-bridge' }, 18: { cold: 's18-bridge' } } },
];

const takeOf = n => TAKES.find(t => t.scenes.includes(n));
const isContinuous = (a, b) => { const t = takeOf(a); return !!t && t.scenes.includes(b); };

/* first scene's entry beat, for the director's initial state */
function entryBeat(scene) { return takeOf(scene).entry[scene].cold; }

function useStoryTransition(scene, director, onEnter) {
  const prev = useRef(scene);
  useEffect(() => {
    const from = prev.current;
    prev.current = scene;
    if (from === scene) return;
    const e = takeOf(scene).entry[scene];
    const beat = (from === scene - 1 && e['from' + from]) || e.cold;
    onEnter && onEnter(scene, from);
    director.goTo(beat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);
}

export { entryBeat, isContinuous, useStoryTransition };
