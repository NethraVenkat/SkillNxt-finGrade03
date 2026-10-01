import React from 'react';

/* ════════ world/EnvironmentLayer.jsx — lighting that answers the story ════════
   No particles. The market "reacts" through light:
     neutral — late-afternoon sun, very slow warmth breathing
     quiet   — the failed trade: light cools and dims a touch
     bright  — understanding: the sun opens up
   (Mood classes are mood-*, never env-*: a mood named like a light layer
   would restyle the container itself and pop instead of fading.)
   Opacity-only, so it is cheap; `still` stops the ambient breath (reduced
   motion, and scenes with 3D surfaces in the world: an animating layer beneath
   3D content forces re-compositing every frame — measured ~40 fps in Scene 12). */

function EnvironmentLayer({ mood = 'neutral', still }) {
  return (
    <div className={'env mood-' + mood + (still ? ' env-still' : '')} aria-hidden="true">
      <span className="env-sun"/>
      <span className="env-shade"/>
      <span className="env-bright"/>
    </div>
  );
}

export { EnvironmentLayer };
