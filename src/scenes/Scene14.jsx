import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { InteractiveBanknote } from '../currency/InteractiveBanknote';
import { SCENE14 } from '../data/denominationContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import './scene13.css';   /* the shared inspection table, 3D money body and wooden tags */
import './scene14.css';

/* ════════ Scene 14 — "What is the Denomination?" — the value reveal ════════
   It opens on the last frame of Scene 13 — the sorted table, the empty brass
   stand, Rupi — and the camera trucks right along the same counter: the sorted
   money slides out of frame, and a stepped wooden value display slides in, with
   Rupi walking across to stand on its far side. He notices it and says the rule.
   Four pieces arrive on the steps, each in its own way (₹1 slides, ₹5 rolls,
   ₹20 is lifted and turned to its value side, the ₹100 note drops in); a gold
   outline finds the value written on each one, and a brass plate rises beneath
   it. The plates close, the camera settles on the ₹100 note — which the class
   can pick up and turn over — and the class names its denomination.

   The world is the crisp village-market plate. No filter, blur or backdrop-filter. */

const EX = SCENE14.examples;
const ORDER = ['one', 'five', 'twenty', 'hundred'];

const SCRIPT_14 = checkScript('value14', [
  beat('s14-bridge',  B.WIDE,         { ms: 1800, rm: 1200 }),  /* Scene 13's sorted table, as we left it */
  beat('s14-travel',  B.TRACK,        { ms: 2900, rm: 1000 }),  /* along the counter to the value display */
  beat('s14-notice',  B.REACTION,     { ms: 1700, rm: 1100 }),
  beat('s14-reveal',  B.DIALOGUE,     { ms: 4400, rm: 3800 }),  /* "The denomination is the value written on the money." */
  beat('s14-one',     B.OBJECT_MOVE,  { ms: 2100, rm: 1300 }),
  beat('s14-five',    B.OBJECT_MOVE,  { ms: 2100, rm: 1300 }),
  beat('s14-twenty',  B.OBJECT_MOVE,  { ms: 2900, rm: 1500 }),  /* lifted, then turned to the side with its value */
  beat('s14-hundred', B.OBJECT_MOVE,  { ms: 2500, rm: 1400 }),
  beat('s14-look',    B.OBJECT_FOCUS, { ms: 3000, rm: 2400 }),  /* the plates close; "Look at the value written on it." */
  beat('s14-ask',     B.QUESTION),
  beat('s14-right',   B.CORRECT,      { ms: 3200, rm: 2600 }),
  beat('s14-done',    B.CELEBRATION,  { hold: true }),         /* the rule again; Next is open */
]);
const at = id => SCRIPT_14.findIndex(b => b.id === id);

/* Scene 13's final frame, reproduced exactly (its sorted piles and stand) so the cut between the two scenes is invisible */
const BRIDGE = {
  wide: {
    rupi: { x: 31, y: 16, h: 46 }, stand: { x: 60, y: 15.5, w: 58 }, rest: 20,
    laid: [
      { kind: 'coin', i: 2, x: 38.5, y: 22, d: 32, s: 0.4 }, { kind: 'coin', i: 3, x: 43, y: 23.6, d: 25, s: 0.4 }, { kind: 'coin', i: 4, x: 46.5, y: 21.7, d: 25, s: 0.4 },
      { kind: 'note', i: 3, x: 83, y: 22.2, w: 64, s: 0.3 }, { kind: 'note', i: 0, x: 89, y: 23.8, w: 49, s: 0.3 },
      { kind: 'note', i: 1, x: 94.5, y: 22, w: 49, s: 0.3 }, { kind: 'note', i: 4, x: 86, y: 25.4, w: 64, s: 0.3 },
    ],
    cam: frame('PULL_OUT', { x: 56, y: 57 }, { s: 1.06, dur: 1 }),
  },
  tall: {
    rupi: { x: 22, y: 40, h: 28 }, stand: { x: 55, y: 17, w: 40 }, rest: 21.5,
    laid: [
      { kind: 'coin', i: 2, x: 38, y: 36.5, d: 23, s: 0.34 }, { kind: 'coin', i: 3, x: 45, y: 38.4, d: 16, s: 0.34 }, { kind: 'coin', i: 4, x: 51, y: 36.2, d: 16, s: 0.34 },
      { kind: 'note', i: 3, x: 66, y: 36.4, w: 40, s: 0.3 }, { kind: 'note', i: 0, x: 76, y: 38.6, w: 26, s: 0.3 },
      { kind: 'note', i: 1, x: 86, y: 36.3, w: 26, s: 0.3 }, { kind: 'note', i: 4, x: 93, y: 39.2, w: 40, s: 0.3 },
    ],
    cam: frame('PULL_OUT', { x: 50, y: 54 }, { s: 1, dur: 1 }),
  },
};

