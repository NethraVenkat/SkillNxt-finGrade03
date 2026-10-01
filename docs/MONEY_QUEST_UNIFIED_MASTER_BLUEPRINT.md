# MONEY QUEST — UNIFIED MASTER BLUEPRINT

## Production Master Specification for Claude + Snitch + Actual Assets + PDF Content

**Project:** Money Quest — Grade 3 Financial Literacy, Module 1, Class 1  
**Lesson:** Why People Use Money & Denominations  
**Format:** React + Vite + JavaScript + JSX + CSS  
**Source project:** `GRADE-3.zip` / `money-quest-react/`  
**Primary character:** Rupi the Guide  
**Scenes:** 18  
**Core feeling:** Interactive animated world / digital museum / cinematic educational adventure

---

# 0. THIS DOCUMENT IS THE UNIFIED SOURCE OF TRUTH

This project has four authoritative inputs:

1. **PDF lesson content** = educational truth.
2. **Actual assets in `GRADE-3.zip`** = visual/source-asset truth.
3. **Cinematic Master Specification** = experience/design law.
4. **Snitch audits** = independent review and quality-control layer.

Claude is the **builder**.

Snitch is the **critic/auditor/director-review layer**.

The PDF is the **content authority**.

The supplied assets are the **visual authority**.

The Cinematic Master Specification is the **experience authority**.

Never replace one authority with another.

---

# 1. NON-NEGOTIABLE PROJECT GOAL

Do NOT convert the PDF into a website.

Do NOT make a PowerPoint-like presentation.

Do NOT make a generic educational dashboard.

Do NOT make 18 repeated cards.

Do NOT create 18 visually identical full-screen pages.

Build a **continuous interactive cinematic learning world** in which the PDF's educational content becomes:

- environments
- characters
- objects
- conversations
- camera choreography
- physical interactions
- classroom activities
- games
- discoveries
- visual explanations
- meaningful transitions

The student should feel:

> “I entered a world. I want to explore it. I am learning because I am interacting with it.”

The teacher should feel:

> “I can actually teach this lesson from this experience.”

---

# 2. EXISTING PROJECT MUST BE UPGRADED, NOT BLINDLY REPLACED

The supplied project already contains a React/Vite foundation, lesson data, navigation, progress, characters, environments, currency assets, several scene components, a currency viewer, and scene widgets.

Current implementation includes dedicated scenes approximately through Scene 11, while later scenes currently rely on generic/fallback rendering.

Therefore:

### KEEP AND REUSE

- existing React/Vite foundation
- JavaScript/JSX architecture
- existing lesson content data
- supplied characters
- supplied environments
- supplied currency assets
- existing navigation where useful
- existing progress persistence where useful
- existing fullscreen concept
- existing teacher controls where useful
- existing currency viewer logic as a starting point

### REFACTOR

- scene orchestration
- navigation/state separation
- camera logic
- motion logic
- interaction logic
- currency interaction
- fullscreen/cinema mode
- teacher mode
- responsive behavior
- reusable animation primitives

### REBUILD / ADD

- cinematic world engine
- dedicated Scene 12–18 implementations
- scene director system
- camera controller
- character acting/state system
- environment controller
- story-driven transition system
- robust interaction system
- physical currency system
- cinematic video experience
- scene contracts and QA gates

Do not throw away working assets or useful systems merely for stylistic reasons.

---

# 3. CONTENT TRUTH — 18 SCENES

## Scene 01 — Welcome to Money Adventure

Duration: 1 min

Purpose: Connect money to students' everyday experiences.

Rupi says:

“Hi! I’m Rupi! Today we’re going on a money adventure!”

Question:

“Where have you seen money?”

Examples:

- shop
- market
- home
- wallet
- canteen

Visual language:

Rupi + familiar locations + rupee symbol.

Animation:

Rupi enters naturally → looks toward world → environment activates → familiar locations reveal → rupee symbol appears as the final discovery.

Interaction:

Students/teacher select places where money is seen.

Expected teaching idea:

Money is part of everyday life.

---

## Scene 02 — The 1-Minute Video Hook

Duration: 1 min

Visual story:

Farmer offers wheat sack.

Milk seller refuses.

Dialogue:

“I don’t need wheat!”

Farmer becomes sad/confused.

Wheat slides toward the milk pot and stops.

Question:

“What was the problem?”

Expected answer:

The milk seller did not want wheat, so the trade could not happen easily.

Important:

This is a cinematic video/film sequence, not a slideshow.

---

## Scene 03 — What Did People Do Before Money?

Core concept:

Barter means exchanging one thing for another.

Visual:

Wheat ↔ Milk.

Rupi claps/celebrates the discovery.

Question:

“What have you swapped with a friend?”

Examples:

- tiffin food
- stickers
- pencils
- eraser

---

## Scene 04 — Let’s Try Barter!

Visual:

Child A has apples and wants pencils.

Child B has pencils and wants apples.

