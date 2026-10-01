import React, { useEffect, useState } from 'react';
import A from '../assets/index';
import { I } from './icons';
import { Coin, Rupi } from '../data/characterData';
import { COINS, NOTES } from '../data/currencyData';
import { Apple, Pencil } from '../scenes/Scene04Barter';
/* ══════════════ scene widgets ══════════════ */
function WCoins({ blip }) {
  const [sel,setSel] = useState(null);
  const [pv,setPv] = useState(null);
  return (
    <div className="gpanel"><div className="in">
      <h3>These are the coins.</h3>
      <div className="grow">
        {COINS.map((c,i) => (
          <button key={c.v} className={"gitem coin" + (sel === i ? " on" : "")}
            onClick={() => { setSel(sel === i ? null : i); blip(760 + i*60); }}>
            <img src={sel === i ? A.COINB[i] : A.COINF[i]} alt={"₹"+c.v}/>
            <b>₹{c.v}</b>
          </button>
        ))}
      </div>
      {sel !== null && <div className="gverdict ok">₹{COINS[sel].v} coin · {COINS[sel].metal} — tap again for the front.</div>}
      <div className="gscore">Which coin has the biggest value? {sel === 4 ? "₹20 — the highest here!" : "Tap to compare."}</div>
    </div></div>
  );
}
function WNotes({ blip }) {
  const [sel,setSel] = useState(null);
  const [pv,setPv] = useState(null);
  return (
    <div className="gpanel"><div className="in">
      <h3>These are the notes.</h3>
      <div className="grow">
        {NOTES.map((n,i) => (
          <button key={n.v} className={"gitem note" + (sel === i ? " on" : "")}
            onClick={() => { setSel(sel === i ? null : i); blip(680 + i*40); }}>
            <img src={sel === i ? A.NOTEB[i] : A.NOTEF[i]} alt={"₹"+n.v}/>
            <b>₹{n.v}</b>
          </button>
        ))}
      </div>
      {sel !== null && <div className="gverdict ok">₹{NOTES[sel].v} note · {NOTES[sel].colour}</div>}
    </div></div>
  );
}
function WCompare({ blip }) {
  const [f,setF] = useState([false,false]);
  return (
    <div className="gpanel"><div className="in">
      <h3>Same value. Different forms!</h3>
      <div className="grow" style={{gap:"6%"}}>
        <button className="gitem coin on" onClick={() => { setF([!f[0],f[1]]); blip(820); }}>
          <img src={f[0] ? A.COINB[3] : A.COINF[3]} alt="₹10 coin" style={{width:"clamp(70px,11cqw,150px)"}}/>
          <b>₹10 Coin</b>
        </button>
        <button className="gitem note on" onClick={() => { setF([f[0],!f[1]]); blip(660); }}>
          <img src={f[1] ? A.NOTEB[0] : A.NOTEF[0]} alt="₹10 note" style={{width:"clamp(140px,22cqw,320px)"}}/>
          <b>₹10 Note</b>
        </button>
      </div>
      <div className="gverdict ok">Both are worth ₹10. Tap each one to see its back.</div>
    </div></div>
  );
}
function WConcept({ blip }) {
  const T = [
    { k:"Buy", d:"Money helps us buy things we need" },
    { k:"Exchange", d:"Money makes exchanging easy for everyone" },
    { k:"Price", d:"Money tells us how much something costs" },
  ];
  const [on,setOn] = useState(null);
  return (
    <div className="gpanel"><div className="in">
      <h3>Money helps us to:</h3>
      <div className="gtiles" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {T.map((t,i) => (
          <button key={t.k} className={"gtile" + (on === i ? " on" : "")}
            onClick={() => { setOn(on === i ? null : i); blip(700 + i*80); }}>
            <b>{t.k}</b><span>{t.d}</span>
          </button>
        ))}
      </div>
    </div></div>
  );
}
function WRupee() {
  return <div className="bigrupee">₹</div>;
}
function WIdea({ blip }) {
  const [on,setOn] = useState(false);
  return (
    <div className="gpanel"><div className="in">
      <h3>{on ? "Use one thing everyone accepts — money!" : "What could solve the barter problem?"}</h3>
      {on
        ? <div className="grow">
            {[0,2,3].map(i => <span key={i} className="gitem coin"><img src={A.COINF[i]} alt=""/><b>₹{COINS[i].v}</b></span>)}
          </div>
        : <div className="gopts"><button className="gopt" onClick={() => { setOn(true); blip(980); }}>Show Rupi's idea</button></div>}
    </div></div>
  );
}
function WBarter({ blip }) {
  const [done,setDone] = useState(false);
  return (
    <div className="gpanel"><div className="in">
      <h3>{done ? "A fair trade — both are happy!" : "Tap to trade the apple for the pencil"}</h3>
      <div className="gopts">
        <button className="gopt" onClick={() => { setDone(true); blip(980); }}>🍎 Apple</button>
        <button className="gopt ghost" onClick={() => { setDone(true); blip(880); }}>✏️ Pencil</button>
      </div>
      {done && <div className="gverdict ok">I give you this apple, you give me this pencil. That is barter!</div>}
    </div></div>
  );
}
function WQuiz({ rounds, blip, heading }) {
  const [i,setI] = useState(0), [v,setV] = useState(null), [sc,setSc] = useState(0);
  const r = rounds[i % rounds.length];
  const answer = a => {
    const ok = a === r.a;
    setV(ok ? "ok" : "no");
    if (ok) { setSc(s => s + 1); blip(980); setTimeout(() => { setI(x => x + 1); setV(null); }, 1000); }
    else blip(320, "square");
  };
  return (
    <div className="gpanel"><div className="in">
      <h3>{heading}</h3>
      <div className="grow" style={{marginBottom:12}}>
        {r.img}
      </div>
      <div className="gopts">
        {r.opts.map(o => <button key={o} className="gopt" onClick={() => answer(o)}>{o}</button>)}
      </div>
      {v && <div className={"gverdict " + v}>{v === "ok"
        ? ("Yes! That's right." + (r.name ? " " + r.a + " — " + r.name + "." : ""))
        : "Not quite — look again and try once more."}</div>}
      <div className="gscore">Score {sc} · Round {i + 1}</div>
    </div></div>
  );
}
function WSort({ blip }) {
  const POOL = [
    { id:"c0", c:true, src:0, v:1 },  { id:"c2", c:true, src:2, v:5 },
    { id:"c3", c:true, src:3, v:10 }, { id:"n1", c:false, src:1, v:20 },
    { id:"n3", c:false, src:3, v:100 },{ id:"n5", c:false, src:5, v:500 },
  ];
  const [left,setLeft] = useState(POOL);
  const [bins,setBins] = useState({ coin:[], note:[] });
  const [sel,setSel] = useState(null);
  const [pv,setPv] = useState(null);
  const [msg,setMsg] = useState(null);
  const drop = bin => {
    if (!sel) return;
    const ok = (bin === "coin") === sel.c;
    if (ok) {
      setBins(b => ({ ...b, [bin]:[...b[bin], sel] }));
      setLeft(l => l.filter(x => x.id !== sel.id));
      setMsg("ok"); blip(960);
    } else { setMsg("no"); blip(320, "square"); }
    setSel(null);
    setTimeout(() => setMsg(null), 1100);
  };
  return (
    <div className="gpanel"><div className="in">
      <h3>Sort the currency into the right boxes</h3>
      <div className="sortwrap">
        {["coin","note"].map(b => (
          <div key={b} className={"bin" + (sel ? " over" : "")} onClick={() => drop(b)}>
            <h4>{b === "coin" ? "Coins" : "Notes"}</h4>
            <div className="drop">
              {bins[b].map(x => <img key={x.id} className={x.c ? "c" : ""} src={x.c ? A.COINF[x.src] : A.NOTEF[x.src]} alt={"₹"+x.v}/>)}
            </div>
          </div>
        ))}
      </div>
      <div className="pool">
        {left.map(x => (
          <img key={x.id} className={(x.c ? "c" : "") + (sel && sel.id === x.id ? " sel" : "")}
            src={x.c ? A.COINF[x.src] : A.NOTEF[x.src]} alt={"₹"+x.v}
            onClick={() => { setSel(sel && sel.id === x.id ? null : x); blip(720); }}/>
        ))}
      </div>
      {msg && <div className={"gverdict " + msg}>{msg === "ok" ? "Correct — into the box it goes!" : "Not that box. Try the other one."}</div>}
      {!left.length && <div className="gverdict ok">All sorted! Great teamwork, Money Organisers.</div>}
    </div></div>
  );
}
function WRecap({ blip }) {
  const K = [
    { k:"Barter", d:"Swapping one thing for another" },
    { k:"The problem", d:"Both people must want the trade" },
    { k:"Money", d:"Makes buying and selling easy" },
    { k:"Denomination", d:"The value written on the money" },
  ];
  const [on,setOn] = useState([]);
  return (
    <div className="gpanel"><div className="in">
      <h3>Why do people use money?</h3>
      <div className="gtiles">
        {K.map((t,i) => (
          <button key={t.k} className={"gtile" + (on.includes(i) ? " on" : "")}
            onClick={() => { setOn(o => o.includes(i) ? o : [...o, i]); blip(820 + i*70); }}>
            <b>{t.k}</b><span>{on.includes(i) ? t.d : "Tap to reveal"}</span>
          </button>
        ))}
      </div>
      {on.length === 4 && <div className="gverdict ok">To make buying and selling easier!</div>}
    </div></div>
  );
}


function WReveal({ q, ans, blip }) {
  const [on,setOn] = useState(false);
  return (
    <div className="gpanel"><div className="in">
      <h3>{q}</h3>
      {on ? <div className="gverdict ok">{ans}</div>
          : <div className="gopts"><button className="gopt" onClick={() => { setOn(true); blip(940); }}>Reveal the answer</button></div>}
    </div></div>
  );
}

function WSwap({ q, ans, blip }) {
  const THINGS = ["Tiffin food","Stickers","Pencils","Eraser"];
  const [on,setOn] = useState([]);
  const [show,setShow] = useState(false);
  return (
    <div className="gpanel"><div className="in">
      <h3>{q}</h3>
      {show && <div className="gverdict ok" style={{marginBottom:10}}>{ans}</div>}
      <p style={{margin:"0 0 10px",fontWeight:800,color:"#2C5375",fontSize:"clamp(11px,1.2cqw,16px)"}}>
        What have YOU swapped with a friend?</p>
      <div className="gtiles">
        {THINGS.map((t,i) => (
          <button key={t} className={"gtile" + (on.includes(i) ? " on" : "")}
            onClick={() => { setOn(o => o.includes(i) ? o : [...o, i]); setShow(true); blip(760 + i*70); }}>
            <b>{t}</b><span>{on.includes(i) ? "That's barter!" : "Tap"}</span>
          </button>
        ))}
      </div>
    </div></div>
  );
}

function WTrade4({ blip }) {
  const [step,setStep] = useState(0);
  return (
    <div className="gpanel"><div className="in">
      <h3>{step === 0 ? "Can they trade?" : step === 1 ? "Yes! Both of them want it." : "A fair trade — both are happy!"}</h3>
      <div className="gtiles" style={{gridTemplateColumns:"repeat(2,1fr)",marginBottom:10}}>
        <span className="gtile"><b>Boy has an apple</b><span>He wants a pencil</span></span>
        <span className="gtile"><b>Girl has a pencil</b><span>She wants an apple</span></span>
      </div>
      {step === 0 && (
        <div className="gopts">
          <button className="gopt" onClick={() => { setStep(1); blip(980); setTimeout(() => setStep(2), 900); }}>Yes</button>
          <button className="gopt ghost" onClick={() => blip(320,"square")}>No</button>
        </div>
      )}
      {step === 2 && <div className="gverdict ok">I give you this apple, you give me this pencil. That is <b>barter</b>!</div>}
    </div></div>
  );
}

function WTrade6({ blip }) {
  const CASES = [
    { a:"Farmer has wheat, wants milk", b:"Milk seller has milk, wants wheat", ok:true,  why:"Both want what the other has — the trade works!" },
    { a:"Farmer has wheat, wants milk", b:"Milk seller has milk, wants rice",  ok:false, why:"The milk seller doesn't want wheat — no trade." },
    { a:"Girl has a pencil, wants an apple", b:"Boy has an apple, wants a pencil", ok:true, why:"Both want the trade — it works!" },
  ];
  const [i,setI] = useState(0), [v,setV] = useState(null);
  const c = CASES[i];
  const answer = yes => {
    const right = yes === c.ok;
    setV(right ? "ok" : "no");
    blip(right ? 980 : 320, right ? "sine" : "square");
    if (right) setTimeout(() => { setI(x => (x + 1) % CASES.length); setV(null); }, 1600);
  };
  return (
    <div className="gpanel"><div className="in">
      <h3>Will this trade work?</h3>
      <div className="gtiles" style={{gridTemplateColumns:"repeat(2,1fr)",marginBottom:10}}>
        <span className="gtile"><b>Person A</b><span>{c.a}</span></span>
        <span className="gtile"><b>Person B</b><span>{c.b}</span></span>
      </div>
      <div className="gopts">
        <button className="gopt" onClick={() => answer(true)}>Yes</button>
        <button className="gopt ghost" onClick={() => answer(false)}>No</button>
      </div>
      {v && <div className={"gverdict " + v}>{v === "ok" ? c.why : "Look again — do BOTH people want the trade?"}</div>}
      <div className="gscore">Scenario {i + 1} of {CASES.length}</div>
    </div></div>
  );
}

function WRupee9({ blip }) {
  const PLACES9 = ["Price tags","Shops","Phones","Receipts"];
  const [on,setOn] = useState([]);
  return (
    <React.Fragment>
      <div className="gpanel"><div className="in">
        <h3>Where have you seen the ₹ symbol?</h3>
        <div className="gtiles">
          {PLACES9.map((p,i) => (
            <button key={p} className={"gtile" + (on.includes(i) ? " on" : "")}
              onClick={() => { setOn(o => o.includes(i) ? o : [...o, i]); blip(760 + i*70); }}>
              <b>{p}</b><span>{on.includes(i) ? "Yes!" : "Tap"}</span>
            </button>
          ))}
        </div>
      </div></div>
    </React.Fragment>
  );
}

export { WBarter, WCoins, WCompare, WConcept, WIdea, WNotes, WQuiz, WRecap, WReveal, WRupee, WRupee9, WSort, WSwap, WTrade4, WTrade6 };
