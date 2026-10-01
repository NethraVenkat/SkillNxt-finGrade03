import React, { useEffect, useLayoutEffect, useRef } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { MoneyBody, RIM } from '../currency/MoneyBody';
import { SCENE16 } from '../data/sortIntroContent';
import { SCENE17 } from '../data/teamSortContent';
import { SCENE18 } from '../data/finalRecapContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import './scene13.css';   /* the shared counter and 3D money body */
import './scene15.css';   /* the money box */
import './scene16.css';   /* the pile and the nine trays */
import './scene17.css';   /* the split-flap sign */
import './scene18.css';

/* ════════ Scene 18 — "Final Recap" — the whole journey, told by the world itself ════════
   It opens on Scene 17's last frame (TIME'S UP!). The counter is cleared to the
   class's nine piles; the sign flips to "Final Recap" and the light warms.
   Rupi walks through the four ideas, and the story world acts each one out:
     BARTER         the farmer (wheat) and the milk seller (milk) walk in and offer to swap
     THE PROBLEM    the milk seller refuses — a ✕ hangs between them
     MONEY          Rupi steps in; a ₹10 coin arcs from the farmer to the seller — ✓
     DENOMINATIONS  every pile receives its own coin or note, ₹1 → ₹500
   "You are now Money Explorers!" — then Rupi asks the final question, the class
   answers aloud, and the answer flips onto the sign. Finish Adventure opens.
   The world is the crisp village-market plate. No filter, blur, :has() or particles. */

const R = SCENE18;
const SCRIPT_18 = checkScript('recap18', [
  beat('s18-bridge',    B.WIDE,        { ms: 1400, rm: 1000 }),  /* Scene 17's TIME'S UP, as we left it */
  beat('s18-clear',     B.OBJECT_MOVE, { ms: 2600, rm: 1100 }),  /* calm: the counter cleared to the nine piles */
  beat('s18-barter',    B.DIALOGUE,    { ms: 4400, rm: 3800 }),
  beat('s18-problem',   B.DIALOGUE,    { ms: 4400, rm: 3800 }),
  beat('s18-money',     B.DIALOGUE,    { ms: 4800, rm: 3800 }),
  beat('s18-denoms',    B.DIALOGUE,    { ms: 5000, rm: 3800 }),
  beat('s18-explorers', B.CELEBRATION, { ms: 3800, rm: 3200 }),  /* "You are now Money Explorers!" */
  beat('s18-ask',       B.QUESTION),                            /* "Why do people use money?" — the class answers aloud */
  beat('s18-answer',    B.CELEBRATION, { hold: true }),          /* the answer, and the end */
]);
const at = id => SCRIPT_18.findIndex(b => b.id === id);
const IDEA = { barter: 0, problem: 1, money: 2, denoms: 3 };

const FARMER = { src: A.CH.farmer, alt: 'The farmer with his wheat', ratio: 429 / 978 };
const SELLER = { src: A.CH.milk, alt: 'The milk seller with his milk can', ratio: 414 / 978 };

