import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { MoneyBody, RIM } from '../currency/MoneyBody';
import { SCENE16 } from '../data/sortIntroContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import './scene13.css';   /* the shared counter and 3D money body */
import './scene15.css';   /* Scene 15's game corner, as it is left at the start of this scene */
import './scene16.css';

/* ════════ Scene 16 — "Classroom Challenge Intro" — the sorting challenge is set up ════════
   It opens on Scene 15's last frame (the money box, the reveal block, the star
   board with five stars). The camera pulls back: the game pieces are cleared,
   a hanging wooden sign drops in and swings to rest — "Money Sorting
   Challenge!" — the money box tips and a mixed pile of money spills across the
   counter, and nine wooden sorting trays (₹1 … ₹500) slide up along its front
   edge: the piles are physical destinations. Rupi: "Now YOU become Money
   Organisers!" He lifts one piece out of the pile — a ₹50 note — and asks how
   we know which pile it belongs in. The class taps a tray; the right one takes
   the note: "Look at the number — the denomination!"

   The blueprint places this in a classroom; the supplied classroom plate has
   blur painted into it, so the challenge is set up on the crisp market counter.
   The pile is flat 2D art (cheap); only the lifted note is a 3D body. */

const PILES = SCENE16.piles, DEMO = SCENE16.demo;
const DEMO_K = PILES.indexOf(DEMO.v);

const SCRIPT_16 = checkScript('sort16', [
  beat('s16-bridge', B.WIDE,         { ms: 1400, rm: 1000 }),  /* Scene 15's game corner, as we left it */
  beat('s16-sign',   B.OBJECT_MOVE,  { ms: 2400, rm: 1000 }),  /* cleared away; the challenge sign drops in */
  beat('s16-spill',  B.OBJECT_MOVE,  { ms: 2200, rm: 900 }),   /* the money box tips: a mixed pile */
  beat('s16-trays',  B.OBJECT_MOVE,  { ms: 2700, rm: 1100 }),  /* nine sorting trays slide up */
  beat('s16-rupi',   B.DIALOGUE,     { ms: 3200, rm: 2800 }),  /* "Now YOU become Money Organisers!" */
  beat('s16-lift',   B.OBJECT_FOCUS, { ms: 2400, rm: 1400 }),  /* one piece is lifted out of the pile */
  beat('s16-ask',    B.QUESTION),                             /* "How do you know which pile it belongs in?" */
  beat('s16-right',  B.CORRECT,      { ms: 2800, rm: 2200 }),  /* the note lands in its tray */
  beat('s16-done',   B.CELEBRATION,  { hold: true }),
]);
const at = id => SCRIPT_16.findIndex(b => b.id === id);

/* Scene 15's final frame, reproduced exactly so the cut is invisible */
const BRIDGE = {
  wide: { rupi: { x: 17, y: 16, h: 46 }, base: 14.5, box: { x: 32, w: 15, h: 9 }, block: { x: 57, w: 19, h: 8 }, board: { x: 84, w: 19, h: 17, base: 25 },
    cam: frame('PULL_OUT', { x: 54, y: 55 }, { s: 1.04, dur: 1 }) },
  tall: { rupi: { x: 19, y: 41, h: 28 }, base: 25, box: { x: 22, w: 30, h: 5.5 }, block: { x: 63, w: 34, h: 5.5 }, board: { x: 70, w: 40, h: 8, base: 48 },
    cam: frame('PULL_OUT', { x: 50, y: 54 }, { s: 1, dur: 1 }) },
};

