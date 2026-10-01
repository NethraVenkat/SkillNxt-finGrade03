import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { SCENE16 } from '../data/sortIntroContent';
import { SCENE17 } from '../data/teamSortContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import './scene13.css';   /* the shared counter */
import './scene15.css';   /* the money box */
import './scene16.css';   /* the sign, the pile and the nine trays, exactly as Scene 16 left them */
import './scene17.css';

/* ════════ Scene 17 — "Team Money Sort" — READY… SET… SORT! ════════
   A classroom activity supported by the screen (blueprint): the class sorts
   real money; the scene is the stage and the clock. It opens on Scene 16's last
   frame. The hanging sign flips over — "READY... SET... SORT!". The teacher
   starts the sort when the teams are ready: 3 → 2 → 1 → GO flip onto the
   sign like a split-flap board, then the sign becomes the 05:00 clock. Rupi
   calls the prompts and cheers; at zero the sign flips to "TIME'S UP!", the
   trays give a small wave, and Next opens. No leaderboard, no online game.

   The five-minute timer is measured from the clock (not counted ticks), and it
   stops while the film is paused or the teacher presses Pause. */

const T = SCENE17;
const SCRIPT_17 = checkScript('sort17', [
  beat('s17-bridge', B.WIDE,        { ms: 1400, rm: 1000 }),  /* Scene 16's set-up, as we left it */
  beat('s17-flip',   B.OBJECT_MOVE, { ms: 1800, rm: 900 }),   /* the sign flips: READY... SET... SORT! */
  beat('s17-ready',  B.HOLD),                                /* the teacher starts it when the teams are ready */
  beat('s17-three',  B.REACTION,    { ms: 1000, rm: 1000 }),  /* the countdown is content: same pace for everyone */
  beat('s17-two',    B.REACTION,    { ms: 1000, rm: 1000 }),
  beat('s17-one',    B.REACTION,    { ms: 1000, rm: 1000 }),
  beat('s17-go',     B.REACTION,    { ms: 1000, rm: 1000 }),
  beat('s17-sort',   B.HOLD),                                /* the five-minute sort */
  beat('s17-up',     B.CELEBRATION, { hold: true }),         /* TIME'S UP! */
]);
const at = id => SCRIPT_17.findIndex(b => b.id === id);
const COUNT = ['three', 'two', 'one', 'go'];

/* Scene 16's final frame — the same world continues through this scene */
const WORLD = {
  wide: {
    rupi: { x: 17, y: 16, h: 46 }, table: { apron: 9, top: 27 },
    box: { x: 32, w: 15, h: 9, base: 14.5, back: 19 },
    sign: { x: 60, w: 30, h: 11, y: 76 },
    trays: SCENE16.piles.map((v, k) => ({ x: 9.5 + k * 10.12, y: 9.8, w: 9.2, h: 7.5 })),
    pile: [[42, 20.4, -14], [49, 23.2, 8], [56, 19.8, 24], [63, 22.4, -6], [46, 18.8, 36], [53, 24.2, -28], [60, 19, 60], [67, 20.2, 12], [44, 22.6, -40], [70, 23.4, -18]],
    flat: { coin: 5.6, note: 11.5 },
    bubbleW: 24,
    cams: {
      bridge: frame('WIDE', { x: 50, y: 50 }, { dur: 1 }),
      flip: frame('MEDIUM', { x: 52, y: 44 }, { s: 1.04, dur: 1400 }),
      ready: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      count: frame('MEDIUM', { x: 54, y: 42 }, { s: 1.06, dur: 700 }),        /* toward the sign for the countdown */
      sort: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
      up: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
    },
  },
  tall: {
    rupi: { x: 19, y: 41, h: 28 }, table: { apron: 8, top: 43 },
    box: { x: 22, w: 30, h: 5.5, base: 25, back: 30 },
    sign: { x: 50, w: 84, h: 6.5, y: 85.5 },
    trays: SCENE16.piles.map((v, k) => (k < 5
      ? { x: 11 + k * 19.5, y: 17.4, w: 18, h: 7 }
      : { x: 20.75 + (k - 5) * 19.5, y: 8.8, w: 18, h: 7 })),
    pile: [[46, 32, -14], [56, 34.5, 8], [66, 31.2, 24], [76, 33.8, -6], [51, 30.2, 36], [61, 35.6, -28], [71, 30.6, 60], [82, 31.8, 12], [47.5, 34.8, -40], [86, 35.4, -18]],
    flat: { coin: 8.5, note: 17 },
    bubbleW: 56,
    cams: {
      bridge: frame('WIDE', { x: 50, y: 50 }, { dur: 1 }),
      flip: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
      ready: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
      count: frame('WIDE', { x: 50, y: 50 }, { dur: 700 }),
      sort: frame('WIDE', { x: 50, y: 50 }, { dur: 1400 }),
      up: frame('WIDE', { x: 50, y: 50 }, { dur: 1200 }),
    },
  },
};
const DEMO_K = SCENE16.piles.indexOf(SCENE16.demo.v);

