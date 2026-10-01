import React from 'react';
import './money.css';

/* ════════ currency/MoneyObject.jsx — real money travelling through the world ════════
   The supplied coin or note artwork (front + back, never altered) as a thin
   physical object that flies between story points. Everything is transform:
     .mo        where it is        (translate, transitioned over the flight time)
     .mo-spin   turning over       (rotateY, persistent so each turn animates)
     .mo-arc    the flight's arc   (a hop, restarted per flight by `flight`)
     faces are back-to-back with hidden backfaces — never faded
   `bright` rings it in gold when the class gets it (crisp outline, no glow). */

function MoneyObject({ kind = 'coin', front, back, alt, at, size, ms = 1600, ease, turns = 0, flight, bright, hidden, reduced }) {
  const w = kind === 'coin' ? size : size * 2.07;          /* notes keep their 620:300 proportion */
  return (
    <div className={'mo mo-' + kind + (bright ? ' bright' : '') + (hidden ? ' hidden' : '')}
      style={{
        '--mw': w + 'cqh', '--mh': size + 'cqh',
        transform: 'translate3d(calc(' + at.x + 'cqw - 50%), calc(' + (-at.y) + 'cqh + 50%), 0)',
        transition: reduced ? 'none' : 'transform ' + ms + 'ms ' + (ease || 'cubic-bezier(.45,.05,.3,1)') + ',opacity .5s ease',
      }}
      role="img" aria-label={alt}>
      <div className="mo-spin" style={{ transform: 'rotateY(' + turns * 360 + 'deg)', transition: reduced ? 'none' : 'transform ' + ms + 'ms ease-in-out' }}>
        <div className="mo-arc" key={flight} style={reduced ? null : { animationDuration: ms + 'ms' }}>
          <img className="mo-face" src={front} alt="" draggable="false"/>
          <img className="mo-face mo-back" src={back} alt="" draggable="false"/>
        </div>
      </div>
    </div>
  );
}

export { MoneyObject };
