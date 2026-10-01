import React from 'react';
import { Coin, Rupi } from './characterData';
import { Explore } from '../pages/Explore';
import { Home } from '../pages/Home';
/* ════════ data/lessonData.js ════════ */
const LESSON = {
  brand:"Money Quest", course:"Grade 3 Financial Literacy", module:"Module 1 • Class 1",
  title:"Why People Use Money & Denominations", minutes:40,
};
const SCENES = [
  { n:1,  t:"Welcome to Money Adventure",       k:"Explore",    m:1 },
  { n:2,  t:"The 1-Minute Video Hook",          k:"Story film", m:1 },
  { n:3,  t:"What Did People Do Before Money?", k:"Barter",     m:2 },
  { n:4,  t:"Let's Try Barter!",                k:"Activity",   m:2 },
  { n:5,  t:"Uh-Oh! A Problem",                 k:"Story",      m:2 },
  { n:6,  t:"Both People Must Want the Trade",  k:"Compare",    m:2 },
  { n:7,  t:"Rupi Has an Idea!",                k:"Reveal",     m:2 },
  { n:8,  t:"Why Do We Use Money?",             k:"Concept",    m:2 },
  { n:9,  t:"Meet the Rupee",                   k:"Visual",     m:2 },
  { n:10, t:"Meet the Coins",                   k:"Explore",    m:3 },
  { n:11, t:"₹10 and ₹20 Can Be Coins or Notes", k:"Compare",   m:1 },
  { n:12, t:"Meet the Notes",                   k:"Explore",    m:3 },
  { n:13, t:"Coin or Note?",                    k:"Activity",   m:2 },
  { n:14, t:"What is the Denomination?",        k:"Concept",    m:2 },
  { n:15, t:"Rupi's Quick Money Game",          k:"Game",       m:3 },
  { n:16, t:"Classroom Challenge Intro",        k:"Challenge",  m:1 },
  { n:17, t:"Team Money Sort",                  k:"Activity",   m:5 },
  { n:18, t:"Final Recap",                      k:"Recap",      m:2 },
];

/* hotspot geometry, measured from the reference plate (1355 × 778) */
const PL = { w:1355, h:778 };
const pct = (v,ax) => (v / (ax === "x" ? PL.w : PL.h)) * 100 + "%";
const ICON_CX = { shop:572, market:695, home:807, wallet:916, canteen:1025 };
const ICON_CY = 436, ICON_R = 52;
const SIGN_Y  = { shop:[100,157], market:[164,221], home:[229,286], wallet:[291,349], canteen:[354,411] };
const SIGN_X  = [1172,1355];
const PLACES = [
  { id:"shop",    label:"Shop"    },
  { id:"market",  label:"Market"  },
  { id:"home",    label:"Home"    },
  { id:"wallet",  label:"Wallet"  },
  { id:"canteen", label:"Canteen" },
];
const PLACE_LINE = {
  shop:"At the shop we pay the shopkeeper with money.",
  market:"At the market, people buy vegetables with rupees.",
  home:"At home, money is kept safe in a purse or a box.",
  wallet:"A wallet holds notes and coins.",
  canteen:"In the school canteen we pay for snacks.",
};
const TEACHER_NOTES = [
  "Welcome the class. Point at Rupi on the screen.",
  "Read Rupi's line aloud, then ask: “Where have you seen money?”",
  "Take 3–4 answers from students BEFORE tapping any picture.",
  "Tap each place as students name it — Shop, Market, Home, Wallet, Canteen.",
  "Finish by tapping the ₹ coin. Say: “This is our money — the rupee.”",
];

export { ICON_CX, ICON_CY, ICON_R, LESSON, PL, PLACES, PLACE_LINE, SCENES, SIGN_X, SIGN_Y, TEACHER_NOTES, pct };