const SORT17 = {
  name: 'sort17',
  script: SCRIPT_17,
  preload: [A.P5BG, A.CH.rupi, A.NOTEF[SCENE16.demo.i], ...SCENE16.pile.map(p => (p.kind === 'coin' ? A.COINF[p.i] : A.NOTEF[p.i]))],
};

/* dev-only QA: ?t=<seconds> shortens the timer so the real zero can be tested */
const LENGTH = (() => {
  if (!import.meta.env.DEV || typeof window === 'undefined') return T.seconds;
  const t = +new URLSearchParams(window.location.search).get('t');
  return t > 0 ? t : T.seconds;
})();
const mmss = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

function Controls({ phase, paused, onStart, onPause, onEnd, homeRef }) {
  const ref = useRef(null);
  /* keyboard users: the Start control takes focus when the scene is ready for it */
  useEffect(() => {
    if (phase !== 'ready' || document.documentElement.dataset.mqInput !== 'key' || !ref.current) return;
    const b = ref.current.querySelector('button');
    if (b) b.focus({ preventScroll: true });
  }, [phase]);
  /* the controls change with the phase: never leave focus on a control that has gone */
  useLayoutEffect(() => () => {
    if (ref.current && ref.current.contains(document.activeElement) && homeRef.current) homeRef.current.focus({ preventScroll: true });
  }, [homeRef]);
  return (
    <div ref={ref} className="c17-controls" role="group" aria-label="Teacher controls for the sort">
      {phase === 'ready' && <button type="button" className="c17-btn go" onClick={onStart}>{T.controls.start}</button>}
      {phase === 'sort' && (
        <React.Fragment>
          <button type="button" className="c17-btn" onClick={onPause} aria-pressed={paused}>{paused ? T.controls.resume : T.controls.pause}</button>
          <button type="button" className="c17-btn" onClick={onEnd}>{T.controls.end}</button>
        </React.Fragment>
      )}
    </div>
  );
}

