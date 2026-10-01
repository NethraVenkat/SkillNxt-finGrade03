/* ════════ data/quickGameContent.js — Scene 15 "Rupi's Quick Money Game" ════════
   From the blueprint: five rounds of rapid identification, difficulty rising;
   round 1 is ₹5 with options ₹1 / ₹5 / ₹10; a score tracker; correct → a star
   and Rupi celebrates; incorrect → a helpful correction without shaming.
   The instruction and prompt are the project's own ("Five quick rounds. Call
   out the answer, then tap it!", "Which denomination is this?"). No other facts. */

const SCENE15 = {
  n: 15,
  title: "Rupi's Quick Money Game",
  kicker: "Rupi's quick money game",
  question: 'Which denomination is this?',
  lines: {
    intro: 'Five quick rounds. Call out the answer, then tap it!',
    wrong: 'Look at the number printed on it.',
    right: v => 'Yes — ₹' + v + '!',
    done: 'Five stars! You named every value.',
  },
  /* i = index into the supplied assets (A.COINF: ₹1 ₹2 ₹5 ₹10 ₹20; A.NOTEF: ₹10 ₹20 ₹50 ₹100 ₹200 ₹500).
     mark = where the printed value sits on the front face (centre x, centre y, w, h — fractions) */
  rounds: [
    { v: 5,   kind: 'coin', i: 2, opts: [1, 5, 10],     mark: [0.5, 0.73, 0.36, 0.27] },
    { v: 20,  kind: 'note', i: 1, opts: [10, 20, 50],   mark: [0.757, 0.69, 0.21, 0.18] },
    { v: 10,  kind: 'coin', i: 3, opts: [5, 10, 20],    mark: [0.5, 0.8, 0.42, 0.21] },
    { v: 200, kind: 'note', i: 4, opts: [100, 200, 500], mark: [0.79, 0.7, 0.23, 0.18] },
    { v: 2,   kind: 'coin', i: 1, opts: [1, 2, 5],      mark: [0.5, 0.78, 0.34, 0.24] },
  ],
  teacher: {
    objective: 'Quickly identify the denomination of coins and notes.',
    question: 'Which denomination is this?',
    expected: '₹5 · ₹20 · ₹10 · ₹200 · ₹2 — the value printed on each one.',
    cue: 'Five quick rounds. Ask the class to call out the value together, then tap it. A wrong tap shows where the value is printed.',
  },
  watchCue: 'Rupi sets up his game. Ask: "Where do we look to find the value?"',
};

export { SCENE15 };
