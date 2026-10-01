import { B, beat } from '../engine/beats';
import { frame } from '../engine/camera';
import { DUR, EASE } from '../engine/motion';
import { between, faceOf, torsoOf } from './barterStaging';

/* ════════ Scene 05 — "Uh-Oh! A Problem" — director sheet ════════
   ARRIVE → OBSERVE → ACTION → REACTION → ASK → UNDERSTAND.
   The question only arrives after the failed trade has played out. */

const SCRIPT_05 = [
  beat('s5-establish', B.WIDE,        { ms: 2600, rm: 1800 }),  /* the market, two traders */
  beat('s5-offer',     B.PUSH_IN,     { ms: 4200, rm: 3400 }),  /* farmer offers wheat, speaks */
  beat('s5-notice',    B.TRACK,       { ms: 1700, rm: 1200 }),  /* seller looks at the wheat… pauses */
  beat('s5-reject',    B.REACTION,    { ms: 4200, rm: 3400 }),  /* seller shakes head, guards the milk, speaks */
  beat('s5-travel',    B.OBJECT_MOVE, { ms: 2300, rm: 900 }),   /* the wheat is carried right up to the seller */
  beat('s5-stop',      B.REACTION,    { ms: 1600, rm: 1000 }),  /* STOP. refused again, closer */
  beat('s5-return',    B.OBJECT_MOVE, { ms: 2900, rm: 900 }),   /* the wheat goes slowly back */
  beat('s5-slump',     B.CLOSE,       { ms: 2400, rm: 1600 }),  /* farmer: lowered, disappointed; light cools */
  beat('s5-ask',       B.QUESTION),                             /* teacher question — holds */
  beat('s5-solved',    B.HOLD),                                 /* understood — waits for Continue */
];

/* everything the world does on each beat of Scene 05 */
function direct05(beat, { spots, answer }) {
  const F = spots.farmer, S = spots.seller;
  const d = {
    cam: frame('WIDE'), mood: 'neutral',
    farmer: { pos: F.home, state: 'idle' },
    seller: { pos: S.home, state: 'idle' },
    rupi: null,
    bubbles: { farmer: 'off', seller: 'off', sellerEm: false },
    ask: false, diagram: 'off',
  };
  switch (beat) {
    case 's5-establish':
      d.cam = frame('WIDE', { x: 50, y: 48 });
      break;
    case 's5-offer':
      d.cam = frame('PUSH_IN', faceOf(F.step), { s: 1.38 });
      d.farmer = { pos: F.step, state: ['offer', 'talk'], walkMs: 1400 };
      d.seller.state = 'lean';
      d.bubbles.farmer = 'on';
      break;
    case 's5-notice':
      d.cam = frame('TRACK', torsoOf(S.home), { s: 1.34 });
      d.farmer = { pos: F.step, state: 'offer' };
      d.seller.state = 'think';
      /* the farmer's line has been heard; don't leave a clipped bubble at the frame edge */
      break;
    case 's5-reject':
      d.cam = frame('REACTION', faceOf(S.home), { s: 1.5 });
      d.farmer = { pos: F.step, state: 'offer' };
      d.seller.state = ['protect', 'reject', 'talk'];
      d.bubbles = { farmer: 'off', seller: 'on', sellerEm: false };
      break;
    case 's5-travel':
      d.cam = frame('MEDIUM', between(torsoOf(F.near), torsoOf(S.home)), { s: 1.2, dur: 2200, ease: EASE.track });
      d.farmer = { pos: F.near, state: ['offer', 'walk'], walkMs: DUR.walk + 300 };
      d.seller.state = 'protect';
      /* the walk is the action — the heard line steps aside (it drifted under the teacher tab) */
      break;
    case 's5-stop':
      d.cam = frame('REACTION', between(faceOf(F.near), faceOf(S.home)), { s: 1.42 });
      d.farmer = { pos: F.near, state: 'offer' };
      d.seller.state = ['protect', 'reject'];
      d.bubbles.seller = 'dim';
      break;
    case 's5-return':
      d.cam = frame('TRACK', torsoOf(F.home), { s: 1.24, dur: DUR.slowWalk, ease: EASE.heavy });
      d.farmer = { pos: F.home, state: ['sad', 'walk'], walkMs: DUR.slowWalk, walkEase: EASE.heavy };
      d.seller.state = 'idle';
      d.mood = 'quiet';
      break;
    case 's5-slump':
      d.cam = frame('CLOSE', faceOf(F.home), { s: 1.5, dur: 1800 });
      d.farmer = { pos: F.home, state: 'sad' };
      d.mood = 'quiet';
      break;
    case 's5-ask':
      d.cam = frame('WIDE', { x: 50, y: 50 }, { dur: 1400 });
      d.farmer = { pos: F.home, state: answer.pick ? 'think' : 'sad' };
      d.seller.state = 'protect';
      d.mood = 'quiet';
      d.ask = true;
      break;
    case 's5-solved':
      d.cam = frame('WIDE', { x: 50, y: 50 }, { dur: 1400 });
      d.farmer = { pos: F.home, state: 'nod' };
      d.seller.state = 'nod';
      d.bubbles = { farmer: 'off', seller: 'on', sellerEm: true };
      d.ask = true;
      break;
    default:
  }
  return d;
}

export { SCRIPT_05, direct05 };
