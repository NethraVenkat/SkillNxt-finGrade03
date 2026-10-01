# Money Quest — Grade 3 Financial Literacy

Interactive, teacher-led lesson app. Module 1 · Class 1 — "Why People Use Money & Denominations".
18 scenes, mascot **Rupi**, real Indian currency imagery.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview
```

React 18 + Vite + JavaScript/JSX. No TypeScript.

## Routes (hash based)

`#/` Home · `#/learn` journey · `#/learn/1` … `#/learn/18` scenes · `#/play` games · `#/explore` currency museum

## Structure

```
src/
  main.jsx                entry
  App.jsx                 shell, router, fullscreen, progress, Next-gating
  assets/                 REAL artwork (characters, currency, environments, scenes)
    index.js              builds the A asset object from ESM imports
  components/
    icons.jsx  TopNavigation.jsx  LessonSidebar.jsx  LearnView.jsx
    TeacherControlBar.jsx  SceneStage.jsx  SceneWidgets.jsx  CurrencyViewer.jsx
  data/
    lessonData.js  sceneData.jsx  characterData.jsx  currencyData.js
  pages/
    Home.jsx  LearningJourney.jsx  Play.jsx  Explore.jsx  Login.jsx
  scenes/
    Scene01Welcome.jsx  Scene02VideoHook.jsx  Scene03BeforeMoney.jsx
    Scene04Barter.jsx   Scene05Problem.jsx    Scene06BothWant.jsx
    Scene07RupiIdea.jsx Scene08WhyMoney.jsx   Scene09MeetRupee.jsx
    Scene10MeetCoins.jsx Scene11CoinOrNote.jsx
  systems/audio.js        tiny WebAudio blip
  styles/global.css       full design system + every scene's CSS
```

Scenes 12–18 are rendered by `components/SceneStage.jsx` from `data/sceneData.jsx`.
Scenes 1–11 are bespoke components.

## Asset rules (important)

* `src/assets/**` is the **source of truth**. Never regenerate or redraw characters or currency.
* Currency images are real ₹1/₹2/₹5/₹10/₹20 coins and ₹10–₹500 notes, front and back.
* Characters come from the approved sheet: Rupi, robot, boy, girl, farmer (turban + vest), milk seller (cap + blue apron).
* Replace a file in place to update artwork — `src/assets/index.js` maps every key.

## Conventions

* Scene plates are **contained**, never cropped; a dimmed copy of the background fills letterbox margins.
* Type inside a scene is sized in `cqw` against the plate (`container-type: size`).
* Each scene is a small state machine — only the current step renders.
* No blur, no glassmorphism, no custom cursor.
* Progress is saved to `localStorage` under `mq_progress`.
