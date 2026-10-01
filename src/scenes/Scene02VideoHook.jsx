import React, { useMemo, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { SCENE02, SCENE03 } from '../data/introContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { Choice, useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import { CAST, SPOTS, between, faceOf, propPoint, torsoOf } from './barterStaging';
import { SCRIPT_03, STAGE_03, direct03 } from './Scene03BeforeMoney';
import { TradeDiagram } from './Scene06';
import { Eraser, Pencil, Stickers, Tiffin } from './props';
import './barter.css';
import './intro.css';
import '../currency/money.css';

/* ════════ Scenes 02 → 03 — the market film and "before money", one continuous take ════════
   The same village market that Scenes 04–18 are filmed in, with the same cast
   standing where Scene 05 will find them. Scene 02 is a short film: the farmer
   offers wheat, the milk seller refuses, the offer stops half-way — then the
   class is asked what went wrong. Scene 03 carries straight on (no cut): Rupi
   walks in and turns the same wheat and milk into the idea of barter.
   No filter, no blur, no backdrop-filter anywhere. */

/* ── Scene 02 — "The 1-Minute Video Hook" — director sheet ── */
const SCRIPT_02 = [
  beat('s2-slate',   B.WIDE,        { ms: 2800, rm: 2000 }),  /* the market; the film's title */
  beat('s2-offer',   B.PUSH_IN,     { ms: 4400, rm: 3600 }),  /* the farmer steps up, offers his wheat, speaks */
  beat('s2-look',    B.TRACK,       { ms: 1800, rm: 1200 }),  /* the milk seller looks at the wheat… */
  beat('s2-refuse',  B.REACTION,    { ms: 4400, rm: 3600 }),  /* …and politely refuses */
  beat('s2-slide',   B.OBJECT_MOVE, { ms: 3200, rm: 2000 }),  /* the offer slides toward the milk — and stops */
  beat('s2-sad',     B.CLOSE,       { ms: 2600, rm: 1800 }),  /* the farmer, sad and confused */
  beat('s2-ask',     B.QUESTION),
  beat('s2-solved',  B.CORRECT,     { hold: true }),          /* waits for Continue */
];

function direct02(beatId, { spots, layout }) {
  const F = spots.farmer, S = spots.seller;
  /* Rupi watches from the edge of the market (wide frames only — a phone has no room beside the traders) */
  const edge = layout === 'tall' ? null : { x: 8, y: 2, h: 44 };
  const d = {
    cam: frame('WIDE', { x: 50, y: 50 }), mood: 'neutral',
    farmer: { pos: F.home, state: 'idle' },
    seller: { pos: S.home, state: 'idle' },
    rupi: edge ? { pos: edge, state: 'idle' } : null,
    bubbles: {}, rupiSays: null, diagram: 'off', ask: false, slate: false,
  };
  switch (beatId) {
    case 's2-slate':
      d.cam = frame('WIDE', { x: 50, y: 48 });
      d.slate = true;
      break;
    case 's2-offer':
      d.cam = frame('PUSH_IN', faceOf(F.step), { s: layout === 'tall' ? 1.2 : 1.32 });
      d.farmer = { pos: F.step, state: ['offer', 'talk'], walkMs: 1400 };
      d.seller.state = 'lean';
      d.bubbles.farmer = 'on';
      break;
    case 's2-look':
      d.cam = frame('TRACK', torsoOf(S.home), { s: layout === 'tall' ? 1.16 : 1.3 });
      d.farmer = { pos: F.step, state: 'offer' };
      d.seller.state = 'think';
      break;
    case 's2-refuse':
      d.cam = frame('REACTION', faceOf(S.home), { s: layout === 'tall' ? 1.2 : 1.42 });
      d.farmer = { pos: F.step, state: 'offer' };
      d.seller.state = ['protect', 'reject', 'talk'];
      d.bubbles.seller = 'on';
      break;
    case 's2-slide':
      d.cam = frame('MEDIUM', between(torsoOf(F.home), torsoOf(S.home)), { s: layout === 'tall' ? 1 : 1.06, dur: 1600 });
      d.farmer = { pos: F.home, state: 'offer', walkMs: 1200 };
      d.seller.state = 'protect';
      d.bubbles.seller = 'dim';
      d.diagram = 'stop';
      if (d.rupi) d.rupi.state = 'surprised';
      break;
    case 's2-sad':
      d.cam = frame('CLOSE', faceOf(F.home), { s: layout === 'tall' ? 1.3 : 1.5, dur: 1800 });
      d.farmer.state = 'sad';
      d.seller.state = 'protect';
      d.diagram = 'gone';
      d.mood = 'quiet';
      break;
    case 's2-ask':
    case 's2-solved':
      d.cam = frame('WIDE', { x: 50, y: 50 }, { dur: 1400 });
      d.farmer.state = 'sad';
      d.seller.state = 'protect';
      if (d.rupi) d.rupi.state = 'think';
      d.ask = true;
      d.mood = 'quiet';
      break;
    default:
  }
  return d;
}

const DIRECT = { 2: direct02, 3: direct03 };
const CONTENT = { 2: SCENE02, 3: SCENE03 };
const FIRST = { 2: 's2-slate', 3: 's3-bridge' };
const SWAP_ART = { tiffin: Tiffin, stickers: Stickers, pencil: Pencil, eraser: Eraser };

const INTRO = {
  name: 'intro',
  script: checkScript('intro', [...SCRIPT_02, ...SCRIPT_03]),
  preload: [A.P5BG, CAST.farmer.src, CAST.seller.src, CAST.rupi.src],
  needs: { 's2-slate': [A.P5BG, CAST.farmer.src, CAST.seller.src] },
};
const NO_ANSWER = { pick: null, attempt: 0, swapped: false };

function IntroSequence({ scene, focusMode, onAdvance }) {
  useInputModality();
  const [answers, setAnswers] = useState({ 2: NO_ANSWER, 3: NO_ANSWER });
  const [seen, setSeen] = useState([]);                 /* the class's swaps revealed so far */
  const setAns = (n, v) => setAnswers(a => ({ ...a, [n]: typeof v === 'function' ? v(a[n]) : v }));

  const { layout, aspect, director, rootProps } = useCinematicScene(INTRO, {
    scene,
    onEnter: to => setAns(to, NO_ANSWER),
    onQa: b => { if (/-(solved|friends)$/.test(b)) setAns(+b[1], { ...NO_ANSWER, pick: CONTENT[+b[1]].choices.find(c => c.correct).id, attempt: 1 }); },
  });

  const n = +director.beat[1];
  const content = CONTENT[n];
  const spots = SPOTS[layout];
  const answer = { ...answers[n], swapped: seen.length > 0 };
  const d = DIRECT[n](director.beat, { spots, layout, answer });

  const pick = id => {
    setAns(n, a => ({ ...a, pick: id, attempt: a.attempt + 1 }));
    if (content.choices.find(c => c.id === id).correct) director.goTo('s' + n + '-solved');
  };
  const replay = () => { setAns(n, NO_ANSWER); setSeen([]); director.reset(FIRST[n]); };
  const reveal = id => setSeen(s => (s.includes(id) ? s : [...s, id]));

  const wheat = propPoint('farmer', d.farmer.pos, aspect);
  const milk = propPoint('seller', d.seller.pos, aspect);
  const asking = d.ask;
  const teacher = asking || d.swaps || answer.pick ? content.teacher : { ...content.teacher, cue: content.watchCue };

  const rupiLines = d.rupiSays === 'wonder' ? { lines: [SCENE03.rupiAsk], size: 'lg' }
    : d.rupiSays === 'rule' ? { lines: SCENE03.rupiRule, size: 'lg' }
    : d.rupiSays === 'friends' ? { lines: [SCENE03.friendsAsk], size: 'lg' }
    : d.rupiSays === 'swapped' ? { lines: [SCENE03.swapSaid], size: 'lg' }
    : null;
  const farmerLines = n === 2 ? SCENE02.farmer : SCENE03.farmer;
  const sellerLines = n === 2 ? SCENE02.seller : SCENE03.seller;

  const caption = useMemo(() => {
    const txt = l => (typeof l === 'string' ? l : l.map(s => s.t).join(''));
    if (rupiLines) return 'Rupi: ' + rupiLines.lines.map(txt).join(' ');
    if (d.bubbles.seller === 'on') return 'Milk seller: ' + sellerLines.join(' ');
    if (d.bubbles.farmer === 'on') return 'Farmer: ' + farmerLines.join(' ');
    return '';
  }, [rupiLines && d.rupiSays, d.bubbles.seller, d.bubbles.farmer, n]);

  const st = STAGE_03[layout];
  const onContinue = n === 2 ? () => onAdvance(2) : null;

  return (
    <section {...rootProps}
      className={'barter intro layout-' + layout + (director.playing ? '' : ' is-paused') + (director.reduced ? ' is-reduced' : '')}
      aria-label={'Scene ' + n + ': ' + content.title}>
      <Plate src={A.P5BG} alt="A village market at sunset: a farmer with wheat and a milk seller with milk cans"
        focusX={layout === 'tall' ? 58 : 50} camera={d.cam} reduced={director.reduced} coupled maxUpscale={1.2}
        atmosphere={<EnvironmentLayer mood={d.mood} still={director.reduced}/>}
        overlay={(
          <React.Fragment>
            {d.slate && (
              <p className="i2-slate" aria-hidden="true"><i>▶</i>{SCENE02.slate}</p>
            )}
            {asking && (
              <Choice key={'q' + n} id={'q' + n} question={content.question} choices={content.choices}
                answer={answer} feedback={content.feedback} onPick={pick}
                onContinue={onContinue} continueLabel="What did people do before money?"/>
            )}
            {d.takeaway && (
              <p className="i3-takeaway" role="status"><b>{SCENE03.word}</b> = {SCENE03.definition.toLowerCase().replace(/\.$/, '')}</p>
            )}
            {d.swaps && !seen.length && <p className="i3-hint" role="status">Tap each thing the class has swapped</p>}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene ' + String(n).padStart(2, '0') + ' · ' + content.title}
                teacher={teacher} playing={director.playing} onToggle={director.toggle} onReplay={replay}/>
            )}
            {!director.playing && <span className="barter-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        {/* Scene 03's crates: the class's own swaps */}
        {n === 3 && st.crates.map((c, k) => (
          <span key={'crate' + k} className={'crate' + (d.swaps ? '' : ' hidden')} aria-hidden="true"
            style={{ '--cw': c.w + 'cqw', '--ch': c.h + 'cqh', transform: 'translate3d(calc(' + c.x + 'cqw - 50%), ' + (-c.y) + 'cqh, 0)' }}>
            <i/><i/><i/>
          </span>
        ))}

        {d.rupi && (
          <Actor {...CAST.rupi} alt="Rupi, watching the market" position={d.rupi.pos} state={d.rupi.state} toward={d.rupi.pos.x < 30 || d.rupi.pos.y < 10 ? 1 : -1}
            enterFrom={d.rupi.enter != null ? d.rupi.enter : null}
            walkMs={d.rupi.walkMs || 1600} cue={director.beat} zIndex={d.rupi.pos.x < 20 ? 1 : d.rupi.pos.y < 10 ? 7 : 5} reduced={director.reduced}/>
        )}
        <Actor {...CAST.farmer} position={d.farmer.pos} state={d.farmer.state} toward={1}
          walkMs={d.farmer.walkMs || 1400} cue={director.beat} zIndex={3} reduced={director.reduced}/>
        <Actor {...CAST.seller} position={d.seller.pos} state={d.seller.state} toward={-1}
          walkMs={d.seller.walkMs || 1400} cue={director.beat} zIndex={2} idle={false} reduced={director.reduced}/>

        <TradeDiagram phase={d.diagram} wheat={wheat} milk={milk} aspect={aspect}
          labels={n === 2 ? SCENE02.labels : SCENE03.labels} word={SCENE03.word}/>

        {n === 3 && SCENE03.swaps.map((s, k) => {
          const Art = SWAP_ART[s.id], at = st.swaps[k], on = seen.includes(s.id);
          return (
            <button key={s.id} type="button" className={'i3-swap' + (d.swaps ? ' on' : '') + (on ? ' seen' : '')}
              tabIndex={d.swaps ? 0 : -1} aria-hidden={!d.swaps} aria-pressed={on}
              aria-label={s.label + (on ? ' — swapped!' : '')} onClick={() => d.swaps && reveal(s.id)}
              style={{ '--pw': st.swapSize + 'cqh', left: at.x + 'cqw', bottom: at.y + 'cqh', transitionDelay: d.swaps ? (k * 0.12) + 's' : '0s' }}>
              <span className="i3-swap-art"><Art/></span>
              <span className="i3-swap-tag">{s.label}</span>
            </button>
          );
        })}

        <SpeechBubble speaker={d.farmer.pos} width={spots.bubbleW} lines={farmerLines}
          show={!!d.bubbles.farmer} dim={d.bubbles.farmer === 'dim'}/>
        <SpeechBubble speaker={d.seller.pos} width={spots.bubbleW} lines={sellerLines}
          show={!!d.bubbles.seller} dim={d.bubbles.seller === 'dim'}/>
        {d.rupi && (
          <SpeechBubble speaker={d.rupi.pos} width={spots.ruleW} lines={rupiLines ? rupiLines.lines : ['']}
            show={!!rupiLines} size={rupiLines ? rupiLines.size : undefined}
            floor={layout === 'tall' ? d.farmer.pos.y + d.farmer.pos.h + 1.8 : 0}/>
        )}
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { IntroSequence, SCRIPT_02, direct02 };
