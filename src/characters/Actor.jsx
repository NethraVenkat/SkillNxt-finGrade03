import React, { useLayoutEffect, useRef } from 'react';
import './actorStates.css';

/* ════════ characters/Actor.jsx — a supplied cut-out that can act ════════
   The artwork is never altered; acting happens on three nested layers so
   states compose without fighting over one transform:

     .actor        where they stand   (x/y/height → walking = transitioned translate)
     .actor-pose   how they hold      (offer, sad, think, protect, point, reach — held lean)
     .actor-beat   what they do now   (talk, nod, reject, surprised, cheer, walk — finite)
     .actor-idle   being alive        (slow breathing, primary actor only)

   state: a string or array, e.g. ['offer','talk'].
   position: { x (% of stage, centre), y (% from bottom, feet), h (% of stage height) }
   enterFrom: optional horizontal offset (cqw) to walk in from on mount/beat.
   toward: 1 if the actor's scene partner is to the right, -1 if to the left —
   leans and recoils are expressed relative to the partner. */

const POSES = ['offer', 'sad', 'think', 'protect', 'point', 'lean', 'reach'];
const BEATS = ['talk', 'nod', 'reject', 'surprised', 'cheer', 'walk'];

function Actor({ src, alt, position, state = 'idle', facing = 1, toward = 1, walkMs = 1900, walkEase, idle = true, zIndex, reduced, cue, enterFrom }) {
  const states = Array.isArray(state) ? state : [state];
  const pose = states.find(s => POSES.includes(s));
  const beats = states.filter(s => BEATS.includes(s));
  const { x, y = 0, h } = position;
  const beatRef = useRef(null);
  const beatCls = 'actor-beat' + beats.map(b => ' beat-' + b).join('');
  /* restart the finite gesture whenever the cue (usually the beat id) or the
     gesture changes — without remounting the image */
  useLayoutEffect(() => {
    const el = beatRef.current;
    if (!el) return;
    el.className = 'actor-beat';
    void el.offsetWidth;
    el.className = beatCls;
  }, [beatCls, cue]);
  return (
    <div className="actor" style={{
        '--h': h, zIndex,
        transform: 'translate3d(calc(' + x + 'cqw - 50%), ' + (-y) + 'cqh, 0)',
        transition: reduced ? 'none' : 'transform ' + walkMs + 'ms ' + (walkEase || 'cubic-bezier(.4,.1,.35,1)'),
      }}>
      {/* entrance: walks in from `enterFrom` cqw away — pure CSS, no frame juggling */}
      <div className={enterFrom != null ? 'actor-enter' : 'actor-still'}
        style={enterFrom != null ? { '--enter-dx': enterFrom + 'cqw', animationDuration: walkMs + 'ms' } : null}>
      <div className={'actor-pose' + (pose ? ' pose-' + pose : '')} style={{ '--to': toward }}>
        <div ref={beatRef} className={beatCls}>
          <div className={'actor-idle' + (idle ? ' breathing' : '')}>
            <img src={src} alt={alt} draggable="false" style={facing < 0 ? { transform: 'scaleX(-1)' } : null}/>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export { Actor, BEATS, POSES };
