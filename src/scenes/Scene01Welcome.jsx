import React, { memo } from 'react';
import A from '../assets/index';
import { I } from '../components/icons';
import { Coin, Robot, Rupi } from '../data/characterData';
import { ICON_CX, ICON_CY, PLACES, PLACE_LINE, SIGN_X, SIGN_Y, pct } from '../data/lessonData';
import { ICON_R } from '../data/lessonData';
/* ════════ world/Scene01 ════════ */
const MOTES = [
  { left:"46%", top:"18%", dur:"19s", del:"0s"   },
  { left:"62%", top:"30%", dur:"24s", del:"-6s"  },
  { left:"71%", top:"14%", dur:"21s", del:"-12s" },
  { left:"55%", top:"45%", dur:"27s", del:"-3s"  },
  { left:"83%", top:"52%", dur:"23s", del:"-9s"  },
];
/* birds crossing the valley */
const BIRDS = [
  { top:"12%", dur:"34s", del:"-4s",  s:1,    back:false },
  { top:"19%", dur:"46s", del:"-22s", s:.72,  back:false },
  { top:"27%", dur:"52s", del:"-11s", s:.58,  back:true  },
];
const CLOUDLETS = [
  { top:"7%",  w:"14%", dur:"120s", del:"-20s", o:.42 },
  { top:"16%", w:"9%",  dur:"165s", del:"-90s", o:.32 },
];
/* leaves dropping out of the canopy on the left */
const LEAVES = [
  { left:"3%",  top:"2%",  dur:"11s", del:"0s"   },
  { left:"9%",  top:"-2%", dur:"14s", del:"-5s"  },
  { left:"15%", top:"1%",  dur:"12s", del:"-9s"  },
  { left:"6%",  top:"6%",  dur:"16s", del:"-3s"  },
  { left:"19%", top:"-3%", dur:"13s", del:"-11s" },
  { left:"12%", top:"4%",  dur:"15s", del:"-7s"  },
];
/* sparkles riding the river */
const SHINES = [
  { left:"22.5%", top:"63%", del:"0s"   }, { left:"26%",   top:"57%", del:"-.7s" },
  { left:"29%",   top:"50%", del:"-1.4s"}, { left:"33%",   top:"44%", del:"-2.1s"},
  { left:"37%",   top:"38%", del:"-.35s"}, { left:"20%",   top:"70%", del:"-1.8s"},
  { left:"78%",   top:"47%", del:"-1.1s"}, { left:"84%",   top:"52%", del:"-2.4s"},
];
const BURST = [
  { g:"₹", dx:"-52px", dy:"-88px",  s:1.5, d:"0s"    },
  { g:"✦", dx:"38px",  dy:"-104px", s:1.1, d:".06s"  },
  { g:"₹", dx:"64px",  dy:"-62px",  s:1.2, d:".12s"  },
  { g:"✦", dx:"-70px", dy:"-46px",  s:.9,  d:".04s"  },
  { g:"✦", dx:"6px",   dy:"-120px", s:1.3, d:".16s"  },
  { g:"₹", dx:"-20px", dy:"-70px",  s:1,   d:".1s"   },
];

const Bird = ({ s }) => (
  <svg viewBox="0 0 60 30" style={{ transform:"scale(" + s + ")" }}>
    <g className="wg"><path d="M30 15 Q18 2 4 9 Q17 11 30 16Z" fill="#2B3E52"/></g>
    <g className="wg wg2"><path d="M30 15 Q42 2 56 9 Q43 11 30 16Z" fill="#35495F"/></g>
    <ellipse cx="30" cy="16" rx="5" ry="3.2" fill="#2B3E52"/>
  </svg>
);
const Leaf = () => (
  <svg viewBox="0 0 30 30"><g className="lf" style={{transformOrigin:"15px 15px"}}>
    <path d="M15 3 Q27 12 15 27 Q3 12 15 3Z" fill="#3E9440"/>
    <path d="M15 4 v22" stroke="#2C7431" strokeWidth="1.4"/>
  </g></svg>
);
const Butterfly = () => (
  <svg viewBox="0 0 40 30">
    <g className="wg"><ellipse cx="13" cy="13" rx="11" ry="9" fill="#F5A93C"/><ellipse cx="14" cy="21" rx="7" ry="6" fill="#E88A2A"/></g>
    <g className="wg" style={{animationDelay:"-.08s"}}><ellipse cx="27" cy="13" rx="11" ry="9" fill="#FFC456"/><ellipse cx="26" cy="21" rx="7" ry="6" fill="#E88A2A"/></g>
    <rect x="19" y="8" width="2.4" height="17" rx="1.2" fill="#4A3218"/>
  </svg>
);

