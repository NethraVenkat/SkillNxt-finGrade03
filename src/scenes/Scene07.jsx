import React from 'react';
import { B, beat } from '../engine/beats';
import { frame } from '../engine/camera';
import { faceOf, topPt, between } from './barterStaging';

/* ════════ Scene 07 — "Then came… money!" — director sheet ════════
   STORY TRANSFORMATION. The market has not moved on: the farmer still holds
   his wheat, the seller still has his milk. Rupi thinks; the light holds its
   breath; he asks the question; and real money — the supplied ₹10 coin —
   arrives, visits everything it can buy, and ties it together. */

const SCRIPT_07 = [
  beat('s7-recall', B.REACTION,    { ms: 2800, rm: 2000 }),  /* the problem is still there */
  beat('s7-think',  B.PUSH_IN,     { ms: 2600, rm: 1600 }),  /* camera moves in on Rupi, thinking */
  beat('s7-pause',  B.HOLD,        { ms: 1700, rm: 1200, hold: false }),  /* the light holds its breath */
  beat('s7-idea',   B.DIALOGUE,    { ms: 4400, rm: 3800 }),  /* "What if everyone used the same thing…" */
  beat('s7-arrive', B.OBJECT_MOVE, { ms: 3000, rm: 1600 }),  /* money enters the world */
  beat('s7-wheat',  B.OBJECT_FOCUS, { ms: 1700, rm: 1100 }),
  beat('s7-milk',   B.OBJECT_FOCUS, { ms: 1700, rm: 1100 }),
  beat('s7-toy',    B.OBJECT_FOCUS, { ms: 1700, rm: 1100 }),
  beat('s7-book',   B.OBJECT_FOCUS, { ms: 1700, rm: 1100 }),
  beat('s7-web',    B.PULL_OUT,    { ms: 3000, rm: 2000 }),  /* money ties them all together */
  beat('s7-sum',    B.DIALOGUE,    { ms: 3600, rm: 3200 }),  /* "Money makes buying and selling easier." */
  beat('s7-ask',    B.QUESTION),
  beat('s7-solved', B.CORRECT,     { hold: true }),         /* waits for "Follow the money" */
];

const ORDER = ['wheat', 'milk', 'toy', 'book'];

