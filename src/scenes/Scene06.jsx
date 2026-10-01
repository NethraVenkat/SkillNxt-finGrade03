import React from 'react';
import { B, beat } from '../engine/beats';
import { frame } from '../engine/camera';
import { DUR, EASE } from '../engine/motion';
import { between, faceOf, topPt } from './barterStaging';
import './scene06.css';

/* ════════ Scene 06 — "Both People Must Want the Trade" — director sheet ════════
   Emerges from Scene 05: the camera lands on the returned wheat, follows the
   path it tried to take, and pulls out as that path becomes the lesson:
            FARMER  wheat ───────✕─────── milk  MILK SELLER            */

const SCRIPT_06 = [
  beat('s6-bridge',  B.MATCH_CUT,   { ms: 2200, rm: 1400 }),  /* close on the wheat that came back */
  beat('s6-track',   B.TRACK,       { ms: 2300, rm: 1200 }),  /* camera follows the wheat's path to centre */
  beat('s6-compose', B.PULL_OUT,    { ms: 3400, rm: 2600 }),  /* farmer left, path, seller right */
  beat('s6-cross',   B.DIALOGUE,    { ms: 3800, rm: 3000 }),  /* seller refuses — the path breaks: ✕ */
  beat('s6-ask',     B.QUESTION),
  beat('s6-solved',  B.CORRECT,     { ms: 3000, rm: 2000 }),  /* both want it → path completes, light opens */
  beat('s6-rupi',    B.ACTOR_ENTER, { ms: 2600, rm: 900 }),   /* Rupi walks in (art decoded first) */
  beat('s6-teach',   B.CELEBRATION, { hold: true }),          /* Rupi says the rule — holds */
];

function direct06(beat, { spots, layout, answer, wheatAt }) {
  const F = spots.farmer, S = spots.seller, R = spots.rupi;
  const centre = { x: 50, y: 50 };
  const d = {
    cam: frame('WIDE', centre), mood: 'neutral',
    farmer: { pos: F.left, state: 'idle', walkMs: 1600 },
    seller: { pos: S.right, state: 'idle', walkMs: 1600 },
    rupi: null,
    bubbles: { farmer: 'off', seller: 'off', sellerEm: false, rupi: false },
    ask: false, diagram: 'off',
  };
  switch (beat) {
    case 's6-bridge':
      /* the wheat is where Scene 05 left it: in the farmer's arms, at home */
      d.cam = frame('CLOSE', topPt(wheatAt(F.home)), { s: 1.8, dur: 1300 });
      d.farmer = { pos: F.home, state: 'lean' };
      d.seller.pos = S.home;
      d.mood = 'quiet';
      d.diagram = 'wheat';
      break;
    case 's6-track':
      d.cam = frame('TRACK', { x: 50, y: topPt(wheatAt(F.left)).y }, { s: 1.45, dur: 2200, ease: EASE.track });
      d.farmer.state = 'lean';
      d.diagram = 'reach';
      break;
    case 's6-compose':
      d.cam = frame('PULL_OUT', centre);
      d.farmer.state = ['offer', 'talk'];
      d.bubbles.farmer = 'on';
      d.diagram = 'full';
      break;
    case 's6-cross':
      /* on a phone the whole exchange must stay in frame — hold the wide */
      d.cam = layout === 'tall' ? frame('WIDE', centre, { dur: 1200 })
                                : frame('MEDIUM', between(faceOf(S.right), centre), { s: 1.12, dur: 1400 });
      d.farmer.state = 'offer';
      d.seller.state = ['protect', 'reject', 'talk'];
      d.bubbles = { farmer: 'dim', seller: 'on', sellerEm: true, rupi: false };
      d.diagram = 'cross';
      d.mood = 'quiet';
      break;
    case 's6-ask':
      d.cam = frame('WIDE', centre, { dur: 1400 });
      d.farmer.state = answer.pick ? 'think' : 'offer';
      d.seller.state = 'protect';
      d.bubbles = { farmer: 'dim', seller: 'dim', sellerEm: true, rupi: false };
      d.diagram = 'cross';
      d.ask = true;
      break;
    case 's6-solved':
      d.cam = frame('PULL_OUT', { x: 50, y: 48 }, { dur: 2200 });
      d.farmer.state = 'cheer';
      d.seller.state = 'nod';
      d.diagram = 'works';
      d.mood = 'bright';
      d.ask = true;
      break;
    case 's6-rupi':
      d.farmer.state = 'idle';
      d.rupi = { pos: R.centre, state: 'walk', walkMs: DUR.walk + 500, from: R.off };
      d.diagram = 'gone';
      d.mood = 'bright';
      break;
    case 's6-teach':
      d.farmer.state = 'nod';
      d.seller.state = 'nod';
      d.rupi = { pos: R.centre, state: ['point', 'cheer'] };
      d.bubbles.rupi = true;
      d.diagram = 'gone';
      d.mood = 'bright';
      break;
    default:
  }
  return d;
}

