import React from 'react';

/* ════════ scenes/props.jsx — small drawn props for Scenes 03–04 ════════
   There is no supplied artwork for these everyday things, so they are drawn in
   the same flat style as the earlier Apple / Pencil / Book / Toy props.
   (The apple and pencil are the ones Scene 04 has always used.) */

const Apple = () => (
  <svg viewBox="0 0 64 70">
    <path d="M32 16c9-8 24-4 26 9 2 14-8 40-18 42-4 1-6-2-8-2s-4 3-8 2C14 65 4 39 6 25 8 12 23 8 32 16z" fill="#E03B33"/>
    <path d="M32 16c-6-5-14-5-19 0 6-2 13 0 19 5z" fill="#F4685F" opacity=".7"/>
    <path d="M32 16c0-7 2-11 6-14" stroke="#7A4A22" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M36 6c7-5 14-3 15 3-6 5-12 4-15-3z" fill="#3E9440"/>
  </svg>
);

const Pencil = () => (
  <svg viewBox="0 0 70 70">
    <g transform="rotate(-38 35 35)">
      <rect x="28" y="6" width="14" height="44" fill="#F5B82E"/>
      <rect x="28" y="6" width="5" height="44" fill="#FFD264"/>
      <path d="M28 50h14l-7 13z" fill="#E8C79A"/>
      <path d="M31 58h8l-4 5z" fill="#33302C"/>
      <rect x="28" y="0" width="14" height="7" fill="#E0665F"/>
      <rect x="28" y="6" width="14" height="3" fill="#9AA3AC"/>
    </g>
  </svg>
);

/* a steel tiffin carrier: three stacked tins and a carry handle */
const Tiffin = () => (
  <svg viewBox="0 0 64 70">
    <path d="M18 14V8a14 6 0 0 1 28 0v6" fill="none" stroke="#7E8791" strokeWidth="4" strokeLinecap="round"/>
    {[0, 1, 2].map(k => (
      <g key={k} transform={'translate(0 ' + (14 + k * 17) + ')'}>
        <rect x="12" y="0" width="40" height="16" rx="3" fill={k % 2 ? '#B9C2CB' : '#CDD5DC'}/>
        <rect x="12" y="0" width="40" height="3" rx="1.5" fill="#E9EEF2"/>
        <rect x="12" y="13" width="40" height="3" fill="#8E98A2"/>
      </g>
    ))}
    <rect x="9" y="14" width="4" height="49" rx="2" fill="#7E8791"/>
    <rect x="51" y="14" width="4" height="49" rx="2" fill="#7E8791"/>
  </svg>
);

/* a sheet of star stickers */
const Stickers = () => (
  <svg viewBox="0 0 64 70">
    <rect x="8" y="8" width="48" height="56" rx="4" fill="#FCF6E6" stroke="#C9B78C" strokeWidth="2"/>
    {[[21, 22, '#F5B82E'], [43, 22, '#E0665F'], [21, 48, '#3E9440'], [43, 48, '#2F6FB5']].map(([x, y, c], k) => (
      <path key={k} fill={c}
        d={'M' + x + ' ' + (y - 9) + 'l2.6 6 6.4.6-4.9 4.2 1.5 6.3L' + x + ' ' + (y + 5.6) + 'l-5.6 3.5 1.5-6.3-4.9-4.2 6.4-.6z'}/>
    ))}
  </svg>
);

/* an eraser: a pink block with a blue sleeve */
const Eraser = () => (
  <svg viewBox="0 0 64 70">
    <g transform="rotate(-14 32 40)">
      <rect x="8" y="26" width="48" height="24" rx="4" fill="#F2A7B5"/>
      <rect x="8" y="26" width="48" height="6" rx="3" fill="#F8C8D1"/>
      <rect x="28" y="24" width="28" height="28" rx="3" fill="#2F6FB5"/>
      <rect x="28" y="24" width="28" height="6" rx="3" fill="#4F8FD4"/>
    </g>
  </svg>
);

export { Apple, Eraser, Pencil, Stickers, Tiffin };
