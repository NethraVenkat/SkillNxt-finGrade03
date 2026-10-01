/* ════════ data/rupeeContent.js — Scenes 09, 10 & 11 educational content ════════
   Words only, from the lesson source (docs/MONEY_QUEST_UNIFIED_MASTER_BLUEPRINT.md
   §3) and the lines these scenes already used. Currency indices refer to the
   supplied artwork: coins [₹1, ₹2, ₹5, ₹10, ₹20], notes [₹10, ₹20, ₹50, ₹100, ₹200, ₹500]. */

const SCENE09 = {
  n: 9,
  title: 'Meet the Rupee',
  lines: {
    name: [[{ t: 'Our Indian money is called the ' }, { t: 'Rupee', em: true }, { t: '.' }]],
    symbol: ['And it has its own special symbol:', [{ t: 'the ' }, { t: '₹', em: true }, { t: ' sign.' }]],
    means: ['Whenever you see ₹ before a number,', 'it means Indian Rupees.'],
    values: 'These are Indian coins and notes.',
    ask: 'Have you seen this ₹ symbol before? Where?',
    say: 'Say it with me — Rupee!',
    said: 'Wonderful! Rupee — that\'s our money.',
  },
  /* the complete collection of Indian money used in this lesson (supplied artwork) */
  coins: [
    { kind: 'coin', i: 0, v: 1, name: 'One Rupee' },
    { kind: 'coin', i: 1, v: 2, name: 'Two Rupees' },
    { kind: 'coin', i: 2, v: 5, name: 'Five Rupees' },
    { kind: 'coin', i: 3, v: 10, name: 'Ten Rupees' },
    { kind: 'coin', i: 4, v: 20, name: 'Twenty Rupees' },
  ],
  notes: [
    { kind: 'note', i: 0, v: 10, name: 'Ten Rupees' },
    { kind: 'note', i: 1, v: 20, name: 'Twenty Rupees' },
    { kind: 'note', i: 2, v: 50, name: 'Fifty Rupees' },
    { kind: 'note', i: 3, v: 100, name: 'One Hundred Rupees' },
    { kind: 'note', i: 4, v: 200, name: 'Two Hundred Rupees' },
    { kind: 'note', i: 5, v: 500, name: 'Five Hundred Rupees' },
  ],
  groups: { coins: 'COINS', notes: 'NOTES', total: 'INDIAN MONEY = COINS + NOTES' },
  board: { symbol: '₹', means: 'Indian Rupees', example: '₹10', exampleSays: 'Ten Rupees' },
  question: 'Have you seen this ₹ symbol before? Where?',
  kicker: 'Tap what the class says',
  places: [
    { id: 'tag', icon: '🏷️', label: 'Price tags', say: 'Yes! We can see the ₹ symbol on price tags.' },
    { id: 'shop', icon: '🏪', label: 'Shops', say: 'Yes! Shop signs show prices with ₹.' },
    { id: 'phone', icon: '📱', label: 'Phones', say: 'Yes! Your phone shows ₹ when you pay.' },
    { id: 'receipt', icon: '🧾', label: 'Receipts', say: 'Yes! A receipt lists every price with ₹.' },
  ],
  sayButton: 'Rupee!',
  takeaway: '₹ means Indian Rupees.',
  teacher: {
    objective: 'Know that Indian money is the Rupee, recognise the ₹ symbol, and see that Indian money = coins + notes.',
    explain: 'Every amount of Indian money uses this sign — ₹. When you see ₹ before a number, it means Indian Rupees.',
    question: 'Have you seen this ₹ symbol before? Where?',
    expected: 'Price tags · shops · phones · receipts.',
    cue: 'Take answers from the class and tap each place they name. Then say "Rupee!" together.',
    takeaway: '₹ means Indian Rupees.',
  },
  watchCue: 'Point to the ₹ on the board, then on the money. Ask: "Where else is this sign?"',
};

