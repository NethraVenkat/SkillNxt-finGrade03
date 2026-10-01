/* ════════ data/denominationContent.js — Scene 14 "What is the Denomination?" ════════
   Words only, from the lesson: "The denomination is the value written on the
   money." Examples ₹1, ₹5, ₹20, ₹100. Question: "What is the denomination of
   this money?" No other facts about the money are stated. */

const SCENE14 = {
  n: 14,
  title: 'What is the Denomination?',
  rule: 'The denomination is the value written on the money.',
  kicker: 'The value reveal',
  question: 'What is the denomination of this money?',
  lines: {
    notice: 'Look — money!',
    look: 'Look at the value written on it.',
    wrong: 'Look at the value again.',
    right: 'Yes — ₹100!',
  },
  /* the four examples. i = index into the supplied assets (A.COINF/COINB: ₹1 ₹2 ₹5 ₹10 ₹20;
     A.NOTEF/NOTEB: ₹10 ₹20 ₹50 ₹100 ₹200 ₹500). face = the side the value is printed on;
     mark = where that value sits on that face (fractions of the face: centre x, centre y, w, h) */
  examples: [
    { v: 1,   kind: 'coin', i: 0, face: 'front', mark: [0.5, 0.73, 0.36, 0.27] },
    { v: 5,   kind: 'coin', i: 2, face: 'front', mark: [0.5, 0.73, 0.36, 0.27] },
    { v: 20,  kind: 'coin', i: 4, face: 'back',  mark: [0.5, 0.855, 0.44, 0.19] },
    { v: 100, kind: 'note', i: 3, face: 'front', mark: [0.805, 0.665, 0.23, 0.17] },
  ],
  /* the money the class is asked about, and the values they may answer with */
  askAbout: 100,
  choices: [1, 5, 20, 100],
  teacher: {
    objective: 'Understand that denomination means the value written on money.',
    question: 'What is the denomination of this money?',
    expected: 'The value written on the money — here, ₹100.',
    cue: 'Key point: "The denomination is the value written on the money." Examples: ₹1, ₹5, ₹20, ₹100. Ask the class to read the number before anyone taps.',
  },
  watchCue: 'Let Rupi reveal the values: ₹1, ₹5, ₹20, ₹100. Ask: "Where is the value written?"',
};

export { SCENE14 };
