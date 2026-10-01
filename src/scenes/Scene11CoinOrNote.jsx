import React, { useMemo, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { SCENE11 } from '../data/rupeeContent';
import { B, beat, checkScript } from '../engine/beats';
import { frame } from '../engine/camera';
import { useCinematicScene } from '../engine/scene';
import { useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import { Board, Counter, CounterAsk, Piece, Tag, fitX } from './counter';

/* ════════ Scene 11 — "₹10 and ₹20 Can Be Coins or Notes" ════════
   The same counter, three steps, each with its own question:
     1  ₹10 coin = ₹10 note   — SAME VALUE, different form
     2  ₹20 coin = ₹20 note   — the ₹10 pair moves aside, the ₹20 pair arrives
     3  ₹10 ≠ ₹20             — the two pairs side by side
   The slate board over the counter carries each step's one line. No filter, no blur. */

const SCRIPT_11 = checkScript('form11', [
  beat('s11-coin',    B.OBJECT_MOVE, { ms: 3000, rm: 2200 }),  /* the ₹10 coin is set down */
  beat('s11-note',    B.OBJECT_MOVE, { ms: 3000, rm: 2200 }),  /* …and a ₹10 note beside it */
  beat('s11-same10',  B.DIALOGUE,    { ms: 5000, rm: 4400 }),  /* COIN · NOTE · = · SAME VALUE */
  beat('s11-ask0',    B.QUESTION),                            /* can ₹10 be a coin or a note? */
  beat('s11-right1',  B.CORRECT,     { ms: 3200, rm: 2600 }),
  beat('s11-coin20',  B.OBJECT_MOVE, { ms: 3200, rm: 2200 }),  /* the ₹10 pair moves aside; a ₹20 coin */
  beat('s11-note20',  B.OBJECT_MOVE, { ms: 3000, rm: 2200 }),  /* …and a ₹20 note */
  beat('s11-same20',  B.DIALOGUE,    { ms: 4800, rm: 4200 }),
  beat('s11-ask2',    B.QUESTION),                            /* can ₹20 be a coin or a note? */
  beat('s11-compare', B.DIALOGUE,    { ms: 3800, rm: 3200 }),  /* ₹10 ≠ ₹20 */
  beat('s11-ask3',    B.QUESTION),                            /* are ₹10 and ₹20 worth the same? */
  beat('s11-done',    B.CELEBRATION, { hold: true }),
]);

const P = SCENE11.pieces;
/* where each piece stands in each step (x cqw, size cqh; y = the row's floor) */
const STAGE = {
  wide: {
    table: { apron: 9, top: 27 },
    rupi: { x: 11, y: 16, h: 48 },
    board: { x: 58, y: 62, w: 32, h: 24 },
    rest: 19, tagY: 11.5, signY: 30,
    bubbleW: 30,
    steps: {
      ten: { c10: { x: 37, s: 21 }, n10: { x: 67, s: 35 }, eq10: 51.5 },
      twenty: { c10: { x: 24, s: 14 }, n10: { x: 40, s: 23 }, c20: { x: 61, s: 16 }, n20: { x: 80, s: 26 }, eq10: 30.8, eq20: 69 },
      compare: { c10: { x: 24, s: 14 }, n10: { x: 40, s: 23 }, c20: { x: 62, s: 14 }, n20: { x: 79, s: 23 }, eq10: 30.8, eq20: 68.8, neq: 51.5 },
    },
    cams: {
      ten: frame('MEDIUM', { x: 52, y: 58 }, { s: 1.12, dur: 1800 }),
      twenty: frame('MEDIUM', { x: 62, y: 58 }, { s: 1.08, dur: 1800 }),
      wide: frame('WIDE', { x: 50, y: 54 }, { dur: 1600 }),
    },
  },
  tall: {
    table: { apron: 8, top: 46 },
    rupi: { x: 20, y: 40, h: 30 },
    board: { x: 70, y: 51, w: 56, h: 18 },
    rest: 34, restLow: 16.5, tagY: 30, tagLow: 12, signY: 40,
    bubbleW: 86,
    steps: {
      ten: { c10: { x: 26, s: 15 }, n10: { x: 70, s: 25 }, eq10: 44 },
      twenty: { c10: { x: 22, s: 11 }, n10: { x: 66, s: 20 }, c20: { x: 22, s: 11, low: true }, n20: { x: 66, s: 20, low: true }, eq10: 40, eq20: 40 },
      compare: { c10: { x: 22, s: 11 }, n10: { x: 66, s: 20 }, c20: { x: 22, s: 11, low: true }, n20: { x: 66, s: 20, low: true }, eq10: 40, eq20: 40, neq: 92.5 },
    },
    cams: {
      ten: frame('WIDE', { x: 50, y: 54 }, { dur: 1800 }),
      twenty: frame('WIDE', { x: 50, y: 54 }, { dur: 1800 }),
      wide: frame('WIDE', { x: 50, y: 54 }, { dur: 1600 }),
    },
  },
};

const CONTRACT = {
  name: 'form11',
  script: SCRIPT_11,
  preload: [A.P5BG, A.CH.rupi, A.COINF[3], A.COINB[3], A.COINF[4], A.COINB[4], A.NOTEF[0], A.NOTEB[0], A.NOTEF[1], A.NOTEB[1]],
  needs: { 's11-coin': [A.P5BG, A.CH.rupi, A.COINF[3], A.COINB[3]], 's11-note': [A.NOTEF[0], A.NOTEB[0]], 's11-coin20': [A.COINF[4], A.COINB[4]] },
};

function Scene11({ focusMode, blip, onSolved }) {
  useInputModality();
  const { layout, director, rootProps } = useCinematicScene(CONTRACT, { scene: 11 });
  const [miss, setMiss] = useState(null);        /* { q, id, n } */
  const [turn, setTurn] = useState(null);        /* the piece the class asked to turn over */
  const st = STAGE[layout];
  const b = director.beat, at = director.at;
  const L = SCENE11.lines;

  const step = at('s11-compare') ? 'compare' : at('s11-coin20') ? 'twenty' : 'ten';
  const S = st.steps[step];
  const shown = {
    c10: true, n10: at('s11-note'),
    c20: at('s11-coin20'), n20: at('s11-note20'),
  };
  const Q = b === 's11-ask0' ? SCENE11.q0 : b === 's11-ask2' ? SCENE11.q2 : b === 's11-ask3' ? SCENE11.q3 : null;
  const pick = id => {
    const t = Q.tags.find(x => x.id === id);
    if (t.correct) {
      if (blip) blip(980);
      setMiss(null);
      if (b === 's11-ask0') director.goTo('s11-right1');
      if (b === 's11-ask2') director.goTo('s11-compare');
      if (b === 's11-ask3') { director.goTo('s11-done'); if (onSolved) onSolved(); }
    } else {
      if (blip) blip(330, 'triangle');
      setMiss(m => ({ q: b, id, n: m && m.q === b ? m.n + 1 : 1 }));
    }
  };
  const missNow = miss && miss.q === b ? miss : null;
  const replay = () => { setMiss(null); setTurn(null); director.reset('s11-coin'); };

  const line = b === 's11-coin' ? [L.coin10]
    : b === 's11-note' ? L.note10
    : b === 's11-same10' ? L.both10
    : b === 's11-ask0' ? (missNow ? [SCENE11.q0.wrong] : null)
    : b === 's11-right1' ? ['Yes! ₹10 can be a coin or a note.', L.right10]
    : b === 's11-coin20' ? L.coin20
    : b === 's11-note20' ? L.note20
    : b === 's11-same20' ? L.both20
    : b === 's11-ask2' ? (missNow ? [SCENE11.q2.wrong] : null)
    : b === 's11-compare' ? [L.compare]
    : b === 's11-ask3' ? (missNow ? [SCENE11.q3.wrong] : null)
    : b === 's11-done' ? [L.done] : null;
  const rupiState = b === 's11-coin' || b === 's11-coin20' ? ['reach', 'talk'] : b === 's11-note' || b === 's11-note20' ? ['point', 'talk']
    : b.startsWith('s11-same') || b === 's11-compare' ? ['lean', 'talk'] : Q ? (missNow ? ['think', 'talk'] : 'idle') : 'cheer';

  const cam = step === 'ten' ? (Q ? st.cams.wide : st.cams.ten) : step === 'twenty' && !Q ? st.cams.twenty : st.cams.wide;

  /* the board's one line for this step */
  const boardLine = step === 'ten'
    ? (at('s11-same10') ? <span className="line fade" key="b10"><em>₹10</em> coin = <em>₹10</em> note</span> : null)
    : step === 'twenty'
      ? (at('s11-same20') ? <span className="line fade" key="b20"><em>₹20</em> coin = <em>₹20</em> note</span> : null)
      : <span className="line fade" key="bneq"><em>₹10</em> ≠ <em>₹20</em></span>;
  const sub = step === 'compare' ? SCENE11.differ : SCENE11.same + ' · ' + SCENE11.sameSub;

  const pieces = ['c10', 'n10', 'c20', 'n20'];
  const floor = p => (p && p.low ? st.restLow : st.rest);
  const tagFloor = p => (p && p.low ? st.tagLow : st.tagY);
  const labelOn = k => shown[k] && !Q && at(k.endsWith('10') ? 's11-same10' : 's11-same20');
  const bright = k => (b === 's11-right1' && k.endsWith('10')) || (b === 's11-same20' && k.endsWith('20'));

  const teacher = at('s11-same10') ? SCENE11.teacher : { ...SCENE11.teacher, cue: SCENE11.watchCue };
  const caption = useMemo(() => (line ? 'Rupi: ' + line.map(l => (typeof l === 'string' ? l : l.map(s => s.t).join(''))).join(' ') : ''), [b, missNow && missNow.n]);

  return (
    <section {...rootProps} className={'counter form11 layout-' + layout + (director.playing ? '' : ' is-paused')}
      aria-label={'Scene 11: ' + SCENE11.title}>
      <Plate src={A.P5BG} alt="Rupi's money counter at the edge of the village market"
        focusX={layout === 'tall' ? 36 : 50} camera={cam} reduced={director.reduced} coupled maxUpscale={1.2}
        atmosphere={<EnvironmentLayer mood={b === 's11-right1' || b === 's11-done' ? 'bright' : 'neutral'} still/>}
        overlay={(
          <React.Fragment>
            {Q && (
              <CounterAsk id={b} question={Q.question} kicker={Q.kicker} tags={Q.tags} miss={missNow} onPick={pick}/>
            )}
            {b === 's11-done' && (
              <p className="cp-note" role="status">{SCENE11.summary}</p>
            )}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene 11 · ' + SCENE11.title} teacher={teacher}
                playing={director.playing} onToggle={director.toggle} onReplay={replay}/>
            )}
            {!director.playing && <span className="counter-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        <Actor src={A.CH.rupi} alt="Rupi, at the money counter" position={st.rupi} state={rupiState} toward={1}
          walkMs={1600} cue={b + (missNow ? missNow.n : '')} zIndex={2} reduced={director.reduced}/>

        <Board box={st.board} down={at('s11-same10')} label={step === 'compare' ? '₹10 is not equal to ₹20' : 'Same value, different form'}>
          {boardLine}
          {boardLine && <span className="small fade" key={'s' + step}>{sub}</span>}
        </Board>

        <Counter table={st.table}/>

        {pieces.map(k => {
          const p = S[k] || S[k.replace('20', '10')];
          const it = P[k];
          const on = shown[k] && S[k];
          return (
            <Piece key={k} item={it} at={{ x: p.x, y: floor(p) }} size={p.s} state={on ? 'stand' : 'off'}
              from={it.kind === 'coin' ? { dx: -20, dy: 0 } : { dx: 22, dy: 6 }} reduced={director.reduced}
              bright={bright(k)} turning={turn === k} still={turn !== k} label={it.label}
              onPick={b === 's11-done' ? () => { setTurn(t => (t === k ? null : k)); if (blip) blip(it.kind === 'coin' ? 820 : 560); } : undefined}/>
          );
        })}

        {pieces.map(k => {
          const p = S[k];
          if (!p) return null;
          return <Tag key={'t' + k} at={{ x: p.x, y: tagFloor(p) }} on={labelOn(k)}>{SCENE11.form[P[k].kind]} · ₹{P[k].v}</Tag>;
        })}

        {/* the carved plates: "=" inside each pair, "≠" between the pairs */}
        <span className={'cp-sign' + (step !== 'ten' ? ' sm' : '') + (at('s11-same10') && !Q ? ' on' : '')} aria-hidden="true"
          style={{ left: S.eq10 + 'cqw', bottom: st.signY + 'cqh' }}>=</span>
        {S.eq20 != null && (
          <span className={'cp-sign sm' + (at('s11-same20') && !Q ? ' on' : '')} aria-hidden="true"
            style={{ left: S.eq20 + 'cqw', bottom: (layout === 'tall' ? st.restLow + 6 : st.signY) + 'cqh' }}>=</span>
        )}
        {S.neq != null && (
          <span className={'cp-sign neq' + (layout === 'tall' ? ' sm' : '') + (at('s11-compare') ? ' on' : '')} aria-hidden="true"
            style={{ left: S.neq + 'cqw', bottom: (layout === 'tall' ? st.restLow + 12 : st.signY) + 'cqh' }}>≠</span>
        )}

        <SpeechBubble speaker={st.rupi} width={st.bubbleW} centerX={fitX(cam, st.rupi.x, st.bubbleW)} lines={line || ['']} show={!!line}
          size={b === 's11-right1' || b === 's11-done' ? 'lg' : undefined} em/>
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { Scene11 };
