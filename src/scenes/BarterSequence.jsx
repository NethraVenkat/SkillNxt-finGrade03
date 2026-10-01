import React, { useCallback, useMemo, useState } from 'react';
import A from '../assets/index';
import { Actor } from '../characters/Actor';
import { SpeechBubble } from '../characters/SpeechBubble';
import { MoneyObject } from '../currency/MoneyObject';
import { FARMER_LINE, SCENE05, SCENE06, SELLER_LINE } from '../data/barterContent';
import { SCENE07, SCENE08 } from '../data/moneyContent';
import { checkScript } from '../engine/beats';
import { useCinematicScene } from '../engine/scene';
import { Choice, useInputModality } from '../interactions/Choice';
import { TeacherPanel } from '../teacher/TeacherPanel';
import { EnvironmentLayer } from '../world/EnvironmentLayer';
import { Plate } from '../world/Plate';
import { CAST, SPOTS, propPoint } from './barterStaging';
import { SCRIPT_05, direct05 } from './Scene05';
import { SCRIPT_06, TradeDiagram, direct06 } from './Scene06';
import { MoneyWeb, SCRIPT_07, direct07 } from './Scene07';
import { SCRIPT_08, direct08 } from './Scene08';
/* the drawn props already used by the earlier Scene 07/08 — there are no supplied images for them */
import { Book, Toy } from './Scene07RupiIdea';
import { Mango, PriceTag } from './Scene08WhyMoney';
import './barter.css';

/* ════════ scenes/BarterSequence.jsx — Scenes 05 → 08, one continuous take ════════
   One market, never reset: the failed trade (05), why it failed (06), money
   arriving as the answer (07), and what money does (08). The world, the actors
   and the camera carry straight on from one lesson step to the next. */

const DIRECT = { 5: direct05, 6: direct06, 7: direct07, 8: direct08 };
const CONTENT = { 5: SCENE05, 6: SCENE06, 7: SCENE07, 8: SCENE08 };
const FIRST = { 5: 's5-establish', 6: 's6-bridge', 7: 's7-recall', 8: 's8-follow' };

/* the scene contract (engine/scene.js) */
const MARKET = {
  name: 'market',
  script: checkScript('market', [...SCRIPT_05, ...SCRIPT_06, ...SCRIPT_07, ...SCRIPT_08]),
  preload: [A.P5BG, CAST.farmer.src, CAST.seller.src],
  needs: {
    's6-rupi': [CAST.rupi.src],                                  /* Rupi's art decoded before the walk-in */
    's7-arrive': [A.COINF[3], A.COINB[3]],                       /* the ₹10 coin before it enters */
    's8-exchange': [A.NOTEF[0], A.NOTEB[0]],                     /* the ₹10 note before it changes hands */
  },
  direct: (beatId, ctx) => DIRECT[ctx.n](beatId, ctx),
};
const NO_ANSWER = { pick: null, attempt: 0 };
const NONE = { 5: NO_ANSWER, 6: NO_ANSWER, 7: NO_ANSWER, 8: NO_ANSWER };