const WINDOWS = [
  {left:"57%",top:"33%",del:"0s"},   {left:"61%",top:"31%",del:"-1.1s"},
  {left:"65%",top:"34%",del:"-2.2s"},{left:"70%",top:"32%",del:"-.6s"},
  {left:"22%",top:"50%",del:"-1.7s"},{left:"26%",top:"53%",del:"-2.8s"},
];
const SMOKES = [
  {left:"58%",top:"31%",del:"0s"},{left:"67%",top:"30%",del:"-2.4s"},{left:"24%",top:"48%",del:"-4.1s"},
];
const STREAKS = [
  {left:"18%",top:"63%",w:"9%",del:"0s"},{left:"24%",top:"51%",w:"7%",del:"-2.2s"},
  {left:"78%",top:"50%",w:"8%",del:"-4s"},
];

const Airships = () => (
  <React.Fragment>
    <div className="sprite" id="air1"><img src={A.AIR1} alt="" draggable="false"/></div>
    <div className="sprite" id="air2"><img src={A.AIR2} alt="" draggable="false"/></div>
  </React.Fragment>
);

const Bubble = memo(({ beat }) => (
  <div id="bubble" key={beat}>
    <svg viewBox="0 0 362 169" style={{ filter:"drop-shadow(0 7px 10px rgba(6,24,40,.3))" }}>
      <path d="M30 6h301a26 26 0 0126 26v74a26 26 0 01-26 26H104l-4 0-42 0-8 35-4-35H30A26 26 0 014 106V32A26 26 0 0130 6z" fill="#FCF6E6"/>
      <path d="M104 128H58l-8 35z" fill="#FCF6E6"/>
      <g fill="#123A63" fontFamily="Baloo 2, sans-serif" fontWeight="700" fontSize="29">
        <text className="ln ln1" x="41" y="42">Hi! I&#39;m Rupi!</text>
        <text className="ln ln2" x="41" y="76">Today we&#39;re going on a</text>
        <text className="ln ln3" x="41" y="110">money adventure!</text>
      </g>
    </svg>
  </div>
));