/* the value display: four wooden steps on the counter. x/w in cqw, h/base in cqh, money size in cqw */
const STAGE = {
  wide: {
    rupi: { x: 87, y: 16, h: 46 },
    table: { apron: 9, top: 27 }, base: 14.5,
    steps: [{ x: 20, w: 11, h: 6 }, { x: 31, w: 11, h: 10 }, { x: 42, w: 11, h: 14 }, { x: 66, w: 22, h: 18 }],
    size: [9, 9.5, 10.5, 19.5],
    bubbleW: 24,
    cams: {
      travel: frame('TRACK', { x: 58, y: 56 }, { s: 1.06, dur: 2700 }),
      notice: frame('MEDIUM', { x: 66, y: 52 }, { s: 1.12, dur: 1200 }),
      reveal: frame('PUSH_IN', { x: 52, y: 58 }, { s: 1.16, dur: 3800 }),
      one: frame('TRACK', { x: 28, y: 62 }, { s: 1.28, dur: 1300 }),
      five: frame('TRACK', { x: 34, y: 62 }, { s: 1.28, dur: 1300 }),
      twenty: frame('TRACK', { x: 42, y: 60 }, { s: 1.28, dur: 1300 }),
      hundred: frame('TRACK', { x: 54, y: 58 }, { s: 1.12, dur: 1300 }),       /* all four in frame */
      look: frame('MEDIUM', { x: 58, y: 55 }, { s: 1.18, dur: 1700 }),          /* toward the note, every piece still whole in frame */
      ask: frame('MEDIUM', { x: 54, y: 58 }, { s: 1.1, dur: 1400 }),
      done: frame('PULL_OUT', { x: 54, y: 56 }, { s: 1.06, dur: 2200 }),
    },
  },
  /* phones / portrait: Rupi stands high on the right, the steps span the whole counter */
  tall: {
    rupi: { x: 82, y: 41, h: 28 },
    table: { apron: 8, top: 43 }, base: 17,
    steps: [{ x: 12.5, w: 19, h: 5 }, { x: 31.5, w: 19, h: 8.5 }, { x: 50.5, w: 19, h: 12 }, { x: 79, w: 36, h: 15.5 }],
    size: [13.5, 14.5, 16, 33],
    bubbleW: 56,
    cams: {
      travel: frame('TRACK', { x: 52, y: 54 }, { s: 1.02, dur: 2700 }),
      notice: frame('MEDIUM', { x: 62, y: 52 }, { s: 1.05, dur: 1200 }),
      reveal: frame('PUSH_IN', { x: 50, y: 58 }, { s: 1.03, dur: 3800 }),
      /* phones: small, purposeful pushes only — every piece stays whole inside the narrow frame */
      one: frame('TRACK', { x: 30, y: 62 }, { s: 1.08, dur: 1300 }),
      five: frame('TRACK', { x: 40, y: 62 }, { s: 1.07, dur: 1300 }),
      twenty: frame('TRACK', { x: 50, y: 60 }, { s: 1.05, dur: 1300 }),
      hundred: frame('TRACK', { x: 50, y: 58 }, { s: 1.02, dur: 1300 }),
      look: frame('MEDIUM', { x: 52, y: 58 }, { s: 1.03, dur: 1700 }),
      ask: frame('MEDIUM', { x: 50, y: 58 }, { s: 1.02, dur: 1400 }),
      done: frame('PULL_OUT', { x: 50, y: 55 }, { s: 1, dur: 2200 }),
    },
  },
};

