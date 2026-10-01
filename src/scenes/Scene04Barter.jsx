import React, { useMemo, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { SCENE04 } from '../data/introContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { Choice, useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import { Apple, Pencil } from './props';
import './barter.css';
import './intro.css';
import './scene06.css';
import '../currency/money.css';

/* ════════ Scene 04 — "Let's Try Barter!" ════════
   The same village market, seen from the other side of the lane (the plate is
   mirrored, never replaced). Two children: the boy has an apple and wants a
   pencil; the girl has a pencil and wants an apple. The class makes the trade —
   tap the apple, tap the pencil — and the two paths meet: ⇄. Then two
   questions: does this barter work, and what is barter?
   Solid colours, borders and transforms only: no filter, no blur. */

const SCRIPT_04 = checkScript('barter04', [
  beat('s4-establish', B.WIDE,        { ms: 2400, rm: 1600 }),
  beat('s4-boy',       B.PUSH_IN,     { ms: 3800, rm: 3400 }),  /* "I have an apple. I want a pencil." */
  beat('s4-girl',      B.PUSH_IN,     { ms: 3800, rm: 3400 }),  /* "I have a pencil. I want an apple." */
  beat('s4-offer',     B.DIALOGUE,    { ms: 3800, rm: 3400 }),  /* "I give you this apple, you give me this pencil." */
  beat('s4-trade',     B.HOLD),                                /* the class makes the trade */
  beat('s4-traded',    B.CORRECT,     { ms: 3400, rm: 2600 }),  /* ⇄ — "This is called barter!" */
  beat('s4-ask1',      B.QUESTION),                            /* Does this barter work? */
  beat('s4-ask2',      B.QUESTION),                            /* What is barter? */
  beat('s4-done',      B.CELEBRATION, { hold: true }),         /* the rule */
]);

const CAST4 = {
  boy: { src: A.CH.boy, alt: 'A boy holding an apple', ratio: 474 / 1059, hand: { dx: 0.36, dy: 0.36 } },
  girl: { src: A.CH.girl, alt: 'A girl holding her books and a pencil', ratio: 438 / 978, hand: { dx: 0.16, dy: 0.42 } },
};
const SPOTS4 = {
  wide: { boy: { x: 28, y: 4, h: 66 }, girl: { x: 72, y: 4, h: 64 }, boyAside: { x: 19, y: 4, h: 66 }, girlAside: { x: 81, y: 4, h: 64 },
          bubbleW: 27, pencil: 11 },
  tall: { boy: { x: 27, y: 30, h: 40 }, girl: { x: 73, y: 30, h: 39 }, boyAside: { x: 27, y: 30, h: 40 }, girlAside: { x: 73, y: 30, h: 39 },
          bubbleW: 46, pencil: 7.5 },
};

/* a point inside a child's artwork → stage units (x cqw, y cqh from the floor) */
const handOf = (who, pos, aspect) => {
  const c = CAST4[who], w = (pos.h * c.ratio) / aspect;
  return { x: pos.x + c.hand.dx * w, y: pos.y + pos.h * (1 - c.hand.dy) };
};
const faceOf = pos => ({ x: pos.x, y: 100 - (pos.y + pos.h * 0.8) });

const CONTRACT = { name: 'barter04', script: SCRIPT_04, preload: [A.P5BG, A.CH.boy, A.CH.girl], needs: { 's4-establish': [A.P5BG, A.CH.boy, A.CH.girl] } };
const NONE = { pick: null, attempt: 0 };

/* the trade: a ring on each thing, and a path from each thing to the other child */
function TradePaths({ apple, pencil, gave, traded, aspect, labels, rings, lift: gap = 5 }) {
  const seg = (a, b) => {
    const dx = b.x - a.x, dy = (b.y - a.y) / aspect;
    return { left: a.x + 'cqw', bottom: a.y + 'cqh', width: Math.hypot(dx, dy) + 'cqw',
             transform: 'rotate(' + (-Math.atan2(dy, dx) * 180 / Math.PI) + 'deg)' };
  };
  const lift = (p, dy) => ({ x: p.x, y: p.y + dy });
  const mid = { x: (apple.x + pencil.x) / 2, y: (apple.y + pencil.y) / 2 };
  return (
    <div className={'trade trade-full' + (rings ? '' : ' trade-out')} aria-hidden="true">
      <span className="trade-ring milk shown" style={{ left: apple.x + 'cqw', bottom: apple.y + 'cqh' }}/>
      <span className="trade-tag milk shown" style={{ left: apple.x + 'cqw', bottom: apple.y + 'cqh' }}>{labels.apple}</span>
      <span className="trade-ring milk shown" style={{ left: pencil.x + 'cqw', bottom: pencil.y + 'cqh' }}/>
      <span className="trade-tag milk shown" style={{ left: pencil.x + 'cqw', bottom: pencil.y + 'cqh' }}>{labels.pencil}</span>
      {/* the apple goes to the girl (upper path), the pencil to the boy (lower path) */}
      <span className={'trade-seg b' + (gave.apple ? ' drawn' : '')} style={seg(lift(apple, gap), lift(pencil, gap))}/>
      <span className={'trade-seg b' + (gave.pencil ? ' drawn' : '')} style={seg(lift(pencil, -gap), lift(apple, -gap))}/>
      <span className={'trade-ok' + (traded ? ' shown' : '')} style={{ left: mid.x + 'cqw', bottom: mid.y + 'cqh' }}>⇄</span>
    </div>
  );
}

function Scene04({ focusMode, blip }) {
  useInputModality();
  const { layout, aspect, director, rootProps } = useCinematicScene(CONTRACT, {
    scene: 4,
    onQa: b => { if (b === 's4-traded' || b === 's4-ask1' || b === 's4-ask2' || b === 's4-done') setGave({ apple: true, pencil: true }); },
  });
  const [gave, setGave] = useState({ apple: false, pencil: false });
  const [q1, setQ1] = useState(NONE);
  const [q2, setQ2] = useState(NONE);
  const b = director.beat, at = director.at;
  const S = SPOTS4[layout];

  const asking = b === 's4-ask1' || b === 's4-ask2' || b === 's4-done';
  const boyPos = asking ? S.boyAside : S.boy, girlPos = asking ? S.girlAside : S.girl;
  const apple = handOf('boy', boyPos, aspect), pencil = handOf('girl', girlPos, aspect);
  const traded = gave.apple && gave.pencil;

  const cam = b === 's4-establish' ? frame('WIDE', { x: 50, y: 50 })
    : b === 's4-boy' ? frame('PUSH_IN', faceOf(S.boy), { s: layout === 'tall' ? 1.12 : 1.26 })
    : b === 's4-girl' ? frame('PUSH_IN', faceOf(S.girl), { s: layout === 'tall' ? 1.12 : 1.26 })
    : frame('WIDE', { x: 50, y: 50 }, { dur: 1500 });

  const give = which => {
    if (b !== 's4-trade' || gave[which]) return;
    const next = { ...gave, [which]: true };
    setGave(next);
    if (blip) blip(which === 'apple' ? 820 : 720);
    if (next.apple && next.pencil) director.goTo('s4-traded');
  };
  const answer = (q, set) => id => {
    set(a => ({ pick: id, attempt: a.attempt + 1 }));
    const right = q.choices.find(c => c.id === id).correct;
    if (blip) blip(right ? 980 : 330, right ? 'sine' : 'square');
  };
  const replay = () => { setGave({ apple: false, pencil: false }); setQ1(NONE); setQ2(NONE); director.reset('s4-establish'); };

  const boyState = b === 's4-boy' ? ['offer', 'talk'] : b === 's4-offer' ? ['offer', 'talk'] : b === 's4-traded' || b === 's4-done' ? 'cheer'
    : b === 's4-trade' ? 'offer' : 'idle';
  const girlState = b === 's4-girl' ? ['offer', 'talk'] : b === 's4-offer' ? 'lean' : b === 's4-traded' || b === 's4-done' ? 'cheer'
    : b === 's4-trade' ? 'offer' : 'idle';
  const rings = at('s4-boy') && !asking || b === 's4-done';

  const prompt = !gave.apple && !gave.pencil ? SCENE04.prompt.start : gave.apple ? SCENE04.prompt.pencil : SCENE04.prompt.apple;
  const teacher = at('s4-trade') ? SCENE04.teacher : { ...SCENE04.teacher, cue: SCENE04.watchCue };
  const caption = useMemo(() => (
    b === 's4-boy' ? 'Boy: ' + SCENE04.boy.join(' ') : b === 's4-girl' ? 'Girl: ' + SCENE04.girl.join(' ')
      : b === 's4-offer' ? 'Boy: ' + SCENE04.offer.join(' ') : b === 's4-traded' ? SCENE04.called : ''
  ), [b]);

  const hot = (which, pt) => (
    <button type="button" className={'i4-hot' + (gave[which] ? ' given' : '')} onClick={() => give(which)}
      aria-label={which === 'apple' ? 'Give the apple to the girl' : 'Give the pencil to the boy'} aria-pressed={gave[which]}
      style={{ left: pt.x + 'cqw', bottom: pt.y + 'cqh' }}/>
  );

  return (
    <section {...rootProps}
      className={'barter barter04 layout-' + layout + (director.playing ? '' : ' is-paused') + (director.reduced ? ' is-reduced' : '')}
      aria-label={'Scene 4: ' + SCENE04.title}>
      <Plate src={A.P5BG} alt="The village market seen from the other side of the lane, a boy and a girl facing each other"
        mirror focusX={50} camera={cam} reduced={director.reduced} coupled maxUpscale={1.2}
        atmosphere={<EnvironmentLayer mood={b === 's4-traded' || b === 's4-done' ? 'bright' : 'neutral'} still={director.reduced}/>}
        overlay={(
          <React.Fragment>
            {b === 's4-trade' && <p className="i4-prompt" role="status">{prompt}</p>}
            {b === 's4-ask1' && (
              <Choice key="q1" id="q4a" question={SCENE04.q1.question} choices={SCENE04.q1.choices} answer={q1}
                feedback={SCENE04.q1.feedback} onPick={answer(SCENE04.q1, setQ1)}
                onContinue={() => director.goTo('s4-ask2')} continueLabel="Next question"/>
            )}
            {(b === 's4-ask2' || b === 's4-done') && (
              <Choice key="q2" id="q4b" question={SCENE04.q2.question} choices={SCENE04.q2.choices} answer={q2}
                feedback={SCENE04.q2.feedback} onPick={answer(SCENE04.q2, setQ2)}
                onContinue={b === 's4-ask2' ? () => director.goTo('s4-done') : null} continueLabel="The barter rule"/>
            )}
            {(b === 's4-traded' || b === 's4-done') && (
              <p className={'i3-takeaway' + (b === 's4-done' ? ' top' : '')} role="status">
                {b === 's4-traded' ? <React.Fragment>This is called <b>barter</b>!</React.Fragment>
                  : SCENE04.rule.map((s, k) => (s.em ? <b key={k}>{s.t}</b> : <React.Fragment key={k}>{s.t}</React.Fragment>))}
              </p>
            )}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 04 · ' + SCENE04.title} teacher={teacher}
                playing={director.playing} onToggle={director.toggle} onReplay={replay}/>
            )}
            {!director.playing && <span className="barter-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        <Actor src={CAST4.boy.src} alt={CAST4.boy.alt} position={boyPos} state={boyState} toward={1}
          walkMs={1300} cue={b} zIndex={3} reduced={director.reduced}/>
        <Actor src={CAST4.girl.src} alt={CAST4.girl.alt} position={girlPos} state={girlState} toward={-1}
          walkMs={1300} cue={b} zIndex={3} reduced={director.reduced}/>

        {/* the girl's pencil (the apple is in the boy's own artwork) */}
        <span className="prop i4-pencil" aria-hidden="true"
          style={{ '--pw': S.pencil + 'cqh', transform: 'translate3d(calc(' + pencil.x + 'cqw - 50%), calc(' + (-pencil.y) + 'cqh + 50%), 0)',
                   transition: director.reduced ? 'none' : 'transform 1.3s cubic-bezier(.4,.1,.35,1)' }}>
          <span className="prop-body"><Pencil/></span>
        </span>

        <TradePaths apple={apple} pencil={pencil} gave={gave} traded={traded && at('s4-traded')} aspect={aspect}
          labels={SCENE04.labels} rings={rings} lift={layout === 'tall' ? 3 : 5}/>
        {b === 's4-trade' && hot('apple', apple)}
        {b === 's4-trade' && hot('pencil', pencil)}

        <SpeechBubble speaker={S.boy} width={S.bubbleW} lines={b === 's4-offer' ? SCENE04.offer : SCENE04.boy}
          show={b === 's4-boy' || b === 's4-offer'}/>
        <SpeechBubble speaker={S.girl} width={S.bubbleW} lines={SCENE04.girl} show={b === 's4-girl'}/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Apple, Pencil, Scene04 };
