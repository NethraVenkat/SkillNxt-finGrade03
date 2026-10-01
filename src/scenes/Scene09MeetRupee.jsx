import React, { useMemo, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { SCENE09 } from '../data/rupeeContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import { Board, Counter, CounterAsk, Next, Piece, Tag, fitX } from './counter';

/* ════════ Scene 09 — "Meet the Rupee" ════════
   Rupi's counter at the edge of the village market, laid out like a small
   museum display of every piece of Indian money in the lesson:
     COINS  ₹1 ₹2 ₹5 ₹10 ₹20          (the front row)
     NOTES  ₹10 ₹20 ₹50 ₹100 ₹200 ₹500 (standing behind them)
   Rupi names our money; a slate board is let down over the counter and the ₹
   sign is chalked on it; then the coins stand up, then the notes, each with its
   own ₹ label — INDIAN MONEY = COINS + NOTES. The class says where they have
   seen ₹, and says "Rupee!" together; afterwards any piece can be picked up.
   No filter, no blur. */

const SCRIPT_09 = checkScript('rupee09', [
  beat('s9-establish', B.ACTOR_ENTER, { ms: 2400, rm: 1200 }),  /* the counter; Rupi walks up to it */
  beat('s9-name',      B.DIALOGUE,    { ms: 3600, rm: 3200 }),  /* "Our Indian money is called the Rupee." */
  beat('s9-symbol',    B.DIALOGUE,    { ms: 4200, rm: 3600 }),  /* the board comes down: ₹ */
  beat('s9-means',     B.DIALOGUE,    { ms: 4600, rm: 4000 }),  /* "Whenever you see ₹ before a number…" ₹10 = Ten Rupees */
  beat('s9-coins',     B.OBJECT_MOVE, { ms: 4400, rm: 3000 }),  /* the five coins stand up: COINS */
  beat('s9-notes',     B.OBJECT_MOVE, { ms: 5000, rm: 3400 }),  /* the six notes stand up: NOTES */
  beat('s9-whole',     B.DIALOGUE,    { ms: 4200, rm: 3600 }),  /* INDIAN MONEY = COINS + NOTES */
  beat('s9-ask',       B.QUESTION),                            /* "Have you seen this ₹ symbol before? Where?" */
  beat('s9-say',       B.HOLD),                                /* "Say it with me — Rupee!" */
  beat('s9-said',      B.CELEBRATION, { hold: true }),         /* ₹ means Indian Rupees; inspect the money */
]);

const COINS = SCENE09.coins, NOTES = SCENE09.notes;
const M = [...COINS, ...NOTES];
/* x cqw (centre), y cqh (floor of the piece), tag = y of its label; coin d / note w in cqh */
const row = (xs, y, tag) => xs.map(x => ({ x, y, tag }));
const STAGE = {
  wide: {
    table: { apron: 9, top: 44 },
    rupi: { x: 9, y: 34, h: 46 },
    board: { x: 62, y: 61, w: 34, h: 24 },
    coin: 15, note: 21,
    coins: row([29.5, 44, 58.5, 73, 87.5], 10, 2.2),
    notes: row([21.4, 35.3, 49.2, 63.1, 77, 90.9], 30, 25.8),
    heads: { coins: { x: 14.5, y: 14 }, notes: { x: 56, y: 41 } },
    held: { x: 34, y: 45, coin: 24, note: 38 },
    bubbleW: 30,
    cams: {
      establish: frame('WIDE', { x: 50, y: 52 }, { dur: 1600 }),
      name: frame('MEDIUM', { x: 40, y: 50 }, { s: 1.1, dur: 1600 }),
      symbol: frame('PUSH_IN', { x: 60, y: 40 }, { s: 1.08, dur: 2400 }),
      values: frame('WIDE', { x: 52, y: 55 }, { dur: 1800 }),
    },
  },
  tall: {
    table: { apron: 6, top: 62 },
    rupi: { x: 18, y: 54, h: 24 },
    board: { x: 68, y: 65, w: 58, h: 17 },
    coin: 9, note: 13,
    /* phones: notes 3 + 3, coins 3 + 2 — every piece whole, nothing overlapping */
    coins: [...row([18, 50, 82], 28, 24.4), ...row([34, 66], 16, 12.4)],
    notes: [...row([20, 50, 80], 51.5, 48), ...row([20, 50, 80], 41, 37.5)],
    heads: { coins: { x: 50, y: 1.2 }, notes: { x: 50, y: 58.4 } },
    held: { x: 50, y: 30, coin: 22, note: 30 },
    bubbleW: 86,
    cams: {
      establish: frame('WIDE', { x: 50, y: 50 }, { dur: 1600 }),
      name: frame('MEDIUM', { x: 40, y: 48 }, { s: 1.04, dur: 1600 }),
      symbol: frame('MEDIUM', { x: 58, y: 40 }, { s: 1.06, dur: 2000 }),
      values: frame('WIDE', { x: 50, y: 52 }, { dur: 1800 }),
    },
  },
};

const CONTRACT = {
  name: 'rupee09',
  script: SCRIPT_09,
  preload: [A.P5BG, A.CH.rupi, ...M.flatMap(m => (m.kind === 'coin' ? [A.COINF[m.i], A.COINB[m.i]] : [A.NOTEF[m.i], A.NOTEB[m.i]]))],
  needs: { 's9-establish': [A.P5BG, A.CH.rupi] },
};

function Scene09({ focusMode, blip, onSolved }) {
  useInputModality();
  const { layout, director, rootProps } = useCinematicScene(CONTRACT, {
    scene: 9,
    onQa: b => { if (b === 's9-say' || b === 's9-said') setSeen(['tag']); },
  });
  const [seen, setSeen] = useState([]);          /* places the class named */
  const [held, setHeld] = useState(null);        /* the piece lifted up to look at (after the lesson) */
  const st = STAGE[layout];
  const b = director.beat, at = director.at;
  const L = SCENE09.lines;

  const place = id => {
    const first = !seen.length;
    setSeen(s => [...s.filter(x => x !== id), id]);
    if (blip) blip(820 + SCENE09.places.findIndex(p => p.id === id) * 60);
    if (first && onSolved) onSolved();
  };
  const sayIt = () => { if (blip) blip(990); director.goTo('s9-said'); };
  const replay = () => { setSeen([]); setHeld(null); director.reset('s9-establish'); };

  const last = seen.length ? SCENE09.places.find(p => p.id === seen[seen.length - 1]) : null;
  const heldItem = held != null ? M[held] : null;
  const line = b === 's9-name' ? L.name
    : b === 's9-symbol' ? L.symbol
    : b === 's9-means' ? L.means
    : b === 's9-coins' ? ['These are our coins.']
    : b === 's9-notes' ? ['And these are our notes.']
    : b === 's9-whole' ? [L.values]
    : b === 's9-ask' ? (last ? [last.say] : null)
    : b === 's9-say' ? [L.say]
    : b === 's9-said' ? [heldItem ? '₹' + heldItem.v + ' — ' + heldItem.name + '!' : L.said]
    : null;
  const rupiState = b === 's9-establish' ? 'walk' : b === 's9-name' ? ['lean', 'talk'] : b === 's9-symbol' || b === 's9-means' ? ['point', 'talk']
    : b === 's9-coins' || b === 's9-notes' ? 'reach' : b === 's9-whole' ? ['lean', 'talk'] : b === 's9-ask' ? (last ? ['nod', 'talk'] : 'idle') : b === 's9-say' ? ['cheer', 'talk'] : 'cheer';

  const cam = st.cams[b.slice(3)] || st.cams.values;
  /* while the class answers, the answer tags sit on the counter's front edge: the coin labels step aside */
  const answering = b === 's9-ask' || b === 's9-say';
  const coinsUp = at('s9-coins'), notesUp = at('s9-notes');
  const stateOf = k => {
    if (held === k) return 'held';
    const coin = k < COINS.length;
    if (coin) return coinsUp ? 'stand' : 'laid';
    return notesUp ? 'stand' : 'laid';
  };
  const placeOf = k => (k < COINS.length ? st.coins[k] : st.notes[k - COINS.length]);
  const spot = (k, s) => (s === 'held' ? { x: st.held.x, y: st.held.y } : { x: placeOf(k).x, y: placeOf(k).y });
  const tagOn = k => held !== k && (k < COINS.length ? coinsUp && !answering : notesUp);
  const board = !at('s9-means') ? 'symbol' : b === 's9-means' ? 'means' : !at('s9-ask') ? 'whole' : answering ? 'ask' : 'said';

  const teacher = at('s9-ask') ? SCENE09.teacher : { ...SCENE09.teacher, cue: SCENE09.watchCue };
  const caption = useMemo(() => (line ? 'Rupi: ' + line.map(l => (typeof l === 'string' ? l : l.map(s => s.t).join(''))).join(' ') : ''), [b, last, heldItem]);
  const rupiPos = st.rupi;

  return (
    <section {...rootProps} className={'counter rupee09 layout-' + layout + (director.playing ? '' : ' is-paused')}
      aria-label={'Scene 9: ' + SCENE09.title}>
      <Plate src={A.P5BG} alt="Rupi's money counter at the edge of the village market"
        focusX={layout === 'tall' ? 36 : 50} camera={cam} reduced={director.reduced} coupled maxUpscale={1.2}
        atmosphere={<EnvironmentLayer mood={b === 's9-said' ? 'bright' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {b === 's9-ask' && (
              <CounterAsk id="q9" kicker={SCENE09.question} inline
                tags={SCENE09.places} picked={seen} onPick={place}>
                {seen.length > 0 && <Next onClick={() => director.goTo('s9-say')}>Say it together</Next>}
              </CounterAsk>
            )}
            {b === 's9-say' && (
              <CounterAsk id="q9say" kicker="Say it together" inline tags={[{ id: 'rupee', label: SCENE09.sayButton, icon: '🔊' }]} onPick={sayIt}/>
            )}
            {b === 's9-said' && (
              <p className={'cp-hint' + (layout === 'tall' ? '' : ' top')} role="status">{heldItem ? 'Tap it again to put it back' : 'Tap any coin or note to look closer'}</p>
            )}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 09 · ' + SCENE09.title} teacher={teacher}
                playing={director.playing} onToggle={director.toggle} onReplay={replay}/>
            )}
            {!director.playing && <span className="counter-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        <Actor src={A.CH.rupi} alt="Rupi, at the money counter" position={rupiPos} state={rupiState} toward={1}
          enterFrom={b === 's9-establish' ? -30 : null} walkMs={2000} cue={b + seen.length + (held != null ? held : '')} zIndex={2}
          reduced={director.reduced}/>

        <Board box={st.board} down={at('s9-symbol')} label={'The ₹ symbol: ' + SCENE09.board.means}>
          <span className="sym" key={board === 'symbol' ? 's' : 'k'}>{SCENE09.board.symbol}</span>
          {board === 'means' && <span className="line fade"><em>{SCENE09.board.example}</em> = {SCENE09.board.exampleSays}</span>}
          {board === 'whole' && at('s9-whole') && <span className="line fade">INDIAN MONEY = <em>COINS</em> + <em>NOTES</em></span>}
          {board === 'whole' && !at('s9-whole') && <span className="line fade">₹ = Indian Rupees</span>}
          {board === 'ask' && <span className="line fade">{b === 's9-say' ? 'Say it: Rupee!' : 'Where have you seen ₹?'}</span>}
          {board === 'said' && <span className="line fade">= <em>{SCENE09.board.means}</em></span>}
        </Board>

        <Counter table={st.table}/>

        {M.map((m, k) => {
          const s = stateOf(k);
          const coin = m.kind === 'coin';
          const size = s === 'held' ? st.held[m.kind] : coin ? st.coin : st.note;
          const order = coin ? k : k - COINS.length;
          return (
            <Piece key={k} item={m} at={spot(k, s)} size={size} state={s} reduced={director.reduced}
              delay={(b === 's9-coins' && coin) || (b === 's9-notes' && !coin) ? 0.2 + order * 0.4 : 0}
              bright={s === 'held'} still={s !== 'held'} z={s === 'held' ? 12 : coin ? 7 : undefined}
              label={'₹' + m.v + ' ' + m.kind + ' — ' + m.name}
              onPick={b === 's9-said' ? () => { setHeld(h => (h === k ? null : k)); if (blip) blip(700 + k * 30); } : undefined}/>
          );
        })}
        {M.map((m, k) => (
          <Tag key={'t' + k} at={{ x: placeOf(k).x, y: placeOf(k).tag }} on={tagOn(k)}>₹{m.v}</Tag>
        ))}
        {/* the two groups, named on the counter */}
        <Tag at={st.heads.coins} on={coinsUp && !answering && !(layout === 'tall' && b === 's9-said')} gold wide>{SCENE09.groups.coins}</Tag>
        <Tag at={st.heads.notes} on={notesUp} gold wide>{SCENE09.groups.notes}</Tag>

        <SpeechBubble speaker={rupiPos} width={st.bubbleW} centerX={fitX(cam, rupiPos.x, st.bubbleW)} lines={line || ['']} show={!!line}
          floor={layout === 'tall' && at('s9-symbol') ? st.board.y + st.board.h + 1.5 : 0}
          size={b === 's9-name' || b === 's9-say' ? 'lg' : undefined} em/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene09 };
