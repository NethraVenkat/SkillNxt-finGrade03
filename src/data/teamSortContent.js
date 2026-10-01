/* ════════ data/teamSortContent.js — Scene 17 "Team Money Sort" ════════
   From the blueprint: title "READY... SET... SORT!"; countdown 3 → 2 → 1 → GO;
   a 05:00 timer; prompts "Look at the number!", "Check the denomination!",
   "Work together!"; Rupi cheers; at zero "TIME'S UP!". A classroom activity
   supported by the web experience — the teacher circulates and asks "Which
   pile does that go in?". No leaderboard, no online game. */

const SCENE17 = {
  n: 17,
  title: 'Team Money Sort',
  sign: 'READY... SET... SORT!',
  countdown: ['3', '2', '1', 'GO!'],
  seconds: 5 * 60,
  prompts: ['Look at the number!', 'Check the denomination!', 'Work together!'],
  promptEvery: 20,                         /* seconds between prompts */
  timesUp: "TIME'S UP!",
  controls: { start: 'Start the sort', pause: 'Pause', resume: 'Resume', end: 'End now' },
  teacher: {
    objective: 'Teams sort the money into the nine piles (₹1 to ₹500) by denomination, working together.',
    question: 'Which pile does that go in?',
    expected: 'The pile for its denomination — look at the number printed on it.',
    cue: 'Press "Start the sort" when the teams are ready. Circulate while they sort and ask: "Which pile does that go in?"',
  },
};

export { SCENE17 };
