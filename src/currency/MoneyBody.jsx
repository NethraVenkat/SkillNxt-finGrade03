import React from 'react';
import A from '../assets/index';

/* ════════ currency/MoneyBody.jsx — supplied artwork on a physical 3D body ════════
   The same construction as Scenes 13–14 (styles in scenes/scene13.css): a front
   and a back face with backface hidden, and between them either five rim discs
   (a coin's thickness) or a paper edge (a note). Turning it shows the edge — a
   face is never crossfaded. Optional: a gold outline on the printed value
   (mark = [cx, cy, w, h] fractions of the face) and a sheen that sweeps once. */

const RIM = { 0: '#8E8A82', 1: '#8A8780', 2: '#8C7147', 3: '#86683A', 4: '#767674' };

function MoneyBody({ kind, i, mark, markFace = 'front', markOn, sheen, markClass = 'c15-mark' }) {
  const coin = kind === 'coin';
  const m = mark && (
    <span className={markClass + (markOn ? ' on' : '')} aria-hidden="true"
      style={{ left: (mark[0] - mark[2] / 2) * 100 + '%', top: (mark[1] - mark[3] / 2) * 100 + '%', width: mark[2] * 100 + '%', height: mark[3] * 100 + '%' }}/>
  );
  return (
    <div className="c13-sway">
      <div className="c13-face c13-front">
        <img src={coin ? A.COINF[i] : A.NOTEF[i]} alt="" draggable="false"/>
        {markFace === 'front' && m}
        {sheen && <span className="c13-sheen"/>}
      </div>
      {coin ? [0, 1, 2, 3, 4].map(k => <i key={k} className="c13-edge" style={{ '--k': k }}/>) : <i className="c13-paper"/>}
      <div className="c13-face c13-back">
        <img src={coin ? A.COINB[i] : A.NOTEB[i]} alt="" draggable="false"/>
        {markFace === 'back' && m}
      </div>
    </div>
  );
}

export { MoneyBody, RIM };
