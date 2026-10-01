import React from 'react';
import A from '../assets/index';
import { I } from '../components/icons';
import { SCENES } from '../data/lessonData';
/* ══════════════ learning/LearningJourney.jsx ══════════════ */
const CARD_C = ["#3FD48A","#F5B82E","#4FA8E0","#F09A3E","#A57CE8","#4FA8E0","#3FD48A","#A57CE8",
                "#4FA8E0","#F06AA8","#F5B82E","#3FD48A","#4FA8E0","#A57CE8","#F09A3E","#3FD48A",
                "#F5B82E","#F06AA8"];
const STARS = Array.from({length:34}, (_,i) => ({
  left: ((i*37)%100) + "%", top: ((i*23)%62) + "%", del: (-(i%9)*0.5) + "s",
}));

function LessonCard({ s, i, onOpen }) {
  return (
    <button className="lcard" style={{ "--c":CARD_C[i], animationDelay:(0.05 + i*0.035) + "s" }}
      onClick={() => onOpen(i)} title={"Open scene " + s.n + " — " + s.t}>
      <span className="art"><img src={A.THUMBS[i]} alt="" draggable="false"/></span>
      <span className="badge">{s.n}</span>
      <span className="meta">
        <b>{s.t}</b>
        <span>{I.clock}{s.m} min · {s.k}</span>
      </span>
      <span className="bar"><i/></span>
    </button>
  );
}

function LearningJourney({ onOpen }) {
  return (
    <div className="journey">
      <span className="jglow"/><span className="jgold"/>
      {STARS.map((st,i) => <span key={i} className="star" style={{left:st.left,top:st.top,animationDelay:st.del}}/>)}
      <div className="jscroll">
        <div className="jhead">
          <h1>Your Learning Journey</h1>
          <p><b>18</b> exciting scenes · <b>40</b> minutes · 1 amazing adventure!</p>
        </div>
        <div className="jgrid">
          {SCENES.map((s,i) => <LessonCard key={s.n} s={s} i={i} onOpen={onOpen}/>)}
        </div>
      </div>
    </div>
  );
}

export { CARD_C, LearningJourney, LessonCard, STARS };