function direct07(beatId, { spots, answer, wheatAt, milkAt }) {
  const F = spots.farmer, S = spots.seller, R = spots.rupi, P = spots.money;
  const wheat = wheatAt(F.left), milk = milkAt(S.right);
  const spot = { wheat, milk, toy: { x: P.toy.x, y: P.toy.y + P.prop }, book: { x: P.book.x, y: P.book.y + P.prop } };
  /* while the class answers, the farmer and Rupi step aside so the question never covers a face */
  const askF = F.aside || F.left, askR = R.aside || R.centre;
  const above = pt => ({ x: pt.x, y: pt.y + P.lift });
  const coin = (at, ms, turns, flight, extra) => ({ kind: 'coin', at, size: P.coin, ms, turns, flight, ...extra });

  const d = {
    cam: frame('WIDE'), mood: 'quiet',
    farmer: { pos: F.left, state: 'sad' },
    seller: { pos: S.right, state: 'protect' },
    rupi: { pos: R.centre, state: 'idle' },
    bubbles: { farmer: 'off', seller: 'off', sellerEm: false },
    rupiSays: null, ask: false, diagram: 'off',
    money: coin(P.enter, 10, 0, 'wait', { hidden: true }),
    props: { toy: 'on', book: 'on', mango: 'off', tag: 'off' }, crates: { L: true, R: true },
    tags: {}, web: 'off', plaque: null,
  };
  const visited = n => ORDER.slice(0, n).reduce((o, k) => ({ ...o, [k]: true }), {});
  /* before money arrives the camera is close on Rupi: the toy and book crates wait off-shot
     (they sat half-cut at the frame edges) and are set out as the money visits them */
  if (['s7-recall', 's7-think', 's7-pause', 's7-idea', 's7-arrive', 's7-wheat', 's7-milk'].includes(beatId)) {
    d.props = { ...d.props, toy: 'hidden', book: 'hidden' };
    d.crates = { L: false, R: false };
  }
  /* the money visits the toy first: the book's crate (far right) is set out only when the money reaches it */
  if (beatId === 's7-toy') { d.props = { ...d.props, book: 'hidden' }; d.crates = { L: true, R: false }; }

  switch (beatId) {
    case 's7-recall':
      d.cam = frame('MEDIUM', between(faceOf(F.left), faceOf(S.right)), { s: 1.08, dur: 1800 });
      d.rupi.state = 'lean';
      break;
    case 's7-think':
      d.cam = frame('PUSH_IN', faceOf(R.centre), { s: 1.5 });
      d.rupi.state = 'think';
      break;
    case 's7-pause':
      d.cam = frame('CLOSE', faceOf(R.centre), { s: 1.8, dur: 1700 });
      d.rupi.state = 'think';
      d.mood = 'hush';
      break;
    case 's7-idea':
      d.cam = frame('MEDIUM', faceOf(R.centre), { s: P.ideaS, dur: 1400 });   /* phones: the line must fit the frame */
      d.rupi.state = ['surprised', 'talk'];
      d.rupiSays = { lines: 'idea' };
      d.mood = 'hush';
      break;
    case 's7-arrive':
      d.cam = frame('TRACK', topPt(P.hub), { s: 1.18, dur: 2800 });
      d.money = coin(P.hub, 2800, 2, 'arrive');
      d.rupi.state = 'surprised';
      d.farmer.state = 'think';
      d.seller.state = 'lean';
      d.rupiSays = { lines: 'arrival' };
      d.mood = 'neutral';
      break;
    case 's7-wheat': case 's7-milk': case 's7-toy': case 's7-book': {
      const k = beatId.slice(3), i = ORDER.indexOf(k);
      /* the book sits at the far right: a gentler zoom keeps the earlier labels (Toys, far left) in frame */
      d.cam = frame('TRACK', topPt(spot[k]), { s: k === 'book' ? 1 : 1.18, dur: 1400 });
      d.money = coin(above(spot[k]), 1400, 3 + i, k);
      d.tags = visited(i + 1);
      d.rupi.state = 'lean';
      if (k === 'wheat') d.farmer.state = ['lean', 'nod'];
      if (k === 'milk') d.seller.state = 'nod';
      if (k === 'toy' || k === 'book') d.props[k] = 'pop';
      d.mood = 'neutral';
      break;
    }
    case 's7-web':
      d.cam = frame('PULL_OUT', { x: 50, y: 50 }, { dur: 2400 });
      d.money = coin(P.hub, 1600, 8, 'hub');
      d.tags = visited(4);
      d.web = 'draw';
      d.rupi.state = 'nod';
      d.farmer.state = 'idle';
      d.seller.state = 'idle';
      d.mood = 'neutral';
      break;
    case 's7-sum':
      d.cam = frame('WIDE', { x: 50, y: 50 });
      d.money = coin(P.hub, 10, 8, 'hub');
      d.tags = visited(4);
      d.web = 'gone';
      d.rupi.state = ['lean', 'talk'];
      d.rupiSays = { lines: 'teaching' };
      d.mood = 'neutral';
      break;
    case 's7-ask':
      d.cam = frame('WIDE', { x: 50, y: 50 });
      d.money = coin(P.hub, 10, 8, 'hub');
      d.tags = visited(4);
      d.farmer = { pos: askF, state: 'idle', walkMs: 1300 };
      d.rupi = { pos: askR, state: answer.pick ? 'think' : 'lean', walkMs: 1500 };
      d.mood = 'neutral';
      d.ask = true;
      break;
    case 's7-solved':
      d.cam = frame('WIDE', { x: 50, y: 50 });
      d.money = coin(P.hub, 10, 8, 'hub', { bright: true });
      d.tags = visited(4);
      d.rupi = { pos: askR, state: 'cheer' };
      d.farmer = { pos: askF, state: 'nod' };
      d.seller.state = 'nod';
      d.mood = 'bright';
      d.ask = true;
      break;
    default:
  }
  return d;
}

/* money → every thing it can buy: lines drawn from the coin to each thing */
function MoneyWeb({ phase, hub, targets, aspect }) {
  if (phase === 'off') return null;
  const seg = (a, b) => {
    const dx = b.x - a.x, dy = (b.y - a.y) / aspect;
    return { left: a.x + 'cqw', bottom: a.y + 'cqh', width: Math.max(0, Math.hypot(dx, dy) - 4) + 'cqw',
             transform: 'rotate(' + (-Math.atan2(dy, dx) * 180 / Math.PI) + 'deg)' };
  };
  return (
    <div className={'mweb ' + (phase === 'gone' ? 'draw gone' : phase)} aria-hidden="true">
      {targets.map((t, i) => <span key={i} className="mweb-seg" style={seg(hub, t)}/>)}
    </div>
  );
}

export { MoneyWeb, SCRIPT_07, direct07 };