const RIM = { 0: '#8E8A82', 2: '#8C7147', 3: '#86683A', 4: '#77746B' };   /* coin edge tones, sampled from each rim */
const ASKED = EX.findIndex(e => e.v === SCENE14.askAbout);

const VALUE14 = {
  name: 'value14',
  script: SCRIPT_14,
  preload: [A.P5BG, A.CH.rupi, ...EX.flatMap(e => (e.kind === 'coin' ? [A.COINF[e.i], A.COINB[e.i]] : [A.NOTEF[e.i], A.NOTEB[e.i]])),
    A.COINF[2], A.COINF[3], A.NOTEF[0], A.NOTEF[1], A.NOTEF[4]],
  /* each piece only arrives once its artwork is decoded (engine caps the wait at 1.5 s) */
  needs: { 's14-one': [A.COINF[0], A.COINB[0]], 's14-five': [A.COINF[2], A.COINB[2]], 's14-twenty': [A.COINF[4], A.COINB[4]], 's14-hundred': [A.NOTEF[3], A.NOTEB[3]] },
};

/* the supplied artwork on a 3D body (Scene 13's physical money, shared through its CSS) */
function Body({ kind, i, mark, markFace, markOn, bright }) {
  const coin = kind === 'coin';
  const m = mark && (
    <span className={'c14-mark' + (markOn ? ' on' : '')}
      style={{ left: (mark[0] - mark[2] / 2) * 100 + '%', top: (mark[1] - mark[3] / 2) * 100 + '%', width: mark[2] * 100 + '%', height: mark[3] * 100 + '%' }}/>
  );
  return (
    <div className="c13-sway">
      <div className="c13-face c13-front">
        <img src={coin ? A.COINF[i] : A.NOTEF[i]} alt="" draggable="false"/>
        {mark && markFace === 'front' && m}
        {bright && <span className="c13-sheen"/>}
      </div>
      {coin ? [0, 1, 2, 3, 4].map(k => <i key={k} className="c13-edge" style={{ '--k': k }}/>) : <i className="c13-paper"/>}
      <div className="c13-face c13-back">
        <img src={coin ? A.COINB[i] : A.NOTEB[i]} alt="" draggable="false"/>
        {mark && markFace === 'back' && m}
      </div>
    </div>
  );
}

/* one example on its step; `way` is how it arrives */
function Piece({ ex, n, st, on, reduced, markOn, bright, hidden, label }) {
  const step = st.steps[n], w = st.size[n], coin = ex.kind === 'coin';
  const y = st.base + step.h;
  const way = ORDER[n];
  /* resting pose, and where each one waits before it arrives */
  const rest = { x: step.x, y, rz: 0, ry: ex.face === 'back' ? 180 : 0, rx: coin ? 0 : -7, o: 1 };
  const from = way === 'one' ? { ...rest, x: step.x + 9, o: 0 }                       /* a small slide along the step */
    : way === 'five' ? { ...rest, x: step.x + 15, rz: 360, o: 0 }                     /* a gentle roll */
    : way === 'twenty' ? { ...rest, ry: 0, rx: 76, o: 0 }                             /* lying on the step, then lifted and turned */
    : { ...rest, y: y + 34, rz: -12, rx: -24, o: 0 };                                 /* the paper note drops in */
  const p = on ? rest : from;
  const move = reduced || !on ? 'none'
    : way === 'one' ? 'transform .9s cubic-bezier(.25,.8,.3,1)'
    : way === 'five' ? 'transform 1.4s cubic-bezier(.3,.7,.3,1)'
    : way === 'twenty' ? 'transform 1.9s cubic-bezier(.45,.05,.3,1)'
    : 'transform 1.5s cubic-bezier(.3,.75,.25,1.05)';
  const T = move === 'none' ? 'none' : move + ', opacity .3s ease';
  return (
    <div className={'c13-obj c14-piece c13-' + ex.kind + (on ? ' is-stand' : ' is-off') + (bright ? ' bright' : '') + (hidden ? ' c14-held-away' : '')}
      role={on ? 'img' : undefined} aria-label={on ? label : undefined} aria-hidden={on ? undefined : true}
      style={{ '--w': w + 'cqw', '--rim': RIM[ex.i] || '#8A6E44', opacity: p.o, transition: T,
        transform: 'translate3d(calc(' + p.x + 'cqw - 50%), ' + (-p.y) + 'cqh, 0)' }}>
      <span className="c13-shadow"/>
      <div className="c13-roll" style={{ transition: move === 'none' ? 'none' : way === 'twenty' ? move + ' .35s' : move,
        transform: 'rotateZ(' + p.rz + 'deg) rotateY(' + p.ry + 'deg)' }}>
        <div className="c13-lay" style={{ transform: 'rotateX(' + p.rx + 'deg)', transition: move === 'none' ? 'none' : 'transform .9s cubic-bezier(.3,.7,.3,1)' }}>
          <Body kind={ex.kind} i={ex.i} mark={ex.mark} markFace={ex.face} markOn={markOn} bright={bright}/>
        </div>
      </div>
    </div>
  );
}

