/* ════════ data/barterContent.js — Scenes 05 & 06 educational content ════════
   Words only. No positions, no timings — those live with the staging. */

const FARMER_LINE = ['I have wheat.', 'I want milk.'];
/* `em` marks the words the teaching moment highlights */
const SELLER_LINE = [{ t: 'I have milk,' }, { t: 'but I ' }, { t: "don't want wheat.", em: true }];

const SCENE05 = {
  n: 5,
  title: 'Uh-Oh! A Problem',
  question: "Why didn't the trade work?",
  choices: [
    { id: 'a', label: "The seller didn't want wheat", correct: true },
    { id: 'b', label: "The farmer didn't have money" },
  ],
  feedback: {
    correct: "Yes! The milk seller didn't want wheat, so the trade could not happen.",
    retry: 'Not quite. Listen to the milk seller again — did the seller want the wheat?',
  },
  teacher: {
    objective: 'Understand why barter can fail.',
    explain: 'Same farmer, same milk seller. The farmer still wants milk, but the milk seller still does not want wheat — so there is no trade.',
    takeaway: 'Barter does not always work easily: the other person may not want what we have.',
    question: "Why didn't the trade work?",
    expected: "The seller didn't want wheat.",
    cue: 'Ask students to explain the problem before revealing the answer.',
  },
  watchCue: 'Let the scene play. Ask: "What is the farmer trying to do?"',
};

const SCENE06 = {
  n: 6,
  title: 'Both People Must Want the Trade',
  question: 'When does barter work?',
  choices: [
    { id: 'a', label: 'Only one person wants the trade' },
    { id: 'b', label: 'Both people want what the other has', correct: true },
  ],
  feedback: {
    correct: 'Correct! Both people must want what the other person has.',
    retry: 'Think again. The farmer wanted milk — but did the milk seller want wheat?',
  },
  /* the rule, spoken by Rupi once the class has it; `em` = BOTH emphasis */
  rule: [{ t: 'Barter works when ' }, { t: 'BOTH', em: true }, { t: ' people want what the other person has.' }],
  labels: { wheat: 'WHEAT', milk: 'MILK', works: 'BOTH want it — the trade works!' },
  teacher: {
    objective: 'Understand that barter works only when both people want what the other has.',
    explain: 'One person wanting the trade is not enough — both people must want it.',
    takeaway: 'Barter works when BOTH people want what the other person has.',
    question: 'When does barter work?',
    expected: 'Both people want what the other person has.',
    cue: 'Point to the ✕. Ask: "Did both people want this trade?" Then take answers.',
  },
  watchCue: 'Follow the wheat. Ask: "What does the farmer want? What does the milk seller want?"',
};

export { FARMER_LINE, SCENE05, SCENE06, SELLER_LINE };
