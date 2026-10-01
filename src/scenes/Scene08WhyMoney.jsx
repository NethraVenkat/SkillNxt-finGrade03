import React, { useEffect, useState } from 'react';
import A from '../assets/index';
import { Rupi } from '../data/characterData';
import { pick } from '../pages/Play';
/* ══════════════ scenes/LessonPage08.jsx ══════════════ */
const Mango = () => (
  <svg viewBox="0 0 64 64"><path d="M40 10c12 4 18 18 12 32S30 62 18 56 4 36 12 24 28 6 40 10z" fill="#F5B82E"/>
    <path d="M40 10c12 4 18 18 12 32-2-10-10-22-24-26 4-4 8-7 12-6z" fill="#F08A2A" opacity=".55"/>
    <path d="M22 22c4-4 10-5 14-4" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" fill="none"/>
    <path d="M40 10c2-4 6-6 10-6" stroke="#6B4A22" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M46 6c8-2 14 2 14 6-6 3-12 2-14-6z" fill="#3E9440"/></svg>
);
const PriceTag = ({ amount }) => (
  <svg viewBox="0 0 90 120"><path d="M28 0v22" stroke="#6B4A22" strokeWidth="2.5"/>
    <path d="M10 26h56l14 16v62a8 8 0 01-8 8H18a8 8 0 01-8-8z" fill="#FFF6DC" stroke="#C99A3C" strokeWidth="3"/>
    <circle cx="28" cy="36" r="4" fill="#C99A3C"/>
    <text x="45" y="82" textAnchor="middle" fontFamily="Baloo 2, sans-serif" fontWeight="800" fontSize="30" fill="#12395F">{amount}</text></svg>
);
const Stall = () => (
  <svg viewBox="0 0 220 140"><rect x="8" y="70" width="204" height="62" rx="6" fill="#9A6836"/>
    <rect x="8" y="70" width="204" height="10" fill="#B98A4E"/><path d="M8 96h204M8 116h204" stroke="#7B4F22" strokeWidth="3"/>
    <g transform="translate(70 4) scale(1.25)"><path d="M40 10c12 4 18 18 12 32S30 62 18 56 4 36 12 24 28 6 40 10z" fill="#F5B82E"/>
    <path d="M40 10c12 4 18 18 12 32-2-10-10-22-24-26 4-4 8-7 12-6z" fill="#F08A2A" opacity=".55"/>
    <path d="M40 10c2-4 6-6 10-6" stroke="#6B4A22" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M46 6c8-2 14 2 14 6-6 3-12 2-14-6z" fill="#3E9440"/></g></svg>
);
function Scene08({ blip, onSolved, solved }) {
  const [beat,setBeat] = useState(0);
  const [ans,setAns] = useState(solved ? "a" : null);
  const [zoom,setZoom] = useState(false);
  useEffect(() => {
    const T = [1200,3400,5200,6600,9200,11000,13800,15400,18000,20400];
    const t = T.map((ms,i) => setTimeout(() => {
      setBeat(i + 1);
      if (i === 2) blip(820); if (i === 3) blip(900); if (i === 5) blip(760); if (i === 6) blip(680); if (i === 8) blip(940);
    }, ms));
    return () => t.forEach(clearTimeout);
  }, []);
  const pick = v => {
    setAns(v);
    if (v === "a") { blip(980); onSolved && onSolved(); setTimeout(() => setZoom(true), 3800); setTimeout(() => setZoom(false), 7200); }
    else { blip(330,"square"); setTimeout(() => setAns(x => (x === v ? null : x)), 2400); }
  };
  const right = ans === "a";
  const buy = beat >= 2 && beat <= 4, exch = beat === 5 || beat === 6, price = beat === 7 || beat === 8, summ = beat >= 9;

  return (
    <div className="s2">
      <div className={"s2cam s8cam b" + beat + (zoom ? " zoom" : "")}>
        <img className="s2back" src={A.P5BG} alt="" aria-hidden="true" draggable="false"/>
        <div className="s2plate p8plate">
          <img className="s2bg" src={A.P5BG} alt="Village marketplace" draggable="false"/>

          <span className={"s2ch in" + (beat === 8 || right ? " s8point" : "")} id="s8rupi">
            <img src={A.CH.rupi} alt="Rupi" draggable="false"/></span>

          {beat === 1 && <span className="s8bub">Why do we use money?</span>}

          {/* ── BUY: the girl pays the farmer, the mango changes hands ── */}
          {beat >= 2 && beat <= 5 && (
            <React.Fragment>
              <span className={"s2ch" + (beat >= 5 ? " s8out" : "")} id="s8girl"><img src={A.CH.girl} alt="A girl buying a mango" draggable="false"/></span>
              <span className={"s2ch" + (beat >= 5 ? " s8out" : "")} id="s8farmer"><img src={A.CH.farmer} alt="The seller" draggable="false"/></span>
              <span className={"s8obj" + (beat >= 3 ? " paid s8arc" : "")} id="s8coin" style={{ opacity: beat >= 5 ? 0 : 1 }}>
                <img src={A.COINF[3]} alt="₹10 coin" draggable="false"/></span>
              <span className={"s8obj" + (beat >= 4 ? " bought s8arc" : "")} id="s8mango" style={{ opacity: beat >= 5 ? 0 : 1 }}><Mango/></span>
            </React.Fragment>
          )}
          {beat === 4 && (
            <span className="s8cap"><b>BUY</b><span>Money helps us buy things.</span></span>
          )}

          {/* ── EXCHANGE: wheat ✕ milk becomes money → wheat, money → milk ── */}
          {exch && (
            <React.Fragment>
              <span className="s8ico" style={{ left:"33%", top:"40%" }}><img src={A.P6WHEAT} alt="Wheat" draggable="false"/></span>
              <span className="s8ico can" style={{ left:"71%", top:"40%", animationDelay:".2s" }}><img src={A.P6CAN} alt="Milk" draggable="false"/></span>
              <span className="s8x" style={{ opacity: beat === 5 ? 1 : 0 }}>✕</span>
              {beat === 6 && (
                <React.Fragment>
                  <span className="s8coinC" style={{ left:"52%", top:"38%" }}><img src={A.COINF[3]} alt="Money" draggable="false"/></span>
                  <span className="s8path" style={{ left:"51.5%", top:"46.5%", width:"8.6%", transform:"rotate(180deg)" }}/>
                  <span className="s8path" style={{ left:"60%", top:"46.5%", width:"9%" }}/>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {beat === 6 && <span className="s8cap"><b>EXCHANGE</b><span>Money makes exchanging easier.</span></span>}

          {/* ── PRICE: a mango and its ₹10 tag ── */}
          {price && (
            <React.Fragment>
              <span className="s8stall"><Stall/></span>
              <span className={"s8tag" + (beat === 8 ? " hot" : "")}><PriceTag amount="₹10"/></span>
            </React.Fragment>
          )}
          {beat === 8 && (
            <span className="s8cap"><b>PRICE</b><span>Money helps us know how much something costs.</span>
              <em>The ₹10 tells us how much the mango costs.</em></span>
          )}

          {/* ── all three together, money at the centre ── */}
          {summ && (
            <React.Fragment>
              <span className="s8coinC"><img src={A.COINF[3]} alt="Money" draggable="false"/></span>
              <span className="s8path" style={{ left:"52%", top:"27%", width:"13.5%", transform:"rotate(152deg)" }}/>
              <span className="s8path" style={{ left:"55.7%", top:"30%", width:"8%", transform:"rotate(90deg)" }}/>
              <span className="s8path" style={{ left:"59.5%", top:"27%", width:"13.5%", transform:"rotate(28deg)" }}/>
              <span className="s8node" style={{ left:"27%", top:"40%" }}><span className="ico"><Mango/></span><b>BUY</b><span>Money helps us buy things</span></span>
              <span className="s8node" style={{ left:"47.8%", top:"44%", animationDelay:".25s" }}><span className="ico"><img src={A.P6CAN} alt="" draggable="false"/></span><b>EXCHANGE</b><span>Money makes exchanging easier</span></span>
              <span className="s8node" style={{ left:"68.5%", top:"40%", animationDelay:".5s" }}><span className="ico"><PriceTag amount="₹10"/></span><b>PRICE</b><span>Money tells us how much things cost</span></span>
            </React.Fragment>
          )}
          {right && <span className="s8bub" style={{top:"2.5%",fontSize:"1.6cqw"}}>Money helps us buy things, makes exchanging easier, and tells us how much things cost!</span>}

          {beat >= 10 && (
            <div className="s8q" role="group" aria-label="If a mango costs ten rupees, what does that tell us?">
              <h5>If a mango costs ₹10, what does that ₹10 tell us?</h5>
              <div className="opts">
                <button className={right ? "right" : ""} onClick={() => pick("a")}><b>A</b>How much the mango costs</button>
                <button className={ans === "b" ? "shake" : ""} onClick={() => pick("b")} disabled={right}><b>B</b>How big the mango is</button>
                <button className={ans === "c" ? "shake" : ""} onClick={() => pick("c")} disabled={right}><b>C</b>How tasty the mango is</button>
              </div>
              {right && <div className="fb ok">Exactly! ₹10 tells us the price — how much the mango costs.</div>}
              {(ans === "b" || ans === "c") && <div className="fb no">Look at the ₹10. It tells us how much the mango costs.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Mango, PriceTag, Scene08, Stall };
