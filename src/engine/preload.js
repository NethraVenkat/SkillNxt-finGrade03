/* ════════ engine/preload.js — scene-scoped image preloading ════════
   Each scene asks only for its own images. Requests are shared and
   reference-counted: two scenes wanting the same artwork decode it once, and
   when the last scene using an image lets go, our reference is dropped so the
   browser may reclaim the decoded bitmap.

   Nothing here blocks first paint — callers start it from an effect. */

const entries = new Map();   /* src → { img, ready: Promise<boolean>, done: boolean, refs } */

function acquire(src) {
  let e = entries.get(src);
  if (!e) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    e = { img, done: false, refs: 0 };
    /* decode() resolves once the bitmap is ready off the main thread;
       failures (offline, bad file) resolve false — a scene never hangs on art */
    e.ready = (img.decode ? img.decode() : new Promise((res, rej) => { img.onload = res; img.onerror = rej; }))
      .then(() => { e.done = true; return true; }, () => { e.done = true; return false; });
    entries.set(src, e);
  }
  e.refs += 1;
  return e;
}

function release(src) {
  const e = entries.get(src);
  if (!e) return;
  e.refs -= 1;
  if (e.refs <= 0) { e.img.src = ''; entries.delete(src); }
}

/* preload a list; returns a handle whose dispose() must be called on unmount */
function preloadImages(srcs) {
  const list = [...new Set(srcs.filter(Boolean))];
  const held = list.map(acquire);
  let disposed = false;
  return {
    ready: Promise.all(held.map(e => e.ready)),
    isReady: src => { const e = entries.get(src); return !!(e && e.done); },
    whenReady: src => { const e = entries.get(src); return e ? e.ready : Promise.resolve(true); },
    dispose: () => { if (disposed) return; disposed = true; list.forEach(release); },
  };
}

/* test / QA visibility */
const preloadStats = () => ({ images: entries.size, refs: [...entries.values()].reduce((n, e) => n + e.refs, 0) });

export { preloadImages, preloadStats };
