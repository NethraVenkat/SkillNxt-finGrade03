import { B, beat } from '../engine/beats';
import { frame } from '../engine/camera';
import { between, faceOf, torsoOf } from './barterStaging';

/* ════════ Scene 03 — "What Did People Do Before Money?" — director sheet ════════
   The same market, straight on from the film of Scene 02. Rupi, watching from
   the side, asks the question; the farmer and the milk seller show the answer
   with their own wheat and milk — the swap path between them becomes BARTER.
   Then Rupi turns to the class: "What have you swapped with a friend?" — the
   children's own swaps wait on two crates, and each one the class names is
   revealed. CONCEPT → EXAMPLE → EXPLANATION → QUESTION → ANSWER → TAKEAWAY. */

const SCRIPT_03 = [
  beat('s3-bridge',  B.MATCH_CUT,   { ms: 1400, rm: 900 }),   /* Scene 02's last frame (cold open) */
  beat('s3-turn',    B.ACTOR_ENTER, { ms: 2600, rm: 1000 }),  /* Rupi turns to the class */
  beat('s3-wonder',  B.DIALOGUE,    { ms: 3600, rm: 3200 }),  /* "What did people do before money?" */
  beat('s3-farmer',  B.DIALOGUE,    { ms: 3400, rm: 3000 }),  /* "I have wheat. Can I get some milk?" */
  beat('s3-seller',  B.DIALOGUE,    { ms: 2600, rm: 2200 }),  /* "I have milk." */
  beat('s3-swap',    B.OBJECT_MOVE, { ms: 3000, rm: 1800 }),  /* the path: wheat → milk */
  beat('s3-barter',  B.CELEBRATION, { ms: 5200, rm: 4600 }),  /* ⇄ BARTER — Rupi claps and says the rule */
  beat('s3-ask',     B.QUESTION),
  beat('s3-solved',  B.CORRECT,     { ms: 3000, rm: 2400 }),
  beat('s3-friends', B.HOLD),                                  /* "What have you swapped with a friend?" */
];

/* where the class's swaps rest (x cqw centre, y cqh floor), and where the grown-ups step to */
const STAGE_03 = {
  wide: {
    watch: { x: 8, y: 2, h: 44 },
    farmerAside: { x: 11, y: 4, h: 70 }, sellerAside: { x: 89, y: 4, h: 70 },
    crates: [{ x: 32, y: 0, w: 16, h: 8 }, { x: 68, y: 0, w: 16, h: 8 }],
    swaps: [{ x: 28, y: 8 }, { x: 36, y: 8 }, { x: 64, y: 8 }, { x: 72, y: 8 }],
    swapSize: 13,
  },
  tall: {
    watch: { x: 50, y: 3, h: 25 },
    farmerAside: { x: 22, y: 30, h: 40 }, sellerAside: { x: 78, y: 30, h: 40 },
    crates: [{ x: 29, y: 8, w: 40, h: 6 }, { x: 71, y: 8, w: 40, h: 6 }],
    swaps: [{ x: 19, y: 14 }, { x: 39, y: 14 }, { x: 61, y: 14 }, { x: 81, y: 14 }],
    swapSize: 10,
  },
};