Both want what the other has.

Interaction:

YES / NO.

Correct idea:

This barter works because both people want the other's item.

---

## Scene 05 — Uh-Oh! A Problem

Farmer:

“I have wheat. I want milk.”

Milk seller:

“Sorry! I don’t need wheat.”

Interaction:

Wheat moves toward seller → rejection → wheat returns.

Rupi reacts with comic concern/surprise.

Teaching point:

Barter does not always work easily.

---

## Scene 06 — Both People Must Want the Trade

Composition:

LEFT:

Farmer

“I have wheat.
I want milk.”

CENTER:

WHEAT → X → MILK

RIGHT:

Milk Seller

“I have milk,
but I don’t want wheat.”

Highlight the word **BOTH** with restrained gold/yellow emphasis.

Question:

“When does barter work?”

Options:

A. Only one person wants the trade.
B. Both people want what the other has.

Correct: B.

Celebration:

Rupi explains and celebrates understanding.

---

## Scene 07 — Rupi Has an Idea!

Opening:

Rupi discovers a better possibility.

Text/idea:

“Then came... MONEY!”

Rupi:

“What if everyone used the same thing to buy and sell?”

Money connects to:

- milk
- wheat
- toys
- books

Question:

“Why is money better than barter?”

Expected idea:

Money makes buying and selling easier because people accept it as a way to pay.

---

## Scene 08 — Why Do We Use Money?

Three core functions:

### BUY
Money helps us buy things.

### EXCHANGE
Money makes exchanging easier.

### PRICE
Money helps us know how much something costs.

Example:

₹10 → item.

Question:

“If a mango costs ₹10, what does that ₹10 tell us?”

Expected:

The price / how much it costs / what to pay.

---

## Scene 09 — Meet the Rupee

Concept:

Indian Rupees.

Symbol:

₹

Values introduced:

₹1, ₹5, ₹10, ₹20, ₹50, ₹100.

Teaching point:

The ₹ symbol tells us the amount is in Indian Rupees.

Question:

“Have you seen this ₹ symbol before? Where?”

Examples:

- price tags
- shops
- phones
- receipts

---

## Scene 10 — Meet the Coins

Core coins:

₹1, ₹2, ₹5, ₹10.

Additional exploration:

₹20.

Instruction:

“Tap a coin to learn more!”

Each coin communicates its denomination/value.

Question:

“Which coin has the biggest value?”

Expected among shown coins:

₹20 if all five are included; the core lesson may emphasize ₹10 depending on the teaching sequence.

Do not contradict the lesson data. If the five-coin exploration is used, explicitly frame ₹20 as additional exploration while preserving the core sequence.

---

## Scene 11 — ₹10 and ₹20 Can Be Coins or Notes

ONLY focus on:

₹10
₹20

Relationships:

₹10 coin = ₹10 note.

₹20 coin = ₹20 note.

₹10 ≠ ₹20.

Questions:

“Are ₹10 and ₹20 worth the same?”

Answer: No.

“Can ₹10 be a coin or a note?”

Answer: Yes.

“Can ₹20 be a coin or a note?”

Answer: Yes.

---

## Scene 12 — Meet the Notes

Notes:

₹10, ₹20, ₹50, ₹100, ₹200, ₹500.

Teaching point:

Notes are paper money and different notes represent different values.

Use supplied note assets.

Do not invent official currency artwork.

---

## Scene 13 — Coin or Note?

Examples:

₹5 → coin
₹100 → note
₹10 → both possible

Interactive identification.

This should feel like physically identifying objects in the world, not answering a form.

---

## Scene 14 — What Is the Denomination?

Definition:

“The denomination is the value written on the money.”

Examples:

₹1
₹5
₹20
₹100

Question:

“What is the denomination of this note?”

Use physical currency inspection.

---

## Scene 15 — Rupi’s Quick Money Game

Five rounds.

Rapid identification.

Round 1 example:

₹5 → options ₹1 / ₹5 / ₹10.

Rounds progressively increase difficulty.

Score tracker.

Correct:

star / Rupi celebration / satisfying physical response.

Incorrect:

Rupi gives a helpful correction without shaming.

---

## Scene 16 — Classroom Challenge Intro

Title:

“Money Sorting Challenge!”

Rupi:

“Now YOU become Money Organisers!”

Mixed money pile.

Sort into:

₹1
₹2
₹5
₹10
₹20
₹50
₹100
₹200
₹500

Question:

“How do you know which pile it belongs in?”

Expected:

Look at the number/denomination.

---

## Scene 17 — Team Money Sort

Title:

“READY... SET... SORT!”

Countdown:

3 → 2 → 1 → GO

Timer:

05:00

Prompts:

“Look at the number!”

“Check the denomination!”

“Work together!”

Rupi cheers.

At zero:

“TIME’S UP!”

This is a classroom activity supported by the web experience.

Teacher circulates and asks:

“Which pile does that go in?”