/* the wooden value tags on the counter's front edge, with the question above them */
function Tags({ phase, miss, onPick, homeRef }) {
  const ref = useRef(null);
  useLayoutEffect(() => () => {
    if (ref.current && ref.current.contains(document.activeElement) && homeRef.current) homeRef.current.focus({ preventScroll: true });
  }, [homeRef]);
  useEffect(() => {
    if (phase !== 'ask' || document.documentElement.dataset.mqInput !== 'key' || !ref.current) return;
    if (ref.current.contains(document.activeElement)) return;
    const b = ref.current.querySelector('.c13-tag');
    if (b) b.focus({ preventScroll: true });
  }, [phase]);
  /* arrows move between the tags and stay here — they never reach the lesson's scene navigation */
  const arrows = e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const bs = [...ref.current.querySelectorAll('.c13-tag')];
    const i = bs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault(); e.stopPropagation();
    bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length].focus();
  };
  const live = phase === 'ask';
  return (
    <div ref={ref} className={'c13-tags c14-tags' + (live ? '' : ' is-waiting')} role="group" aria-labelledby="c14-q" onKeyDown={arrows}>
      {SCENE14.choices.map(v => {
        const right = (phase === 'right' || phase === 'done') && v === SCENE14.askAbout;
        const wrong = live && miss && miss.v === v;
        return (
          <button key={v} type="button" aria-disabled={!live} aria-label={'₹' + v}
            className={'c13-tag' + (right ? ' is-right' : '') + (wrong ? ' is-wrong' : '')}
            onClick={() => live && onPick(v)}>
            <span className="c13-tag-in" key={wrong ? miss.n : 0}><b>₹{v}</b></span>
          </button>
        );
      })}
    </div>
  );
}

