import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { MoneyBody, RIM } from '../currency/MoneyBody';
import { SCENE15 } from '../data/quickGameContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import './scene13.css';   /* the shared counter and 3D money body */
import './scene15.css';

/* ════════ Scene 15 — "Rupi's Quick Money Game" ════════
   It opens on Scene 14's last frame — the value display on the counter — and
   the camera trucks LEFT along the same counter (Scene 14 trucked right) to
   Rupi's game corner: a wooden money box, a small reveal block and a wooden
   star board. Five quick rounds: the lid flips, a piece of money is tossed out
   in a spinning arc and bounces onto the block, the camera snaps in, and the
   class taps a brass token. Wrong → the token dips, a gold outline finds the
   printed value, Rupi helps. Right → the token presses, a star flies from the
   money into the board, and the money is flicked away for the next one.

   Rapid rhythm on purpose: quick snaps and tosses, not the slow reveals of 13–14.
   The world is the crisp village-market plate. No filter, blur or backdrop-filter. */

const R = SCENE15.rounds;
const rid = (k, p) => 'r' + (k + 1) + '-' + p;

const SCRIPT_15 = checkScript('game15', [
  beat('s15-bridge', B.WIDE,        { ms: 1400, rm: 1000 }),  /* Scene 14's value display, as we left it */
  beat('s15-move',   B.TRACK,       { ms: 2500, rm: 900 }),   /* back along the counter, to the left */
  beat('s15-intro',  B.DIALOGUE,    { ms: 3600, rm: 3200 }),  /* "Five quick rounds…" */
  ...R.flatMap((r, k) => [
    beat(rid(k, 'draw'),  B.OBJECT_MOVE, { ms: 1500, rm: 700 }),  /* tossed out of the box */
    beat(rid(k, 'ask'),   B.QUESTION),
    beat(rid(k, 'right'), B.CORRECT,     { ms: 1900, rm: 1300 }), /* a star flies to the board; the money is flicked away */
  ]),
  beat('s15-done', B.CELEBRATION, { hold: true }),
]);
const at = id => SCRIPT_15.findIndex(b => b.id === id);
function parse(id) {
  if (id === 's15-done') return { c: R.length, phase: 'done' };
  if (id[0] === 'r') return { c: +id.slice(1, id.indexOf('-')) - 1, phase: id.slice(id.indexOf('-') + 1) };
  return { c: 0, phase: id.slice(4) };
}

/* Scene 14's final frame, reproduced exactly (its steps, plates and four pieces) so the cut is invisible */
const BRIDGE = {
  wide: {
    rupi: { x: 87, y: 16, h: 46 }, base: 14.5,
    steps: [{ x: 20, w: 11, h: 6 }, { x: 31, w: 11, h: 10 }, { x: 42, w: 11, h: 14 }, { x: 66, w: 22, h: 18 }],
    size: [9, 9.5, 10.5, 19.5],
    cam: frame('PULL_OUT', { x: 54, y: 56 }, { s: 1.06, dur: 1 }),
  },
  tall: {
    rupi: { x: 82, y: 41, h: 28 }, base: 17,
    steps: [{ x: 12.5, w: 19, h: 5 }, { x: 31.5, w: 19, h: 8.5 }, { x: 50.5, w: 19, h: 12 }, { x: 79, w: 36, h: 15.5 }],
    size: [13.5, 14.5, 16, 33],
    cam: frame('PULL_OUT', { x: 50, y: 55 }, { s: 1, dur: 1 }),
  },
};
const EX14 = [{ v: 1, kind: 'coin', i: 0 }, { v: 5, kind: 'coin', i: 2 }, { v: 20, kind: 'coin', i: 4, back: true }, { v: 100, kind: 'note', i: 3 }];