Do not turn this into a fake online leaderboard unless the lesson explicitly requires it.

---

## Scene 18 — Final Recap

Four ideas:

BARTER
People exchanged things.

THE PROBLEM
The other person may not want what we have.

MONEY
Money makes buying and selling easier.

DENOMINATIONS
Coins and notes have different values.

Rupi:

“You are now Money Explorers!”

Final question:

“Why do people use money?”

Expected:

“To make buying and selling easier!”

---

# 4. VISUAL TRUTH — SUPPLIED ASSETS

The supplied assets are authoritative.

Known asset families include:

## Characters

- Rupi
- Farmer
- Milk Seller
- Boy
- Girl
- Robot
- scene-specific character variants

## Coins

- ₹1 front/back
- ₹2 front/back
- ₹5 front/back
- ₹10 front/back
- ₹20 front/back

## Notes

- ₹10 front/back
- ₹20 front/back
- ₹50 front/back
- ₹100 front/back
- ₹200 front/back
- ₹500 front/back

## Environments / Scene Assets

- home world
- village
- farm
- market
- village market
- shop
- supermarket
- canteen
- classroom
- celebration
- coin table
- note display
- game area
- scene-specific backgrounds
- wheat
- milk can
- airship assets
- scene cards

Before implementation, create an actual asset manifest from the repository and map every asset to one or more scenes.

Never assume an asset can be regenerated simply because it is visually convenient.

---

# 5. CURRENCY AUTHENTICITY RULES

For Indian currency:

DO:

- use supplied reference images
- preserve authenticity
- preserve denomination
- preserve front/back identity
- create digital depth around the supplied artwork
- use lighting/shadows/perspective to make it feel physical

DO NOT:

- AI-generate official Indian currency
- redraw official notes
- invent portraits
- invent security features
- invent serial numbers
- invent inscriptions
- alter denomination
- mix front/back of different denominations
- create misleading official-looking currency

If a true 3D model is not available, use the supplied image surfaces on a controlled 3D plane/object with believable thickness rather than fabricating currency details.

---

# 6. THE CINEMATIC WORLD MODEL

The application is a continuous world, not 18 slides.

Every scene has five layers:

1. WORLD
2. ACTORS
3. STORY OBJECTS
4. CAMERA
5. TEACHING

## WORLD

Environment, architecture, props, atmosphere, lighting, depth.

## ACTORS

Rupi and supporting characters.

## STORY OBJECTS

Wheat, milk, money, coins, notes, books, toys, apples, pencils, etc.

## CAMERA

The camera reveals information instead of simply showing a page.

## TEACHING

Teacher question + student interaction + feedback + concept reinforcement.

---

# 7. SCENE RHYTHM

Use this as the default narrative rhythm:

ARRIVE
→ OBSERVE
→ ACTION
→ REACTION
→ DISCOVERY
→ INTERACTION
→ UNDERSTANDING
→ TRANSITION

Not every scene must use every beat, but the experience should have a sense of cause and effect.

Avoid immediate text-card presentation.

---

# 8. CHARACTER ACTING SYSTEM

Characters are not static PNGs placed on backgrounds.

Build reusable character states where the available assets and implementation permit:

- idle
- breathing
- blink
- look left/right
- head movement
- curious
- explaining
- pointing
- thinking
- surprised
- confused
- disappointed
- happy
- celebrating
- walking
- reacting to objects
- listening

Use anticipation → action → reaction → follow-through.

Do not make characters continuously bounce.

Do not randomly rotate characters.

Do not animate every body part independently without purpose.

When a story object moves, the character should respond when appropriate.

Example:

Wheat moves → farmer watches → seller reacts → farmer changes expression → Rupi notices the problem.

---

# 9. CAMERA LANGUAGE

Camera movement must communicate meaning.

Available language:

- establishing wide shot
- slow push-in
- pull-back reveal
- lateral tracking
- object tracking
- character follow
- close-up
- reaction shot
- over-the-shoulder
- low-angle reveal
- overhead classroom shot
- orbit around currency
- macro currency inspection
- perspective transition

Never move the camera just to make the page “look animated.”

Ask:

> What information does this camera movement reveal?

If the answer is “nothing,” remove the movement.

---

# 10. ZERO-BLUR RULE

Absolutely no visual blur as a substitute for cinematic quality.

Avoid:

- backdrop-filter blur
- Gaussian blur
- blurry currency
- blurry characters
- excessive depth of field
- soft-focus backgrounds
- glow-heavy effects

Create depth using:

- perspective
- scale
- parallax
- layer separation
- shadows
- lighting
- occlusion
- camera movement
- composition

The user explicitly requires a crisp visual experience.

---

# 11. NO CUSTOM CURSOR

Use the normal browser system cursor.

Absolutely do NOT create:

- cursor ring
- cursor dot
- cursor halo
- cursor trail
- magnetic cursor
- hidden browser cursor
- fake pointer replacement

