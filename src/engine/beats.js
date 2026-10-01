/* ════════ engine/beats.js — the cinematic beat vocabulary ════════
   A beat is one line of a scene's director sheet:  { id, kind, ms, rm, hold }.
   `kind` says what the beat is FOR; it supplies deterministic default timing
   (full motion and reduced motion) so sheets read like a shot list:

     beat('s5-offer', B.PUSH_IN, { ms: 4200 })
     beat('s5-ask',   B.QUESTION)                 → holds for the class

   The kind never animates anything by itself — the scene's direct() function
   decides camera, actors, light and objects for each beat. Timing, cancel,
   pause/resume and cleanup belong to the SceneDirector; freezing in-flight
   motion belongs to useMotionFreeze (engine/motion.js). */

const B = {
  /* camera */
  WIDE: 'WIDE', MEDIUM: 'MEDIUM', CLOSE: 'CLOSE', PUSH_IN: 'PUSH_IN', PULL_OUT: 'PULL_OUT',
  TRACK: 'TRACK', REACTION: 'REACTION', MATCH_CUT: 'MATCH_CUT',
  /* actors & objects */
  ACTOR_ENTER: 'ACTOR_ENTER', ACTOR_EXIT: 'ACTOR_EXIT', OBJECT_FOCUS: 'OBJECT_FOCUS', OBJECT_MOVE: 'OBJECT_MOVE',
  DIALOGUE: 'DIALOGUE',
  /* world */
  LIGHT_CHANGE: 'LIGHT_CHANGE', ENVIRONMENT_REACTION: 'ENVIRONMENT_REACTION',
  /* teaching */
  QUESTION: 'QUESTION', CORRECT: 'CORRECT', WRONG: 'WRONG', CELEBRATION: 'CELEBRATION',
  HOLD: 'HOLD',
};

/* default timing per kind: [ms, reduced-motion ms]; null ms = waits (hold) */
const TIMING = {
  WIDE: [2600, 1800], MEDIUM: [2200, 1500], CLOSE: [2400, 1600], PUSH_IN: [3800, 2400], PULL_OUT: [2600, 1600],
  TRACK: [2200, 1200], REACTION: [1600, 1000], MATCH_CUT: [2200, 1400],
  ACTOR_ENTER: [2600, 900], ACTOR_EXIT: [2000, 700], OBJECT_FOCUS: [2200, 1400], OBJECT_MOVE: [2300, 900],
  DIALOGUE: [3600, 3000],          /* reading time — barely shortened: words still need reading */
  LIGHT_CHANGE: [1800, 900], ENVIRONMENT_REACTION: [2000, 1200],
  QUESTION: [null, null], CORRECT: [3000, 2000], WRONG: [null, null], CELEBRATION: [2600, 1600],
  HOLD: [null, null],
};

function beat(id, kind, over = {}) {
  if (!TIMING[kind]) throw new Error('beat "' + id + '": unknown kind ' + kind);
  const [ms, rm] = TIMING[kind];
  const b = { id, kind, ms: over.ms != null ? over.ms : ms, rm: over.rm != null ? over.rm : rm };
  b.hold = over.hold != null ? over.hold : b.ms == null;
  if (!b.hold && b.rm == null) b.rm = b.ms;
  return b;
}

/* sanity-check a sheet once, in development: unique ids, known kinds, timings present */
function checkScript(name, script) {
  const seen = new Set();
  script.forEach(b => {
    if (seen.has(b.id)) throw new Error(name + ': duplicate beat id ' + b.id);
    seen.add(b.id);
    if (!b.hold && !(b.ms > 0)) throw new Error(name + ': beat ' + b.id + ' has no duration');
  });
  return script;
}

export { B, beat, checkScript };