/* the game corner. x/w in cqw, heights and bases in cqh, money sizes in cqw */
const STAGE = {
  wide: {
    rupi: { x: 17, y: 16, h: 46 },
    table: { apron: 9, top: 27 }, base: 14.5,
    box: { x: 32, w: 15, h: 9 },
    block: { x: 57, w: 19, h: 8 },
    board: { x: 84, w: 19, h: 17, base: 25 },
    size: { coin: 15, note: 30 },
    bubbleW: 24,
    cams: {
      move: frame('TRACK', { x: 50, y: 56 }, { s: 1.04, dur: 2300 }),
      intro: frame('MEDIUM', { x: 50, y: 55 }, { s: 1.06, dur: 1400 }),
      draw: frame('REACTION', { x: 53, y: 58 }, { s: 1.14, dur: 480 }),          /* a quick snap onto the block */
      ask: frame('MEDIUM', { x: 56, y: 57 }, { s: 1.1, dur: 900 }),
      right: frame('REACTION', { x: 60, y: 54 }, { s: 1.1, dur: 520 }),          /* toward the star board */
      done: frame('PULL_OUT', { x: 54, y: 55 }, { s: 1.04, dur: 1800 }),
    },
  },
  /* phones / portrait: Rupi high on the left, the star board up on the far edge of the counter, the money large */
  tall: {
    rupi: { x: 19, y: 41, h: 28 },
    /* the box and block stand further back on the counter, clear of the question and tokens along its front edge */
    table: { apron: 8, top: 43 }, base: 25,
    box: { x: 22, w: 30, h: 5.5 },
    block: { x: 63, w: 34, h: 5.5 },
    board: { x: 70, w: 40, h: 8, base: 48 },
    size: { coin: 29, note: 58 },
    bubbleW: 56,
    cams: {
      move: frame('TRACK', { x: 50, y: 55 }, { s: 1, dur: 2300 }),
      intro: frame('MEDIUM', { x: 48, y: 54 }, { s: 1.02, dur: 1400 }),
      draw: frame('REACTION', { x: 55, y: 58 }, { s: 1.04, dur: 480 }),
      ask: frame('MEDIUM', { x: 52, y: 57 }, { s: 1.02, dur: 900 }),
      right: frame('REACTION', { x: 58, y: 52 }, { s: 1.03, dur: 520 }),
      done: frame('PULL_OUT', { x: 50, y: 54 }, { s: 1, dur: 1800 }),
    },
  },
};

const GAME15 = {
  name: 'game15',
  script: SCRIPT_15,
  preload: [A.P5BG, A.CH.rupi, ...R.flatMap(r => (r.kind === 'coin' ? [A.COINF[r.i], A.COINB[r.i]] : [A.NOTEF[r.i], A.NOTEB[r.i]])),
    A.COINF[0], A.COINB[0], A.COINF[4], A.COINB[4], A.NOTEF[3], A.NOTEB[3]],
  /* each piece is only tossed once its artwork is decoded (engine caps the wait at 1.5 s) */
  needs: Object.fromEntries(R.map((r, k) => [rid(k, 'draw'), r.kind === 'coin' ? [A.COINF[r.i], A.COINB[r.i]] : [A.NOTEF[r.i], A.NOTEB[r.i]]])),
};

const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l3.1 6.6 7.1.9-5.2 5 1.3 7.1L12 18l-6.3 3.4 1.3-7.1-5.2-5 7.1-.9z"/></svg>
);

/* the brass answer tokens on the counter's front edge, with the question above them */
function Tokens({ round, phase, miss, onPick, homeRef }) {
  const ref = useRef(null);
  useLayoutEffect(() => () => {
    if (ref.current && ref.current.contains(document.activeElement) && homeRef.current) homeRef.current.focus({ preventScroll: true });
  }, [homeRef]);
  useEffect(() => {
    if (phase !== 'ask' || document.documentElement.dataset.mqInput !== 'key' || !ref.current) return;
    if (ref.current.contains(document.activeElement)) return;
    const b = ref.current.querySelector('.c15-token');
    if (b) b.focus({ preventScroll: true });
  }, [phase, round]);
  /* arrows move between the tokens and stay here — never reaching the lesson's scene navigation */
  const arrows = e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const bs = [...ref.current.querySelectorAll('.c15-token')];
    const i = bs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault(); e.stopPropagation();
    bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length].focus();
  };
  const r = R[round], live = phase === 'ask';
  return (
    <div ref={ref} className={'c15-tokens' + (live ? '' : ' is-waiting')} role="group" aria-labelledby="c15-q" onKeyDown={arrows}>
      {r.opts.map(v => {
        const right = phase === 'right' && v === r.v;
        const wrong = live && miss && miss.v === v;
        return (
          <button key={v} type="button" aria-disabled={!live} aria-label={'₹' + v}
            className={'c15-token' + (right ? ' is-right' : '') + (wrong ? ' is-wrong' : '')} onClick={() => live && onPick(v)}>
            <span className="c15-token-in" key={wrong ? miss.n : 0}>₹{v}</span>
          </button>
        );
      })}
    </div>
  );
}

