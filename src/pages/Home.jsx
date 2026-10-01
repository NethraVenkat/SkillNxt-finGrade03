import React from 'react';
import A from '../assets/index';
import { Rupi } from '../data/characterData';
import { Bird, Butterfly, CLOUDLETS, Leaf, MOTES } from '../scenes/Scene01Welcome';
/* ══════════════ HOME — cinematic landing world ══════════════ */
const H_LEAVES = [
  {left:"2%", top:"0%",  dur:"12s", del:"0s"},  {left:"7%",  top:"-3%", dur:"15s", del:"-5s"},
  {left:"13%",top:"2%",  dur:"13s", del:"-9s"}, {left:"19%", top:"-2%", dur:"16s", del:"-3s"},
  {left:"25%",top:"1%",  dur:"14s", del:"-11s"},{left:"4%",  top:"5%",  dur:"17s", del:"-7s"},
];
const H_SHINES = [
  {left:"45%",top:"86%"},{left:"49%",top:"90%"},{left:"53%",top:"84%"},
  {left:"41%",top:"92%"},{left:"57%",top:"88%"},{left:"37%",top:"83%"},
];
const H_STREAKS = [
  {left:"40%",top:"88%",w:"12%",del:"0s"},{left:"48%",top:"93%",w:"9%",del:"-2.6s"},
];
const H_WIN = [
  {left:"17%",top:"52%",del:"0s"},{left:"22%",top:"57%",del:"-1.3s"},{left:"78%",top:"58%",del:"-2.1s"},
  {left:"84%",top:"52%",del:"-.7s"},{left:"12%",top:"46%",del:"-2.8s"},{left:"88%",top:"66%",del:"-1.9s"},
];
const H_BIRDS = [
  {top:"14%",dur:"38s",del:"-6s", s:.9,  back:false},
  {top:"21%",dur:"50s",del:"-24s",s:.66, back:true },
  {top:"9%", dur:"44s",del:"-14s",s:.52, back:false},
];

function Home({ intro, entering, onStart }) {
  return (
    <div className={"home" + (intro ? " intro" : "") + (entering ? " entering" : "")}>
      <div className="cam">
        <div className="camdrift">
          <div className="hplate">
            <img className="bgimg" src={A.HOME} alt="Money Quest world" draggable="false"/>

            {/* background life */}
            {CLOUDLETS.map((c,i) => (
              <div key={"hc"+i} className="track-x" style={{top:c.top,animation:"cloudAcross "+c.dur+" linear infinite",animationDelay:c.del}}>
                <svg className="cloudlet" style={{width:c.w,opacity:c.o}} viewBox="0 0 220 92">
                  <path d="M30 78q-26 0-26-20t26-20q4-24 30-24 16 0 24 12 10-16 30-16 26 0 30 26 22 2 22 20t-24 22z" fill="#fff"/>
                </svg>
              </div>
            ))}
            {H_BIRDS.map((b,i) => (
              <div key={"hb"+i} className="track-x"
                style={{top:b.top,animation:(b.back?"flyBack ":"flyAcross ")+b.dur+" linear infinite",animationDelay:b.del}}>
                <span className="bird"><Bird s={b.s}/></span>
              </div>
            ))}

            {/* midground life */}
            {H_WIN.map((w,i) => <span key={"hw"+i} className="win" style={{left:w.left,top:w.top,animationDelay:w.del}}/>)}
            {H_STREAKS.map((t,i) => <span key={"hs"+i} className="streak" style={{left:t.left,top:t.top,width:t.w,animationDelay:t.del}}/>)}
            {H_SHINES.map((t,i) => <span key={"hh"+i} className="shine" style={{left:t.left,top:t.top,animationDelay:(-i*0.6)+"s"}}/>)}

            {/* foreground life */}
            {H_LEAVES.map((l,i) => (
              <span key={"hl"+i} className="leaf"
                style={{left:l.left,top:l.top,animation:"leafFall "+l.dur+" linear infinite",animationDelay:l.del}}><Leaf/></span>
            ))}
            <span className="fly" style={{left:"22%",top:"78%"}}><Butterfly/></span>
            <span className="fly" style={{left:"63%",top:"82%",animationDuration:"16s",animationDelay:"-5s"}}><Butterfly/></span>

            <div className="lightsweep"/>
            <span className="gloss htitle"/>
            {MOTES.map((m,i) => <span key={"hm"+i} className="mote" style={{left:m.left,top:m.top,animationDuration:m.dur+",3s",animationDelay:m.del+",0s"}}/>)}

            {/* approved Rupi, breathing and blinking */}
            <div id="hrupi">
              <img src={A.HRUPI} alt="Rupi" draggable="false"/>
              <span className="hlid hlid-l"/><span className="hlid hlid-r"/>
            </div>

            <button className="startbtn" onClick={onStart}>
              Start Your Journey
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15M13 6l6 6-6 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {entering && <div className="flash"/>}
    </div>
  );
}

export { H_BIRDS, H_LEAVES, H_SHINES, H_STREAKS, H_WIN, Home };
