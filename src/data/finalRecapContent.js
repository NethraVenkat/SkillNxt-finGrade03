/* ════════ data/finalRecapContent.js — Scene 18 "Final Recap" ════════
   Words only, from the blueprint: four ideas (BARTER · THE PROBLEM · MONEY ·
   DENOMINATIONS, each with its line); Rupi: "You are now Money Explorers!";
   final question "Why do people use money?"; expected "To make buying and
   selling easier!". Each idea is shown by the story world itself (barter →
   failed trade → money → denominations). */

const SCENE18 = {
  n: 18,
  title: 'Final Recap',
  sign: 'Final Recap',
  ideas: [
    { key: 'barter',  word: 'BARTER',        line: 'People exchanged things.' },
    { key: 'problem', word: 'THE PROBLEM',   line: 'The other person may not want what we have.' },
    { key: 'money',   word: 'MONEY',         line: 'Money makes buying and selling easier.' },
    { key: 'denoms',  word: 'DENOMINATIONS', line: 'Coins and notes have different values.' },
  ],
  explorers: 'You are now Money Explorers!',
  question: 'Why do people use money?',
  answer: 'To make buying and selling easier!',
  reveal: 'Show the answer',
  /* what drops into each of the nine piles (supplied assets: A.COINF ₹1 ₹2 ₹5 ₹10 ₹20 · A.NOTEF ₹10 ₹20 ₹50 ₹100 ₹200 ₹500) */
  sorted: [
    { v: 1, kind: 'coin', i: 0 }, { v: 2, kind: 'coin', i: 1 }, { v: 5, kind: 'coin', i: 2 }, { v: 10, kind: 'coin', i: 3 }, { v: 20, kind: 'coin', i: 4 },
    { v: 50, kind: 'note', i: 2 }, { v: 100, kind: 'note', i: 3 }, { v: 200, kind: 'note', i: 4 }, { v: 500, kind: 'note', i: 5 },
  ],
  teacher: {
    objective: 'Recap the four ideas — barter, the problem with barter, money, denominations — and answer: why do people use money?',
    question: 'Why do people use money?',
    expected: 'To make buying and selling easier!',
    cue: 'Walk through the four ideas with Rupi. Ask the class the final question and let them answer aloud before you press "Show the answer".',
  },
};

export { SCENE18 };
