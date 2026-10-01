import React, { useCallback, useEffect, useRef, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { InteractiveBanknote } from '../currency/InteractiveBanknote';
import { SCENE12 } from '../data/notesContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import './scene12.css';

/* ════════ Scene 12 — "Meet the Notes" ════════
   A money table at the front of the market. Rupi stands behind it; the six
   supplied notes lie on it at different depths. The camera arrives, Rupi
   notices, leans over the notes to present them, the camera moves in, and
   the class picks notes up.

   The world is the crisp village-market plate (the market of Scenes 05–11).
   The supplied "note display" / "coin table" environments have their blur
   painted into the image, so they are not used. */

const SCRIPT_12 = checkScript('notes', [
  beat('s12-establish', B.WIDE,     { ms: 2800, rm: 1800 }),  /* the market and the money table */
  beat('s12-notice',    B.REACTION, { ms: 1900, rm: 1200 }),  /* Rupi reacts to the notes on the counter */
  beat('s12-point',     B.DIALOGUE, { ms: 3600, rm: 3000 }),  /* Rupi leans over them: "These are the notes." */
  beat('s12-travel',    B.PUSH_IN,  { ms: 2600, rm: 1200 }),  /* the camera moves in toward the table */
  beat('s12-explore',   B.HOLD),                              /* the class picks notes up */
]);

const RUPI = { src: A.CH.rupi, alt: 'Rupi, standing behind the money table' };

/* Two compositions. Notes are placed on the table surface: x/y = % of the
   surface (y from its far edge), w = % of surface width, r = turn in degrees.
   Two rows: far ₹10 ₹20 ₹50 · near ₹100 ₹200 ₹500. */
const STAGE = {
  wide: {
    rupi: { x: 71, y: 22, h: 54 },
    rupiNear: { x: 65, y: 22, h: 54 },     /* a step along the counter, toward the notes */
    bubbleW: 24, ruleW: 36,
    /* the notes are laid out like a museum display: two straight rows, equal size and spacing,
       each with a printed ₹ label on the table in front of it */
    notes: {
      10:  { x: 5.5, y: 1, w: 24, r: 0 }, 20:  { x: 38, y: 1, w: 24, r: 0 }, 50:  { x: 70.5, y: 1, w: 24, r: 0 },
      100: { x: 5.5, y: 46, w: 24, r: 0 }, 200: { x: 38, y: 46, w: 24, r: 0 }, 500: { x: 70.5, y: 46, w: 24, r: 0 },
    },
    cams: {
      establish: frame('WIDE', { x: 50, y: 50 }, { dur: 1600 }),
      notice:    frame('MEDIUM', { x: 68, y: 40 }, { s: 1.12, dur: 1500 }),
      point:     frame('TRACK', { x: 58, y: 52 }, { s: 1.1, dur: 2200 }),   /* follows Rupi's lean down to the notes */
      travel:    frame('PUSH_IN', { x: 50, y: 62 }, { s: 1.06, dur: 2600 }),
    },
  },
  tall: {
    rupi: { x: 66, y: 29, h: 42 },
    rupiNear: { x: 61, y: 29, h: 42 },
    bubbleW: 48, ruleW: 76,        /* the explore camera zooms ~8% — keep the line inside the frame */
    notes: {
      10:  { x: 2, y: 8,  w: 31, r: 0 }, 20:  { x: 34.5, y: 8,  w: 31, r: 0 }, 50:  { x: 67, y: 8,  w: 31, r: 0 },
      100: { x: 2, y: 52, w: 31, r: 0 }, 200: { x: 34.5, y: 52, w: 31, r: 0 }, 500: { x: 67, y: 52, w: 31, r: 0 },
    },
    cams: {
      establish: frame('WIDE', { x: 50, y: 50 }, { dur: 1600 }),
      notice:    frame('MEDIUM', { x: 66, y: 40 }, { s: 1.12, dur: 1500 }),
      point:     frame('TRACK', { x: 56, y: 50 }, { s: 1.1, dur: 2200 }),
      travel:    frame('PUSH_IN', { x: 50, y: 62 }, { s: 1.08, dur: 2600 }),
    },
  },
};

const NOTES12 = {
  name: 'notes',
  script: SCRIPT_12,
  preload: [A.P5BG, RUPI.src, ...A.NOTEF, ...A.NOTEB],
  /* Rupi only turns to the table once the notes are on it (engine caps the wait at 1.5 s) */
  needs: { 's12-notice': A.NOTEF },
};

function Scene12({ scene, focusMode }) {
  useInputModality();
  const { layout, aspect, director, rootProps, stageRef } = useCinematicScene(NOTES12, { scene });
  /* notes are sized against the table's width, its depth follows the frame's
     height: on wider portrait frames (tablets) shrink them so they stay on the table */
  const noteScale = layout === 'tall' ? Math.min(1, 0.6 / aspect) : 1;
  const st = STAGE[layout];
  /* a note's depth on the table top per unit of its width: 300/620 × the top's width:depth
     (wide: 92cqw × 58cqh, tall: 106cqw × 64cqh — scene12.css) — places each label just in front of its note */
  const noteH = (300 / 620) * (layout === 'tall' ? (106 * aspect) / 64 : (92 * aspect) / 58);
  const beatId = director.beat;
  const exploring = beatId === 's12-explore';

  const [hover, setHover] = useState(null);
  const [held, setHeld] = useState(null);          /* { v, from: DOMRect, cam } */
  const [seen, setSeen] = useState(() => new Set());
  const [face, setFace] = useState('front');
  const [ready, setReady] = useState(() => new Set());
  const markReady = v => setReady(r => (r.has(v) ? r : new Set(r).add(v)));
  const slots = useRef({});
  const closeHeld = useRef(null);

  const pick = (n, e) => {
    if (held) return;
    const el = slots.current[n.v];
    const r = el.getBoundingClientRect();
    const s = stageRef.current.getBoundingClientRect();
    /* the camera leans toward the note that was picked */
    const cam = frame('CLOSE', { x: ((r.left + r.width / 2 - s.left) / s.width) * 100, y: ((r.top + r.height / 2 - s.top) / s.height) * 100 },
      { s: layout === 'tall' ? 1.12 : 1.18, dur: 900 });
    if (!exploring) director.goTo('s12-explore');
    setHeld({ v: n.v, i: n.i, from: r, cam, byKey: e && e.detail === 0 });
    setHover(null);
  };
  const heldRef = useRef(null);
  heldRef.current = held;
  const putBack = useCallback(() => {
    const h = heldRef.current;
    if (!h) return;
    setSeen(sv => new Set(sv).add(h.v));
    setHeld(null);
    setFace('front');
    if (h.byKey) returnTo.current = h.v;       /* refocused after the commit re-enables the note */
  }, []);
  /* keyboard users return to the note they picked up — once it is enabled again */
  const returnTo = useRef(null);
  useEffect(() => {
    if (held || returnTo.current == null) return;
    const el = slots.current[returnTo.current];
    returnTo.current = null;
    if (el) el.focus({ preventScroll: true });
  }, [held]);
  const getHome = useCallback(() => (held && slots.current[held.v] ? slots.current[held.v].getBoundingClientRect() : null), [held]);

  /* ── direction ── */
  const cam = held ? held.cam
    : beatId === 's12-establish' ? st.cams.establish
    : beatId === 's12-notice' ? st.cams.notice
    : beatId === 's12-point' ? st.cams.point
    : st.cams.travel;
  /* The artwork is a single still image (no arm to move), so "presenting" is
     staging: Rupi reacts, steps along the counter, leans over the notes, and the
     camera follows his lean down to them while warm light falls on the table. */
  const presenting = beatId === 's12-point' || beatId === 's12-travel' || exploring;
  const rupiPos = presenting ? st.rupiNear : st.rupi;
  const rupiState = held ? ['reach', 'nod']
    : hover ? 'reach'
    : beatId === 's12-notice' ? ['lean', 'surprised']
    : beatId === 's12-point' ? ['reach', 'talk']
    : exploring && seen.size >= 2 ? ['lean', 'nod']
    : 'idle';
  const lit = beatId === 's12-point' || beatId === 's12-travel';
  const showIntro = beatId === 's12-point' || beatId === 's12-travel';
  const showRule = exploring && !held && seen.size >= 2;
  const heldNote = held && SCENE12.notes.find(n => n.v === held.v);

  const teacher = exploring ? SCENE12.teacher : { ...SCENE12.teacher, cue: SCENE12.watchCue };
  const caption = held ? '₹' + held.v + ' note, ' + face + ' side.'
    : showRule ? 'Rupi: ' + SCENE12.rule.map(s => s.t).join('')
    : showIntro ? 'Rupi: ' + SCENE12.intro : '';

  return (
    <section {...rootProps} className={'notes12 layout-' + layout + (director.playing ? '' : ' is-paused') + (held ? ' is-holding' : '')}
      aria-label={'Scene 12: ' + SCENE12.title}>
      <Plate src={A.P5BG} alt="The village market, with a wooden money table in front"
        focusX={50} camera={cam} reduced={director.reduced}
        /* still: the sun's slow ambient pulse, animating beneath the 3D table, cost
           ~40 fps during camera moves (measured) — the light stays, the pulse goes */
        atmosphere={<EnvironmentLayer mood={held ? 'quiet' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {held && <span className="n12-focus" aria-hidden="true" onClick={() => closeHeld.current && closeHeld.current()}/>}
            {heldNote && (
              <div className="n12-held">
                <InteractiveBanknote key={held.v} note={heldNote} front={A.NOTEF[heldNote.i]} back={A.NOTEB[heldNote.i]}
                  from={held.from} getHome={getHome} reduced={director.reduced}
                  onClose={putBack} onFace={setFace} closeRef={closeHeld} focusOnOpen={held.byKey}/>
              </div>
            )}
            {exploring && !held && <p className="n12-hint">{SCENE12.instruction}</p>}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 12 · ' + SCENE12.title} teacher={teacher}
                playing={director.playing} onToggle={director.toggle} onReplay={() => { setSeen(new Set()); director.reset('s12-establish'); }}/>
            )}
            {!director.playing && <span className="n12-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        {/* Rupi first: the table in front hides his legs */}
        <Actor {...RUPI} position={rupiPos} state={rupiState} toward={-1} cue={beatId + (held ? held.v : '') + (hover || '')}
          walkMs={1600} zIndex={1} reduced={director.reduced}/>

        <div className={'n12-table' + (lit ? ' is-lit' : '')} role="group" aria-label="Money table with six notes">
          <div className="n12-top">
            <span className="n12-planks" aria-hidden="true"><i/><i/><i/><i/><i/><i/></span>
            <span className="n12-farshade" aria-hidden="true"/>
            <span className="n12-lit" aria-hidden="true"/>
            {SCENE12.notes.map(n => {
              const p = st.notes[n.v];
              const lifted = hover === n.v;
              const gone = held && held.v === n.v;
              return (
                <React.Fragment key={n.v}>
                <div className={'n12-slot' + (p.y < 30 ? ' far' : '') + (ready.has(n.v) ? ' ready' : '') + (lifted ? ' lift' : '') + (gone ? ' gone' : '')}
                  style={{ left: (p.x + (p.w * (1 - noteScale)) / 2) + '%', top: p.y + '%', width: p.w * noteScale + '%', '--r': p.r + 'deg' }}>
                  <span className="n12-shadow"/>
                  <button type="button" className="n12-note" ref={el => { slots.current[n.v] = el; }}
                    aria-label={'₹' + n.v + ' note — pick it up'} disabled={!!held}
                    onPointerEnter={() => setHover(n.v)} onPointerLeave={() => setHover(h => (h === n.v ? null : h))}
                    onFocus={() => setHover(n.v)} onBlur={() => setHover(h => (h === n.v ? null : h))}
                    onClick={e => pick(n, e)}>
                    <img src={A.NOTEF[n.i]} alt="" draggable="false" onLoad={() => markReady(n.v)}
                      ref={el => { if (el && el.complete && el.naturalWidth) markReady(n.v); }}/>
                  </button>
                </div>
                {/* its label, printed on the table in front of it */}
                <span className={'n12-tag' + (ready.has(n.v) ? ' ready' : '')} aria-hidden="true"
                  style={{ left: (p.x + p.w / 2) + '%', top: (p.y + p.w * noteScale * noteH + 1.5) + '%' }}>₹{n.v}</span>
                </React.Fragment>
              );
            })}
          </div>
          <div className="n12-front" aria-hidden="true">
            {[1, 2, 3, 4, 5].map(k => <i key={k} style={{ left: (k * 100 / 6) + '%' }}/>)}
          </div>
        </div>

        {/* wide frames: Rupi stands high on the right, so his lines sit beside his face */}
        <SpeechBubble speaker={rupiPos} width={st.bubbleW} lines={[SCENE12.intro]} show={showIntro}
          dim={beatId === 's12-travel'} beside={layout === 'wide' ? 'left' : undefined}/>
        <SpeechBubble speaker={rupiPos} width={st.ruleW} lines={[SCENE12.rule]} show={showRule} size="lg"
          beside={layout === 'wide' ? 'left' : undefined} centerX={layout === 'tall' ? 50 : undefined}/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene12 };
