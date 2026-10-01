import React from 'react';
import { I } from './icons';
import { SCENES } from '../data/lessonData';
/* ════════ components/TeacherControlBar.jsx ════════ */
function TeacherControls({ index, playing, elapsed, total, soundOn, notesOpen, done,
                           onMenu, onPrev, onNext, onPlay, onRestart, onNotes, onSound, onFull }) {
  const mm = n => String(Math.floor(n/60)).padStart(2,"0") + ":" + String(Math.floor(n%60)).padStart(2,"0");
  const R = 16, C = 2*Math.PI*R, frac = Math.min(1, elapsed/total);
  return (
    <div className="controls">
      <button className="ctl" onClick={onMenu} title="Lesson menu" aria-label="Lesson menu">{I.menu}</button>
      <button className="ctl boxed" onClick={onPrev} title="Previous scene" aria-label="Previous scene">{I.prev}</button>
      <span className="counter">{index+1}<small>/{SCENES.length}</small></span>
      <span className="now-title">{SCENES[index].t}</span>
      <button className={"next-btn" + (done ? " ready" : "")} onClick={onNext} title="Next scene">Next {I.next}</button>

      <div className="timer-pod">
        <span className="ring">
          <svg width="38" height="38">
            <circle cx="19" cy="19" r={R} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="3.2"/>
            <circle cx="19" cy="19" r={R} fill="none" stroke="#F5B82E" strokeWidth="3.2" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C*(1-frac)}/>
          </svg>
        </span>
        <span className="time-now">{mm(elapsed)}</span>
        <span className="time-tot">/ {mm(total)}</span>
        <button className="ctl" style={{width:38,height:38}} onClick={onPlay}
          title={playing ? "Pause scene" : "Play scene"} aria-label={playing ? "Pause scene" : "Play scene"}>
          {playing ? I.pause : I.play}
        </button>
        <button className="ctl" style={{width:38,height:38}} onClick={onNext} title="Skip to next scene" aria-label="Skip to next scene">{I.skip}</button>
      </div>

      <div className="right-ctls">
        <button className="ctl" onClick={onRestart} title="Restart scene" aria-label="Restart scene">{I.reset}</button>
        <button className="ctl" onClick={onNotes} title="Teacher notes" aria-label="Teacher notes"
          style={notesOpen ? {background:"rgba(245,184,46,.18)",color:"#F5B82E"} : null}>{I.notes}</button>
        <button className={"ctl" + (soundOn ? "" : " off")} onClick={onSound} title={soundOn ? "Sound on" : "Sound off"} aria-label="Toggle sound">
          {soundOn ? I.sound : I.mute}
        </button>
        <button className="ctl fsbtn" onClick={onFull} title="Fullscreen (hides all navigation)" aria-label="Fullscreen">{I.full}</button>
      </div>
    </div>
  );
}

export { TeacherControls };