Mouse movement may influence subtle parallax where useful, but the real system cursor must remain visible.

---

# 12. UI PHILOSOPHY

UI supports the world.

The world does not exist to decorate the UI.

Avoid:

- dashboard layouts
- giant cards
- excessive pills
- glassmorphism
- excessive gradients
- floating panel overload
- repeated centered content boxes
- generic AI landing-page aesthetics

Use contextual UI only when teaching or interaction requires it.

Teacher controls can be elegant and compact.

---

# 13. NAVIGATION

Top navigation:

- Home
- Learn
- Play
- Explore
- Login at far right
- Fullscreen control near the right side

Home is standalone.

Learning scenes are continuous.

Side navigation:

- scene/chapter navigation
- left-corner toggle
- hidden in cinema/fullscreen mode

Bottom navigation:

- Back
- Next
- current scene context if necessary

Do NOT add timers to the ordinary bottom navigation.

Scene 17 may have its own activity timer because the lesson requires a five-minute classroom challenge.

---

# 14. CINEMA / FULLSCREEN MODE

Normal mode:

- top navigation visible
- side navigation available
- bottom navigation available

Cinema mode:

- top navigation hidden
- side navigation hidden
- bottom navigation hidden
- only the world/body remains

Provide a minimal exit control that does not disrupt the cinematic experience.

---

# 15. TEACHER MODE

This is a teacher-led educational product.

Teacher controls should provide:

- teaching objective
- ask-the-class prompt
- expected answer
- teacher cue
- interaction instruction
- optional reveal
- activity guidance

Do not cover important character/environment content.

Teacher mode should feel like a professional teaching instrument, not a dashboard.

---

# 16. INTERACTION PRINCIPLE

Every meaningful interaction must follow:

USER ACTION
→ OBJECT RESPONSE
→ CHARACTER RESPONSE
→ ENVIRONMENT RESPONSE
→ TEACHING RESULT

Example:

Student selects ₹10.

→ coin moves into focus
→ lighting emphasizes coin
→ Rupi looks toward it
→ denomination appears
→ explanation is revealed
→ student understands value.

---

# 17. CURRENCY INTERACTION ENGINE

Create reusable `InteractiveBanknote` and `InteractiveCoin` systems.

Required behavior:

## Hover

- subtle lift
- shadow response
- lighting/highlight response
- small scale change

## Drag

Horizontal drag → Y rotation.

Vertical drag → X rotation.

Release → damped settling.

## Click

Focus object.

Other objects become secondary.

Information appears contextually.

## Flip

Front
→ physical 3D rotation
→ edge visible
→ back

Never crossfade front to back.

## Repeated flip

Back
→ physical reverse rotation
→ front.

## Mobile

Use touch drag and tap.

Do not depend on hover.

---

# 18. MOTION HIERARCHY

Not everything moves equally.

PRIMARY:

- Rupi
- key currency/object
- central story action

SECONDARY:

- supporting character
- relevant props
- environment reactions

TERTIARY:

- subtle leaves
- flags
- distant movement
- ambient particles

If everything moves constantly, nothing feels important.

---

# 19. ENVIRONMENT CONTROLLER

Environment motion should be scene-specific.

Examples:

Village:

- leaves
- flags
- distant activity
- subtle environmental motion

Market:

- vendor activity
- cloth movement
- object movement
- people/props responding

Classroom:

- subtle student movement
- teacher activity
- board/desk context

Currency museum:

- controlled lighting
- object rotation
- display movement
- focused highlights

Never use generic particle backgrounds as the main cinematic device.

---

# 20. STORY-DRIVEN TRANSITIONS

Transitions should feel like filmmaking.

Preferred methods:

- camera follows Rupi
- character walks into next environment
- object travels into next scene
- currency becomes transition object
- foreground object wipes scene
- door/archway/light reveals next location
- camera pulls back to reveal new world
- match cut between related objects

Avoid using simple fade-to-black as the default transition.

Never use PowerPoint slide transitions.

---

# 21. SCENE-BY-SCENE CINEMATIC DIRECTION

## Scene 01

Start with environment before UI.

Camera establishes the village/home-world.

Rupi enters or becomes visible naturally.

She notices the student/camera.

She gestures toward the world.

Shop, market, home, wallet, canteen references appear as physical/contextual elements.

₹ symbol becomes the final visual discovery.

Teacher question appears only after the world has been established.

Transition:

Rupi begins moving toward the marketplace.

---

## Scene 02

Begin as a cinematic marketplace shot.

Farmer approaches milk seller.

Wheat is visibly offered.

Milk seller looks at wheat.

Seller politely refuses.

Wheat stops.

Farmer reacts.

Rupi observes from a meaningful position.

The question appears after the failed trade.

Transition follows the wheat/milk relationship into barter explanation.

---

## Scene 03

Use wheat and milk as the teaching objects.

Show exchange relationship.

Rupi demonstrates barter.