const SCENE10 = {
  n: 10,
  title: 'Meet the Coins',
  lines: {
    intro: 'Now let\'s meet our coins!',
    look: 'Every coin is a little different — look at them closely.',
    tap: 'Tap a coin to learn more!',
    denom: ['Each one has a number on it.', [{ t: 'That number is the ' }, { t: 'denomination', em: true }, { t: '.' }]],
    ask: 'Which coin has the biggest value?',
    right: 'Yes! ₹20 has the biggest value.',
    wrong: 'Look carefully at the numbers on the coins.',
    done: 'The number on a coin tells us its value.',
  },
  /* all five coins, in order */
  coins: [
    { i: 0, v: 1, name: 'One Rupee' },
    { i: 1, v: 2, name: 'Two Rupees' },
    { i: 2, v: 5, name: 'Five Rupees' },
    { i: 3, v: 10, name: 'Ten Rupees' },
    { i: 4, v: 20, name: 'Twenty Rupees' },
  ],
  question: 'Which coin has the biggest value?',
  kicker: 'Tap the coin',
  denomWord: 'DENOMINATION',
  denomLine: 'The number on the coin tells us its value.',
  takeaway: 'The number on a coin tells us its value.',
  teacher: {
    objective: 'Recognise all five coins — ₹1, ₹2, ₹5, ₹10, ₹20. The number on a coin is its denomination — its value.',
    explain: 'Each coin has a number on it. That number is the denomination — the value of the coin.',
    question: 'Which coin has the biggest value?',
    expected: '₹20.',
    cue: 'Let children tap coins to pick them up and turn them over first. Then ask which coin has the biggest value.',
    takeaway: 'The number on a coin tells us its value.',
  },
  watchCue: 'Ask: "What is different about each coin?" Point to the numbers.',
};

const SCENE11 = {
  n: 11,
  title: '₹10 and ₹20 Can Be Coins or Notes',
  lines: {
    coin10: 'The ₹10 coin from the coin gallery…',
    note10: [[{ t: '…and look — a ₹10 ' }, { t: 'note', em: true }, { t: '.' }]],
    both10: ['₹10 can be a coin or a note.', 'Each one is worth ₹10.'],
    right10: 'Both are worth ₹10! Same value, different form.',
    coin20: [[{ t: 'Now look — a ' }, { t: '₹20 coin', em: true }, { t: '…' }]],
    note20: [[{ t: '…and a ' }, { t: '₹20 note', em: true }, { t: '.' }]],
    both20: ['₹20 can be a coin or a note too.', 'Both are worth ₹20.'],
    compare: 'So are ₹10 and ₹20 worth the same?',
    done: 'No! ₹10 and ₹20 are different values.',
  },
  pieces: {
    c10: { kind: 'coin', i: 3, v: 10, label: '₹10 coin' },
    n10: { kind: 'note', i: 0, v: 10, label: '₹10 note' },
    c20: { kind: 'coin', i: 4, v: 20, label: '₹20 coin' },
    n20: { kind: 'note', i: 1, v: 20, label: '₹20 note' },
  },
  form: { coin: 'COIN', note: 'NOTE' },
  same: 'SAME VALUE',
  sameSub: 'different form',
  differ: 'DIFFERENT VALUE',
  q0: {
    question: 'Can ₹10 be a coin or a note?',
    tags: [{ id: 'yes', label: 'Yes', correct: true }, { id: 'no', label: 'No' }],
    wrong: 'Look at the counter: a ₹10 coin and a ₹10 note.',
  },
  q2: {
    question: 'Can ₹20 be a coin or a note?',
    tags: [{ id: 'yes', label: 'Yes', correct: true }, { id: 'no', label: 'No' }],
    wrong: 'Look at the counter: a ₹20 coin and a ₹20 note.',
  },
  q3: {
    question: 'Are ₹10 and ₹20 worth the same?',
    tags: [{ id: 'yes', label: 'Yes, the same' }, { id: 'no', label: 'No, different', correct: true }],
    wrong: 'Look at the numbers: 10 and 20. Are they the same?',
  },
  summary: '₹10 coin = ₹10 note.  ₹20 coin = ₹20 note.  But ₹10 ≠ ₹20.',
  takeaway: 'Same number, same value — even if one is a coin and one is a note.',
  teacher: {
    objective: 'The same value can come in different forms (₹10 coin = ₹10 note); different denominations have different values (₹10 ≠ ₹20).',
    explain: 'A coin and a note can look different but be worth the same. ₹10 is ₹10 whether it is a coin or a note.',
    question: 'Can ₹10 be a coin or a note?  ·  Can ₹20 be a coin or a note?  ·  Are ₹10 and ₹20 worth the same?',
    expected: 'Yes  ·  Yes  ·  No',
    cue: 'Ask each question in order and let the class answer before tapping.',
    takeaway: 'Same number, same value — even if one is a coin and one is a note.',
  },
  watchCue: 'Point to the number on the coin and on the note. Ask: "What is the same? What is different?"',
};

export { SCENE09, SCENE10, SCENE11 };