function BarterSequence({ scene, focusMode, onSolved, onAdvance }) {
  const [answers, setAnswers] = useState(NONE);
  const setAns = (n, v) => setAnswers(a => ({ ...a, [n]: typeof v === 'function' ? v(a[n]) : v }));
  useInputModality();

  const { layout, aspect, director, rootProps } = useCinematicScene(MARKET, {
    scene,
    onEnter: to => setAns(to, NO_ANSWER),
    /* dev QA deep links: preset the answers a beat assumes */
    onQa: (b, p) => {
      const n = +b[1];
      if (/-(solved|rupi|teach)$/.test(b)) setAns(n, { pick: CONTENT[n].choices.find(c => c.correct).id, attempt: 1 });
      if (p.get('wrong')) setAns(n, { pick: CONTENT[n].choices.find(c => !c.correct).id, attempt: 1 });
    },
  });

  const n = +director.beat[1];                        /* which lesson step this beat belongs to */
  const spots = SPOTS[layout];
  const wheatAt = useCallback(pos => propPoint('farmer', pos, aspect), [aspect]);
  const milkAt = useCallback(pos => propPoint('seller', pos, aspect), [aspect]);
  const answer = answers[n];
  const d = MARKET.direct(director.beat, { n, spots, layout, answer, wheatAt, milkAt });

  const pick = id => {
    setAns(n, a => ({ pick: id, attempt: a.attempt + 1 }));
    if (CONTENT[n].choices.find(c => c.id === id).correct) {
      director.goTo('s' + n + '-solved');
      onSolved(n - 1);
    }
  };
  const replay = () => { setAns(n, NO_ANSWER); director.reset(FIRST[n]); };

  const content = CONTENT[n];
  const asking = director.beat === 's' + n + '-ask';
  const teacher = asking || answer.pick ? content.teacher : { ...content.teacher, cue: content.watchCue };

  const wheat = wheatAt(d.farmer.pos);
  const milk = milkAt(d.seller.pos);
  const rupiPos = d.rupi ? d.rupi.pos : null;
  const P = spots.money;
  const propAt = k => ({ x: P[k].x, y: P[k].y + P.prop });           /* top of a prop, for its label */

  /* what Rupi is saying (06 rule, or a Scene 07 line) */
  const rupiLine = d.bubbles.rupi ? { lines: [SCENE06.rule], size: 'lg' }
    : d.rupiSays && d.rupiSays.lines === 'idea' ? { lines: SCENE07.idea, size: 'lg' }
    : d.rupiSays && d.rupiSays.lines === 'arrival' ? { lines: [SCENE07.arrival], size: 'lg' }
    : d.rupiSays && d.rupiSays.lines === 'teaching' ? { lines: [SCENE07.teaching], size: 'lg' }
    : null;

  /* one line for screen readers — the captions of the film */
  const caption = useMemo(() => {
    if (rupiLine) return 'Rupi: ' + rupiLine.lines.map(l => (typeof l === 'string' ? l : l.map(s => s.t).join(''))).join(' ');
    if (d.bubbles.seller === 'on') return 'Milk seller: ' + SELLER_LINE.map(s => s.t).join(' ');
    if (d.bubbles.farmer === 'on') return 'Farmer: ' + FARMER_LINE.join(' ');
    if (d.plaque) return SCENE08.uses[d.plaque.key].word + ': ' + SCENE08.uses[d.plaque.key].line;
    return '';
  }, [rupiLine && rupiLine.lines, d.bubbles.seller, d.bubbles.farmer, d.plaque && d.plaque.key]);

  /* 'hidden' fades a prop out in place; 'off' means it was never there */
  const prop = (k, Art) => d.props && d.props[k] !== 'off' && (
    <span key={k + (d.props[k] === 'pop' ? director.beat : '')}
      className={'prop' + (d.props[k] === 'pop' ? ' pop' : '') + (d.props[k] === 'hidden' ? ' hidden' : '')}
      style={{ '--pw': P.prop + 'cqh', transform: 'translate3d(calc(' + P[k].x + 'cqw - 50%), ' + (-P[k].y) + 'cqh, 0)' }}
      aria-hidden="true"><span className="prop-body"><Art amount={SCENE08.priceAmount}/></span></span>
  );
  const tag = (k, at) => (
    <span key={'tag' + k} className={'mtag' + (d.tags && d.tags[k] ? ' on' : '')}
      style={{ left: at.x + 'cqw', bottom: at.y + 'cqh' }} aria-hidden="true">{SCENE07.things[k]}</span>
  );
  /* labels for held things hang just below the thing, never across a face */
  const heldTag = pt => ({ x: pt.x, y: pt.y - 9 });
  const crate = (k, c) => d.crates && (
    <span key={'crate' + k} className={'crate' + (d.crates[k] ? '' : ' hidden')} aria-hidden="true"
      style={{ '--cw': c.w + 'cqw', '--ch': c.h + 'cqh', transform: 'translate3d(calc(' + c.x + 'cqw - 50%), ' + (-c.y) + 'cqh, 0)' }}>
      <i/><i/><i/>
    </span>
  );

  /* BUY / EXCHANGE / PRICE: beside the action on wide screens; on phones the
     close-ups zoom hard, so the line sits in the frame (screen space), on the empty ground band */
  const plaques = n >= 8 && ['buy', 'exchange', 'price'].map(k => {
    const on = d.plaque && d.plaque.key === k;
    return (
      <span key={k} className={'mplaque' + (on ? ' on' : '')} aria-hidden="true"
        style={layout === 'tall' ? { left: '50cqw', bottom: '9cqh' }
          : on ? { left: d.plaque.at.x + 'cqw', bottom: d.plaque.at.y + 'cqh' } : { left: '50cqw', bottom: '50cqh' }}>
        <b>{SCENE08.uses[k].word}</b>{SCENE08.uses[k].line}
      </span>
    );
  });

  return (
    <section {...rootProps}
      className={'barter layout-' + layout + (director.playing ? '' : ' is-paused') + (director.reduced ? ' is-reduced' : '')}
      aria-label={'Scene ' + content.n + ': ' + content.title}>
      <Plate src={A.P5BG} alt="A village market at sunset, milk cans stacked on the right"
        focusX={layout === 'tall' ? 58 : 50} camera={d.cam} reduced={director.reduced} coupled maxUpscale={1.2}
        atmosphere={<EnvironmentLayer mood={d.mood} still={director.reduced}/>}
        overlay={(
          <React.Fragment>
            {d.ask && (
              <Choice key={'q' + n} id={'q' + n}
                question={content.question} choices={content.choices} answer={answer}
                feedback={content.feedback} onPick={pick}
                onContinue={n === 5 ? () => onAdvance(5) : n === 7 ? () => onAdvance(7) : null}
                continueLabel={n === 5 ? 'See why' : 'Follow the money'}/>
            )}
            {!focusMode && (
              <TeacherPanel sceneLabel={'Scene ' + String(content.n).padStart(2, '0') + ' · ' + content.title}
                teacher={teacher} playing={director.playing} onToggle={director.toggle} onReplay={replay}/>
            )}
            {layout === 'tall' && plaques}
            {!director.playing && <span className="barter-paused" aria-hidden="true">Paused</span>}
          </React.Fragment>
        )}>

        {/* things money can buy, resting on crates in the market */}
        {crate('L', P.crateL)}{crate('R', P.crateR)}
        {prop('toy', Toy)}{prop('book', Book)}{prop('mango', Mango)}{prop('tag', PriceTag)}

        <Actor {...CAST.farmer} position={d.farmer.pos} state={d.farmer.state} toward={1}
          walkMs={d.farmer.walkMs} walkEase={d.farmer.walkEase} cue={director.beat} zIndex={3} reduced={director.reduced}/>
        <Actor {...CAST.seller} position={d.seller.pos} state={d.seller.state} toward={-1}
          walkMs={d.seller.walkMs} cue={director.beat} zIndex={2} idle={false} reduced={director.reduced}/>
        {rupiPos && (
          <Actor {...CAST.rupi} position={rupiPos} state={d.rupi.state} toward={-1}
            enterFrom={d.rupi.from ? d.rupi.from.x - d.rupi.pos.x : null}
            walkMs={d.rupi.walkMs || 1600} cue={director.beat} zIndex={5} reduced={director.reduced}/>
        )}

        <TradeDiagram phase={n === 6 ? d.diagram : 'off'} wheat={wheat} milk={milk} aspect={aspect} labels={SCENE06.labels}/>

        {n >= 7 && (
          <React.Fragment>
            <MoneyWeb phase={d.web} hub={P.hub} aspect={aspect}
              targets={[wheatAt(spots.farmer.left), milkAt(spots.seller.right), propAt('toy'), propAt('book')]}/>
            {tag('wheat', heldTag(wheat))}{tag('milk', heldTag(milk))}
            {tag('toy', { x: P.toy.x, y: P.toy.y + P.prop + 1.5 })}{tag('book', { x: P.book.x, y: P.book.y + P.prop + 1.5 })}
            <MoneyObject {...d.money} front={A.COINF[3]} back={A.COINB[3]} alt="A ₹10 coin" reduced={director.reduced}/>
            {d.note && <MoneyObject {...d.note} front={A.NOTEF[0]} back={A.NOTEB[0]} alt="A ₹10 note" reduced={director.reduced}/>}
            {layout !== 'tall' && plaques}
          </React.Fragment>
        )}

        <SpeechBubble speaker={d.farmer.pos} width={spots.bubbleW} lines={FARMER_LINE}
          show={d.bubbles.farmer !== 'off'} dim={d.bubbles.farmer === 'dim'}/>
        <SpeechBubble speaker={d.seller.pos} width={spots.bubbleW} lines={[SELLER_LINE.slice(0, 1).map(s => s.t)[0], SELLER_LINE.slice(1)]}
          show={d.bubbles.seller !== 'off'} dim={d.bubbles.seller === 'dim'} em={d.bubbles.sellerEm}/>
        {rupiPos && (
          <SpeechBubble speaker={d.rupi.pos} width={spots.ruleW} lines={rupiLine ? rupiLine.lines : ['']}
            show={!!rupiLine} size={rupiLine ? rupiLine.size : undefined}
            floor={layout === 'tall' ? d.farmer.pos.y + d.farmer.pos.h + 1.8 : 0}/>
        )}
      </Plate>
      <p className="sr-only" aria-live="polite">{caption}</p>
    </section>
  );
}

export { BarterSequence };
