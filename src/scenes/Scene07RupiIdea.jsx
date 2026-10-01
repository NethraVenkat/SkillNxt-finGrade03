import React, { useEffect, useState } from 'react';
import A from '../assets/index';
import { Rupi } from '../data/characterData';
import { pick } from '../pages/Play';
/* ══════════════ scenes/LessonPage07.jsx ══════════════ */
const Toy = () => (
  <svg viewBox="0 0 64 64"><path d="M32 6l14 16H18z" fill="#E03B33"/><path d="M18 22h28l-6 22H24z" fill="#F5B82E"/>
    <path d="M24 44h16l-8 14z" fill="#3D8AD9"/><rect x="30" y="0" width="4" height="8" rx="2" fill="#7A4A22"/>
    <path d="M18 22h28v4H18z" fill="#fff" opacity=".55"/></svg>
);
const Book = () => (
  <svg viewBox="0 0 64 64"><rect x="10" y="10" width="40" height="46" rx="4" fill="#3D8AD9"/>
    <rect x="14" y="10" width="36" height="42" rx="3" fill="#2F6FB5"/><rect x="14" y="52" width="36" height="6" rx="2" fill="#FFF3D6"/>
    <rect x="20" y="20" width="24" height="4" rx="2" fill="#FFD34D"/><rect x="20" y="28" width="18" height="3" rx="1.5" fill="#BFD8F2"/></svg>
);
const S7_LINKS = [
  { key:"milk",  label:"Milk",  x:36.5, y:45, render:() => <span className="ico can"><img src={A.P6CAN} alt="" draggable="false"/></span> },
  { key:"wheat", label:"Wheat", x:48,   y:49, render:() => <span className="ico"><img src={A.P6WHEAT} alt="" draggable="false"/></span> },
  { key:"toys",  label:"Toys",  x:59.5, y:49, render:() => <span className="ico"><Toy/></span> },
  { key:"books", label:"Books", x:71,   y:45, render:() => <span className="ico"><Book/></span> },
];
function Scene07({ blip, onSolved, solved }) {
  const [beat,setBeat] = useState(0);
  const [ans,setAns] = useState(solved ? "a" : null);
  useEffect(() => {
    const T = [1400,3400,5600,8400,10000,11600,12800,14000,15200,16900,18600];
    const t = T.map((ms,i) => setTimeout(() => {
      setBeat(i + 1);
      if (i === 3) blip(520); if (i === 4) blip(880); if (i >= 5 && i <= 8) blip(700 + (i - 5) * 90);
    }, ms));
    return () => t.forEach(clearTimeout);
  }, []);
  const pick = v => {
    setAns(v);
    if (v === "a") { blip(980); onSolved && onSolved(); }
    else { blip(330,"square"); setTimeout(() => setAns(x => (x === v ? null : x)), 2200); }
  };
  const right = ans === "a";
  const shown = Math.max(0, Math.min(4, beat - 5));    /* how many connections are visible */
  const rupiCls = right ? " s7cheer" : beat === 2 ? " s7think" : beat === 3 ? " s7idea" : beat === 5 ? " s7idea" : "";
  const adultCls = beat === 5 ? " s7curious" : "";
  const cx = 58.5, cy = 26.5;                           /* coin centre (% of plate) */

  return (
    <div className="s2">
      <div className={"s2cam s7cam b" + beat}>
        <img className="s2back" src={A.P5BG} alt="" aria-hidden="true" draggable="false"/>
        <div className="s2plate p7plate">
          <img className="s2bg" src={A.P5BG} alt="Indian village marketplace" draggable="false"/>

          <span className={"s2ch" + (beat <= 1 ? " s5ask" : adultCls)} id="s7farmer">
            <img src={A.CH.farmer} alt="Farmer holding wheat" draggable="false"/></span>
          <span className={"s2ch" + adultCls} id="s7milk">
            <img src={A.CH.milk} alt="Milk seller" draggable="false"/></span>
          {beat >= 1 && (
            <span className={"s2ch enter" + rupiCls} id="s7rupi">
              <img src={A.CH.rupi} alt="Rupi" draggable="false"/></span>
          )}

          <div className={"s7old" + (beat >= 4 ? " gone" : "")}>
            <span className="ico"><img src={A.P6WHEAT} alt="Wheat" draggable="false"/></span>
            <span className="x">✕</span>
            <span className="ico can"><img src={A.P6CAN} alt="Milk" draggable="false"/></span>
          </div>

          {beat >= 3 && <span className={"s7bub" + (beat >= 5 ? " dim" : "")}>What if everyone used the same thing to buy and sell?</span>}

          <span className={"s7dark" + (beat === 4 || beat === 5 ? " on" : "")}/>
          {beat >= 4 && <span className="s7glow"/>}
          {beat >= 4 && <span className="s7coin"><img src={A.COINF[3]} alt="A ten rupee coin" draggable="false"/></span>}

          {beat >= 5 && beat < 10 && <span className="s7title">THEN CAME…<b>MONEY!</b></span>}
          {beat >= 10 && (
            <span className="s7title small"><b>MONEY</b><small>Money makes buying and selling easier.</small></span>
          )}

          {S7_LINKS.slice(0, shown).map((l,i) => {
            const HW = 1023/1537;                          /* plate height ÷ width */
            const sx = cx, sy = cy + 7;                    /* just below the coin */
            const tx = l.x + 3.7, ty = l.y + 5.55;         /* icon centre (icon is 7.4cqw wide) */
            const dxw = tx - sx, dyw = (ty - sy) * HW;     /* both in plate-width units */
            const len = Math.max(0, Math.hypot(dxw, dyw) - 4.4);
            const ang = Math.atan2(dyw, dxw) * 180 / Math.PI;
            return (
              <React.Fragment key={l.key}>
                <span className="s7arr" style={{ left:sx + "%", top:sy + "%", width:len + "%", transform:"rotate(" + ang + "deg)" }}/>
                <span className="s7link" style={{ left:l.x + "%", top:l.y + "%" }}>{l.render()}<span>→ {l.label}</span></span>
              </React.Fragment>
            );
          })}

          {beat >= 11 && (
            <div className="s7q" role="group" aria-label="Why is money useful?">
              <h5>Why is money useful?</h5>
              <div className="opts">
                <button className={right ? "right" : ""} onClick={() => pick("a")}><b>A</b>Everyone can use it to buy and sell</button>
                <button className={ans === "b" ? "shake" : ""} onClick={() => pick("b")} disabled={right}><b>B</b>Everyone wants wheat</button>
                <button className={ans === "c" ? "shake" : ""} onClick={() => pick("c")} disabled={right}><b>C</b>Money is food</button>
              </div>
              {right && <div className="fb ok">Exactly! Everyone accepts money, so buying and selling is easy.</div>}
              {(ans === "b" || ans === "c") && <div className="fb no">Think about what happened with the wheat and milk.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Book, S7_LINKS, Scene07, Toy };
