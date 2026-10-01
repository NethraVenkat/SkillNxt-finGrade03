import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { SCENE13 } from '../data/coinNoteContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import './scene13.css';

/* ════════ Scene 13 — "Coin or Note?" — Rupi's money inspection station ════════
   A long, low wooden table at the edge of the market, filmed from just above
   table height. A ₹5 coin already stands in the brass slot of a small wooden
   stand. Rupi walks in, notices it, walks over, looks down and gestures — the
   camera follows his attention in to the coin, which turns once (front → edge
   → back) so the class can inspect it. The class answers on wooden tags fixed
   to the table's front edge; each right answer lays the money down at the back
   of the table — coins on one side, notes on the other — and the next piece
   arrives. By the last round the table itself is sorted.

   The world is the crisp village-market plate: the other supplied environment
   plates have blur painted into them, so they are not used. Nothing here uses
   filter, blur or backdrop-filter. */

const ROUNDS = SCENE13.rounds;
const rid = (k, p) => 'r' + (k + 1) + '-' + p;

const SCRIPT_13 = checkScript('coins13', [
  beat('s13-establish', B.WIDE,        { ms: 2200, rm: 1400 }),  /* the market; a coin on the stand */
  beat('s13-enter',     B.ACTOR_ENTER, { ms: 2200, rm: 900 }),   /* Rupi walks in */
  beat('s13-notice',    B.REACTION,    { ms: 1500, rm: 1000 }),  /* …and notices the money */
  beat('s13-approach',  B.TRACK,       { ms: 2100, rm: 900 }),   /* he walks over to the stand */
  beat('s13-look',      B.DIALOGUE,    { ms: 2600, rm: 2200 }),  /* looks down, gestures: "Look carefully!" */
  ...ROUNDS.flatMap((r, k) => [
    ...(k ? [beat(rid(k, 'next'), r.staged ? B.DIALOGUE : B.OBJECT_MOVE, r.staged ? { ms: 2800, rm: 2400 } : { ms: 2200, rm: 1100 })] : []),
    ...(r.staged ? [beat(rid(k, 'aside'), B.OBJECT_MOVE, { ms: 2800, rm: 2400 })] : []),
    beat(rid(k, 'inspect'), B.OBJECT_FOCUS, { ms: 3400, rm: 1200 }),  /* it turns once: front → edge → back */
    beat(rid(k, 'ask'), B.QUESTION),
    beat(rid(k, 'right'), B.CORRECT, { ms: 2600, rm: 2000 }),
  ]),
  beat('s13-done', B.CELEBRATION, { hold: true }),              /* the sorted table */
]);

/* beat id → { c: round (0-based), phase } */
function parse(id) {
  if (id === 's13-done') return { c: ROUNDS.length, phase: 'done' };
  if (id[0] === 'r') return { c: +id.slice(1, id.indexOf('-')) - 1, phase: id.slice(id.indexOf('-') + 1) };
  return { c: 0, phase: id.slice(4) };
}

/* every piece of money in the scene, with its place in the sorted piles */
const ITEMS = (() => {
  const n = { coin: 0, note: 0 };
  return ROUNDS.flatMap((r, k) => r.items.map((it, j) => ({ ...it, v: r.v, round: k, key: k + '-' + j, pair: r.items.length > 1, pile: n[it.kind]++ })));
})();

const RIM = { 2: '#8C7147', 3: '#86683A', 4: '#767674' };           /* coin edge tones, sampled from each coin's rim */