function Scene14({ scene, focusMode, blip, onSolved }) {
  useInputModality();
  const { layout, director, rootProps, stageRef } = useCinematicScene(VALUE14, { scene });
  const st = STAGE[layout], br = BRIDGE[layout];
  const beatId = director.beat;
  const phase = beatId.slice(4);
  const idx = at(beatId);
  const [miss, setMiss] = useState(null);               /* { v, n } — a wrong tag */
  const [held, setHeld] = useState(null);               /* { from: DOMRect, byKey } */
  const missNow = phase === 'ask' ? miss : null;

  const pick = v => {
    if (phase !== 'ask') return;
    if (v === SCENE14.askAbout) {
      if (blip) blip(960);
      setMiss(null);
      director.goTo('s14-right');
      if (onSolved) onSolved();
    } else {
      if (blip) blip(330, 'triangle');
      setMiss(m => ({ v, n: m ? m.n + 1 : 1 }));
    }
  };

  /* the ₹100 note can be picked up and turned over while the class decides (and after) */
  const pickRef = useRef(null);
  const closeHeld = useRef(null);
  const canHold = idx >= at('s14-ask');
  const hold = e => { if (!canHold || held) return; setHeld({ from: pickRef.current.getBoundingClientRect(), byKey: e && e.detail === 0 }); };
  const heldRef = useRef(null); heldRef.current = held;
  const returnTo = useRef(false);
  const putBack = useCallback(() => { const h = heldRef.current; if (!h) return; setHeld(null); if (h.byKey) returnTo.current = true; }, []);
  useEffect(() => { if (!held && returnTo.current && pickRef.current) { returnTo.current = false; pickRef.current.focus({ preventScroll: true }); } }, [held]);
  useEffect(() => { if (!canHold && held) setHeld(null); }, [canHold, held]);
  const getHome = useCallback(() => (pickRef.current ? pickRef.current.getBoundingClientRect() : null), []);

  /* ── direction ── */
  const cam = phase === 'bridge' ? br.cam
    : phase === 'right' ? { ...st.cams.ask, s: st.cams.ask.s + 0.025, dur: 600 }
    : st.cams[phase] || st.cams.ask;
  const arrived = n => idx >= at('s14-' + ORDER[n]);
  const plateUp = n => arrived(n) && !(phase === 'look' || phase === 'ask');
  const markOn = n => (phase === ORDER[n]) || (n === ASKED && (phase === 'look' || phase === 'right'));
  const rupiPos = phase === 'bridge' ? br.rupi : st.rupi;
  const L = SCENE14.lines;
  const line = phase === 'notice' ? L.notice
    : phase === 'reveal' || phase === 'done' ? SCENE14.rule
    : phase === 'look' ? L.look
    : phase === 'ask' && missNow ? L.wrong
    : phase === 'right' ? L.right : null;
  const rupiState = phase === 'travel' ? 'walk'
    : phase === 'notice' ? ['lean', 'surprised']
    : phase === 'reveal' ? ['reach', 'talk']
    : ORDER.includes(phase) ? ['point', 'nod']
    : phase === 'look' ? ['lean', 'talk']
    : phase === 'ask' ? (missNow ? ['think', 'talk'] : 'idle')
    : phase === 'right' ? ['lean', 'nod']
    : phase === 'done' ? ['cheer', 'talk'] : 'idle';
  const asking = phase === 'ask' || phase === 'right' || phase === 'done';
  const homeRef = useRef(null); homeRef.current = stageRef.current;
  const teacher = idx >= at('s14-look') ? SCENE14.teacher : { ...SCENE14.teacher, cue: SCENE14.watchCue };
  const asked = EX[ASKED], askStep = st.steps[ASKED], askW = st.size[ASKED];
  const caption = held ? '₹100 note in your hand.' : line ? 'Rupi: ' + line : '';

  return (
    <section {...rootProps} className={'value14 layout-' + layout + (director.playing ? '' : ' is-paused') + (held ? ' is-holding' : '')}
      aria-label={'Scene 14: ' + SCENE14.title}>
      <Plate src={A.P5BG} alt="The village market, further along Rupi's counter"
        focusX={layout === 'tall' ? 36 : 50} camera={cam} reduced={director.reduced} coupled
        atmosphere={<EnvironmentLayer mood={phase === 'bridge' || phase === 'right' || phase === 'done' ? 'bright' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {held && <span className="c14-focus" aria-hidden="true" onClick={() => closeHeld.current && closeHeld.current()}/>}
            {held && (
              <div className="c14-held">
                <InteractiveBanknote note={{ v: asked.v }} front={A.NOTEF[asked.i]} back={A.NOTEB[asked.i]}
                  from={held.from} getHome={getHome} reduced={director.reduced}
                  onClose={putBack} closeRef={closeHeld} focusOnOpen={held.byKey}/>
              </div>
            )}
            {/* kept mounted while the note is held (hidden, so it cannot take focus): re-creating it
                would steal focus from the note when it is put back */}
            {asking && (
              <div className={'c13-ask c14-ask' + (held ? ' c14-away' : '')} aria-hidden={held ? true : undefined}>
                <p className="c13-q" id="c14-q"><small>{SCENE14.kicker}</small>{SCENE14.question}</p>
                <Tags phase={phase} miss={missNow} onPick={pick} homeRef={homeRef}/>
              </div>
            )}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 14 · ' + SCENE14.title} teacher={teacher}
                playing={director.playing} onToggle={director.toggle}
                onReplay={() => { setMiss(null); setHeld(null); director.reset('s14-bridge'); }}/>
            )}
            {!director.playing && <span className="c13-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        <Actor src={A.CH.rupi} alt="Rupi, at the value display" position={rupiPos} state={rupiState} toward={phase === 'bridge' ? 1 : -1}
          walkMs={phase === 'travel' ? 2700 : 1600} cue={beatId + (missNow ? missNow.n : '')} zIndex={2} reduced={director.reduced}/>

        <div className="c13-table" style={{ '--apron': st.table.apron + 'cqh', '--top': st.table.top + 'cqh' }} aria-hidden="true">
          <div className="c13-surface"><i/><i/><i/><i/><span className="c13-farshade"/></div>
          <div className="c13-apron">{[1, 2, 3, 4, 5].map(k => <i key={k} style={{ left: (k * 100 / 6) + '%' }}/>)}</div>
        </div>

        {/* what we leave behind: Scene 13's sorted table slides out of frame as the camera trucks right */}
        {/* once the camera has left it, the old set is no longer rendered (seven 3D bodies off screen) */}
        {idx <= at('s14-travel') && (
        <div className={'c14-set' + (phase === 'bridge' ? '' : ' gone')} aria-hidden="true" style={director.reduced ? { transition: 'none' } : null}>
          <div className="c13-stand" style={{ left: br.stand.x + 'cqw', bottom: br.stand.y + 'cqh', '--sw': br.stand.w + 'cqh' }}>
            <span className="c13-pool"/><span className="c13-stand-side"/><span className="c13-stand-top"/><span className="c13-slot"/>
          </div>
          <span className="c13-lip" style={{ left: br.stand.x + 'cqw', bottom: (br.rest - 0.9) + 'cqh', '--sw': br.stand.w + 'cqh' }}/>
          {br.laid.map((p, k) => (
            <div key={k} className={'c13-obj c13-' + p.kind + ' is-laid'}
              style={{ '--w': (p.kind === 'coin' ? p.d : p.w) + 'cqh', '--rim': RIM[p.i] || '#8A6E44', transition: 'none',
                transform: 'translate3d(calc(' + p.x + 'cqw - 50%), ' + (-p.y) + 'cqh, 0) scale(' + p.s + ')' }}>
              <span className="c13-shadow"/>
              <div className="c13-roll"><div className="c13-lay"><Body kind={p.kind} i={p.i}/></div></div>
            </div>
          ))}
        </div>
        )}

        {/* the value display: four wooden steps, a brass value plate on each */}
        <div className={'c14-riser' + (phase === 'bridge' ? ' away' : '')} style={director.reduced ? { transition: 'none' } : null}>
          {st.steps.map((s, n) => (
            <div key={n} className="c14-step" aria-hidden="true"
              style={{ left: (s.x - s.w / 2) + 'cqw', width: s.w + 'cqw', bottom: st.base + 'cqh', height: s.h + 'cqh' }}>
              <span className={'c14-plate' + (plateUp(n) ? ' up' : '')}>₹{EX[n].v}</span>
            </div>
          ))}
          {EX.map((ex, n) => (
            <Piece key={ex.v} ex={ex} n={n} st={st} on={arrived(n)} reduced={director.reduced} markOn={markOn(n)}
              bright={n === ASKED && (phase === 'right' || phase === 'done')} hidden={n === ASKED && !!held}
              label={'₹' + ex.v + ' ' + ex.kind + (ex.face === 'back' ? ', turned to the side with its value' : '')}/>
          ))}
          {/* the ₹100 note can be picked up once the question is asked */}
          <button ref={pickRef} type="button" className={'c14-pick' + (canHold && !held ? ' on' : '')} disabled={!canHold || !!held}
            aria-label="₹100 note — pick it up to look closely" onClick={hold}
            style={{ left: (askStep.x - askW / 2) + 'cqw', width: askW + 'cqw', bottom: (st.base + askStep.h) + 'cqh', height: (askW * 300 / 620) + 'cqw' }}/>
        </div>

        {/* wide frames: the line sits beside Rupi's face, raised clear of the note's top edge */}
        <SpeechBubble speaker={layout === 'wide' && phase !== 'bridge' ? { ...rupiPos, h: rupiPos.h * 1.4 } : rupiPos} width={st.bubbleW} lines={[line || '']} show={!!line && !held}
          size={(phase === 'reveal' || phase === 'done') && layout === 'wide' ? 'lg' : undefined} beside={layout === 'wide' && phase !== 'bridge' ? 'left' : undefined}/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene14 };