/* Scene 17's world (itself Scene 16's) — the same counter, trays and sign continue */
const WORLD = {
  wide: {
    rupi: { start: { x: 17, y: 16, h: 46 }, side: { x: 13, y: 16, h: 46 }, mid: { x: 50, y: 16, h: 46 } },
    farmer: { off: { x: -16, y: 16, h: 50 }, on: { x: 33, y: 16, h: 50 } },
    seller: { off: { x: 118, y: 16, h: 50 }, on: { x: 67, y: 16, h: 50 } },
    table: { apron: 9, top: 27 },
    box: { x: 32, w: 15, h: 9, base: 14.5, back: 19 },
    sign: { x: 60, w: 30, h: 11, y: 76 }, signTo: 4,       /* the sign drifts a little right, clear of Rupi's lines */
    trays: SCENE16.piles.map((v, k) => ({ x: 9.5 + k * 10.12, y: 9.8, w: 9.2, h: 7.5 })),
    pile: [[42, 20.4, -14], [49, 23.2, 8], [56, 19.8, 24], [63, 22.4, -6], [46, 18.8, 36], [53, 24.2, -28], [60, 19, 60], [67, 20.2, 12], [44, 22.6, -40], [70, 23.4, -18]],
    flat: { coin: 5.6, note: 11.5 },
    mark: { x: 50, y: 66.5, s: 5 },                         /* ✕ / ✓: above the heads, below the sign */
    coin: { from: { x: 39, y: 42 }, to: { x: 62, y: 38 }, w: 6 },
    bubbleW: 26, bubbleX: 31,
    cams: {
      bridge: frame('WIDE', { x: 50, y: 50 }, { dur: 1 }),
      clear: frame('PULL_OUT', { x: 50, y: 50 }, { dur: 2200 }),
      barter: frame('MEDIUM', { x: 50, y: 50 }, { s: 1, dur: 1600 }),
      problem: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      money: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      denoms: frame('WIDE', { x: 50, y: 52 }, { dur: 1400 }),
      explorers: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
      ask: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      answer: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
    },
  },
  /* phones / portrait: Rupi stands between the farmer and the milk seller throughout */
  tall: {
    rupi: { start: { x: 19, y: 41, h: 28 }, side: { x: 50, y: 41, h: 28 }, mid: { x: 50, y: 41, h: 28 } },
    farmer: { off: { x: -25, y: 41, h: 31 }, on: { x: 22, y: 41, h: 31 } },
    seller: { off: { x: 125, y: 41, h: 31 }, on: { x: 78, y: 41, h: 31 } },
    table: { apron: 8, top: 43 },
    box: { x: 22, w: 30, h: 5.5, base: 25, back: 30 },
    sign: { x: 50, w: 84, h: 6.5, y: 85.5 }, signTo: 0, signH: 9, signY: 84,
    trays: SCENE16.piles.map((v, k) => (k < 5
      ? { x: 11 + k * 19.5, y: 17.4, w: 18, h: 7 }
      : { x: 20.75 + (k - 5) * 19.5, y: 8.8, w: 18, h: 7 })),
    pile: [[46, 32, -14], [56, 34.5, 8], [66, 31.2, 24], [76, 33.8, -6], [51, 30.2, 36], [61, 35.6, -28], [71, 30.6, 60], [82, 31.8, 12], [47.5, 34.8, -40], [86, 35.4, -18]],
    flat: { coin: 8.5, note: 17 },
    mark: { x: 50, y: 76, s: 5 },
    coin: { from: { x: 30, y: 58 }, to: { x: 71, y: 56 }, w: 11 },
    bubbleW: 60, bubbleX: undefined,
    cams: {
      bridge: frame('WIDE', { x: 50, y: 50 }, { dur: 1 }),
      clear: frame('PULL_OUT', { x: 50, y: 50 }, { dur: 2200 }),
      barter: frame('WIDE', { x: 50, y: 50 }, { dur: 1600 }),
      problem: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      money: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      denoms: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
      explorers: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
      ask: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      answer: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
    },
  },
};
const DEMO_K = SCENE16.piles.indexOf(SCENE16.demo.v);

const RECAP18 = {
  name: 'recap18',
  script: SCRIPT_18,
  preload: [A.P5BG, A.CH.rupi, A.CH.farmer, A.CH.milk, A.COINF[3], A.COINB[3], A.NOTEF[SCENE16.demo.i],
    ...R.sorted.map(s => (s.kind === 'coin' ? A.COINF[s.i] : A.NOTEF[s.i])), ...SCENE16.pile.map(p => (p.kind === 'coin' ? A.COINF[p.i] : A.NOTEF[p.i]))],
  /* the farmer and the milk seller only walk in once their artwork is ready (engine caps the wait at 1.5 s) */
  needs: { 's18-barter': [A.CH.farmer, A.CH.milk], 's18-money': [A.COINF[3], A.COINB[3]] },
};

function Reveal({ onReveal, homeRef }) {
  const ref = useRef(null);
  useEffect(() => {
    if (document.documentElement.dataset.mqInput !== 'key' || !ref.current) return;
    ref.current.focus({ preventScroll: true });
  }, []);
  useLayoutEffect(() => () => {
    if (ref.current && ref.current === document.activeElement && homeRef.current) homeRef.current.focus({ preventScroll: true });
  }, [homeRef]);
  return (
    <div className="c17-controls c18-controls">
      <button ref={ref} type="button" className="c17-btn go" onClick={onReveal}>{R.reveal}</button>
    </div>
  );
}

