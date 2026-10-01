import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { layerStyle } from '../engine/camera';
import './world.css';

/* ════════ world/Plate.jsx — the filmed world ════════
   The environment plate COVERS the frame (no letterbox) and every layer is
   positioned in stage percentages, so a scene can recompose per layout:
     wide  — landscape desktop / tablet
     tall  — portrait tablet / phone
   Layers, back to front:
     background  (plate image, parallax depth .9)
     atmosphere  (lighting only, screen-space)
     subjects    (actors, story objects, dialogue — full camera depth)
     overlay     (screen-space interaction, never moved by the camera) */

function useStageLayout() {
  const ref = useRef(null);
  /* first guess from the window, so a phone's first frame is already 'tall' —
     otherwise actors render at the wide spots and visibly walk to the tall ones */
  const [shape, setShape] = useState(() => {
    if (typeof window === 'undefined' || !window.innerHeight) return { layout: 'wide', aspect: 16 / 9 };
    const aspect = Math.round((window.innerWidth / window.innerHeight) * 100) / 100;
    return { layout: aspect < 1.1 ? 'tall' : 'wide', aspect };
  });
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (!width || !height) return;
      const aspect = Math.round((width / height) * 100) / 100;
      const layout = aspect < 1.1 ? 'tall' : 'wide';
      setShape(s => (s.aspect === aspect && s.layout === layout ? s : { layout, aspect }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, shape];
}

/* mirror: shows the plate flipped left↔right (Scene 04 films the same market from the other side) */
/* maxUpscale (opt-in): on large screens the camera's push-ins are limited so the plate is
   never drawn more than this many times its own pixel size (a soft, stretched background).
   Small and medium screens never reach the limit, so their shots are unchanged. */
/* the plate's pixel size, known before it has decoded (all opt-in scenes film the market plate) */
const PLATE_PX = { w: 1537, h: 1023 };
function capFor(el, img, maxUpscale) {
  const { width, height } = el.getBoundingClientRect();
  if (!width || !height) return Infinity;
  const nw = (img && img.naturalWidth) || PLATE_PX.w, nh = (img && img.naturalHeight) || PLATE_PX.h;
  const dpr = window.devicePixelRatio || 1;
  /* the plate covers the frame with a 4% bleed each side (world.css) */
  const cover = Math.max(width * 1.08 / nw, height * 1.08 / nh) * dpr;
  /* the background layer scales by 1 + (s - 1) × 0.9 (its parallax depth) */
  const sBg = Math.max(1, maxUpscale / cover);
  return Math.max(1, 1 + (sBg - 1) / 0.9);
}
function useUpscaleCap(maxUpscale) {
  const ref = useRef(null);
  const [cap, setCap] = useState(Infinity);
  /* camera moves stay off until the limit is known: otherwise the first frame (laid out at the
     uncapped zoom) would visibly ease back to the limit */
  const [live, setLive] = useState(!maxUpscale);
  useLayoutEffect(() => {
    if (!maxUpscale || !ref.current) return undefined;
    setCap(capFor(ref.current, ref.current.querySelector('.world-bg img'), maxUpscale));
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setLive(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [maxUpscale]);
  useEffect(() => {
    const el = ref.current;
    if (!maxUpscale || !el || typeof ResizeObserver === 'undefined') return undefined;
    const img = el.querySelector('.world-bg img');
    const measure = () => setCap(capFor(el, img, maxUpscale));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    img.addEventListener('load', measure);
    measure();
    return () => { ro.disconnect(); img.removeEventListener('load', measure); };
  }, [maxUpscale]);
  return [ref, cap, live];
}

function Plate({ src, alt, focusX = 50, camera: shot, reduced, atmosphere, overlay, coupled = false, mirror = false, maxUpscale, children }) {
  const [ref, cap, live] = useUpscaleCap(maxUpscale);
  const camera = shot.s > cap ? { ...shot, s: cap } : shot;
  const still = reduced || !live;
  return (
    <div className="world" ref={ref}>
      <div className="world-layer world-bg" style={layerStyle(camera, 0.9, still, 4, coupled)}>
        <img src={src} alt={alt} draggable="false" style={{ objectPosition: focusX + '% 62%', transform: mirror ? 'scaleX(-1)' : undefined }}/>
      </div>
      {atmosphere}
      <div className="world-layer world-subjects" style={layerStyle(camera, 1, still)}>
        {children}
      </div>
      {overlay}
    </div>
  );
}

export { Plate, useStageLayout };
