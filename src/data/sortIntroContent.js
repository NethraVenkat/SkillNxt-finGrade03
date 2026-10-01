/* ════════ data/sortIntroContent.js — Scene 16 "Classroom Challenge Intro" ════════
   From the blueprint: title "Money Sorting Challenge!"; Rupi: "Now YOU become
   Money Organisers!"; a mixed money pile; piles ₹1 ₹2 ₹5 ₹10 ₹20 ₹50 ₹100 ₹200
   ₹500; question "How do you know which pile it belongs in?"; expected: look at
   the number / denomination. "Work together!" is the project's own prompt. */

const SCENE16 = {
  n: 16,
  title: 'Classroom Challenge Intro',
  sign: 'Money Sorting Challenge!',
  lines: {
    rupi: 'Now YOU become Money Organisers!',
    ask: 'How do you know which pile it belongs in?',
    wrong: 'Look at the number printed on it.',
    right: 'Look at the number — the denomination!',
    done: 'Work together!',
  },
  /* the nine piles, in order */
  piles: [1, 2, 5, 10, 20, 50, 100, 200, 500],
  /* the mixed pile on the counter — supplied assets only (A.COINF: ₹1 ₹2 ₹5 ₹10 ₹20; A.NOTEF: ₹10 ₹20 ₹50 ₹100 ₹200 ₹500) */
  pile: [
    { kind: 'note', i: 5 }, { kind: 'coin', i: 0 }, { kind: 'note', i: 1 }, { kind: 'coin', i: 3 }, { kind: 'note', i: 3 },
    { kind: 'coin', i: 1 }, { kind: 'coin', i: 4 }, { kind: 'note', i: 4 }, { kind: 'coin', i: 2 }, { kind: 'note', i: 0 },
  ],
  /* the one Rupi lifts out and asks about */
  demo: { v: 50, kind: 'note', i: 2, mark: [0.766, 0.7, 0.21, 0.18] },
  teacher: {
    objective: 'Introduce the money sorting challenge: every piece goes into the pile for its denomination.',
    question: 'How do you know which pile it belongs in?',
    expected: 'Look at the number — the denomination.',
    cue: 'Show the mixed pile and the nine piles (₹1 to ₹500). Ask the question before anyone taps a tray.',
  },
  watchCue: 'Rupi sets up the challenge. Ask: "What do you think we are going to do with all this money?"',
};

export { SCENE16 };
