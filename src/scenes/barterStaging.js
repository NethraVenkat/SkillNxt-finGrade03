import A from '../assets/index';

/* ════════ scenes/barterStaging.js — where things stand in the market ════════
   Shared by Scenes 05–08 because they are one continuous take.
   x = % of stage width (actor centre), y = % of stage height from the floor
   (feet), h = % of stage height. Two compositions: wide and tall (phone). */

const CAST = {
  farmer: { src: A.CH.farmer, alt: 'Farmer holding a bundle of wheat', ratio: 429 / 978,
            /* where the wheat sits inside the artwork (fraction of width from centre, of height from top) */
            prop: { dx: 0.2, dy: 0.37 } },
  seller: { src: A.CH.milk, alt: 'Milk seller holding a milk can', ratio: 414 / 978,
            prop: { dx: 0.0, dy: 0.55 } },   /* upper body of the can: keeps the ✕ clear of the question */
  rupi:   { src: A.CH.rupi, alt: 'Rupi', ratio: 459 / 1059 },
};

const SPOTS = {
  wide: {
    farmer: { home: { x: 23, y: 4, h: 70 }, step: { x: 28, y: 4, h: 70 }, near: { x: 52, y: 4, h: 70 }, left: { x: 22, y: 4, h: 70 },
              aside: { x: 12, y: 4, h: 70 }, mid: { x: 57, y: 4, h: 70 } },
    seller: { home: { x: 77, y: 4, h: 70 }, right: { x: 78, y: 4, h: 70 } },
    rupi:   { off: { x: 118, y: 2, h: 50 }, centre: { x: 50, y: 2, h: 50 }, aside: { x: 24.5, y: 2, h: 50 }, stall: { x: 28, y: 2, h: 50 } },
    bubbleW: 27, ruleW: 44,
    /* Scenes 07–08: money and the things it buys. Props rest on two small wooden
       crates (the left one becomes the fruit stall in 08). */
    money: { enter: { x: 112, y: 96 }, hub: { x: 50, y: 80 }, coin: 11, note: 10.5, lift: 8, prop: 12, ideaS: 1.25,
             crateL: { x: 10, y: 0, w: 17, h: 11 }, crateR: { x: 91, y: 0, w: 14, h: 10 },
             toy: { x: 10, y: 11 }, book: { x: 91, y: 10 }, mango: { x: 10.5, y: 11 }, tag: { x: 16.5, y: 11 }, stallCoin: { x: 5, y: 11 } },
  },
  tall: {
    farmer: { home: { x: 24, y: 30, h: 40 }, step: { x: 29, y: 30, h: 40 }, near: { x: 44, y: 30, h: 40 }, left: { x: 22, y: 30, h: 40 }, mid: { x: 52, y: 30, h: 40 } },
    seller: { home: { x: 76, y: 30, h: 40 }, right: { x: 78, y: 30, h: 40 }, far: { x: 84, y: 30, h: 40 } },
    rupi:   { off: { x: 140, y: 30, h: 30 }, centre: { x: 50, y: 30, h: 30 }, stall: { x: 30, y: 30, h: 30 } },
    bubbleW: 46, ruleW: 88,
    money: { enter: { x: 115, y: 96 }, hub: { x: 50, y: 89 }, coin: 8, note: 8, lift: 6, prop: 8, ideaS: 1.04,
             crateL: { x: 12, y: 27, w: 22, h: 6 }, crateR: { x: 88, y: 27, w: 20, h: 6 },
             toy: { x: 12, y: 33 }, book: { x: 88, y: 33 }, mango: { x: 10, y: 33 }, tag: { x: 18, y: 33 }, stallCoin: { x: 8, y: 23 } },   /* phones: on the ground in front of the stall, clear of the mango */
  },
};

/* width of an actor in cqw for the current stage aspect */
const widthOf = (who, pos, aspect) => (pos.h * CAST[who].ratio) / aspect;

/* the held prop (wheat / milk can) in stage coordinates: x cqw, y cqh from floor */
function propPoint(who, pos, aspect) {
  const p = CAST[who].prop;
  return { x: pos.x + p.dx * widthOf(who, pos, aspect), y: pos.y + pos.h * (1 - p.dy) };
}

/* camera focus helpers (camera y is measured from the top) */
const faceOf = pos => ({ x: pos.x, y: 100 - (pos.y + pos.h * 0.78) });
const torsoOf = pos => ({ x: pos.x, y: 100 - (pos.y + pos.h * 0.6) });
const between = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const topPt = pt => ({ x: pt.x, y: 100 - pt.y });

export { CAST, SPOTS, between, faceOf, propPoint, topPt, torsoOf, widthOf };