/* two compositions. x cqw (centre), y cqh from the floor; money sizes in cqh */
const STAGE = {
  wide: {
    rupi: { arrive: { x: 12, y: 16, h: 46 }, stand: { x: 31, y: 16, h: 46 } },
    table: { apron: 9, top: 27 },
    stand: { x: 60, y: 15.5, w: 58 },
    rest: 20,
    single: { coin: { x: 60, d: 32 }, note: { x: 61, w: 64 } },
    pair: { coin: { x: 48.5, d: 25 }, note: { x: 72, w: 49 } },
    pile: {
      coin: [{ x: 38.5, y: 22 }, { x: 43, y: 23.6 }, { x: 46.5, y: 21.7 }],
      note: [{ x: 83, y: 22.2 }, { x: 89, y: 23.8 }, { x: 94.5, y: 22 }, { x: 86, y: 25.4 }],
    },
    lay: { coin: 0.4, note: 0.3 },
    from: { right: { dx: 62, dy: 0 }, left: { dx: -72, dy: 0 }, drop: { dx: 14, dy: 60 }, slide: { dx: 55, dy: 3 } },
    bubbleW: 24,
    cams: {
      establish: frame('WIDE', { x: 52, y: 52 }, { dur: 1600 }),
      enter: frame('MEDIUM', { x: 40, y: 54 }, { s: 1.06, dur: 2000 }),
      notice: frame('MEDIUM', { x: 38, y: 50 }, { s: 1.14, dur: 900 }),
      approach: frame('TRACK', { x: 46, y: 55 }, { s: 1.14, dur: 2000 }),
      look: frame('PUSH_IN', { x: 52, y: 58 }, { s: 1.2, dur: 2600 }),
      coin: frame('CLOSE', { x: 57, y: 62 }, { s: 1.3, dur: 1600 }),
      note: frame('MEDIUM', { x: 60, y: 57 }, { s: 1.24, dur: 1600 }),
      both: frame('MEDIUM', { x: 58, y: 60 }, { s: 1.16, dur: 1600 }),
      next: frame('TRACK', { x: 55, y: 57 }, { s: 1.1, dur: 1300 }),
      done: frame('PULL_OUT', { x: 56, y: 57 }, { s: 1.06, dur: 2400 }),
    },
  },
  /* phones / portrait tablets: Rupi stands high on the left, the table comes
     closer and deeper, and the money is much larger relative to the frame */
  tall: {
    rupi: { arrive: { x: 12, y: 40, h: 28 }, stand: { x: 22, y: 40, h: 28 } },
    table: { apron: 8, top: 43 },
    stand: { x: 55, y: 17, w: 40 },
    rest: 21.5,
    single: { coin: { x: 55, d: 23 }, note: { x: 54, w: 40 } },
    pair: { coin: { x: 27, d: 16 }, note: { x: 71, w: 26 } },
    pile: {
      coin: [{ x: 38, y: 36.5 }, { x: 45, y: 38.4 }, { x: 51, y: 36.2 }],
      note: [{ x: 66, y: 36.4 }, { x: 76, y: 38.6 }, { x: 86, y: 36.3 }, { x: 93, y: 39.2 }],
    },
    lay: { coin: 0.34, note: 0.3 },
    from: { right: { dx: 70, dy: 0 }, left: { dx: -75, dy: 0 }, drop: { dx: 8, dy: 52 }, slide: { dx: 70, dy: 3 } },
    bubbleW: 56,
    cams: {
      establish: frame('WIDE', { x: 50, y: 50 }, { dur: 1600 }),
      enter: frame('MEDIUM', { x: 40, y: 50 }, { s: 1.04, dur: 2000 }),
      notice: frame('MEDIUM', { x: 34, y: 48 }, { s: 1.08, dur: 900 }),
      approach: frame('TRACK', { x: 44, y: 52 }, { s: 1.06, dur: 2000 }),
      look: frame('PUSH_IN', { x: 50, y: 56 }, { s: 1.08, dur: 2600 }),
      coin: frame('CLOSE', { x: 54, y: 62 }, { s: 1.12, dur: 1600 }),
      note: frame('MEDIUM', { x: 54, y: 60 }, { s: 1.1, dur: 1600 }),
      both: frame('MEDIUM', { x: 50, y: 60 }, { s: 1.05, dur: 1600 }),
      next: frame('TRACK', { x: 50, y: 56 }, { s: 1.03, dur: 1300 }),
      done: frame('PULL_OUT', { x: 50, y: 54 }, { s: 1, dur: 2400 }),
    },
  },
};

/* how each round's money arrives — no two rounds arrive the same way
   (round 1's coin is already on the stand when the scene opens) */
