import React, { useMemo, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { SCENE10 } from '../data/rupeeContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import { Counter, CounterAsk, Next, Piece, Tag, fitX } from './counter';

/* ════════ Scene 10 — "Meet the Coins" ════════
   The same counter, now a coin gallery: all five coins — ₹1, ₹2, ₹5, ₹10,
   ₹20 — stand in one row with equal spacing. The class picks a coin up: it
   comes forward, turns once, can be turned by hand (tap to flip it over), and
   Rupi names it. Then each coin's number is labelled — its denomination — and
   the class finds the coin with the biggest value (₹20). No filter, no blur. */

const SCRIPT_10 = checkScript('coins10', [
  beat('s10-establish', B.WIDE,        { ms: 1800, rm: 1200 }),
  beat('s10-intro',     B.OBJECT_MOVE, { ms: 4200, rm: 2400 }),  /* "Now let's meet our coins!" — five coins are set down */
  beat('s10-look',      B.DIALOGUE,    { ms: 3400, rm: 3000 }),  /* "Every coin is a little different…" */
  beat('s10-explore',   B.HOLD),                                /* "Tap a coin to learn more!" */
  beat('s10-denom',     B.DIALOGUE,    { ms: 5600, rm: 5000 }),  /* the numbers are labelled: DENOMINATION */
  beat('s10-ask',       B.QUESTION),                            /* which has the biggest value? */
  beat('s10-done',      B.CELEBRATION, { hold: true }),         /* ₹20 — the number tells us the value */
]);

const COINS = SCENE10.coins;
const STAGE = {
  wide: {
    table: { apron: 9, top: 27 },
    rupi: { x: 11, y: 16, h: 48 },
    row: [{ x: 29, y: 19 }, { x: 43, y: 19 }, { x: 57, y: 19 }, { x: 71, y: 19 }, { x: 85, y: 19 }],
    d: 16, tagY: 11.5,
    held: { x: 50, y: 30, d: 32 },
    bubbleW: 30,
    cams: {
      establish: frame('WIDE', { x: 50, y: 52 }, { dur: 1600 }),
      intro: frame('MEDIUM', { x: 50, y: 56 }, { s: 1.06, dur: 2000 }),
      look: frame('MEDIUM', { x: 52, y: 60 }, { s: 1.06, dur: 2400 }),
      row: frame('WIDE', { x: 50, y: 54 }, { dur: 1600 }),
    },
  },
  tall: {
    table: { apron: 8, top: 46 },
    rupi: { x: 21, y: 40, h: 30 },
    /* two rows on a phone: three behind, two in front — nothing overlaps */
    row: [{ x: 18, y: 31 }, { x: 50, y: 31 }, { x: 82, y: 31 }, { x: 34, y: 15 }, { x: 66, y: 15 }],
    d: 12, tagY: [27, 27, 27, 11, 11],
    held: { x: 50, y: 18, d: 26 },
    bubbleW: 86,
    cams: {
      establish: frame('WIDE', { x: 50, y: 50 }, { dur: 1600 }),
      intro: frame('WIDE', { x: 50, y: 52 }, { dur: 2000 }),
      look: frame('MEDIUM', { x: 50, y: 58 }, { s: 1.04, dur: 2000 }),
      row: frame('WIDE', { x: 50, y: 52 }, { dur: 1600 }),
    },
  },
};

const CONTRACT = {
  name: 'coins10',
  script: SCRIPT_10,
  preload: [A.P5BG, A.CH.rupi, ...COINS.flatMap(c => [A.COINF[c.i], A.COINB[c.i]])],
  needs: { 's10-intro': COINS.flatMap(c => [A.COINF[c.i], A.COINB[c.i]]) },
};

function Scene10({ focusMode, blip, onSolved }) {
  useInputModality();
  const { layout, director, rootProps } = useCinematicScene(CONTRACT, { scene: 10 });
  const [held, setHeld] = useState(null);        /* coin value lifted towards the class */
  const [miss, setMiss] = useState(null);        /* { v, n } a wrong pick */
  const st = STAGE[layout];
  const b = director.beat, at = director.at;
  const L = SCENE10.lines;

  const explore = b === 's10-explore' || b === 's10-done';
  const asking = b === 's10-ask';
  const heldCoin = held != null ? COINS.find(c => c.v === held) : null;

  const tap = c => {
    if (asking) {
      if (c.v === 20) {
        if (blip) blip(980);
        setMiss(null);
        director.goTo('s10-done');
        if (onSolved) onSolved();
      } else {
        if (blip) blip(330, 'triangle');
        setMiss(m => ({ v: c.v, n: m ? m.n + 1 : 1 }));
      }
      return;
    }
    if (explore) { setHeld(h => (h === c.v ? null : c.v)); if (blip) blip(700 + c.i * 50); }
  };
  const leave = id => { setHeld(null); setMiss(null); director.goTo(id); };
  const replay = () => { setHeld(null); setMiss(null); director.reset('s10-establish'); };

  const named = heldCoin ? '₹' + heldCoin.v + ' — ' + heldCoin.name + '!' : null;
  const line = b === 's10-intro' ? [L.intro]
    : b === 's10-look' ? [L.look]
    : b === 's10-explore' ? [named || L.tap]
    : b === 's10-denom' ? L.denom
    : asking ? (miss ? [L.wrong] : null)
    : b === 's10-done' ? [named || L.right]
    : null;
  const rupiState = b === 's10-intro' ? ['reach', 'talk'] : b === 's10-look' ? ['lean', 'talk'] : b === 's10-denom' ? ['point', 'talk']
    : asking ? (miss ? ['think', 'talk'] : 'idle') : b === 's10-done' ? 'cheer' : 'lean';

  const cam = b === 's10-establish' ? st.cams.establish : b === 's10-intro' ? st.cams.intro : b === 's10-look' ? st.cams.look : st.cams.row;
  const tagY = k => (Array.isArray(st.tagY) ? st.tagY[k] : st.tagY);
  const brightV = b === 's10-done' && held == null ? 20 : null;
  const tagsOn = at('s10-denom');

  const teacher = at('s10-explore') ? SCENE10.teacher : { ...SCENE10.teacher, cue: SCENE10.watchCue };
  const caption = useMemo(() => (line ? 'Rupi: ' + line.map(l => (typeof l === 'string' ? l : l.map(s => s.t).join(''))).join(' ') : ''), [b, held, miss]);

  return (
    <section {...rootProps} className={'counter coins10 layout-' + layout + (director.playing ? '' : ' is-paused')}
      aria-label={'Scene 10: ' + SCENE10.title}>
      <Plate src={A.P5BG} alt="Rupi's money counter at the edge of the village market, with coins on it"
        focusX={layout === 'tall' ? 36 : 50} camera={cam} reduced={director.reduced} coupled maxUpscale={1.2}
        atmosphere={<EnvironmentLayer mood={b === 's10-done' ? 'bright' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {b === 's10-explore' && (
              <CounterAsk id="q10x" question={held == null ? L.tap : 'Drag it to turn it over'} kicker={held == null ? 'Explore' : '₹' + held + ' coin'}>
                <span className="cp-row">
                  {held != null && <button type="button" className="cp-putback" onClick={() => setHeld(null)}>Put it back</button>}
                  <Next onClick={() => leave('s10-denom')}>Show me the number</Next>
                </span>
              </CounterAsk>
            )}
            {b === 's10-denom' && (
              <p className="cp-note" role="status"><b>{SCENE10.denomWord}</b> — {SCENE10.denomLine}</p>
            )}
            {asking && <CounterAsk id="q10" question={SCENE10.question} kicker={SCENE10.kicker}/>}
            {b === 's10-done' && (held == null
              ? <p className="cp-note" role="status">{SCENE10.takeaway}</p>
              : <CounterAsk id="q10d" question="Drag it to turn it over" kicker={'₹' + held + ' coin'}>
                  <span className="cp-row"><button type="button" className="cp-putback" onClick={() => setHeld(null)}>Put it back</button></span>
                </CounterAsk>)}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 10 · ' + SCENE10.title} teacher={teacher}
                playing={director.playing} onToggle={director.toggle} onReplay={replay}/>
            )}
            {!director.playing && <span className="counter-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        <Actor src={A.CH.rupi} alt="Rupi, at the money counter" position={st.rupi} state={rupiState} toward={1}
          walkMs={1600} cue={b + (held || '') + (miss ? miss.n : '')} zIndex={2} reduced={director.reduced}/>

        <Counter table={st.table}/>

        {COINS.map((c, k) => {
          const s = held === c.v ? 'held' : at('s10-intro') ? 'stand' : 'off';
          const p = st.row[k];
          return (
            <Piece key={c.v} item={{ kind: 'coin', i: c.i }} at={s === 'held' ? { x: st.held.x, y: st.held.y } : p}
              size={s === 'held' ? st.held.d : st.d} state={s} from={{ dx: 0, dy: 16 }} reduced={director.reduced}
              delay={b === 's10-intro' ? 0.4 + k * 0.45 : 0} still={s !== 'held'} turning={s === 'held'}
              bright={brightV === c.v} nope={miss && miss.v === c.v} z={s === 'held' ? 12 : undefined}
              label={'₹' + c.v + ' coin — ' + c.name} drag={s === 'held'}
              onPick={(explore || asking) && s !== 'off' ? () => tap(c) : undefined}/>
          );
        })}
        {COINS.map((c, k) => (
          <Tag key={'t' + c.v} at={{ x: st.row[k].x, y: tagY(k) }} on={tagsOn && held !== c.v && !asking} gold={brightV === c.v}>₹{c.v}</Tag>
        ))}

        <SpeechBubble speaker={st.rupi} width={st.bubbleW} centerX={fitX(cam, st.rupi.x, st.bubbleW)} lines={line || ['']} show={!!line}
          size={b === 's10-intro' ? 'lg' : undefined} em/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene10 };
