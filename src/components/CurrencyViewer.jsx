import React, { useEffect, useRef, useState } from 'react';
import A from '../assets/index';
import { COINS, NOTES } from '../data/currencyData';
/* ══════════════ currency/CurrencyViewer.jsx ══════════════ */
function Inspector({ kind, idx }) {
  const [rot,setRot] = useState(0);
  const [snap,setSnap] = useState(true);
  const drag = useRef(null);
  useEffect(() => { setRot(0); setSnap(true); }, [kind, idx]);

  const down = e => { drag.current = { x:e.clientX, r:rot }; setSnap(false); e.currentTarget.setPointerCapture(e.pointerId); };
  const move = e => { if (!drag.current) return; setRot(drag.current.r + (e.clientX - drag.current.x) * 0.7); };
  const up   = () => { drag.current = null; setSnap(true); };

  const face = Math.abs(((rot % 360) + 360) % 360 - 180) < 90 ? "back" : "front";
  const item = kind === "coin" ? COINS[idx] : NOTES[idx];
  const front = kind === "coin" ? A.COINF[idx] : A.NOTEF[idx];
  const back  = kind === "coin" ? A.COINB[idx] : A.NOTEB[idx];

  return (
    <div className="inspect">
      <h3>Interactive 3D view</h3>
      <p className="hint">Drag to rotate · click to flip</p>
      <div className="stage3d" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        onClick={() => { if (!drag.current) { setSnap(true); setRot(r => r + 180); } }}>
        <div className={"flipper " + kind + (snap ? " snap" : "")} style={{ transform:"rotateY(" + rot + "deg)" }}>
          <span className="face"><img src={front} alt={"₹" + item.v + " front"} draggable="false"/></span>
          <span className="face back"><img src={back} alt={"₹" + item.v + " back"} draggable="false"/></span>
        </div>
      </div>
      <div className="exrow">
        <button className={"exbtn" + (face === "front" ? " on" : "")} onClick={() => { setSnap(true); setRot(0); }}>Front view</button>
        <button className={"exbtn" + (face === "back" ? " on" : "")} onClick={() => { setSnap(true); setRot(180); }}>Back view</button>
        <button className="exbtn" onClick={() => { setSnap(true); setRot(90); }}>Edge view</button>
      </div>
      <div className="exfacts">
        <div><span>Denomination</span><b>₹{item.v}</b></div>
        <div><span>{kind === "coin" ? "Material" : "Colour"}</span><b>{kind === "coin" ? item.metal : item.colour}</b></div>
        <div><span>Showing</span><b>{face === "front" ? "Front" : "Back"}</b></div>
      </div>
      <p className="hint" style={{marginTop:10}}>{item.note}</p>
    </div>
  );
}

export { Inspector };
