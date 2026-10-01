import React, { useEffect, useState } from 'react';
import A from '../assets/index';
import { I } from '../components/icons';
import { Robot, Rupi } from '../data/characterData';
import { pick } from '../pages/Play';
/* ══════════════ scenes/LessonPage06.jsx ══════════════ */
const S6_STARS = [
  {g:"★",dx:"-70px",dy:"-70px",d:"0s"},{g:"✦",dx:"50px",dy:"-90px",d:".07s"},
  {g:"★",dx:"86px",dy:"-50px",d:".14s"},{g:"✦",dx:"-40px",dy:"-104px",d:".21s"},
  {g:"★",dx:"8px",dy:"-120px",d:".28s"},
];
function Scene06({ blip, onSolved, solved }) {
  const [beat,setBeat] = useState(0);
  const [ans,setAns] = useState(solved ? "b" : null);
  useEffect(() => {
    const T = [1200,3200,5200,6600,7800,9200,10800];
    const t = T.map((ms,i) => setTimeout(() => { setBeat(i + 1); if (i === 4) blip(300,"square"); }, ms));
    return () => t.forEach(clearTimeout);
  }, []);
  const pick = v => {
    setAns(v);
    if (v === "b") { blip(980); onSolved && onSolved(); }
    else { blip(330,"square"); setTimeout(() => setAns(a => (a === "a" ? null : a)), 2200); }
  };
  const right = ans === "b";

  /* farmer: offers (1) → lowers the wheat, confused (5+) → thoughtful on a wrong try → nods when correct */
  const farmerCls = right ? " s6nod" : ans === "a" ? " s6think" : beat === 1 ? " s5ask" : beat >= 5 ? " s6lower" : "";
  /* milk seller: shakes his head (2) → smiles when correct */
  const milkCls = right ? " s6smile" : beat === 2 ? " s5shake" : "";

  return (
    <div className="s2">
      <div className={"s2cam s6cam b" + beat}>
        <img className="s2back" src={A.P5BG} alt="" aria-hidden="true" draggable="false"/>
        <div className="s2plate p6plate">
          <img className="s2bg" src={A.P5BG} alt="Indian village marketplace" draggable="false"/>

          <span className={"s2ch" + farmerCls} id="s6farmer">
            <img src={A.CH.farmer} alt="Farmer holding wheat" draggable="false"/></span>
          <span className={"s2ch" + milkCls} id="s6milk">
            <img src={A.CH.milk} alt="Milk seller refusing the wheat" draggable="false"/></span>
          <span className={"s2ch" + (right ? " s6nod" : "")} id="s6boy"><img src={A.CH.boy} alt="Rupi watching" draggable="false"/></span>
          <span className="s2ch" id="s6bot"><img src={A.CH.robot} alt="Robot watching" draggable="false"/></span>
          <span className="s2ch" id="s6girl"><img src={A.CH.girl} alt="Girl watching" draggable="false"/></span>

          {beat >= 1 && <span className="s6bub l">I have wheat.<br/>I want milk.</span>}
          {beat >= 2 && <span className="s6bub r">I have milk,<br/>but I don't want wheat.</span>}

          {beat >= 3 && (
            <React.Fragment>
              <span className={"s6ico" + (beat === 4 ? " try" : "")} id="s6w"><img src={A.P6WHEAT} alt="Wheat" draggable="false"/></span>
              <span className={"s6ico can" + (beat === 4 ? " try" : "")} id="s6m"><img src={A.P6CAN} alt="Milk" draggable="false"/></span>
            </React.Fragment>
          )}
          {beat === 4 && <span className="s6arrows">⟶</span>}
          {beat >= 5 && <span className="s6x">✕</span>}

          {beat >= 7 && (
            <div className="s6q" role="group" aria-label="When does barter work?">
              <h5>When does barter work?</h5>
              <div className="row">
                <button className={ans === "a" ? "shake" : ""} onClick={() => pick("a")} disabled={right}>
                  <b>A</b>Only one person wants the trade</button>
                <button className={right ? "right" : ""} onClick={() => pick("b")}>
                  <b>B</b>Both people want the trade</button>
              </div>
              {right && <div className="fb ok"><b>Correct!</b>Both people must want what the other person has.</div>}
              {ans === "a" && <div className="fb no"><b>Think again!</b>Both people need to want the trade.</div>}
              {right && S6_STARS.map((st,i) => (
                <i key={i} className="s6star" style={{left:"50%",top:"10%","--dx":st.dx,"--dy":st.dy,animationDelay:st.d}}>{st.g}</i>
              ))}
            </div>
          )}

          {beat >= 6 && (
            <div className="s6panel">
              <h4><b>BOTH</b> people must want the trade.</h4>
              <div className="s6rows">
                <div className="s6row">
                  <span className="s6face"><img src={A.CH.farmer} alt="" draggable="false"/></span>
                  <span>Farmer wants → Milk</span>
                  <span className="s6mini can"><img src={A.P6CAN} alt="" draggable="false"/></span>
                </div>
                <div className="s6row">
                  <span className="s6face"><img src={A.CH.milk} alt="" draggable="false"/></span>
                  <span>Milk Seller <em>does NOT</em> want → Wheat</span>
                  <span className="s6mini no"><img src={A.P6WHEAT} alt="" draggable="false"/></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { S6_STARS, Scene06 };