function Scene01({ hot, onPick, attract, beat, finale }) {
  return (
    <React.Fragment>
    <img className="s2back" src={A.BG} alt="" aria-hidden="true" draggable="false"/>
    <div className="plate">
      <img className="bgimg" src={A.BG} alt="" draggable="false"/>

      {/* sky */}
      {CLOUDLETS.map((c,i) => (
        <div key={"c"+i} className="track-x" style={{top:c.top,animation:"cloudAcross "+c.dur+" linear infinite",animationDelay:c.del}}>
          <svg className="cloudlet" style={{width:c.w,opacity:c.o}} viewBox="0 0 220 92">
            <path d="M30 78q-26 0-26-20t26-20q4-24 30-24 16 0 24 12 10-16 30-16 26 0 30 26 22 2 22 20t-24 22z" fill="#fff"/>
          </svg>
        </div>
      ))}
      {BIRDS.map((b,i) => (
        <div key={"b"+i} className="track-x"
          style={{top:b.top,animation:(b.back?"flyBack ":"flyAcross ")+b.dur+" linear infinite",animationDelay:b.del}}>
          <span className="bird"><Bird s={b.s}/></span>
        </div>
      ))}

      {/* canopy leaves */}
      {LEAVES.map((l,i) => (
        <span key={"lv"+i} className="leaf"
          style={{left:l.left,top:l.top,animation:"leafFall "+l.dur+" linear infinite",animationDelay:l.del}}><Leaf/></span>
      ))}

      {/* water sparkle */}
      {SHINES.map((s,i) => <span key={"s"+i} className="shine" style={{left:s.left,top:s.top,animationDelay:s.del}}/>)}

      {/* butterflies near the foreground planting */}
      <span className="fly" style={{left:"29%",top:"84%"}}><Butterfly/></span>
      <span className="fly" style={{left:"67%",top:"88%",animationDuration:"17s",animationDelay:"-6s"}}><Butterfly/></span>

      {/* village life */}
      {WINDOWS.map((w,i) => <span key={"w"+i} className="win" style={{left:w.left,top:w.top,animationDelay:w.del}}/>)}
      {SMOKES.map((s,i) => <span key={"sm"+i} className="smoke" style={{left:s.left,top:s.top,animationDelay:s.del}}/>)}
      {STREAKS.map((s,i) => <span key={"st"+i} className="streak" style={{left:s.left,top:s.top,width:s.w,animationDelay:s.del}}/>)}

      <Airships/>

      <div className="lightsweep"/>
      {MOTES.map((m,i) => <span key={i} className="mote" style={{left:m.left,top:m.top,animationDuration:m.dur+",3s",animationDelay:m.del+",0s"}}/>)}

      <span className="gloss board"/>

      <Bubble beat={beat}/>
      <Rupi/>
      <Robot/>
      <span className="coinglow"/>
      <Coin/>

      {hot && (
        <div className="burst" key={hot}
          style={{ left:pct(ICON_CX[hot],"x"), top:pct(ICON_CY,"y") }}>
          {BURST.map((b,i) => (
            <i key={i} style={{ "--dx":b.dx, "--dy":b.dy, fontSize:"calc(1vw * "+b.s+" + 6px)", animationDelay:b.d }}>{b.g}</i>
          ))}
        </div>
      )}

      {/* board picture hotspots */}
      {PLACES.map(p => {
        const cx = ICON_CX[p.id];
        return (
          <button key={"i"+p.id + (attract===p.id ? "-a" : "")}
            className={"hot-icon" + (hot===p.id ? " on" : "") + (attract===p.id ? " attract" : "")}
            onClick={() => onPick(p.id)} title={p.label} aria-label={"Show " + p.label}
            style={{ left:pct(cx-ICON_R,"x"), top:pct(ICON_CY-ICON_R,"y"),
                     width:pct(ICON_R*2,"x"), height:pct(ICON_R*2,"y") }}/>
        );
      })}
      {PLACES.map(p => (
        <span key={"l"+p.id} className={"hot-label" + (hot===p.id ? " on" : "")}
          style={{ left:pct(ICON_CX[p.id]-56,"x"), top:pct(494,"y"), width:pct(112,"x"), height:pct(34,"y") }}/>
      ))}

      {/* wooden signpost hotspots */}
      {PLACES.map(p => {
        const [y0,y1] = SIGN_Y[p.id];
        return (
          <button key={"s"+p.id} className={"hot-sign" + (hot===p.id ? " on" : "")}
            onClick={() => onPick(p.id)} title={p.label} aria-label={"Show " + p.label + " sign"}
            style={{ left:pct(SIGN_X[0],"x"), top:pct(y0,"y"),
                     width:pct(SIGN_X[1]-SIGN_X[0],"x"), height:pct(y1-y0,"y") }}/>
        );
      })}

      {hot && <div className="caption"><b>{PLACE_LINE[hot]}</b></div>}

      {finale && (
        <div className="burst" style={{ left:pct(850,"x"), top:pct(580,"y") }}>
          {BURST.map((b,i) => (
            <i key={i} style={{ "--dx":b.dx, "--dy":b.dy, fontSize:"calc(1vw * "+b.s+" + 6px)",
              animationDelay:b.d, animationIterationCount:"infinite" }}>{b.g}</i>
          ))}
        </div>
      )}
    </div>
    </React.Fragment>
  );
}

export { Airships, BIRDS, BURST, Bird, Bubble, Butterfly, CLOUDLETS, LEAVES, Leaf, MOTES, SHINES, SMOKES, STREAKS, Scene01, WINDOWS };