const ARRIVE = [[null], ['drop'], ['right', 'drop'], ['left', 'drop'], ['slide']];

const COINS13 = {
  name: 'coins13',
  script: SCRIPT_13,
  preload: [A.P5BG, A.CH.rupi, ...ITEMS.flatMap(it => (it.kind === 'coin' ? [A.COINF[it.i], A.COINB[it.i]] : [A.NOTEF[it.i], A.NOTEB[it.i]]))],
  /* the coin must be on the stand before the camera opens on it (engine caps the wait at 1.5 s) */
  needs: { 's13-enter': [A.CH.rupi, A.COINF[2], A.COINB[2]] },
};

/* one piece of money: a real coin with a rim and thickness, or a note with a paper edge */
function Money({ item, st, spot, from, reduced, bright, turning, label }) {
  const coin = item.kind === 'coin';
  const front = coin ? A.COINF[item.i] : A.NOTEF[item.i];
  const back = coin ? A.COINB[item.i] : A.NOTEB[item.i];
  const place = st === 'off' ? { x: spot.x + from.dx, y: spot.y + from.dy, s: 1 } : spot;
  const roll = st !== 'off' ? 0 : coin ? (from.dx > 0 ? 540 : from.dx < 0 ? -540 : 0) : (from.dy > 10 ? -14 : 6);
  return (
    <div className={'c13-obj c13-' + item.kind + ' is-' + st + (bright ? ' bright' : '') + (turning ? ' turning' : '')}
      role={st === 'stand' ? 'img' : undefined} aria-label={st === 'stand' ? label : undefined} aria-hidden={st === 'stand' ? undefined : true}
      style={{
        '--w': (coin ? spot.d : spot.w) + 'cqh', '--rim': RIM[item.i] || '#8A6E44',
        transform: 'translate3d(calc(' + place.x + 'cqw - 50%), ' + (-place.y) + 'cqh, 0) scale(' + (place.s || 1) + ')',
        transition: st === 'off' || reduced ? 'none' : undefined,
      }}>
      <span className="c13-shadow"/>
      <div className="c13-roll" style={{ transform: 'rotateZ(' + roll + 'deg)' }}>
        <div className="c13-lay">
          <div className="c13-sway">
            <div className="c13-face c13-front">
              <img src={front} alt="" draggable="false"/>
              <span className="c13-sheen"/>
            </div>
            {coin
              ? [0, 1, 2, 3, 4].map(k => <i key={k} className="c13-edge" style={{ '--k': k }}/>)
              : <i className="c13-paper"/>}
            <div className="c13-face c13-back"><img src={back} alt="" draggable="false"/></div>
          </div>
        </div>
      </div>
      <span className="c13-ring"/>
    </div>
  );
}

/* the wooden answer tags on the table's front edge, with the question above them */
function Tags({ phase, answer, miss, onPick, homeRef, round }) {
  const ref = useRef(null);
  /* if the tags leave the frame while holding keyboard focus, hand it back to the scene */
  useLayoutEffect(() => () => {
    if (ref.current && ref.current.contains(document.activeElement) && homeRef.current) homeRef.current.focus({ preventScroll: true });
  }, [homeRef]);
  /* keyboard users: the tags take focus when a new question is asked */
  useEffect(() => {
    if (phase !== 'ask' || document.documentElement.dataset.mqInput !== 'key' || !ref.current) return;
    if (ref.current.contains(document.activeElement)) return;
    const b = ref.current.querySelector('button');
    if (b) b.focus({ preventScroll: true });
  }, [phase, round]);
  const arrows = e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const bs = [...ref.current.querySelectorAll('button')];
    const i = bs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length].focus();
  };
  const live = phase === 'ask';
  return (
    <div ref={ref} className={'c13-tags' + (live ? '' : ' is-waiting')} role="group" aria-labelledby="c13-q" onKeyDown={arrows}>
      {['coin', 'note', 'both'].map(id => {
        const right = phase === 'right' && id === answer;
        const wrong = live && miss && miss.id === id;
        return (
          <button key={id} type="button" aria-disabled={!live}
            className={'c13-tag' + (right ? ' is-right' : '') + (wrong ? ' is-wrong' : '')}
            onClick={() => live && onPick(id)}>
            <span className="c13-tag-in" key={wrong ? miss.n : 0}><b>{SCENE13.answers[id]}</b></span>
          </button>
        );
      })}
    </div>
  );
}

