/* ════════ data/introContent.js — Scenes 02, 03 & 04 educational content ════════
   Words only, from the lesson source (docs/MONEY_QUEST_UNIFIED_MASTER_BLUEPRINT.md
   §3 "Content truth") and the lines these scenes already used. No positions, no timings. */

const SCENE02 = {
  n: 2,
  title: 'The 1-Minute Video Hook',
  slate: 'The 1-Minute Video Hook',
  farmer: ['I have plenty of wheat!', 'But I need some fresh milk.'],
  seller: ["Hmm… I don't need wheat!", 'I already have plenty.'],
  labels: { wheat: 'WHEAT', milk: 'MILK', works: '' },
  question: 'What was the problem?',
  choices: [
    { id: 'a', label: 'The farmer had no wheat.' },
    { id: 'b', label: "The milk seller didn't want wheat.", correct: true },
  ],
  feedback: {
    correct: "Yes! The milk seller didn't want wheat, so the trade could not happen.",
    retry: "Think again. Who didn't want the wheat?",
  },
  takeaway: "The trade got stuck: the milk seller didn't want wheat.",
  teacher: {
    objective: 'Notice that a trade can fail when one person does not want what the other offers.',
    explain: 'The farmer came with wheat to get milk. The milk seller already has wheat, so the milk seller says no. Nobody got what they wanted.',
    question: 'What was the problem?',
    expected: 'The milk seller did not want wheat, so the trade could not happen easily.',
    cue: 'Let the film play without talking. When the question appears, ask the class before anyone taps.',
    takeaway: "A trade gets stuck when the other person doesn't want what you have.",
  },
  watchCue: 'Just watch. Ask afterwards: "What was the farmer trying to get?"',
};

const SCENE03 = {
  n: 3,
  title: 'What Did People Do Before Money?',
  rupiAsk: 'What did people do before money?',
  farmer: ['I have wheat.', 'Can I get some milk?'],
  seller: ['I have milk.'],
  swap: 'They exchanged things with each other.',
  word: 'BARTER',
  definition: 'Exchanging one thing for another.',
  labels: { wheat: 'WHEAT', milk: 'MILK', works: 'BARTER · exchanging one thing for another' },
  rupiRule: [[{ t: 'BARTER', em: true }, { t: ' means' }], 'exchanging one thing for another.'],
  question: 'What did people do before money?',
  choices: [
    { id: 'a', label: 'They kept everything for themselves.' },
    { id: 'b', label: 'They exchanged things with each other.', correct: true },
  ],
  feedback: {
    correct: 'Correct! People used barter — exchanging one thing for another.',
    retry: 'Think about how people got what they needed in the old days!',
  },
  /* the class's own swaps (lesson source examples) */
  friendsAsk: 'What have you swapped with a friend?',
  swaps: [
    { id: 'tiffin', label: 'Tiffin food' },
    { id: 'stickers', label: 'Stickers' },
    { id: 'pencil', label: 'Pencils' },
    { id: 'eraser', label: 'Eraser' },
  ],
  swapSaid: 'That is barter too!',
  takeaway: 'Barter = exchanging one thing for another.',
  teacher: {
    objective: 'Say that before money, people used barter — exchanging one thing for another.',
    explain: 'Long ago there were no coins or notes. If you had wheat and needed milk, you swapped them. This swapping is called barter.',
    question: 'What did people do before money?  ·  Then: "What have you swapped with a friend?"',
    expected: 'They exchanged things with each other (barter).  ·  Tiffin food, stickers, pencils, an eraser.',
    cue: 'After the answer, ask the class about their own swaps. Tap each thing a child names.',
    takeaway: 'Barter = exchanging one thing for another.',
  },
  watchCue: 'Watch the wheat and the milk. Ask: "What are they doing with their things?"',
};

const SCENE04 = {
  n: 4,
  title: "Let's Try Barter!",
  boy: ['I have an apple.', 'I want a pencil.'],
  girl: ['I have a pencil.', 'I want an apple.'],
  offer: ['I give you this apple,', 'you give me this pencil.'],
  labels: { apple: 'APPLE', pencil: 'PENCIL' },
  prompt: { start: 'Tap the apple, then the pencil, to trade', pencil: 'Now tap the pencil', apple: 'Now tap the apple' },
  called: 'This is called barter!',
  q1: {
    question: 'Does this barter work?',
    choices: [
      { id: 'a', label: 'YES — both want what the other has', correct: true },
      { id: 'b', label: 'NO' },
    ],
    feedback: {
      correct: 'Yes! Both children want what the other has, so the trade works.',
      retry: 'Look again: does the boy want the pencil? Does the girl want the apple?',
    },
  },
  q2: {
    question: 'What is barter?',
    choices: [
      { id: 'a', label: 'Buying something with money.' },
      { id: 'b', label: 'Exchanging one thing for another.', correct: true },
    ],
    feedback: {
      correct: 'Correct! Barter means exchanging one thing for another.',
      retry: 'Not quite — did the children use any money?',
    },
  },
  rule: [{ t: 'Barter works when ' }, { t: 'BOTH', em: true }, { t: ' people want what the other has.' }],
  teacher: {
    objective: 'See a barter that works: both people want what the other has.',
    explain: 'The boy has an apple and wants a pencil. The girl has a pencil and wants an apple. Each one wants what the other has, so the swap works.',
    question: 'Does this barter work?  ·  Then: "What is barter?"',
    expected: 'Yes — both want the other\'s item.  ·  Exchanging one thing for another.',
    cue: 'Let a child come up and tap the apple, then the pencil. Ask the YES / NO question before tapping an answer.',
    takeaway: 'Barter works when both people want what the other has.',
  },
  watchCue: 'Ask: "What does the boy have? What does he want?"',
};

export { SCENE02, SCENE03, SCENE04 };
