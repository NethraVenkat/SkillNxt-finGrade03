import React, { useState } from 'react';
import A from '../assets/index';
import { Inspector } from '../components/CurrencyViewer';
import { Coin } from '../data/characterData';
import { COINS, NOTES } from '../data/currencyData';
import { STARS } from './LearningJourney';
/* ══════════════ pages/ExplorePage.jsx ══════════════ */
function Explore() {
  const [sel,setSel] = useState({ kind:"coin", idx:3 });
  return (
    <div className="explore">
      {STARS.slice(0,22).map((st,i) => <span key={i} className="star" style={{left:st.left,top:st.top,animationDelay:st.del}}/>)}
      <div className="exscroll">
        <div className="exhead">
          <span className="rs">₹</span>
          <div>
            <h1>Indian Currency</h1>
            <p>Real money, real values. Explore, learn, grow.</p>
          </div>
        </div>

        <div className="exbody">
          <div>
            <div className="exsec">
              <h2><i/>Coins</h2>
              <p className="sub">Five denominations. One trusted currency.</p>
              <div className="coinrow">
                {COINS.map((c,i) => (
                  <button key={c.v} className={"coinpick" + (sel.kind === "coin" && sel.idx === i ? " on" : "")}
                    onClick={() => setSel({ kind:"coin", idx:i })}>
                    <img src={A.COINF[i]} alt={"₹" + c.v + " coin"} draggable="false"/>
                    <b>₹{c.v} Coin</b>
                  </button>
                ))}
              </div>
            </div>

            <div className="exsec">
              <h2><i/>Indian Banknotes</h2>
              <p className="sub">Six denominations. A stronger tomorrow.</p>
              <div className="noterow">
                {NOTES.map((n,i) => (
                  <button key={n.v} className={"notepick" + (sel.kind === "note" && sel.idx === i ? " on" : "")}
                    onClick={() => setSel({ kind:"note", idx:i })}>
                    <img src={A.NOTEF[i]} alt={"₹" + n.v + " note"} draggable="false"/>
                    <b>₹{n.v} Note</b>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Inspector kind={sel.kind} idx={sel.idx}/>
        </div>
      </div>
    </div>
  );
}

export { Explore };
