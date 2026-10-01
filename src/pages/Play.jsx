import React, { useState } from 'react';
import A from '../assets/index';
import { Coin } from '../data/characterData';
import { COINS, NOTES } from '../data/currencyData';
/* ══════════════ PLAY — in-world money games ══════════════ */
const GAMES = [
  { id:"coinnote", name:"Coin or Note?",           sub:"Spot the difference" },
  { id:"denom",    name:"Denomination Match",      sub:"Name the value" },
  { id:"higher",   name:"Higher Value",            sub:"Which is worth more?" },
  { id:"same",     name:"Same Value, Different Form", sub:"₹10 two ways" },
  { id:"sorting",  name:"Money Sorting",           sub:"Coins on one side, notes on the other" },
];
const allMoney = () => [
  ...[0,1,2,3,4].map(i => ({ kind:"coin", i, v:COINS[i].v })),
  ...[0,1,2,3,4,5].map(i => ({ kind:"note", i, v:NOTES[i].v })),
];
const pick = arr => arr[Math.floor(Math.random()*arr.length)];

function MoneyItem({ m }) {
  if (m.kind === "coin") return <img className="realcoin" src={A.COINF[m.i]} alt={"₹"+m.v+" coin"} draggable="false"/>;
  return <img className="realnote" src={A.NOTEF[m.i]} alt={"₹"+m.v+" note"} draggable="false"/>;
}

function Play({ blip }) {
  const [game,setGame] = useState("coinnote");
  const [round,setRound] = useState(0);
  const [score,setScore] = useState(0);
  const [verdict,setVerdict] = useState(null);
  const ALLM = allMoney();
  const [pair,setPair] = useState(() => [pick(allMoney()), pick(allMoney())]);
  const [item,setItem] = useState(() => pick(allMoney()));
  const [bins,setBins] = useState({ coin:[], note:[] });
  const [pool,setPool] = useState(() => allMoney().slice(0,6));
  const [sel,setSel] = useState(null);
  const [pv,setPv] = useState(null);

  const next = () => {
    setItem(pick(ALLM));
    let a = pick(ALLM), b = pick(ALLM);
    while (b.v === a.v) b = pick(ALLM);
    setPair([a,b]);
    setVerdict(null); setRound(r => r + 1);
  };
  const judge = ok => {
    setVerdict(ok ? "ok" : "no");
    if (ok) { setScore(s => s + 1); blip(980); setTimeout(next, 1000); }
    else blip(320, "square");
  };
  const switchGame = id => {
    setGame(id); setScore(0); setRound(0); setVerdict(null); setSel(null);
    setBins({ coin:[], note:[] }); setPool(allMoney().slice(0,6)); next(); blip(700);
  };
  const dropTo = bin => {
    if (!sel) return;
    const ok = (bin === "coin") === (sel.kind === "coin");
    if (ok) { setBins(b => ({ ...b, [bin]:[...b[bin], sel] }));
      setPool(p => p.filter(x => x !== sel)); setScore(s => s + 1); setVerdict("ok"); blip(960); }
    else { setVerdict("no"); blip(320,"square"); }
    setSel(null); setTimeout(() => setVerdict(null), 1100);
  };

  const denomOpts = () => {
    const set = new Set([item.v]);
    while (set.size < 3) set.add(pick(ALLM).v);
    return [...set].sort((a,b) => a - b);
  };

  return (
    <div className="view">
      <div className="pagebg"><img src={A.HOME} alt="" draggable="false"/></div>
      <div className="pagewrap">
        <div className="woodpanel"><div className="woodinner">
          <h2>Play — Money Games</h2>
          <p>Same world, same money. Pick a game and let the class call out the answer before you tap.</p>
          <div className="gamegrid">
            {GAMES.map(g => (
              <button key={g.id} className={"gametile" + (game === g.id ? " on" : "")} onClick={() => switchGame(g.id)}>
                <b>{g.name}</b><span>{g.sub}</span>
              </button>
            ))}
          </div>

          <div className="arena">
            {game === "coinnote" && (
              <React.Fragment>
                <div className="moneyitem" key={round}><MoneyItem m={item}/></div>
                <div className="answers">
                  <button className="ansbtn" onClick={() => judge(item.kind === "coin")}>Coin</button>
                  <button className="ansbtn" onClick={() => judge(item.kind === "note")}>Note</button>
                  <button className="ansbtn ghost" onClick={() => { next(); blip(560); }}>Skip →</button>
                </div>
              </React.Fragment>
            )}

            {game === "denom" && (
              <React.Fragment>
                <div className="moneyitem" key={round}><MoneyItem m={item}/></div>
                <div className="answers">
                  {denomOpts().map(v => (
                    <button key={v} className="ansbtn" onClick={() => judge(v === item.v)}>₹{v}</button>
                  ))}
                </div>
              </React.Fragment>
            )}

            {game === "higher" && (
              <React.Fragment>
                <div className="moneyitem" key={round} style={{display:"flex",gap:26,justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
                  {pair.map((m,i) => (
                    <button key={i} onClick={() => judge(m.v >= pair[1-i].v)} style={{display:"block"}}>
                      <MoneyItem m={m}/>
                    </button>
                  ))}
                </div>
                <div className="scoreline">Tap the one that is worth more</div>
              </React.Fragment>
            )}

            {game === "same" && (
              <React.Fragment>
                <div className="moneyitem" style={{display:"flex",gap:26,justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
                  <img className="realcoin" src={A.COINF[3]} alt="₹10 coin"/>
                  <span style={{fontFamily:"Baloo 2",fontWeight:800,fontSize:34,color:"#12395F"}}>=</span>
                  <img className="realnote" src={A.NOTEF[0]} alt="₹10 note"/>
                </div>
                <div className="answers">
                  <button className="ansbtn" onClick={() => judge(true)}>Same value</button>
                  <button className="ansbtn ghost" onClick={() => judge(false)}>Different value</button>
                </div>
              </React.Fragment>
            )}

            {game === "sorting" && (
              <React.Fragment>
                <div className="sortwrap" style={{maxWidth:640,margin:"0 auto"}}>
                  {["coin","note"].map(b => (
                    <div key={b} className={"bin" + (sel ? " over" : "")} onClick={() => dropTo(b)}>
                      <h4>{b === "coin" ? "Coins" : "Notes"}</h4>
                      <div className="drop">
                        {bins[b].map((x,i) => <img key={i} className={x.kind === "coin" ? "c" : ""}
                          src={x.kind === "coin" ? A.COINF[x.i] : A.NOTEF[x.i]} alt={"₹"+x.v}/>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pool">
                  {pool.map((x,i) => (
                    <img key={i} className={(x.kind === "coin" ? "c" : "") + (sel === x ? " sel" : "")}
                      src={x.kind === "coin" ? A.COINF[x.i] : A.NOTEF[x.i]} alt={"₹"+x.v}
                      onClick={() => { setSel(sel === x ? null : x); blip(720); }}/>
                  ))}
                </div>
                {!pool.length && <div className="verdict ok">All sorted! Well played.</div>}
              </React.Fragment>
            )}

            {verdict && (
              <div className={"verdict " + verdict}>
                {verdict === "ok" ? "Yes! That's right." : "Not quite — look again and try once more."}
              </div>
            )}
            <div className="scoreline">Score {score}{game !== "sorting" ? " · Round " + (round + 1) : ""}</div>
          </div>
        </div></div>
      </div>
    </div>
  );
}

export { GAMES, MoneyItem, Play, allMoney, pick };