function direct03(beatId, { spots, layout, answer }) {
  const F = spots.farmer, S = spots.seller, R = spots.rupi, st = STAGE_03[layout];
  /* while the grown-ups show the swap, Rupi watches from where the path cannot cross a face:
     the edge of the market (wide), or the front of the frame below the traders (phones) */
  const watch = st.watch;
  const d = {
    cam: frame('WIDE', { x: 50, y: 50 }), mood: 'neutral',
    farmer: { pos: F.home, state: 'idle', walkMs: 1500 },
    seller: { pos: S.home, state: 'idle', walkMs: 1500 },
    rupi: { pos: watch, state: 'idle', walkMs: 1600 },
    bubbles: {}, rupiSays: null, diagram: 'off', ask: false, swaps: false, takeaway: false,
  };
  switch (beatId) {
    case 's3-bridge':
      d.farmer.state = 'sad';
      d.seller.state = 'protect';
      d.rupi = layout === 'tall' ? null : { pos: watch, state: 'think' };
      d.mood = 'quiet';
      break;
    case 's3-turn':
      d.cam = frame('MEDIUM', layout === 'tall' ? { x: 50, y: 62 } : between(faceOf(watch), faceOf(F.home)), { s: layout === 'tall' ? 1.02 : 1.1, dur: 2000 });
      d.farmer.state = 'sad';
      d.rupi = { pos: watch, state: layout === 'tall' ? 'walk' : ['surprised'], enter: layout === 'tall' ? -60 : null, walkMs: 2000 };
      break;
    case 's3-wonder':
      d.cam = frame('MEDIUM', layout === 'tall' ? { x: 50, y: 58 } : between(faceOf(watch), faceOf(F.home)), { s: layout === 'tall' ? 1.02 : 1.1, dur: 1400 });
      d.rupi.state = ['think', 'talk'];
      d.rupiSays = 'wonder';
      break;
    case 's3-farmer':
      d.cam = frame('MEDIUM', between(faceOf(F.home), { x: 50, y: 40 }), { s: layout === 'tall' ? 1 : 1.1, dur: 1500 });
      d.farmer.state = ['offer', 'talk'];
      d.rupi.state = 'lean';
      d.bubbles.farmer = 'on';
      break;
    case 's3-seller':
      d.cam = frame('MEDIUM', between({ x: 50, y: 40 }, faceOf(S.home)), { s: layout === 'tall' ? 1 : 1.1, dur: 1500 });
      d.farmer.state = 'offer';
      d.seller.state = ['offer', 'talk'];
      d.bubbles = { farmer: 'dim', seller: 'on' };
      break;
    case 's3-swap':
      d.cam = frame('WIDE', { x: 50, y: 50 }, { dur: 1600 });
      d.farmer.state = 'offer';
      d.seller.state = 'offer';
      d.rupi.state = 'lean';
      d.diagram = 'full';
      break;
    case 's3-barter':
      d.cam = frame('WIDE', { x: 50, y: 50 });
      d.farmer.state = 'nod';
      d.seller.state = 'nod';
      d.rupi.state = 'cheer';
      d.diagram = 'works';
      d.takeaway = true;
      d.mood = 'bright';
      break;
    case 's3-ask':
      /* the grown-ups and Rupi step apart so the question never covers a face */
      d.farmer = { pos: st.farmerAside, state: 'idle', walkMs: 1300 };
      d.seller = { pos: st.sellerAside, state: 'idle', walkMs: 1300 };
      d.rupi = layout === 'tall' ? { pos: R.centre, state: 'think', walkMs: 1500 } : { pos: R.aside, state: answer.pick ? 'think' : 'lean', walkMs: 1500 };
      d.ask = true;
      break;
    case 's3-solved':
      d.farmer = { pos: st.farmerAside, state: 'nod' };
      d.seller = { pos: st.sellerAside, state: 'nod' };
      d.rupi = layout === 'tall' ? { pos: R.centre, state: 'cheer' } : { pos: R.aside, state: 'cheer' };
      d.ask = true;
      d.mood = 'bright';
      break;
    case 's3-friends':
      d.cam = frame('WIDE', { x: 50, y: 50 }, { dur: 1600 });
      d.farmer = { pos: st.farmerAside, state: 'idle' };
      d.seller = { pos: st.sellerAside, state: 'idle' };
      d.rupi = { pos: R.centre, state: answer.swapped ? 'cheer' : ['point', 'talk'], walkMs: 1500 };
      d.rupiSays = answer.swapped ? 'swapped' : 'friends';
      d.swaps = true;
      d.takeaway = answer.swapped;
      break;
    default:
  }
  return d;
}

export { SCRIPT_03, STAGE_03, direct03 };