function Scene15({ scene, focusMode, blip, onSolved }) {
  useInputModality();
  const { layout, aspect, director, rootProps, stageRef } = useCinematicScene(GAME15, { scene });
  const st = STAGE[layout], br = BRIDGE[layout];
  const beatId = director.beat;
  const { c, phase } = parse(beatId);
  const idx = at(beatId);
  const round = Math.min(c, R.length - 1);
  const r = R[round];
  const [miss, setMiss] = useState(null);                 /* { round, v, n } */
  const missNow = miss && miss.round === c && phase === 'ask' ? miss : null;
  useEffect(() => { setMiss(null); }, [c]);

  const pick = v => {
    if (phase !== 'ask') return;
    if (v === r.v) { if (blip) blip(960); setMiss(null); director.goTo(rid(c, 'right')); }
    else { if (blip) blip(330, 'triangle'); setMiss(m => ({ round: c, v, n: m && m.round === c ? m.n + 1 : 1 })); }
  };
  useEffect(() => { if (phase === 'done' && onSolved) onSolved(); }, [phase, onSolved]);

  /* the score: stars on the board; the number counts up rather than jumping */
  const earned = phase === 'done' ? R.length : c + (phase === 'right' ? 1 : 0);
  const [shown, setShown] = useState(earned);
  useEffect(() => {
    if (shown === earned) return undefined;
    if (director.reduced || earned < shown) { setShown(earned); return undefined; }
    const t = setTimeout(() => setShown(s => s + 1), phase === 'right' ? 820 : 160);   /* lands with the star */
    return () => clearTimeout(t);
  }, [earned, shown, phase, director.reduced]);

  /* ── direction ── */
  const cam = phase === 'bridge' ? br.cam : st.cams[phase] || st.cams.ask;
  const gameOn = idx >= at('s15-move');
  const rupiPos = phase === 'bridge' ? br.rupi : st.rupi;
  const L = SCENE15.lines;
  const line = phase === 'intro' ? L.intro
    : phase === 'ask' && missNow ? L.wrong
    : phase === 'right' ? L.right(r.v)
    : phase === 'done' ? L.done : null;
  const rupiState = phase === 'move' ? 'walk'
    : phase === 'intro' ? ['reach', 'talk']
    : phase === 'draw' ? ['point', 'surprised']
    : phase === 'ask' ? (missNow ? ['think', 'talk'] : 'idle')
    : phase === 'right' ? ['lean', 'cheer']
    : phase === 'done' ? ['cheer', 'talk'] : 'idle';
  const asking = phase === 'ask' || phase === 'right';
  const homeRef = useRef(null); homeRef.current = stageRef.current;
  const teacher = idx >= at('r1-ask') ? SCENE15.teacher : { ...SCENE15.teacher, cue: SCENE15.watchCue };

  /* where things are, in stage units */
  const size = r.kind === 'coin' ? st.size.coin : st.size.note;
  const hCqh = (r.kind === 'coin' ? size : size * 300 / 620) * aspect;          /* the piece's height in cqh */
  const rest = { x: st.block.x, y: st.base + st.block.h };
  const boxTop = { x: st.box.x, y: st.base + st.box.h };
  const socket = k => ({ x: st.board.x - st.board.w / 2 + (k + 0.5) * st.board.w / 5, y: st.board.base + st.board.h * 0.36 });
  const showPiece = c < R.length && (phase === 'draw' || phase === 'ask' || phase === 'right');
  const caption = line ? 'Rupi: ' + line : phase === 'ask' ? 'Round ' + (c + 1) + ' of 5. ' + SCENE15.question : '';

  return (
    <section {...rootProps} className={'game15 layout-' + layout + (director.playing ? '' : ' is-paused') + (director.reduced ? ' is-reduced' : '')}
      aria-label={'Scene 15: ' + SCENE15.title}>
      <Plate src={A.P5BG} alt="The village market, at Rupi's game corner on the counter"
        focusX={layout === 'tall' ? 36 : 50} camera={cam} reduced={director.reduced} coupled
        atmosphere={<EnvironmentLayer mood={phase === 'bridge' || phase === 'right' || phase === 'done' ? 'bright' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {asking && (
              <div className="c15-ask">
                <p className="c15-q" id="c15-q">
                  <small>{SCENE15.kicker} · round <span className="c15-num" key={c}>{String(c + 1).padStart(2, '0')}</span> / 05</small>
                  {SCENE15.question}
                </p>
                <Tokens round={round} phase={phase} miss={missNow} onPick={pick} homeRef={homeRef}/>
              </div>
            )}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 15 · ' + SCENE15.title} teacher={teacher}
                playing={director.playing} onToggle={director.toggle}
                onReplay={() => { setMiss(null); director.reset('s15-bridge'); }}/>
            )}
            {!director.playing && <span className="c13-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        <Actor src={A.CH.rupi} alt="Rupi, at his game corner" position={rupiPos} state={rupiState} toward={phase === 'bridge' ? -1 : 1}
          walkMs={phase === 'move' ? 2300 : 1400} cue={beatId + (missNow ? missNow.n : '')} zIndex={2} reduced={director.reduced}/>

        <div className="c13-table" style={{ '--apron': st.table.apron + 'cqh', '--top': st.table.top + 'cqh' }} aria-hidden="true">
          <div className="c13-surface"><i/><i/><i/><i/><span className="c13-farshade"/></div>
          <div className="c13-apron">{[1, 2, 3, 4, 5].map(k => <i key={k} style={{ left: (k * 100 / 6) + '%' }}/>)}</div>
        </div>

        {/* what we leave: Scene 14's value display slides out to the right (rendered only until the camera has left it) */}
        {idx <= at('s15-move') && (
          <div className={'c15-leave' + (phase === 'bridge' ? '' : ' gone')} aria-hidden="true" style={director.reduced ? { transition: 'none' } : null}>
            {br.steps.map((s, n) => (
              <div key={n} className="c15-step" style={{ left: (s.x - s.w / 2) + 'cqw', width: s.w + 'cqw', bottom: br.base + 'cqh', height: s.h + 'cqh' }}>
                <span className="c15-plate">₹{EX14[n].v}</span>
              </div>
            ))}
            {EX14.map((ex, n) => (
              <div key={n} className={'c13-obj c13-' + ex.kind + ' is-stand c15-still'}
                style={{ '--w': br.size[n] + 'cqw', '--rim': RIM[ex.i] || '#8A6E44', transition: 'none',
                  transform: 'translate3d(calc(' + br.steps[n].x + 'cqw - 50%), ' + (-(br.base + br.steps[n].h)) + 'cqh, 0)' }}>
                <span className="c13-shadow"/>
                <div className="c13-roll" style={{ transform: ex.back ? 'rotateY(180deg)' : 'none' }}>
                  <div className="c13-lay"><MoneyBody kind={ex.kind} i={ex.i}/></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rupi's game corner: the money box, the reveal block, the star board */}
        <div className={'c15-corner' + (gameOn ? '' : ' away')} style={director.reduced ? { transition: 'none' } : null}>
          <div className="c15-box" aria-hidden="true" style={{ left: (st.box.x - st.box.w / 2) + 'cqw', width: st.box.w + 'cqw', bottom: st.base + 'cqh', height: st.box.h + 'cqh' }}>
            <span className={'c15-lid' + (phase === 'draw' && !director.reduced ? ' flip' : '')} key={phase === 'draw' ? beatId : 'shut'}/>
            <i/><i/>
          </div>
          <div className="c15-block" aria-hidden="true" style={{ left: (st.block.x - st.block.w / 2) + 'cqw', width: st.block.w + 'cqw', bottom: st.base + 'cqh', height: st.block.h + 'cqh' }}/>
          <div className="c15-board" role="img" aria-label={'Stars: ' + shown + ' of 5'}
            style={{ left: (st.board.x - st.board.w / 2) + 'cqw', width: st.board.w + 'cqw', bottom: st.board.base + 'cqh', height: st.board.h + 'cqh' }}>
            <span className="c15-sockets">
              {R.map((x, k) => <span key={k} className={'c15-socket' + (k < shown ? ' full' : '')}><Star/></span>)}
            </span>
            <span className="c15-score"><span className="c15-num" key={shown}>{shown}</span> / 5</span>
          </div>

          {showPiece && (
            <div key={'piece' + c} className={'c13-obj c13-' + r.kind + ' is-stand c15-piece' + (phase === 'right' ? ' bright leave' : '')}
              role="img" aria-label={'A ' + (r.kind === 'coin' ? 'coin' : 'note') + ' with ₹' + r.v + ' printed on it'}
              style={{ '--w': size + 'cqw', '--rim': RIM[r.i] || '#8A6E44', '--x': rest.x, '--y': rest.y, '--x0': boxTop.x, '--y0': boxTop.y,
                '--xm': (boxTop.x + rest.x) / 2, '--ym': Math.max(boxTop.y, rest.y) + hCqh * 0.9,
                transform: 'translate3d(calc(' + rest.x + 'cqw - 50%), ' + (-rest.y) + 'cqh, 0)' }}>
              <span className="c13-shadow"/>
              <div className="c13-roll"><div className="c13-lay">
                <MoneyBody kind={r.kind} i={r.i} mark={r.mark} markOn={!!missNow} sheen={phase === 'right'}/>
              </div></div>
            </div>
          )}

          {/* the star flies from the money to its socket on the board */}
          {phase === 'right' && !director.reduced && (
            <span className="c15-fly" key={'fly' + c} aria-hidden="true"
              style={{ '--sx': rest.x, '--sy': rest.y + hCqh / 2, '--tx': socket(c).x, '--ty': socket(c).y, '--mx': (rest.x + socket(c).x) / 2, '--my': Math.max(rest.y + hCqh, socket(c).y) + 12 }}>
              <Star/>
            </span>
          )}
        </div>

        {/* wide frames: Rupi stands near the left edge, so his line is centred a little inward (the tail still points at him) */}
        <SpeechBubble speaker={rupiPos} width={st.bubbleW} lines={[line || '']} show={!!line}
          centerX={layout === 'wide' && phase !== 'bridge' ? 31 : undefined}/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene15 };