Student examples appear as physical objects or compact contextual illustrations.

Question becomes conversational rather than card-based.

---

## Scene 04

Two children occupy distinct positions.

Camera establishes each child's desired item.

Apples and pencils move between them.

When both desires align, the exchange completes successfully.

Use a clear visual “yes” moment without giant UI.

---

## Scene 05

Repeat the farmer/milk seller situation with altered outcome.

The purpose is contrast.

The student should visually understand the failed trade before the explanation appears.

---

## Scene 06

Use the explicit farmer-left / milk-seller-right composition.

Camera first establishes both sides.

Then focus on the mismatch.

The WHEAT → X → MILK relationship becomes the central diagram.

Highlight BOTH.

Ask when barter works.

Correct response triggers synchronized character acknowledgement.

---

## Scene 07

Allow a brief visual pause after barter difficulty.

Rupi thinks.

Environment subtly quiets.

She gets the idea.

“MONEY” becomes a visual breakthrough.

Money then connects to milk, wheat, toys, books.

This should be one of the lesson's major cinematic reveals.

---

## Scene 08

Turn BUY / EXCHANGE / PRICE into three physical demonstrations in the same world.

Do not show three generic cards.

Example:

BUY → money changes hands for an item.

EXCHANGE → money bridges a transaction.

PRICE → ₹10 appears beside a mango/item as the amount.

---

## Scene 09

Move into a premium rupee discovery environment.

The ₹ symbol is treated as a visual object/mark of discovery.

Currency values appear as physical examples.

The supplied currency assets must remain crisp and authentic.

---

## Scene 10

Create a currency exploration table/world.

Five coin objects can be explored:

₹1, ₹2, ₹5, ₹10, ₹20.

Core lesson sequence should remain clear.

Clicking a coin:

- moves it into focus
- camera/object focus changes
- coin rotates
- denomination is revealed
- Rupi responds

---

## Scene 11

Use only ₹10 and ₹20 as the teaching comparison.

Show:

₹10 coin ↔ ₹10 note
₹20 coin ↔ ₹20 note

Then clearly compare:

₹10 ≠ ₹20.

Questions should appear in sequence rather than all at once.

---

## Scene 12

Move into a note-display environment.

Notes:

₹10, ₹20, ₹50, ₹100, ₹200, ₹500.

Each note can be inspected.

Do not turn this into a gallery grid.

Use spatial placement and camera movement.

---

## Scene 13

Coins and notes are mixed physically.

Student selects/identifies whether an item is a coin or note.

₹10 should provide the meaningful “both possible” case.

---

## Scene 14

Zoom into the printed value/denomination.

The camera and object itself teach the concept.

Do not rely on a definition card alone.

---

## Scene 15

Rapid game rhythm.

Five rounds.

Each round has:

- object reveal
- question
- choices
- response
- physical feedback
- score update
- Rupi reaction

Difficulty increases gradually.

---

## Scene 16

Transition from learning world into classroom challenge world.

Mixed money pile becomes visible.

Rupi introduces the challenge.

Sorting piles exist as physical destinations.

---

## Scene 17

Create classroom activity atmosphere.

Countdown:

3 → 2 → 1 → GO.

05:00 timer.

Prompts appear contextually.

The web app supports the physical classroom activity rather than pretending the student is playing a multiplayer online game.

At time-up:

visual/audio celebration without excessive effects.

---

## Scene 18

Return to a calm celebratory environment.

Rupi walks through the four key ideas.

Each recap item is represented visually by the actual story world:

barter → failed trade → money → denominations.

Final question.

Rupi's final “Money Explorer” moment.

End with a sense of completion, not a generic “quiz complete” screen.

---

# 22. VIDEO SYSTEM

The class video must be a coherent 60–90 second cinematic educational film.

Minimum target: 60 seconds.

Recommended sequence:

0–5s:

cinematic opening.

5–15s:

currency/world introduction.

15–30s:

barter/historical problem.

30–45s:

money solves the transaction problem.

45–60s:

currency/denomination closeups.

60–75+ sec:

coin sequence and transition into the interactive experience.

The video must not be a slideshow.

Use:

- camera movement
- acting
- object choreography
- continuity
- captions
- coherent narration
- sound design

Narration rule:

There is one coherent voiceover inside the video.

Do not create random website-wide narration across ordinary scenes.

If the current environment cannot export a real 60–90 second video, implement a production-ready cinematic video system with:

- storyboard
- scene timings
- captions
- narration script
- audio cue structure
- video player
- poster
- transition from video into interactive scene.

Never pretend a simple animated webpage is a finished video file.

---

# 23. SOUND SYSTEM

Optional but meaningful:

- footsteps
- marketplace ambience
- soft environment ambience
- coin movement
- coin flip
- note interaction
- success sound
- transition sound

No aggressive autoplay.

Provide mute control.

Respect browser autoplay policies.

Video narration remains separate from normal scene ambience.