/* the challenge set-up. x/w in cqw, y/h in cqh (from the floor) */
const STAGE = {
  wide: {
    rupi: { x: 17, y: 16, h: 46 },
    table: { apron: 9, top: 27 },
    boxBack: 19,                                             /* the box is pushed to the back of the counter */
    sign: { x: 60, w: 30, h: 11, y: 76 },
    trays: PILES.map((v, k) => ({ x: 9.5 + k * 10.12, y: 9.8, w: 9.2, h: 7.5 })),
    pile: [[42, 20.4, -14], [49, 23.2, 8], [56, 19.8, 24], [63, 22.4, -6], [46, 18.8, 36], [53, 24.2, -28], [60, 19, 60], [67, 20.2, 12], [44, 22.6, -40], [70, 23.4, -18]],
    lifted: { x: 55, y: 20.5 }, hover: { x: 60, y: 38 }, noteW: 26,
    flat: { coin: 5.6, note: 11.5 },
    bubbleW: 24,
    cams: {
      sign: frame('PULL_OUT', { x: 50, y: 50 }, { s: 1, dur: 2200 }),
      spill: frame('MEDIUM', { x: 50, y: 60 }, { s: 1.08, dur: 1300 }),
      trays: frame('WIDE', { x: 50, y: 52 }, { dur: 1400 }),
      rupi: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      /* the nine trays span the whole counter: any push-in would cut one off, so the lift stays wide */
      lift: frame('MEDIUM', { x: 50, y: 48 }, { s: 1, dur: 1500 }),
      ask: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),             /* all nine trays in frame to choose from */
      right: frame('WIDE', { x: 50, y: 52 }, { dur: 900 }),
      done: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
    },
  },
  /* phones / portrait: two rows of trays along the counter's front, the pile behind them */
  tall: {
    rupi: { x: 19, y: 41, h: 28 },
    table: { apron: 8, top: 43 },
    boxBack: 30,
    sign: { x: 50, w: 84, h: 6.5, y: 85.5 },          /* under the teacher controls, above Rupi's lines */
    trays: PILES.map((v, k) => (k < 5
      ? { x: 11 + k * 19.5, y: 17.4, w: 18, h: 7 }
      : { x: 20.75 + (k - 5) * 19.5, y: 8.8, w: 18, h: 7 })),
    pile: [[46, 32, -14], [56, 34.5, 8], [66, 31.2, 24], [76, 33.8, -6], [51, 30.2, 36], [61, 35.6, -28], [71, 30.6, 60], [82, 31.8, 12], [47.5, 34.8, -40], [86, 35.4, -18]],
    lifted: { x: 64, y: 32 }, hover: { x: 62, y: 47 }, noteW: 50,
    flat: { coin: 8.5, note: 17 },
    bubbleW: 56,
    cams: {
      sign: frame('PULL_OUT', { x: 50, y: 50 }, { s: 1, dur: 2200 }),
      /* phones: the frame is already full — no push-ins that would cut off a tray or a line */
      spill: frame('MEDIUM', { x: 50, y: 52 }, { s: 1, dur: 1300 }),
      trays: frame('WIDE', { x: 50, y: 52 }, { dur: 1400 }),
      rupi: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      lift: frame('MEDIUM', { x: 50, y: 50 }, { s: 1, dur: 1500 }),
      ask: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      right: frame('WIDE', { x: 50, y: 52 }, { dur: 900 }),
      done: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
    },
  },
};

const SORT16 = {
  name: 'sort16',
  script: SCRIPT_16,
  preload: [A.P5BG, A.CH.rupi, A.NOTEF[DEMO.i], A.NOTEB[DEMO.i], ...SCENE16.pile.map(p => (p.kind === 'coin' ? A.COINF[p.i] : A.NOTEF[p.i]))],
  needs: { 's16-spill': SCENE16.pile.map(p => (p.kind === 'coin' ? A.COINF[p.i] : A.NOTEF[p.i])), 's16-lift': [A.NOTEF[DEMO.i], A.NOTEB[DEMO.i]] },
};

const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l3.1 6.6 7.1.9-5.2 5 1.3 7.1L12 18l-6.3 3.4 1.3-7.1-5.2-5 7.1-.9z"/></svg>
);

