/* ════════ data/notesContent.js — Scene 12 "Meet the Notes" ════════
   Words only (blueprint §3, Scene 12). No extra facts about the notes are
   stated — only their denominations and the lesson's teaching point. */

const SCENE12 = {
  n: 12,
  title: 'Meet the Notes',
  intro: 'These are the notes.',
  instruction: 'Tap a note to inspect it.',
  /* the teaching point, said once the class has looked at a couple of notes */
  rule: [{ t: 'Notes are paper money. ' }, { t: 'Different notes', em: true }, { t: ' have different values.' }],
  /* i = index into the supplied note assets (A.NOTEF / A.NOTEB) */
  notes: [
    { v: 10, i: 0 }, { v: 20, i: 1 }, { v: 50, i: 2 },
    { v: 100, i: 3 }, { v: 200, i: 4 }, { v: 500, i: 5 },
  ],
  teacher: {
    objective: 'Recognise the notes: ₹10, ₹20, ₹50, ₹100, ₹200 and ₹500 — notes are paper money with different values.',
    question: 'What number is written on this note?',
    expected: 'Its value — for example ₹50. Different notes have different values.',
    cue: 'Tap a note. Ask the class to read its number before you flip it over.',
  },
  watchCue: 'Let Rupi introduce the notes. Ask: "Where have you seen notes like these?"',
};

export { SCENE12 };