---

# 24. RESPONSIVE RULES

Desktop:

- full environment
- cinematic camera
- mouse interaction
- rich depth

Tablet:

- simplified camera range
- touch-friendly controls
- maintain scene composition

Mobile:

- recomposed scenes
- touch drag
- tap to flip
- reduced background complexity
- readable text
- no overlap
- no horizontal scrolling

Do not simply shrink the desktop design.

---

# 25. ACCESSIBILITY

Support:

- semantic HTML
- keyboard navigation
- visible focus
- readable contrast
- touch targets
- labels
- captions
- reduced motion

When `prefers-reduced-motion` is enabled:

- reduce camera movement
- reduce parallax
- reduce particles
- reduce nonessential character motion
- preserve interactions and teaching content

---

# 26. PERFORMANCE

Target smooth interaction on capable devices.

Use:

- transform/opacity animation
- GPU-friendly properties
- lazy loading
- asset reuse
- code splitting where useful
- cleanup of event listeners
- cleanup of GSAP timelines
- cleanup of animation loops
- controlled render loops
- efficient image sizing
- device-aware effects

Do not continuously animate expensive properties.

Do not use unnecessary WebGL.

Use Three.js/R3F only when genuine 3D interaction adds educational or physical value.

If an effect causes lag:

**remove/rebuild the effect rather than accepting poor performance.**

---

# 27. TECHNICAL ARCHITECTURE

Recommended structure:

```text
src/
├── app/
│   ├── App.jsx
│   ├── routes.js
│   └── appState.js
│
├── engine/
│   ├── SceneManager.js
│   ├── CameraController.js
│   ├── TransitionManager.js
│   ├── MotionSystem.js
│   ├── EnvironmentController.js
│   ├── CharacterController.js
│   ├── InteractionSystem.js
│   ├── ProgressSystem.js
│   └── AudioSystem.js
│
├── currency/
│   ├── InteractiveCoin.jsx
│   ├── InteractiveBanknote.jsx
│   ├── CurrencyViewer.jsx
│   ├── CurrencyFlip.js
│   └── currencyData.js
│
├── characters/
│   ├── Rupi.jsx
│   ├── Farmer.jsx
│   ├── MilkSeller.jsx
│   ├── Child.jsx
│   └── CharacterState.js
│
├── environments/
│   ├── World.jsx
│   ├── Village.jsx
│   ├── Market.jsx
│   ├── Classroom.jsx
│   └── EnvironmentLayer.jsx
│
├── scenes/
│   ├── Scene01.jsx
│   ├── Scene02.jsx
│   ├── ...
│   └── Scene18.jsx
│
├── teacher/
│   ├── TeacherMode.jsx
│   ├── TeachingPrompt.jsx
│   └── TeacherControls.jsx
│
├── games/
│   ├── QuickMoneyGame.jsx
│   └── MoneySortActivity.jsx
│
├── video/
│   ├── CinematicVideo.jsx
│   ├── VideoStoryboard.js
│   └── captions.js
│
├── ui/
│   ├── TopNavigation.jsx
│   ├── LessonSidebar.jsx
│   ├── BottomNavigation.jsx
│   └── CinemaMode.jsx
│
├── data/
│   ├── lessonData.js
│   ├── sceneData.js
│   └── assetManifest.js
│
├── assets/
│
└── styles/
    ├── tokens.css
    ├── world.css
    ├── typography.css
    └── responsive.css
```

The exact folder structure may differ if the existing project can be cleanly evolved, but responsibilities must remain separated.

---

# 28. DATA-DRIVEN CONTENT

Educational content must be separate from visual presentation.

Example conceptual model:

```js
{
  id: 6,
  title: 'Both People Must Want the Trade',
  duration: '2 min',
  environment: 'market',
  characters: ['farmer', 'milkSeller', 'rupi'],
  teachingPoint: '...',
  question: 'When does barter work?',
  answers: [...],
  correctAnswer: 'both',
  cameraPlan: [...],
  interactionPlan: [...],
  transition: {...}
}
```

Do not hard-code educational facts into dozens of visual components.

---

# 29. SCENE CONTRACT

No scene is complete until all applicable gates pass.

```text
CONTENT
[ ] PDF content preserved
[ ] No invented educational fact

WORLD
[ ] Correct environment
[ ] Correct asset references
[ ] No visual collisions

CHARACTERS
[ ] Correct characters
[ ] Acting state exists
[ ] Reactions are meaningful

CAMERA
[ ] Camera movement has narrative purpose
[ ] No random movement
[ ] No motion sickness

OBJECTS
[ ] Story objects are physical/credible
[ ] Object actions cause responses

INTERACTION
[ ] Interaction is obvious
[ ] Interaction is responsive
[ ] Correct feedback
[ ] Incorrect feedback

TEACHING
[ ] Teacher knows what to ask
[ ] Expected answer available
[ ] Student understands the concept

TRANSITION
[ ] Story-driven
[ ] Not a PPT slide transition

VISUAL
[ ] Zero blur
[ ] No generic dashboard
[ ] No custom cursor
[ ] No excessive gradients
[ ] No card-grid presentation

RESPONSIVE
[ ] Desktop
[ ] Tablet
[ ] Mobile

ACCESSIBILITY
[ ] Keyboard
[ ] Focus
[ ] Reduced motion
[ ] Contrast

PERFORMANCE
[ ] No uncontrolled animation loop
[ ] No console errors
[ ] No memory leaks
[ ] Acceptable interaction latency
```

