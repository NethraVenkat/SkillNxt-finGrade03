import { B, beat } from '../engine/beats';
import { frame } from '../engine/camera';
import { between, faceOf } from './barterStaging';

/* ════════ Scene 08 — "Why Do We Use Money?" — director sheet ════════
   DISCOVERY. The camera follows the coin from Scene 07 to a fruit stall at the
   edge of the same market. Three uses, three different kinds of motion:
     BUY       object-focused: the camera closes on the mango as money reaches it
     EXCHANGE  between two people: the farmer and the milk seller from Scene 05 —
               the ₹10 note passes from one to the other, and this time the
               trade works
     PRICE     close-up: a price tag swings in beside the mango */

const SCRIPT_08 = [
  beat('s8-follow',   B.TRACK,        { ms: 3000, rm: 1500 }),  /* follow the money to the stall */
  beat('s8-buy',      B.OBJECT_FOCUS, { ms: 4000, rm: 3400 }),
  beat('s8-exchange', B.OBJECT_MOVE,  { ms: 4800, rm: 3800 }),
  beat('s8-price',    B.CLOSE,        { ms: 4200, rm: 3600 }),
  beat('s8-ask',      B.QUESTION),
  beat('s8-solved',   B.CORRECT,      { hold: true }),
];

function direct08(beatId, { spots, answer, wheatAt, milkAt }) {
  const F = spots.farmer, S = spots.seller, R = spots.rupi, P = spots.money;
  const sellerPos = S.far || S.right;
  const mango = { x: P.mango.x, y: P.mango.y + P.prop * 0.55 };
  const coinAtStall = { x: P.stallCoin.x, y: P.stallCoin.y + P.coin * 0.35 };   /* beside the mango, never over the tag */
  /* labels float above Rupi's head at the stall, clear of every face */
  const aboveStall = { x: R.stall.x - 4, y: R.stall.y + R.stall.h + 8 };
  const hand = wheatAt(F.mid), can = milkAt(sellerPos);

  const d = {
    cam: frame('WIDE'), mood: 'neutral',
    farmer: { pos: F.mid, state: 'idle', walkMs: 2200 },
    seller: { pos: sellerPos, state: 'idle', walkMs: 1600 },
    rupi: { pos: R.stall, state: 'idle', walkMs: 2400 },
    bubbles: { farmer: 'off', seller: 'off', sellerEm: false },
    rupiSays: null, ask: false, diagram: 'off',
    money: { kind: 'coin', at: coinAtStall, size: P.coin * 0.8, ms: 10, turns: 10, flight: 'stall' },
    note: { kind: 'note', at: hand, size: P.note, ms: 10, turns: 0, flight: 'wait', hidden: true },
    props: { toy: 'hidden', book: 'hidden', mango: 'on', tag: 'off' }, crates: { L: true, R: false },
    tags: {}, web: 'off', plaque: null,
  };

  switch (beatId) {
    case 's8-follow':
      /* the coin leaves the web and leads everyone's eyes to the stall */
      d.cam = frame('TRACK', { x: 30, y: 60 }, { s: 1.12, dur: 2800 });
      d.money = { ...d.money, at: coinAtStall, size: P.coin * 0.8, ms: 2800, turns: 10, flight: 'follow' };
      d.farmer.state = 'walk';
      d.rupi.state = 'walk';
      break;
    case 's8-buy':
      d.cam = frame('CLOSE', { x: 16, y: 70 }, { s: 1.3, dur: 1600 });
      d.props.mango = 'pop';
      d.rupi.state = 'reach';
      d.plaque = { key: 'buy', at: aboveStall };
      break;
    case 's8-exchange':
      /* a two-shot: the note goes from the farmer to the milk seller — the trade works */
      d.cam = frame('MEDIUM', between(faceOf(F.mid), faceOf(sellerPos)), { s: 1.12, dur: 1500 });
      d.note = { ...d.note, at: can, ms: 2400, turns: 1, flight: 'pay', hidden: false };
      d.farmer.state = ['offer', 'talk'];
      d.seller.state = ['lean', 'nod'];
      d.plaque = { key: 'exchange', at: { x: (F.mid.x + sellerPos.x) / 2, y: F.mid.y + F.mid.h + 4 } };
      /* the two-shot cuts the fruit stall in half at the frame edge: it steps out of shot */
      d.props = { ...d.props, mango: 'hidden' };
      d.crates = { L: false, R: false };
      break;
    case 's8-price':
      d.cam = frame('CLOSE', { x: 16, y: 70 }, { s: 1.35, dur: 1600 });
      d.note = { ...d.note, at: can, hidden: true };
      d.farmer.state = 'cheer';
      d.seller.state = 'nod';
      d.props.tag = 'pop';
      d.rupi.state = 'reach';
      d.plaque = { key: 'price', at: aboveStall };
      break;
    case 's8-ask':
      d.cam = frame('WIDE', { x: 50, y: 50 }, { dur: 1600 });
      d.note.hidden = true;
      d.props.tag = 'on';
      d.rupi.state = answer.pick ? 'think' : ['reach', 'talk'];
      d.ask = true;
      break;
    case 's8-solved':
      d.cam = frame('WIDE', { x: 50, y: 50 }, { dur: 1600 });
      d.note.hidden = true;
      d.props.tag = 'pop';
      d.money = { ...d.money, bright: true };
      d.rupi.state = 'cheer';
      d.mood = 'bright';
      d.ask = true;
      break;
    default:
  }
  return d;
}

export { SCRIPT_08, direct08 };
