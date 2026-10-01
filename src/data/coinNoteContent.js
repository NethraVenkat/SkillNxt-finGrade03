/* ════════ data/coinNoteContent.js — Scene 13 "Coin or Note?" ════════
   Words only (blueprint: Scene 13 — ₹5 → coin, ₹100 → note, ₹10 → both
   possible). No facts beyond the lesson's own: ₹10 and ₹20 come as a coin
   and as a note (Scene 11); notes are paper money (Scene 12). */

const SCENE13 = {
  n: 13,
  title: 'Coin or Note?',
  kicker: 'Money inspection',
  question: 'Is it a coin or a note?',
  lines: {
    look: 'Look carefully!',
    canCoin: 'This can be a coin…',
    orNote: '…or a note!',
    wrong: 'Look at the value again.',
    right: { coin: 'Yes — a coin!', note: 'Yes — a note!', both: 'Both! It can be a coin or a note.' },
    next: 'Here is another one.',
    done: 'You can tell coins from notes!',
  },
  answers: { coin: 'Coin', note: 'Note', both: 'Both' },
  /* i = index into the supplied assets: A.COINF/COINB (₹1 ₹2 ₹5 ₹10 ₹20),
     A.NOTEF/NOTEB (₹10 ₹20 ₹50 ₹100 ₹200 ₹500) */
  rounds: [
    { v: 5,   answer: 'coin', items: [{ kind: 'coin', i: 2 }] },
    { v: 100, answer: 'note', items: [{ kind: 'note', i: 3 }] },
    { v: 10,  answer: 'both', staged: true, items: [{ kind: 'coin', i: 3 }, { kind: 'note', i: 0 }] },
    { v: 20,  answer: 'both', items: [{ kind: 'coin', i: 4 }, { kind: 'note', i: 1 }] },
    { v: 200, answer: 'note', items: [{ kind: 'note', i: 4 }] },
  ],
  teacher: {
    objective: 'Tell whether a money object is a coin or a note. ₹10 and ₹20 come as both a coin and a note.',
    question: 'Is it a coin or a note?',
    expected: '₹5 coin · ₹100 note · ₹10 both · ₹20 both · ₹200 note.',
    cue: 'Ask the class to call out "coin", "note" or "both" together before anyone taps.',
  },
  watchCue: 'Watch Rupi find the money on his table. Ask: "What do you notice?"',
};

export { SCENE13 };