---

# 30. SNITCH INTEGRATION

Snitch is not the builder.

Snitch is the review layer.

Use the appropriate Snitch skills for:

## Blueprint

Review architecture before major implementation.

Questions:

- Is the architecture capable of supporting 18 cinematic scenes?
- Are responsibilities separated?
- Are systems reusable?
- Are scene-specific requirements represented?

## UX

Review:

- clarity
- interaction discoverability
- teacher workflow
- student workflow
- navigation
- hierarchy
- visual obstruction

## Film / Video

Review:

- story rhythm
- camera motivation
- continuity
- scene transitions
- acting
- cinematic language
- video structure

## DevReady

Review:

- implementation completeness
- asset mapping
- edge cases
- technical readiness
- dependency correctness

## ADA / Accessibility

Review:

- keyboard
- contrast
- reduced motion
- focus
- semantics
- touch

Snitch findings become tracked issues.

Claude fixes those issues.

Snitch does not override the PDF's educational truth or the user's explicit asset restrictions.

---

# 31. CLAUDE ROLE

Claude is the implementation engine.

Claude must:

1. inspect the existing repository
2. inspect the actual assets
3. read the unified blueprint
4. preserve the educational content
5. preserve authentic supplied assets
6. build shared systems first
7. implement scenes systematically
8. test after each milestone
9. fix visual/technical problems
10. never declare completion based only on code compilation

Claude must not blindly rewrite the entire project.

Claude must prefer incremental, verifiable upgrades.

---

# 32. CLAUDE DEVELOPMENT ORDER

### Phase A — Repository audit

Read the existing project.

Map current components.

Map current assets.

Map existing scenes.

Map dependencies.

Do not code yet.

### Phase B — Architecture

Create/refactor:

- SceneManager
- CameraController
- MotionSystem
- CharacterController
- EnvironmentController
- InteractionSystem
- TransitionManager
- CurrencySystem
- TeacherSystem
- ProgressSystem

### Phase C — Visual foundation

Implement:

- world composition
- typography
- lighting
- shadows
- responsive tokens
- zero-blur visual system

### Phase D — Character system

Implement reusable states and scene reactions.

### Phase E — Camera system

Implement cinematic camera primitives.

### Phase F — Transition system

Implement story-driven transitions.

### Phase G — Currency system

Implement coin/note physical interactions.

### Phase H — Scene 01–03

Build, test, inspect.

### Phase I — Scene 04–06

Build, test, inspect.

### Phase J — Scene 07–09

Build, test, inspect.

### Phase K — Scene 10–12

Build, test, inspect.

### Phase L — Scene 13–15

Build, test, inspect.

### Phase M — Scene 16–18

Build, test, inspect.

### Phase N — Video

Build video-ready cinematic system.

### Phase O — Teacher mode

Polish teacher experience.

### Phase P — Responsive

Desktop → tablet → mobile recomposition.

### Phase Q — Snitch audit

UX + film + devready + accessibility.

### Phase R — Final visual QA

Browser-based inspection of every scene.

---

# 33. IMPLEMENTATION LOOP

For each scene:

```text
READ DIRECTOR SHEET
        ↓
MAP ASSETS
        ↓
BUILD WORLD
        ↓
PLACE CHARACTERS
        ↓
IMPLEMENT CAMERA
        ↓
IMPLEMENT ACTING
        ↓
IMPLEMENT STORY OBJECTS
        ↓
IMPLEMENT INTERACTION
        ↓
IMPLEMENT TEACHING
        ↓
IMPLEMENT TRANSITION
        ↓
RUN
        ↓
INSPECT
        ↓
FIX
        ↓
SNITCH REVIEW
        ↓
FIX
        ↓
SCENE CONTRACT PASS
```

Do not build all 18 scenes first and inspect only at the end.

---

# 34. VISUAL QA QUESTIONS

After implementation, inspect every scene and ask:

1. Does it feel like a world?
2. Does it feel cinematic?
3. Does the camera have a reason to move?
4. Is Rupi acting rather than standing?
5. Are supporting characters reacting?
6. Does the environment feel alive but controlled?
7. Does the story object matter?
8. Does interaction teach something?
9. Does the transition connect scenes?
10. Is anything overlapping?
11. Is any text unreadable?
12. Is any currency blurry?
13. Is any currency fabricated?
14. Is there any custom cursor?
15. Is there any unnecessary blur?
16. Does it resemble PowerPoint?
17. Does it resemble a generic dashboard?
18. Is animation repetitive?
19. Is the scene too busy?
20. Is the teacher's instruction clear?
21. Does mobile work?
22. Does reduced motion work?
23. Is performance acceptable?

