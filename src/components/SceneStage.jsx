import React from 'react';
import A from '../assets/index';
import { WCoins, WCompare, WConcept, WIdea, WNotes, WRecap, WReveal, WRupee9, WSwap, WTrade4, WTrade6 } from './SceneWidgets';
import { Rupi } from '../data/characterData';
import { CHAR_SRC, SD } from '../data/sceneData';
import { STARS } from '../pages/LearningJourney';
/* ══════════════ components/SceneStage.jsx ══════════════ */
function SceneStage({ n, blip }) {
  const d = SD[n]; if (!d) return null;
  const CH = CHAR_SRC();
  const W = { coins:WCoins, notes:WNotes, compare:WCompare, concept:WConcept, rupee9:WRupee9,
              idea:WIdea, trade4:WTrade4, trade6:WTrade6, reveal:null, swap:null,
              recap:WRecap }[d.widget];
  const chars = d.chars || [];
  const bubbles = d.bubbles || [];

  /* CHARACTER ZONE — outer columns of the scene band, never the centre */
  const slot = i => (i === 0 ? { left:"2%" } : { right:"2%" });
  /* DIALOGUE ZONE — top of the scene band, on the speaker's own side */
  const bubbleAt = i => (i === 0
    ? { top:0, left:"17%" }
    : { top:0, right:"17%" });

  return (
    <div className={"gstage" + (chars.length ? "" : " nochars")}>
      <img className="gbg" src={A.ENV[d.env]} alt="" draggable="false"/>
      <span className="gvig"/>
      {STARS.slice(0,6).map((st,i) => (
        <span key={i} className="mote" style={{left:st.left,top:st.top,animationDuration:"22s,3s",animationDelay:(-i*3)+"s,0s"}}/>
      ))}

      <span className="gtitle">{d.title}</span>

      <div className="gscene">
        {chars.map((c,i) => (
          <span key={i} className={"gchar side" + i + (c.flip ? " flip" : "") + (c.float ? " float" : i ? " b2" : "")}
            style={{ ...slot(i), height: c.float ? "72%" : "100%" }}>
            <img src={CH[c.k]} alt={c.k} draggable="false"/>
          </span>
        ))}

        {bubbles.map((b,i) => (
          <span key={i} className={"gbub " + (i === 0 ? "l" : "r")}
            style={{ ...bubbleAt(i), animationDelay:(0.5 + i*0.45) + "s" }}>{b.t}</span>
        ))}

        {d.widget === "rupee9" && <div className="bigrupee">₹</div>}
        {d.widget === "idea" && (
          <button className="lightbulb" style={{left:"44%",top:"2%"}} onClick={() => blip(980)} aria-label="Rupi's idea">
            <svg viewBox="0 0 64 80"><path d="M32 4a22 22 0 0114 39v7H18v-7A22 22 0 0132 4z" fill="#FFE07A" stroke="#D89A0E" strokeWidth="3"/>
              <rect x="20" y="52" width="24" height="7" rx="3" fill="#B9A06A"/><rect x="22" y="61" width="20" height="6" rx="3" fill="#8E7A4C"/>
              <path d="M26 44v-8M38 44v-8M32 44V30" stroke="#D89A0E" strokeWidth="3" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>

      <div className="gedu">
        {W && <W blip={blip}/>}
        {d.widget === "reveal" && <WReveal q={d.q} ans={d.ans} blip={blip}/>}
        {d.widget === "swap" && <WSwap q={d.q} ans={d.ans} blip={blip}/>}
      </div>

      <span className="gcap" dangerouslySetInnerHTML={{ __html: d.cap }}/>
    </div>
  );
}

export { SceneStage };
