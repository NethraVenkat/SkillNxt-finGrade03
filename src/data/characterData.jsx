import React, { memo } from 'react';
import A from '../assets/index';
/* ════════ characters — master assets from the character sheet ════════ */
const Rupi = memo(() => (
  <div className="sprite" id="rupi">
    <img src={A.RUPI} alt="Rupi" draggable="false"/>
    <span className="lid lid-l"/>
    <span className="lid lid-r"/>
  </div>
));
const Robot = memo(() => <div className="sprite" id="robot"><img src={A.ROBOT} alt="Robot" draggable="false"/></div>);
const Coin  = memo(() => <div className="sprite" id="coin"><img src={A.COIN} alt="Rupee coin" draggable="false"/></div>);

export { Coin, Robot, Rupi };