If any answer is bad, fix the scene before calling it complete.

---

# 35. ANTI-AI-GENERATED-WEBSITE RULE

Avoid visual patterns commonly associated with generic AI-generated websites:

- repeated rounded cards
- huge gradient headings
- excessive glass panels
- random floating blobs
- excessive neon
- generic particle fields
- random 3D shapes
- meaningless parallax
- identical section templates
- “feature card” grids everywhere

The design must feel art-directed.

Every major visual element must have a narrative or educational reason.

---

# 36. ANTI-POWERPOINT RULE

Never use:

- slide numbers as primary navigation
- slide dots
- page-flip transitions
- presentation arrows as the main experience
- identical full-screen panels
- centered text over background for every scene
- repeated fade-to-next-scene
- presentation-style card grids

The experience must behave like a continuous web application/world.

---

# 37. FINAL QUALITY TARGET

The final product should feel closer to:

**interactive animated museum + educational adventure + cinematic game-like exploration**

than:

**lesson website + slideshow + dashboard**.

The user should not think:

> “This is a PDF converted into React.”

The user should think:

> “This is a world I can explore.”

---

# 38. MASTER INSTRUCTION TO CLAUDE

Use the following as the highest-level implementation instruction after loading all project documents:

> You are the lead frontend engineer, cinematic interaction designer, technical director, educational-experience designer, and animation engineer for Money Quest.
>
> You are working on an existing React/Vite JavaScript/JSX project supplied in `GRADE-3.zip`.
>
> Do not blindly replace the existing project. First inspect it and preserve useful existing systems and all approved assets.
>
> The PDF is the educational source of truth.
>
> The supplied repository assets are the visual source of truth.
>
> The Cinematic Master Specification is the experience-design law.
>
> The Scene Director Sheets are the scene-level implementation authority.
>
> Snitch findings are quality-control requirements and tracked issues.
>
> Build an interactive cinematic learning world, not a PDF viewer, slideshow, dashboard, or generic AI website.
>
> Use JavaScript, JSX and CSS. Do not migrate the project to TypeScript unless explicitly requested.
>
> Reuse the supplied Rupi, character, environment, coin and note assets. Never fabricate official Indian currency details.
>
> Preserve the normal system browser cursor. Never implement a custom cursor.
>
> Never use blur as the primary depth technique.
>
> Never make every scene look like the same template.
>
> Never use repetitive fade-up animations as the default motion language.
>
> Every scene must have a deliberate environment, character acting, story-object choreography, camera language, interaction and teaching purpose.
>
> Build reusable engines before duplicating scene logic.
>
> Treat animation as communication, not decoration.
>
> Treat camera movement as storytelling.
>
> Treat characters as actors.
>
> Treat currency as physical objects.
>
> Treat the teacher as a participant in the experience.
>
> After implementation, run the application and inspect every scene and interaction. Fix visual collisions, console errors, broken navigation, interaction failures, performance problems, responsive issues, accessibility problems, repetitive animation, PPT-like composition and generic dashboard styling before declaring completion.
>
> Do not say “complete” merely because the code compiles.
>
> Completion requires the Scene Contract and final QA gates to pass.

---

# 39. FINAL SYSTEM HIERARCHY

```text
                    PDF
                     │
             EDUCATIONAL TRUTH
                     │
                     ▼
          CINEMATIC MASTER SPEC
                     │
            EXPERIENCE TRUTH
                     │
                     ▼
             ASSET MANIFEST
                     │
              VISUAL TRUTH
                     │
                     ▼
         SCENE DIRECTOR SHEETS
                     │
           IMPLEMENTATION TRUTH
                     │
                     ▼
                 CLAUDE
                  BUILDER
                     │
                     ▼
                 RUN APP
                     │
                     ▼
                 SNITCH
                  CRITIC
                     │
                     ▼
              FIX + POLISH
                     │
                     ▼
                FINAL QA
                     │
                     ▼
              MONEY QUEST
```

---

# 40. GOLDEN RULE

Do not ask:

> “Where should I put the text?”

Ask:

> “How can the environment, character, object and camera communicate this concept?”

Do not ask:

> “What animation should I add?”

Ask:

> “What movement makes this scene feel alive and teaches something?”

Do not ask:

> “How should the page transition?”

Ask:

> “How would a film director naturally move the viewer into the next part of this story?”

Do not ask:

> “How can I make this look impressive?”

Ask:

> “What is the simplest physical, cinematic interaction that makes the student understand the concept?”

That is the standard for Money Quest.

---

# END OF UNIFIED MASTER BLUEPRINT
