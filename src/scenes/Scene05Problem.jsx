import React, { useEffect, useState } from 'react';
import A from '../assets/index';
import { I } from '../components/icons';
/* ══════════════ scenes/Page05Problem.jsx ══════════════ */
function Scene05({ blip }) {
  const [beat,setBeat] = useState(0);
  const [glow,setGlow] = useState(null);      /* "farmer" | "milk" | "both" */
  const [hot,setHot] = useState(false);
  const [told,setTold] = useState(false);
  useEffect(() => {
    const t = [setTimeout(() => setBeat(1), 1600), setTimeout(() => setBeat(2), 4400),
               setTimeout(() => setBeat(3), 7400), setTimeout(() => setBeat(4), 10000)];
    return () => t.forEach(clearTimeout);
  }, []);
  const flash = who => { setGlow(who); blip(who === "milk" ? 660 : 780); setTimeout(() => setGlow(null), 2200); };
  const lesson = () => { setHot(true); flash("both"); setTimeout(() => setHot(false), 3200); };
  const ringF = glow === "farmer" || glow === "both";
  const ringM = glow === "milk" || glow === "both";

  return (
    <div className="s2">
      <div className={"s2cam s5cam b" + beat}>
        <img className="s2back" src={A.P5BG} alt="" aria-hidden="true" draggable="false"/>
        <div className="s2plate p5plate">
          <img className="s2bg" src={A.P5BG} alt="Indian village market at sunset" draggable="false"/>

          {ringF && <span className="s5ring" style={{left:"13%",width:"20.5%",top:"91%"}}/>}
          {ringM && <span className="s5ring" style={{left:"66%",width:"19%",top:"91%"}}/>}

          <span className={"s2ch" + (beat === 1 ? " s5ask" : "")} id="s5farmer">
            <img src={A.CH.farmer} alt="Farmer holding wheat" draggable="false"/></span>
          <span className={"s2ch" + (beat === 2 ? " s5shake" : "")} id="s5milk">
            <img src={A.CH.milk} alt="Milk seller" draggable="false"/></span>

          {beat >= 1 && <button className="s5bub l" onClick={() => flash("farmer")}>Do you want my wheat?</button>}
          {beat >= 2 && <button className="s5bub r" onClick={() => flash("milk")}>I need milk, not wheat.</button>}

          {beat >= 3 && <span className="s5neq">Wheat<b>≠</b>Milk</span>}

          {beat >= 4 && (
            <button className="s5q" onClick={() => { setTold(true); blip(940); }}>
              Why didn't the trade work?
              {told && <em>The milk seller didn't want wheat.</em>}
            </button>
          )}

          {beat >= 4 && (
            <button className={"s5msg" + (hot ? " hot" : "")} onClick={lesson}>
              <span>The trade works only if <b>BOTH</b> people want it.</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { Scene05 };