function Scene17({ scene, focusMode, blip, onSolved }) {
  useInputModality();
  const { layout, director, rootProps, stageRef } = useCinematicScene(SORT17, { scene });
  const w = WORLD[layout];
  const beatId = director.beat;
  const phase = beatId.slice(4);
  const idx = at(beatId);
  const counting = COUNT.includes(phase);

  /* ── the five-minute clock ── */
  const [left, setLeft] = useState(LENGTH * 1000);          /* ms remaining */
  const [held, setHeld] = useState(false);                  /* the teacher's Pause */
  const running = phase === 'sort' && director.playing && !held;
  /* the exact time left lives in a ref (sampled every 250 ms); React state — and so a render of the
     scene — changes only when the displayed second does: once a second, not four times */
  const leftRef = useRef(LENGTH * 1000);
  useEffect(() => { if (idx <= at('s17-ready')) { leftRef.current = LENGTH * 1000; setLeft(LENGTH * 1000); setHeld(false); } }, [idx]);
  useEffect(() => {
    if (!running) return undefined;
    let last = performance.now();
    let t;
    const tick = () => {
      const now = performance.now();
      const before = leftRef.current;
      leftRef.current = Math.max(0, before - (now - last)); last = now;
      if (Math.ceil(leftRef.current / 1000) !== Math.ceil(before / 1000) || leftRef.current === 0) setLeft(leftRef.current);
      if (leftRef.current > 0) t = setTimeout(tick, 250);
    };
    t = setTimeout(tick, 250);
    return () => clearTimeout(t);
  }, [running]);
  useEffect(() => { if (phase === 'sort' && left <= 0) director.goTo('s17-up'); }, [phase, left, director]);
  useEffect(() => { if (phase === 'up') { if (onSolved) onSolved(); if (blip) { blip(880); } } }, [phase, onSolved, blip]);
  useEffect(() => { if (counting && blip) blip(phase === 'go' ? 1040 : 620); }, [phase, counting, blip]);

  const secs = Math.ceil(left / 1000);
  const elapsed = LENGTH - secs;
  const prompt = T.prompts[Math.floor(Math.max(0, elapsed) / T.promptEvery) % T.prompts.length];

  /* screen readers: the clock is announced at the minute marks, the last ten seconds, and the end — never every second */
  const [said, setSaid] = useState('');
  useEffect(() => {
    if (phase !== 'sort') return;
    if (secs > 0 && (secs % 60 === 0 || secs === 30 || secs === 10)) setSaid(secs >= 60 ? (secs / 60) + (secs === 60 ? ' minute' : ' minutes') + ' left.' : secs + ' seconds left.');
  }, [phase, secs]);

  /* ── the sign: what it shows, and a flip whenever that changes ── */
  const face = phase === 'bridge' ? SCENE16.sign
    : phase === 'flip' || phase === 'ready' ? T.sign
    : counting ? T.countdown[COUNT.indexOf(phase)]
    : phase === 'sort' ? mmss(Math.max(0, secs))
    : T.timesUp;
  const flipKey = phase === 'sort' ? 'clock' : face;

  /* ── direction ── */
  const cam = counting ? w.cams.count : w.cams[phase];
  const line = phase === 'sort' ? (held || !director.playing ? null : prompt) : phase === 'go' ? 'GO!' : null;
  const rupiState = phase === 'bridge' ? ['cheer', 'talk']
    : phase === 'flip' ? ['lean', 'surprised']
    : counting ? (phase === 'go' ? 'cheer' : 'point')
    : phase === 'sort' ? (held ? 'idle' : ['lean', 'cheer'])
    : phase === 'up' ? ['cheer', 'talk'] : 'idle';
  const cue = beatId + (phase === 'sort' ? prompt : '');
  const homeRef = useRef(null); homeRef.current = stageRef.current;
  const caption = phase === 'up' ? T.timesUp : said || (line ? 'Rupi: ' + line : phase === 'flip' || phase === 'ready' ? T.sign : '');

  return (
    <section {...rootProps} className={'sort17 layout-' + layout + (director.playing ? '' : ' is-paused') + (director.reduced ? ' is-reduced' : '')}
      aria-label={'Scene 17: ' + T.title}>
      <Plate src={A.P5BG} alt="The village market counter, set up for the team money sort"
        focusX={layout === 'tall' ? 36 : 50} camera={cam} reduced={director.reduced} coupled
        atmosphere={<EnvironmentLayer mood={phase === 'bridge' || phase === 'up' ? 'bright' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {(phase === 'ready' || phase === 'sort') && (
              <Controls phase={phase} paused={held} homeRef={homeRef}
                onStart={() => director.goTo('s17-three')}
                onPause={() => setHeld(h => !h)}
                onEnd={() => { leftRef.current = 0; setLeft(0); director.goTo('s17-up'); }}/>
            )}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 17 · ' + T.title} teacher={T.teacher}
                playing={director.playing} onToggle={director.toggle}
                onReplay={() => director.reset('s17-bridge')}/>
            )}
            {!director.playing && <span className="c13-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        <Actor src={A.CH.rupi} alt="Rupi, cheering the teams on" position={w.rupi} state={rupiState} toward={1}
          cue={cue} zIndex={2} reduced={director.reduced}/>

        {/* the hanging sign: the title, then the countdown, then the clock */}
        <div className={'c16-sign c17-sign' + (phase !== 'bridge' ? ' big' : '') + (phase === 'sort' ? ' clock' : '') + (phase === 'up' ? ' up' : '')}
          role={phase === 'sort' ? 'timer' : 'heading'} aria-level={phase === 'sort' ? undefined : 2}
          aria-label={phase === 'sort' ? mmss(Math.max(0, secs)) + ' left' : undefined}
          style={{ left: (w.sign.x - w.sign.w / 2) + 'cqw', width: w.sign.w + 'cqw', bottom: w.sign.y + 'cqh', height: w.sign.h + 'cqh' }}>
          <span className="c16-rope l"/><span className="c16-rope r"/>
          <b className="c17-face" key={flipKey}>{face}</b>
          {phase === 'sort' && held && <span className="c17-held">Paused</span>}
        </div>

        <div className="c13-table" style={{ '--apron': w.table.apron + 'cqh', '--top': w.table.top + 'cqh' }} aria-hidden="true">
          <div className="c13-surface"><i/><i/><i/><i/><span className="c13-farshade"/></div>
          <div className="c13-apron">{[1, 2, 3, 4, 5].map(k => <i key={k} style={{ left: (k * 100 / 6) + '%' }}/>)}</div>
        </div>

        <div className="c15-box c16-box" aria-hidden="true"
          style={{ left: (w.box.x - w.box.w / 2) + 'cqw', width: w.box.w + 'cqw', bottom: w.box.base + 'cqh', height: w.box.h + 'cqh', transform: 'translateY(' + -(w.box.back - w.box.base) + 'cqh)' }}>
          <span className="c15-lid"/><i/><i/>
        </div>

        <div className="c16-pile out" role="img" aria-label="A mixed pile of coins and notes">
          {SCENE16.pile.map((p, k) => {
            const [x, y, r] = w.pile[k];
            return (
              <span key={k} className={'c16-flat c16-' + p.kind} style={{ '--x': x, '--y': y, '--r': r + 'deg', '--x0': x, '--y0': y, '--d': '0ms', width: (p.kind === 'coin' ? w.flat.coin : w.flat.note) + 'cqw', transition: 'none' }}>
                <img src={p.kind === 'coin' ? A.COINF[p.i] : A.NOTEF[p.i]} alt="" draggable="false"/>
              </span>
            );
          })}
        </div>

        {/* the nine piles: the destinations the class is sorting into */}
        <div className={'c16-trays' + (phase === 'up' && !director.reduced ? ' c17-wave' : '')} role="list" aria-label="The nine piles: ₹1, ₹2, ₹5, ₹10, ₹20, ₹50, ₹100, ₹200, ₹500">
          {SCENE16.piles.map((v, k) => {
            const t = w.trays[k];
            return (
              <div key={v} role="listitem" className={'c16-tray c17-tray' + (k === DEMO_K ? ' is-right' : '')}
                style={{ left: (t.x - t.w / 2) + 'cqw', bottom: t.y + 'cqh', width: t.w + 'cqw', height: t.h + 'cqh', '--k': k }}>
                <span className="c16-tray-in">
                  {k === DEMO_K && <img className="c16-landed" src={A.NOTEF[SCENE16.demo.i]} alt="" draggable="false"/>}
                  <b className="c16-label">₹{v}</b>
                </span>
              </div>
            );
          })}
        </div>

        <SpeechBubble speaker={w.rupi} width={w.bubbleW} lines={[line || '']} show={!!line}
          centerX={layout === 'wide' ? 31 : undefined}/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene17 };
