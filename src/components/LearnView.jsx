import React, { useCallback, useEffect, useState } from 'react';
import { Sidebar } from './LessonSidebar';
import { I } from './icons';
import { ICON_CX, ICON_CY, PL, PLACES, SCENES } from '../data/lessonData';
import { isContinuous } from '../engine/TransitionManager';
import { BarterSequence } from '../scenes/BarterSequence';
import { Scene12 } from '../scenes/Scene12';
import { Scene13 } from '../scenes/Scene13';
import { Scene14 } from '../scenes/Scene14';
import { Scene15 } from '../scenes/Scene15';
import { Scene16 } from '../scenes/Scene16';
import { Scene17 } from '../scenes/Scene17';
import { Scene18 } from '../scenes/Scene18';
import { Scene01 } from '../scenes/Scene01Welcome';
import { IntroSequence } from '../scenes/Scene02VideoHook';
import { Scene04 } from '../scenes/Scene04Barter';
import { Scene09 } from '../scenes/Scene09MeetRupee';
import { Scene10 } from '../scenes/Scene10MeetCoins';
import { Scene11 } from '../scenes/Scene11CoinOrNote';
import { useBlip } from '../systems/audio';

/* ════════ Scene 01 stage ════════
   Scene 01 plays itself on a clock while the teacher watches the class. That
   clock, its camera push and its attract loop now live here, so they exist
   only while Scene 01 is on screen — they no longer drive the whole lesson. */