function Scene18({ scene, focusMode, blip, onSolved }) {
  useInputModality();
  const { layout, director, rootProps, stageRef } = useCinematicScene(RECAP18, { scene });
  const w = WORLD[layout];
  const beatId = director.beat;
  const phase = beatId.slice(4);
  const idx = at(beatId);
  const past = id => idx >= at(id);

  useEffect(() => { if (phase === 'answer') { if (onSolved) onSolved(); if (blip) blip(880); } }, [phase, onSolved, blip]);

  /* ── the sign: one face per moment, flipped like a split-flap board ── */
  const idea = IDEA[phase] != null ? R.ideas[IDEA[phase]] : null;
  const face = phase === 'bridge' ? { big: SCENE17.timesUp }
    : idea ? { word: idea.word, line: idea.line }
    : phase === 'ask' ? { big: R.question }                    /* the final question, large enough for the class to read */
    : phase === 'answer' ? { big: R.answer }
    : { big: R.sign };
  const flipKey = phase === 'bridge' ? 'up' : idea ? idea.key : phase === 'ask' ? 'ask' : phase === 'answer' ? 'answer' : 'recap';

  /* ── the cast ── */
  const castIn = past('s18-barter');
  const farmerState = !castIn ? 'idle'
    : phase === 'barter' ? ['walk', 'offer']
    : phase === 'problem' ? ['sad']
    : phase === 'money' ? ['offer', 'nod']
    : phase === 'denoms' ? 'idle'
    : ['cheer'];
  const sellerState = !castIn ? 'idle'
    : phase === 'barter' ? ['walk', 'lean']
    : phase === 'problem' ? ['protect', 'reject']
    : phase === 'money' ? ['lean', 'nod']
    : phase === 'denoms' ? 'idle'
    : ['cheer'];
  const rupiPos = phase === 'bridge' ? w.rupi.start : phase === 'money' ? w.rupi.mid : w.rupi.side;
  const rupiState = phase === 'clear' ? 'walk'
    : phase === 'barter' ? ['point', 'talk']
    : phase === 'problem' ? ['think']
    : phase === 'money' ? ['reach', 'talk']
    : phase === 'denoms' ? ['point', 'talk']
    : phase === 'explorers' ? ['cheer', 'talk']
    : phase === 'ask' ? ['lean', 'talk']
    : phase === 'answer' ? ['cheer'] : 'idle';
  const line = phase === 'explorers' ? R.explorers : null;
  const mark = phase === 'problem' ? 'no' : phase === 'money' ? 'yes' : null;
  const filled = past('s18-denoms');
  const homeRef = useRef(null); homeRef.current = stageRef.current;
  const caption = idea ? idea.word + ': ' + idea.line : line ? 'Rupi: ' + line : phase === 'ask' ? 'Rupi asks: ' + R.question : phase === 'answer' ? R.answer : '';
  const cam = w.cams[phase];

  return (
    <section {...rootProps} className={'recap18 layout-' + layout + (director.playing ? '' : ' is-paused') + (director.reduced ? ' is-reduced' : '')}
      aria-label={'Scene 18: ' + R.title}>
      <Plate src={A.P5BG} alt="The village market, warm and calm, at the end of the journey"
        focusX={layout === 'tall' ? 36 : 50} camera={cam} reduced={director.reduced} coupled
        atmosphere={<EnvironmentLayer mood={phase === 'problem' ? 'quiet' : phase === 'bridge' || phase === 'explorers' || phase === 'answer' || phase === 'money' || phase === 'denoms' ? 'bright' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {phase === 'ask' && <Reveal homeRef={homeRef} onReveal={() => director.goTo('s18-answer')}/>}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 18 · ' + R.title} teacher={R.teacher}
                playing={director.playing} onToggle={director.toggle}
                onReplay={() => director.reset('s18-bridge')}/>
            )}
            {!director.playing && <span className="c13-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        <Actor src={A.CH.rupi} alt="Rupi" position={rupiPos} state={rupiState} toward={1}
          walkMs={phase === 'clear' ? 1800 : 1600} cue={beatId} zIndex={3} reduced={director.reduced}/>
        {past('s18-clear') && (
          <React.Fragment>
            <Actor {...FARMER} position={castIn ? w.farmer.on : w.farmer.off} state={farmerState} toward={1}
              walkMs={2200} cue={beatId} zIndex={2} idle={false} reduced={director.reduced}/>
            <Actor {...SELLER} position={castIn ? w.seller.on : w.seller.off} state={sellerState} toward={-1}
              walkMs={2200} cue={beatId} zIndex={2} idle={false} reduced={director.reduced}/>
          </React.Fragment>
        )}

        {/* the hanging sign: TIME'S UP → Final Recap → each idea → the answer */}
        <div className={'c16-sign c17-sign big c18-sign' + (phase === 'bridge' ? ' up' : '') + (face.big ? '' : ' words')} role="heading" aria-level={2}
          style={{ left: (w.sign.x - w.sign.w / 2) + 'cqw', width: w.sign.w + 'cqw', bottom: (phase !== 'bridge' && w.signY ? w.signY : w.sign.y) + 'cqh',
            height: (phase !== 'bridge' && w.signH ? w.signH : w.sign.h) + 'cqh', translate: phase === 'bridge' ? '0 0' : w.signTo + 'cqw 0' }}>
          <span className="c16-rope l"/><span className="c16-rope r"/>
          <b className="c17-face" key={flipKey}>
            {face.word && <small>{face.word}</small>}
            {face.big || face.line}
          </b>
        </div>

        {/* ✕ then ✓, hung between the farmer and the milk seller */}
        {mark && (
          <span className={'c18-mark ' + mark} key={mark} aria-hidden="true"
            style={{ left: w.mark.x + 'cqw', bottom: w.mark.y + 'cqh', width: w.mark.s + 'cqh', height: w.mark.s + 'cqh' }}>{mark === 'no' ? '✕' : '✓'}</span>
        )}

        <div className="c13-table" style={{ '--apron': w.table.apron + 'cqh', '--top': w.table.top + 'cqh' }} aria-hidden="true">
          <div className="c13-surface"><i/><i/><i/><i/><span className="c13-farshade"/></div>
          <div className="c13-apron">{[1, 2, 3, 4, 5].map(k => <i key={k} style={{ left: (k * 100 / 6) + '%' }}/>)}</div>
        </div>

        {/* what the sort left on the counter is cleared away (rendered only until then) */}
        {idx <= at('s18-clear') && (
          <div className={'c18-clearing' + (phase === 'bridge' ? '' : ' gone')} aria-hidden="true" style={director.reduced ? { transition: 'none' } : null}>
            <div className="c15-box c16-box"
              style={{ left: (w.box.x - w.box.w / 2) + 'cqw', width: w.box.w + 'cqw', bottom: w.box.base + 'cqh', height: w.box.h + 'cqh', transform: 'translateY(' + -(w.box.back - w.box.base) + 'cqh)' }}>
              <span className="c15-lid"/><i/><i/>
            </div>
            <div className="c16-pile out">
              {SCENE16.pile.map((p, k) => {
                const [x, y, r] = w.pile[k];
                return (
                  <span key={k} className={'c16-flat c16-' + p.kind} style={{ '--x': x, '--y': y, '--r': r + 'deg', '--x0': x, '--y0': y, '--d': '0ms', width: (p.kind === 'coin' ? w.flat.coin : w.flat.note) + 'cqw', transition: 'none' }}>
                    <img src={p.kind === 'coin' ? A.COINF[p.i] : A.NOTEF[p.i]} alt="" draggable="false"/>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* the nine piles: in DENOMINATIONS each receives its own coin or note */}
        <div className={'c16-trays' + (phase === 'denoms' && !director.reduced ? ' c18-lit' : '')} role="list" aria-label="The nine piles: ₹1, ₹2, ₹5, ₹10, ₹20, ₹50, ₹100, ₹200, ₹500">
          {SCENE16.piles.map((v, k) => {
            const t = w.trays[k], s = R.sorted[k];
            return (
              <div key={v} role="listitem" className={'c16-tray c17-tray' + (k === DEMO_K ? ' is-right' : '') + (filled ? ' c18-full' : '')}
                aria-label={filled ? '₹' + v + ' pile, with a ₹' + v + ' ' + s.kind + ' in it' : '₹' + v + ' pile'}
                style={{ left: (t.x - t.w / 2) + 'cqw', bottom: t.y + 'cqh', width: t.w + 'cqw', height: t.h + 'cqh', '--k': k }}>
                <span className="c16-tray-in">
                  {(filled || k === DEMO_K) && (
                    <img className={'c16-landed c18-in c18-k-' + s.kind + (filled && k !== DEMO_K ? ' drop' : '')} alt="" draggable="false"
                      src={s.kind === 'coin' ? A.COINF[s.i] : A.NOTEF[s.i]}/>
                  )}
                  <b className="c16-label">₹{v}</b>
                </span>
              </div>
            );
          })}
        </div>

        {/* MONEY: a ₹10 coin passes from the farmer to the milk seller (the only 3D money here, only while it is needed) */}
        {phase === 'money' && (
          <div className="c13-obj c13-coin is-stand c18-coin" aria-hidden="true"
            style={{ '--w': w.coin.w + 'cqw', '--rim': RIM[3], '--x0': w.coin.from.x, '--y0': w.coin.from.y, '--x': w.coin.to.x, '--y': w.coin.to.y,
              '--xm': (w.coin.from.x + w.coin.to.x) / 2, '--ym': Math.max(w.coin.from.y, w.coin.to.y) + 12,
              transform: 'translate3d(calc(' + w.coin.to.x + 'cqw - 50%), ' + (-w.coin.to.y) + 'cqh, 0)' }}>
            <span className="c13-shadow"/>
            <div className="c13-roll"><div className="c13-lay"><MoneyBody kind="coin" i={3}/></div></div>
          </div>
        )}

        {/* wide frames: the farmer stands beside Rupi, so Rupi's line is raised clear of the farmer's head (left of the sign) */}
        <SpeechBubble speaker={layout === 'wide' ? { ...rupiPos, h: 52.5 } : rupiPos} width={w.bubbleW} lines={[line || '']} show={!!line}
          size={phase === 'explorers' && layout === 'wide' ? 'lg' : undefined} centerX={layout === 'wide' ? w.bubbleX : undefined}/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene18 };