/* WHEAT → ✕ → MILK, drawn between the objects the actors are really holding.
   Two segments so the break (and the repair) happens exactly at the middle. */
/* phase 'stop' (Scene 02): the offer travels half-way and stops at a ✕ — the milk end is ringed but never reached.
   word: the plaque's emphasised word (Scene 06: BOTH; Scene 03: BARTER) */
function TradeDiagram({ phase, wheat, milk, aspect, labels, word = 'BOTH' }) {
  if (phase === 'off') return null;
  const mid = { x: (wheat.x + milk.x) / 2, y: (wheat.y + milk.y) / 2 };
  const seg = (a, b) => {
    const dx = b.x - a.x, dy = (b.y - a.y) / aspect;       /* both in cqw */
    return { left: a.x + 'cqw', bottom: a.y + 'cqh', width: Math.hypot(dx, dy) + 'cqw',
             transform: 'rotate(' + (-Math.atan2(dy, dx) * 180 / Math.PI) + 'deg)' };
  };
  const show = p => ['wheat', 'reach', 'full', 'cross', 'works'].indexOf(phase) >= ['wheat', 'reach', 'full', 'cross', 'works'].indexOf(p);
  const on = phase !== 'gone';
  const stop = phase === 'stop';
  return (
    <div className={'trade trade-' + phase + (on ? '' : ' trade-out')} aria-hidden="true">
      <span className="trade-ring wheat" style={{ left: wheat.x + 'cqw', bottom: wheat.y + 'cqh' }}/>
      <span className="trade-tag" style={{ left: wheat.x + 'cqw', bottom: wheat.y + 'cqh' }}>{labels.wheat}</span>

      <span className={'trade-seg a' + (show('reach') || stop ? ' drawn' : '')} style={seg(wheat, mid)}/>
      <span className={'trade-seg b' + (show('full') ? ' drawn' : '')} style={seg(mid, milk)}/>

      <span className={'trade-ring milk' + (show('full') || stop ? ' shown' : '')} style={{ left: milk.x + 'cqw', bottom: milk.y + 'cqh' }}/>
      <span className={'trade-tag milk' + (show('full') || stop ? ' shown' : '')} style={{ left: milk.x + 'cqw', bottom: milk.y + 'cqh' }}>{labels.milk}</span>

      <span className={'trade-x' + (phase === 'cross' || stop ? ' shown' : '')} style={{ left: mid.x + 'cqw', bottom: mid.y + 'cqh' }}>✕</span>
      <span className={'trade-ok' + (phase === 'works' ? ' shown' : '')} style={{ left: mid.x + 'cqw', bottom: mid.y + 'cqh' }}>⇄</span>
      <span className={'trade-plaque' + (phase === 'works' ? ' shown' : '')} style={{ left: mid.x + 'cqw', bottom: mid.y + 'cqh' }}>
        <b>{word}</b>{labels.works.replace(new RegExp('^' + word), '')}
      </span>
    </div>
  );
}

export { SCRIPT_06, TradeDiagram, direct06 };