function Scene01Stage({ blip, completed, onComplete, onExit }) {
  const total = SCENES[0].m * 60;
  const [playing, setPlaying] = useState(true), [elapsed, setElapsed] = useState(0);
  const [hot, setHot] = useState(null), [manual, setManual] = useState(false);
  const [attract, setAttract] = useState(null), [touched, setTouched] = useState(false);
  const [bubbleBeat, setBubbleBeat] = useState(0);

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => setElapsed(e => (e + .2 >= total ? (setPlaying(false), total) : e + .2)), 200);
    return () => clearInterval(id);
  }, [playing, total]);

  useEffect(() => {
    if (manual || !playing) return;
    const e = elapsed;
    const a = e < 12 ? null : e < 20 ? 'shop' : e < 28 ? 'market'
            : e < 36 ? 'home' : e < 44 ? 'wallet' : e < 52 ? 'canteen' : null;
    setHot(h => (h === a ? h : a));
  }, [elapsed, playing, manual]);

  /* gentle attract loop over the five pictures until the teacher taps one */
  useEffect(() => {
    if (touched) { setAttract(null); return undefined; }
    let i = 0, off = null;
    const id = setInterval(() => {
      setAttract(PLACES[i % PLACES.length].id);
      i++;
      clearTimeout(off);
      off = setTimeout(() => setAttract(null), 1500);
    }, 3400);
    return () => { clearInterval(id); clearTimeout(off); };
  }, [touched]);

  useEffect(() => { if (elapsed >= total) onComplete(0); }, [elapsed, total]);

  /* Space toggles the Scene 01 clock, but never swallows a focused control */
  useEffect(() => {
    const k = e => {
      if (e.code === 'Space' && !(e.target && e.target.closest && e.target.closest('button,a,input,textarea,select'))) {
        e.preventDefault(); setPlaying(p => !p);
      }
      if (e.code === 'Escape') setHot(null);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const robotBeat = playing && !manual && elapsed >= 6 && elapsed < 10.5;
  const finale    = playing && !manual && elapsed >= 52;

  /* CameraController (Scene 01) — gentle push toward the thing being discussed */
  const camStyle = (() => {
    if (!hot) return null;
    const cx = (ICON_CX[hot] / PL.w) * 100, cy = (ICON_CY / PL.h) * 100;
    const tx = (50 - cx) * .5, ty = (50 - cy) * .3;
    return { transform: 'scale(1.08) translate(' + tx.toFixed(2) + '%,' + ty.toFixed(2) + '%)' };
  })();

  const pick = id => {
    const off = hot === id;
    setHot(off ? null : id); setTouched(true); setAttract(null); setManual(true);
    blip(off ? 440 : 880);
    if (!off) setTimeout(() => blip(1180, 'triangle'), 120);
  };

  return (
    <div className={'s01host' + (hot ? ' pointing coinhot' : '') + (playing ? ' playing' : '')
        + (robotBeat ? ' beat-robot' : '') + (finale ? ' finale' : '')}>
      <div className="cam" style={camStyle}>
        <div className="camdrift">
          <Scene01 hot={hot} onPick={pick} attract={attract} beat={bubbleBeat} finale={finale}/>
        </div>
      </div>

      {elapsed >= total && <div className="badgepop">🏅 Scene complete — <span>{(completed || []).length}/18</span> explored</div>}
      {elapsed >= total && (
        <div className="donebar">
          <p>Scene 1 complete!<i>{SCENES[0].t}</i></p>
          <button className="replaybtn" onClick={() => { setElapsed(0); setHot(null); setManual(false); setPlaying(true); setBubbleBeat(b => b + 1); }}>Replay</button>
          <button className="contbtn" onClick={onExit}>
            Continue Exploring
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════ LearnView — hosts one scene at a time ════════ */
function LearnView({ focusMode, onFocus, startIndex, onExit, completed, onComplete, onIndex }) {
  const [gates, setGates] = useState({});      /* scenes whose activity must be solved before Next */
  const [nope, setNope] = useState(false);
  const GATED = [4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17];

  const [index, setIndex] = useState(startIndex || 0);
  const [soundOn] = useState(true);
  /* below 1180px the lesson list is an overlay — start closed so it never covers the scene */
  const [navOpen, setNav] = useState(() => typeof window === 'undefined' || window.innerWidth > 1180);
  const [intro, setIntro] = useState(true);
  const [wipeKey, setWipeKey] = useState(0);

  const blip = useBlip(soundOn);

  useEffect(() => { const t = setTimeout(() => setIntro(false), 150); return () => clearTimeout(t); }, []);

  const goto = useCallback(i => {
    const n = Math.max(0, Math.min(SCENES.length - 1, i));
    if (n === index) return;
    if (n > index && onComplete) onComplete(index);           /* moving on = this scene was taught */
    setIndex(n);
    /* the lesson list only gets out of the way when it is an overlay (≤1180px);
       when it sits beside the stage, collapsing it would resize the whole world mid-shot */
    if (typeof window !== 'undefined' && window.innerWidth <= 1180) setNav(false);
    /* continuous takes carry their own camera transition — no generic wipe and no
       UI beep over the camera move */
    if (!isContinuous(index + 1, n + 1)) { setWipeKey(k => k + 1); blip(n > index ? 780 : 520); }
  }, [index, blip, onComplete]);

  /* tell the shell which scene is being taught — it keeps the address bar in step
     without remounting this view (a remount would cut a continuous take) */
  useEffect(() => { if (onIndex) onIndex(index); }, [index, onIndex]);

  const solve = useCallback(i => setGates(g => (g[i] ? g : { ...g, [i]: true })), []);
  const locked = GATED.includes(index) && !gates[index];

  useEffect(() => {
    const k = e => {
      if (e.target && e.target.closest && e.target.closest('input,textarea,select')) return;
      if (e.defaultPrevented) return;          /* a scene control already used this key (e.g. arrows between answer tags) */
      /* arrows belong to whatever control is focused inside the scene (an answer, a note, the
         teacher tab); they move through the lesson only from the scene itself or the page */
      const t = e.target;
      if ((e.code === 'ArrowRight' || e.code === 'ArrowLeft') && t && t.closest && t.closest('.stage')
        && !(t.hasAttribute && t.hasAttribute('data-focus-home'))) return;
      if (e.code === 'ArrowRight' && !locked) goto(index + 1);
      if (e.code === 'ArrowLeft') goto(index - 1);
      if (e.code === 'Escape' && focusMode) onFocus();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [index, goto, focusMode, onFocus, locked]);

  const progress = (index / SCENES.length) * 100;

  return (
    <div className={'app' + (intro ? ' intro' : '') + (focusMode ? ' focus-mode' : '')}>

      <div className="body-row">
        <Sidebar open={navOpen} index={index} progress={progress} onPick={goto} onExit={onExit} completed={completed}/>

        <div className="stage-col">
          <div className="stage">
            {index === 0 && <Scene01Stage blip={blip} completed={completed} onComplete={onComplete} onExit={onExit}/>}
            {/* Scenes 02–03 are one continuous take: the same market stays mounted */}
            {index >= 1 && index <= 2 && (
              <IntroSequence key="intro" scene={index + 1} focusMode={focusMode} onAdvance={i => goto(i)}/>
            )}
            {index === 3 && <Scene04 key="barter04" focusMode={focusMode} blip={blip}/>}
            {/* Scenes 05–08 are one continuous take: the same market stays mounted */}
            {index >= 4 && index <= 7 && (
              <BarterSequence key="market" scene={index + 1} focusMode={focusMode}
                onSolved={solve} onAdvance={i => goto(i)}/>
            )}
            {index === 8 && <Scene09 key="rupee09" focusMode={focusMode} blip={blip} onSolved={() => solve(8)}/>}
            {index === 9 && <Scene10 key="coins10" focusMode={focusMode} blip={blip} onSolved={() => solve(9)}/>}
            {index === 10 && <Scene11 key="form11" focusMode={focusMode} blip={blip} onSolved={() => solve(10)}/>}
            {index === 11 && <Scene12 key="notes" scene={12} focusMode={focusMode}/>}
            {index === 12 && <Scene13 key="coins13" scene={13} focusMode={focusMode} blip={blip}/>}
            {index === 13 && <Scene14 key="value14" scene={14} focusMode={focusMode} blip={blip} onSolved={() => solve(13)}/>}
            {index === 14 && <Scene15 key="game15" scene={15} focusMode={focusMode} blip={blip} onSolved={() => solve(14)}/>}
            {index === 15 && <Scene16 key="sort16" scene={16} focusMode={focusMode} blip={blip} onSolved={() => solve(15)}/>}
            {index === 16 && <Scene17 key="sort17" scene={17} focusMode={focusMode} blip={blip} onSolved={() => solve(16)}/>}
            {index === 17 && <Scene18 key="recap18" scene={18} focusMode={focusMode} blip={blip} onSolved={() => solve(17)}/>}
            {wipeKey > 0 && <div className="wipe" key={wipeKey}><i/></div>}
          </div>
        </div>
      </div>

      <div className="bottomnav">
        <button className="bnav-toggle" onClick={() => setNav(o => !o)} aria-label="Toggle lesson list" title="Lesson list"
          aria-expanded={navOpen}>{I.menu}</button>
        <button className="bnav-toggle" onClick={() => goto(index - 1)} disabled={index === 0}
          aria-label="Previous scene" title="Previous scene"
          style={index === 0 ? { opacity: .35, pointerEvents: 'none' } : null}>{I.prev}</button>
        <span className="bnav-count">{index + 1}<small> / {SCENES.length}</small></span>
        <span className="bnav-title">{SCENES[index].t}</span>
        {locked && <span className="bnav-lock">Finish the activity to continue</span>}
        <button className={'bnav-next' + (locked ? ' locked' + (nope ? ' nope' : '') : '')}
          aria-disabled={locked}
          onClick={() => {
            if (locked) { setNope(true); blip(280, 'square'); setTimeout(() => setNope(false), 450); return; }
            /* the last scene: record it as completed, then finish the adventure */
            if (index >= SCENES.length - 1) { if (onComplete) onComplete(index); onExit(); } else goto(index + 1);
          }}>
          {index >= SCENES.length - 1 ? 'Finish Adventure' : 'Next'} {I.next}
        </button>
      </div>
    </div>
  );
}

export { LearnView };