function Scene13({ scene, focusMode, blip }) {
  useInputModality();
  const { layout, director, rootProps, stageRef } = useCinematicScene(COINS13, { scene });
  const st = STAGE[layout];
  const beatId = director.beat;
  const { c, phase } = parse(beatId);
  const round = ROUNDS[Math.min(c, ROUNDS.length - 1)];
  const [miss, setMiss] = useState(null);          /* { round, id, n } — a wrong tag, this round */
  const missNow = miss && miss.round === c && phase === 'ask' ? miss : null;
  useEffect(() => { setMiss(null); }, [c]);

  const pick = id => {
    if (phase !== 'ask') return;
    if (id === round.answer) {
      if (blip) blip(960);
      setMiss(null);
      director.goTo(rid(c, 'right'));
    } else {
      if (blip) blip(330, 'triangle');
      setMiss(m => ({ round: c, id, n: m && m.round === c ? m.n + 1 : 1 }));
    }
  };

  /* ── direction ── */
  const shot = round.items.length > 1 ? 'both' : round.items[0].kind;
  const staging = round.staged && phase === 'next';           /* ₹10: the coin first, on its own */
  const cams = st.cams;
  const cam = phase === 'inspect' || phase === 'ask' ? cams[staging ? 'coin' : shot]
    : phase === 'right' ? { ...cams[shot], s: cams[shot].s + 0.035, dur: 600 }     /* a small, satisfying push */
    : phase === 'next' ? (round.staged ? cams.coin : cams.next)
    : phase === 'aside' ? cams.both
    : cams[phase];

  const solved = phase === 'done' ? ROUNDS.length : c + (phase === 'right' ? 1 : 0);
  const rupiOn = phase !== 'establish';
  const rupiPos = phase === 'enter' || phase === 'notice' ? st.rupi.arrive : st.rupi.stand;
  const L = SCENE13.lines;
  const line = phase === 'look' ? L.look
    : phase === 'ask' && missNow ? L.wrong
    : phase === 'right' ? L.right[round.answer]
    : phase === 'next' ? (round.staged ? L.canCoin : L.next)
    : phase === 'aside' ? L.orNote
    : phase === 'done' ? L.done : null;
  const rupiState = phase === 'enter' || phase === 'approach' ? 'walk'
    : phase === 'notice' ? ['lean', 'surprised']
    : phase === 'look' ? ['reach', 'talk']
    : phase === 'inspect' ? 'lean'
    : phase === 'ask' ? (missNow ? ['think', 'talk'] : 'idle')
    : phase === 'right' ? ['lean', 'nod']
    : phase === 'next' ? ['point', 'talk']
    : phase === 'aside' ? ['reach', 'talk']
    : phase === 'done' ? 'cheer' : 'idle';

  /* each item: off (waiting outside the frame) → stand (in the brass slot) → laid down in its pile */
  const stateOf = it => {
    if (phase === 'done' || it.round < c) return 'laid';
    if (it.round > c) return 'off';
    if (staging && it.kind === 'note') return 'off';
    return 'stand';
  };
  const spotOf = (it, s) => {
    const size = (it.pair ? st.pair : st.single)[it.kind];
    if (s === 'laid') return { ...st.pile[it.kind][it.pile], d: size.d, w: size.w, s: st.lay[it.kind] };
    const p = staging && it.kind === 'coin' ? { ...st.single.coin, d: size.d } : size;
    return { x: p.x, y: st.rest, d: p.d, w: p.w, s: 1 };
  };
  const labelOf = it => (it.kind === 'coin' ? 'A round ₹' + it.v + ' piece of money' : 'A ₹' + it.v + ' piece of paper money');

  const homeRef = useRef(null);
  homeRef.current = stageRef.current;
  const asking = phase === 'ask' || phase === 'right';
  const wideStand = round.items.length > 1 && !staging && phase !== 'done';
  const teacher = c > 0 || asking || phase === 'inspect' || phase === 'done' ? SCENE13.teacher : { ...SCENE13.teacher, cue: SCENE13.watchCue };
  const caption = line ? 'Rupi: ' + line : '';

  return (
    <section {...rootProps} className={'coins13 layout-' + layout + (director.playing ? '' : ' is-paused')}
      aria-label={'Scene 13: ' + SCENE13.title}>
      <Plate src={A.P5BG} alt="The village market, with Rupi's money inspection table in front"
        focusX={layout === 'tall' ? 36 : 50} camera={cam} reduced={director.reduced} coupled
        /* the ambient sun pulse is stilled: animating light beneath 3D money costs frames */
        atmosphere={<EnvironmentLayer mood={phase === 'right' || phase === 'done' ? 'bright' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {asking && (
              <div className="c13-ask">
                <p className="c13-q" id="c13-q">
                  <small>{SCENE13.kicker}<span className="c13-studs" role="img" aria-label={'Round ' + (c + 1) + ' of ' + ROUNDS.length}>
                    {ROUNDS.map((r, k) => <i key={k} className={k < solved ? 'full' : k === c ? 'now' : ''}/>)}
                  </span></small>
                  {SCENE13.question}
                </p>
                <Tags phase={phase} answer={round.answer} miss={missNow} onPick={pick} homeRef={homeRef} round={c}/>
              </div>
            )}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 13 · ' + SCENE13.title} teacher={teacher}
                playing={director.playing} onToggle={director.toggle} onReplay={() => { setMiss(null); director.reset('s13-establish'); }}/>
            )}
            {!director.playing && <span className="c13-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        {/* Rupi first: the table in front of him hides his legs */}
        {rupiOn && (
          <Actor src={A.CH.rupi} alt="Rupi, at his money inspection table" position={rupiPos} state={rupiState} toward={1}
            enterFrom={phase === 'enter' ? -40 : null} walkMs={phase === 'approach' ? 1800 : 2000}
            cue={beatId + (missNow ? missNow.n : '')} zIndex={2} reduced={director.reduced}/>
        )}

        <div className="c13-table" style={{ '--apron': st.table.apron + 'cqh', '--top': st.table.top + 'cqh' }} aria-hidden="true">
          <div className="c13-surface"><i/><i/><i/><i/><span className="c13-farshade"/></div>
          <div className="c13-apron">{[1, 2, 3, 4, 5].map(k => <i key={k} style={{ left: (k * 100 / 6) + '%' }}/>)}</div>
        </div>

        {/* the inspection stand: a wooden turntable with a brass slot, lit a little warmer than the table */}
        <div className={'c13-stand' + (wideStand ? ' wide' : '')} aria-hidden="true"
          style={{ left: st.stand.x + 'cqw', bottom: st.stand.y + 'cqh', '--sw': st.stand.w + 'cqh' }}>
          <span className="c13-pool"/><span className="c13-stand-side"/><span className="c13-stand-top"/><span className="c13-slot"/>
        </div>

        {ITEMS.map(it => {
          const s = stateOf(it);
          const way = ARRIVE[it.round][it.pair && it.kind === 'note' ? 1 : 0] || 'right';
          return (
            <Money key={it.key} item={it} st={s} spot={spotOf(it, s === 'off' ? 'stand' : s)} from={st.from[way]}
              reduced={director.reduced} bright={s === 'stand' && phase === 'right'}
              turning={s === 'stand' && phase === 'inspect'} label={labelOf(it)}/>
          );
        })}

        {/* the slot's front lip sits in front of the money standing in it */}
        <span className={'c13-lip' + (wideStand ? ' wide' : '')} aria-hidden="true"
          style={{ left: st.stand.x + 'cqw', bottom: (st.rest - 0.9) + 'cqh', '--sw': st.stand.w + 'cqh' }}/>

        <SpeechBubble speaker={rupiPos} width={st.bubbleW} lines={[line || '']} show={!!line}
          size={phase === 'look' ? 'lg' : undefined}/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene13 };
