/* ════════ data/moneyContent.js — Scenes 07 & 08 educational content ════════
   Words only, from the lesson source. No positions, no timings. */

const SCENE07 = {
  n: 7,
  title: 'Rupi Has an Idea!',
  idea: ['What if everyone used the same thing', 'to buy and sell?'],
  arrival: 'Then came… money!',
  /* money connects to these (lesson source) */
  things: { wheat: 'Wheat', milk: 'Milk', toy: 'Toys', book: 'Books' },
  teaching: 'Money makes buying and selling easier.',
  question: 'Why is money better than barter?',
  choices: [
    { id: 'a', label: 'Everyone can use it', correct: true },
    { id: 'b', label: 'Everyone must want the same thing' },
  ],
  feedback: {
    correct: 'Yes! Everyone accepts money, so buying and selling is easier.',
    retry: 'Think about the wheat and the milk. With money, does everyone need to want the same thing?',
  },
  teacher: {
    objective: 'Understand that money makes buying and selling easier than barter.',
    explain: 'Instead of finding someone who wants your wheat, everyone accepts the same thing — money.',
    takeaway: 'Money makes buying and selling easier.',
    question: 'Why is money better than barter?',
    expected: 'Everyone accepts money · you can use money to buy things · money makes buying and selling easier.',
    cue: 'Ask the class before you tap. Point back to the farmer: now he can use money instead of wheat.',
  },
  watchCue: 'Pause after Rupi\'s question. Ask: "What could everyone use?"',
};

const SCENE08 = {
  n: 8,
  title: 'Why Do We Use Money?',
  uses: {
    buy: { word: 'BUY', line: 'Money helps us buy things.' },
    exchange: { word: 'EXCHANGE', line: 'Money makes exchanging easier.' },
    price: { word: 'PRICE', line: 'Money helps us know how much something costs.' },
  },
  priceAmount: '₹10',
  question: 'If a mango costs ₹10, what does that ₹10 tell us?',
  choices: [
    { id: 'a', label: 'How much the mango costs', correct: true },
    { id: 'b', label: 'How big the mango is' },
  ],
  feedback: {
    correct: 'Yes! ₹10 is the price — it tells us how much the mango costs.',
    retry: 'Look at the tag again. The ₹10 tells us how much we pay for the mango.',
  },
  teacher: {
    objective: 'Money helps us buy, makes exchanging easier, and tells us the price.',
    explain: 'Money does three jobs: we buy with it, it makes swapping easier, and it tells us the price.',
    takeaway: 'Money helps us buy, exchange, and know the price.',
    question: 'If a mango costs ₹10, what does that ₹10 tell us?',
    expected: 'It tells us the price · how much it costs · what to pay.',
    cue: 'Name each use as it happens: buy, exchange, price. Then ask the question.',
  },
  watchCue: 'Follow the money. Ask: "What is the money doing now?"',
};

export { SCENE07, SCENE08 };
