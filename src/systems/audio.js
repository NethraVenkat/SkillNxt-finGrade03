import { useCallback, useSyncExternalStore } from 'react';

/* ════════ systems/audio.js — UI sound, never on the critical path ════════
   The first `new AudioContext()` spins up the audio device synchronously on the
   main thread; in QA it blocked for 2–20 s, freezing whatever was on screen.
   So UI sounds do not use Web Audio at all:

   • each tone is synthesised ONCE into a tiny WAV (≈14 KB, a few ms of JS) and
     cached as a blob URL;
   • it plays through an <audio> element — the browser's media pipeline starts
     its output off the main thread, and play() is asynchronous;
   • play() only happens inside the user gesture that asked for it, and any
     autoplay refusal or missing audio support is swallowed: sound is optional,
     the lesson never waits for it.

   One shared module (no per-component contexts), one mute switch for the app. */

const SR = 22050, DUR = 0.32, VOLUME = 0.55;
const tones = new Map();            /* "freq|type" → { url, pool: HTMLAudioElement[] } */
let muted = false;
let unavailable = typeof window === 'undefined' || typeof Audio === 'undefined';
const listeners = new Set();

function wave(type, p) {            /* p = phase in cycles */
  const f = p - Math.floor(p);
  if (type === 'square') return f < 0.5 ? 0.55 : -0.55;
  if (type === 'triangle') return 4 * Math.abs(f - 0.5) - 1;
  return Math.sin(2 * Math.PI * f);
}

/* 16-bit mono PCM WAV with the same 20 ms attack / exponential decay as before */
function synth(freq, type) {
  const n = Math.round(SR * DUR), buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, SR, true); v.setUint32(28, SR * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = t < 0.02 ? t / 0.02 : Math.exp(-(t - 0.02) * 16);
    v.setInt16(44 + i * 2, wave(type, freq * t) * env * 0.1 * 32767, true);
  }
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

function play(freq = 660, type = 'sine') {
  if (muted || unavailable) return;
  try {
    const key = freq + '|' + type;
    let tone = tones.get(key);
    if (!tone) { tone = { url: synth(freq, type), pool: [] }; tones.set(key, tone); }
    /* reuse an idle element; overlapping blips get their own (max 3 per tone) */
    let el = tone.pool.find(a => a.paused || a.ended);
    if (!el && tone.pool.length < 3) { el = new Audio(tone.url); el.volume = VOLUME; tone.pool.push(el); }
    if (!el) return;
    el.currentTime = 0;
    const p = el.play();
    if (p && p.catch) p.catch(() => { /* autoplay refused / no device — stay silent */ });
  } catch (e) {
    unavailable = true;               /* no audio support: never try again, never throw */
  }
}

/* ── mute switch shared by the whole app ── */
function setMuted(on) { muted = !!on; listeners.forEach(l => l()); }
function isMuted() { return muted; }
function useMuted() {
  return useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb); }, isMuted, isMuted);
}

/* existing API: const blip = useBlip(soundOn); blip(880, 'triangle') */
function useBlip(on = true) {
  return useCallback((freq, type) => { if (on) play(freq, type); }, [on]);
}

export { isMuted, play as playTone, setMuted, useBlip, useMuted };