/* the nine sorting trays: physical destinations, and the answer controls */
function Trays({ st, phase, miss, onPick, homeRef, layout, landed }) {
  const ref = useRef(null);
  const live = phase === 'ask';
  useLayoutEffect(() => () => {
    if (ref.current && ref.current.contains(document.activeElement) && homeRef.current) homeRef.current.focus({ preventScroll: true });
  }, [homeRef]);
  useEffect(() => {
    if (!live || document.documentElement.dataset.mqInput !== 'key' || !ref.current) return;
    if (ref.current.contains(document.activeElement)) return;
    const b = ref.current.querySelector('.c16-tray');
    if (b) b.focus({ preventScroll: true });
  }, [live]);
  /* arrows move between trays and stay here (never the lesson's scene navigation); on phones ↑ ↓ change row */
  const keys = e => {
    const bs = [...ref.current.querySelectorAll('.c16-tray')];
    const i = bs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % bs.length;
    else if (e.key === 'ArrowLeft') j = (i + bs.length - 1) % bs.length;
    else if (layout === 'tall' && e.key === 'ArrowDown') j = i < 5 ? Math.min(i + 5, 8) : i;
    else if (layout === 'tall' && e.key === 'ArrowUp') j = i >= 5 ? i - 5 : i;
    if (j == null) return;
    e.preventDefault(); e.stopPropagation();
    bs[j].focus();
  };
  return (
    <div ref={ref} className={'c16-trays' + (live ? '' : ' is-waiting')} role="group" aria-label="The nine piles" onKeyDown={keys}>
      {PILES.map((v, k) => {
        const t = st.trays[k];
        const right = (phase === 'right' || phase === 'done') && k === DEMO_K;
        const wrong = live && miss && miss.k === k;
        return (
          <button key={v} type="button" aria-disabled={!live} aria-label={'The ₹' + v + ' pile'}
            className={'c16-tray' + (right ? ' is-right' : '') + (wrong ? ' is-wrong' : '')}
            style={{ left: (t.x - t.w / 2) + 'cqw', bottom: t.y + 'cqh', width: t.w + 'cqw', height: t.h + 'cqh', '--k': k }}
            onClick={() => live && onPick(k)}>
            <span className="c16-tray-in" key={wrong ? miss.n : 0}>
              {landed && k === DEMO_K && <img className="c16-landed" src={A.NOTEF[DEMO.i]} alt="" draggable="false"/>}
              <b className="c16-label">₹{v}</b>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Scene16({ scene, focusMode, blip, onSolved }) {
  useInputModality();
  const { layout, director, rootProps, stageRef } = useCinematicScene(SORT16, { scene });
  const st = STAGE[layout], br = BRIDGE[layout];
  const beatId = director.beat;
  const phase = beatId.slice(4);
  const idx = at(beatId);
  const [miss, setMiss] = useState(null);               /* { k, n } — a wrong tray */
  const missNow = phase === 'ask' ? miss : null;

  const pick = k => {
    if (phase !== 'ask') return;
    if (k === DEMO_K) { if (blip) blip(960); setMiss(null); director.goTo('s16-right'); }
    else { if (blip) blip(330, 'triangle'); setMiss(m => ({ k, n: m ? m.n + 1 : 1 })); }
  };
  useEffect(() => { if (phase === 'done' && onSolved) onSolved(); }, [phase, onSolved]);
  useEffect(() => { if (idx < at('s16-ask')) setMiss(null); }, [idx]);

  /* ── direction ── */
  const cam = phase === 'bridge' ? br.cam : st.cams[phase];
  const cleared = idx >= at('s16-sign');
  const spilled = idx >= at('s16-spill');
  const traysUp = idx >= at('s16-trays');
  const lifted = idx >= at('s16-lift');
  const landed = idx >= at('s16-right');
  const rupiPos = phase === 'bridge' ? br.rupi : st.rupi;
  const L = SCENE16.lines;
  const line = phase === 'rupi' ? L.rupi
    : phase === 'lift' || (phase === 'ask' && !missNow) ? L.ask
    : phase === 'ask' ? L.wrong
    : phase === 'right' ? L.right
    : phase === 'done' ? L.done : null;
  const rupiState = phase === 'sign' ? ['lean', 'surprised']
    : phase === 'spill' ? 'point'
    : phase === 'trays' ? ['lean', 'nod']
    : phase === 'rupi' ? ['reach', 'cheer']
    : phase === 'lift' ? ['reach', 'talk']
    : phase === 'ask' ? (missNow ? ['think', 'talk'] : 'idle')
    : phase === 'right' ? ['lean', 'nod']
    : phase === 'done' ? ['cheer', 'talk'] : 'idle';
  const homeRef = useRef(null); homeRef.current = stageRef.current;
  const teacher = idx >= at('s16-ask') ? SCENE16.teacher : { ...SCENE16.teacher, cue: SCENE16.watchCue };
  const caption = line ? 'Rupi: ' + line : '';

  /* the lifted note: lying in the pile → standing in the air → lying in the ₹50 tray */
  const tray = st.trays[DEMO_K];
  const note = landed ? { x: tray.x, y: tray.y + tray.h * 0.28, s: 0.3, lay: 72 }
    : lifted ? { x: st.hover.x, y: st.hover.y, s: 1, lay: -6 }
    : { x: st.lifted.x, y: st.lifted.y, s: 0.36, lay: 74 };

  return (
    <section {...rootProps} className={'sort16 layout-' + layout + (director.playing ? '' : ' is-paused') + (director.reduced ? ' is-reduced' : '')}
      aria-label={'Scene 16: ' + SCENE16.title}>
      <Plate src={A.P5BG} alt="The village market counter, set up for the money sorting challenge"
        focusX={layout === 'tall' ? 36 : 50} camera={cam} reduced={director.reduced} coupled
        atmosphere={<EnvironmentLayer mood={phase === 'bridge' || phase === 'right' || phase === 'done' ? 'bright' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 16 · ' + SCENE16.sign} teacher={teacher}
                playing={director.playing} onToggle={director.toggle}
                onReplay={() => { setMiss(null); director.reset('s16-bridge'); }}/>
            )}
            {!director.playing && <span className="c13-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        <Actor src={A.CH.rupi} alt="Rupi, at the money sorting challenge" position={rupiPos} state={rupiState} toward={1}
          walkMs={1400} cue={beatId + (missNow ? missNow.n : '')} zIndex={2} reduced={director.reduced}/>

        {/* the challenge sign, hung over the counter */}
        <div className={'c16-sign' + (cleared ? ' down' : '')} role="heading" aria-level={2}
          style={{ left: (st.sign.x - st.sign.w / 2) + 'cqw', width: st.sign.w + 'cqw', bottom: st.sign.y + 'cqh', height: st.sign.h + 'cqh' }}>
          <span className="c16-rope l"/><span className="c16-rope r"/>
          <b>{SCENE16.sign}</b>
        </div>

        <div className="c13-table" style={{ '--apron': st.table.apron + 'cqh', '--top': st.table.top + 'cqh' }} aria-hidden="true">
          <div className="c13-surface"><i/><i/><i/><i/><span className="c13-farshade"/></div>
          <div className="c13-apron">{[1, 2, 3, 4, 5].map(k => <i key={k} style={{ left: (k * 100 / 6) + '%' }}/>)}</div>
        </div>

        {/* Scene 15's block and star board are cleared away (rendered only until then) */}
        {idx <= at('s16-sign') && (
          <div className={'c16-clear' + (cleared ? ' gone' : '')} aria-hidden="true" style={director.reduced ? { transition: 'none' } : null}>
            <div className="c15-block" style={{ left: (br.block.x - br.block.w / 2) + 'cqw', width: br.block.w + 'cqw', bottom: br.base + 'cqh', height: br.block.h + 'cqh' }}/>
            <div className="c15-board" style={{ left: (br.board.x - br.board.w / 2) + 'cqw', width: br.board.w + 'cqw', bottom: br.board.base + 'cqh', height: br.board.h + 'cqh' }}>
              <span className="c15-sockets">{[0, 1, 2, 3, 4].map(k => <span key={k} className="c15-socket full"><Star/></span>)}</span>
              <span className="c15-score">5 / 5</span>
            </div>
          </div>
        )}

        {/* the money box: pushed back, then tipped — the mixed pile spills out */}
        <div className={'c15-box c16-box' + (spilled && idx <= at('s16-spill') && !director.reduced ? ' tip' : '')} aria-hidden="true"
          style={{ left: (br.box.x - br.box.w / 2) + 'cqw', width: br.box.w + 'cqw', bottom: br.base + 'cqh', height: br.box.h + 'cqh',
            /* pushed to the back of the counter by transform (never an animated layout property) */
            transform: cleared ? 'translateY(' + -(st.boxBack - br.base) + 'cqh)' : 'none', transition: director.reduced ? 'none' : undefined }}>
          <span className={'c15-lid' + (phase === 'spill' && !director.reduced ? ' flip' : '')}/>
          <i/><i/>
        </div>

        <div className={'c16-pile' + (spilled ? ' out' : '')} aria-hidden={!spilled} role={spilled ? 'img' : undefined}
          aria-label={spilled ? 'A mixed pile of coins and notes' : undefined}>
          {SCENE16.pile.map((p, k) => {
            const [x, y, r] = st.pile[k];
            const w = p.kind === 'coin' ? st.flat.coin : st.flat.note;
            return (
              <span key={k} className={'c16-flat c16-' + p.kind}
                style={{ '--x': x, '--y': y, '--r': r + 'deg', '--x0': br.box.x, '--y0': st.boxBack + br.box.h, '--d': (k * 70) + 'ms', width: w + 'cqw' }}>
                <img src={p.kind === 'coin' ? A.COINF[p.i] : A.NOTEF[p.i]} alt="" draggable="false"/>
              </span>
            );
          })}
        </div>

        {traysUp && <Trays st={st} phase={phase} miss={missNow} onPick={pick} homeRef={homeRef} layout={layout} landed={landed && phase === 'done'}/>}

        {/* the one Rupi lifts out: a 3D note (the only 3D money in this scene) */}
        {spilled && !(phase === 'done') && (
          <div className={'c13-obj c13-note is-stand c16-demo' + (lifted ? ' up' : '') + (phase === 'right' ? ' bright' : '')}
            role={lifted ? 'img' : undefined} aria-label={lifted ? 'A note with ₹50 printed on it' : undefined} aria-hidden={lifted ? undefined : true}
            style={{ '--w': st.noteW + 'cqw', '--rim': RIM[DEMO.i] || '#8A6E44', opacity: lifted ? 1 : 0,
              transition: director.reduced ? 'none' : undefined,
              transform: 'translate3d(calc(' + note.x + 'cqw - 50%), ' + (-note.y) + 'cqh, 0) scale(' + note.s + ')' }}>
            <span className="c13-shadow"/>
            <div className="c13-roll"><div className="c13-lay" style={{ transform: 'rotateX(' + note.lay + 'deg)', transition: director.reduced ? 'none' : undefined }}>
              <MoneyBody kind="note" i={DEMO.i} mark={DEMO.mark} markOn={!!missNow || phase === 'right'} sheen={phase === 'right'} markClass="c15-mark"/>
            </div></div>
          </div>
        )}

        <SpeechBubble speaker={rupiPos} width={st.bubbleW} lines={[line || '']} show={!!line}
          size={phase === 'rupi' && layout === 'wide' ? 'lg' : undefined} centerX={layout === 'wide' && phase !== 'bridge' ? 31 : undefined}/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene16 };
