import React from 'react';
import { biomeFor } from './IslandArt';

interface Props { nodeCount: number; width: number; height: number; top: number; step: number }

/** Animated backdrop: biome-coloured sea bands, drifting waves, clouds, birds and sparkles. */
export const MapScenery: React.FC<Props> = ({ nodeCount, width, height, top, step }) => {
  const pct = (i: number) => (((top + i * step) / height) * 100).toFixed(1);
  const stops: string[] = [];
  const bands = Math.max(1, Math.ceil(nodeCount / 4));
  for (let b = 0; b < bands; b++) {
    const c = biomeFor(b * 4).sea;
    const from = b === 0 ? 0 : Number(pct(b * 4 - 2));
    const to = b === bands - 1 ? 100 : Number(pct(b * 4 + 2));
    stops.push(`${c[0]} ${from}%`, `${c[1]} ${to}%`);
  }
  const rows = Math.floor(height / 110);
  const clouds = Array.from({ length: Math.max(3, Math.floor(height / 420)) }, (_, i) => ({
    top: ((i * 37 + 11) % 86) + 4, left: (i * 53) % 80, scale: 0.7 + ((i * 7) % 5) / 6, dur: 40 + (i % 4) * 14, delay: -i * 9
  }));
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <style>{`
        @keyframes hsv-wave{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes hsv-drift{0%{transform:translateX(-30%)}100%{transform:translateX(130%)}}
        @keyframes hsv-hop{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes hsv-twinkle{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.1)}}
        @keyframes hsv-pop{0%{transform:scale(0) rotate(-40deg)}70%{transform:scale(1.35) rotate(8deg)}100%{transform:scale(1) rotate(0)}}
        @keyframes hsv-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
        .hsv-anim-wave{animation:hsv-wave 14s linear infinite}
        .hsv-anim-drift{animation:hsv-drift var(--d,50s) linear infinite}
        .hsv-anim-hop{animation:hsv-hop 1s ease-in-out infinite}
        .hsv-anim-twinkle{animation:hsv-twinkle 2.4s ease-in-out infinite}
        .hsv-anim-pop{animation:hsv-pop .6s cubic-bezier(.2,1.4,.4,1) both}
        .hsv-anim-bob{animation:hsv-bob 3s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){.hsv-anim-wave,.hsv-anim-drift,.hsv-anim-hop,.hsv-anim-twinkle,.hsv-anim-pop,.hsv-anim-bob{animation:none}}
      `}</style>
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${stops.join(', ')})` }} />
      {Array.from({ length: rows }, (_, r) => (
        <svg key={r} className="absolute left-0 w-[200%] hsv-anim-wave" style={{ top: `${(r / rows) * 100 + 3}%`, animationDuration: `${12 + (r % 3) * 4}s`, animationDirection: r % 2 ? 'reverse' : 'normal' }} viewBox="0 0 1200 24" height="24" preserveAspectRatio="none">
          <path d="M0 12 Q25 0 50 12 T100 12 T150 12 T200 12 T250 12 T300 12 T350 12 T400 12 T450 12 T500 12 T550 12 T600 12 T650 12 T700 12 T750 12 T800 12 T850 12 T900 12 T950 12 T1000 12 T1050 12 T1100 12 T1150 12 T1200 12" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ))}
      {clouds.map((c, i) => (
        <div key={i} className="absolute hsv-anim-drift" style={{ top: `${c.top}%`, left: `${c.left - 40}%`, ['--d' as string]: `${c.dur}s`, animationDelay: `${c.delay}s`, transform: `scale(${c.scale})` }}>
          <svg width="120" height="50" viewBox="0 0 120 50"><g fill="#fff" opacity=".85"><ellipse cx="40" cy="32" rx="30" ry="16" /><ellipse cx="68" cy="26" rx="26" ry="18" /><ellipse cx="92" cy="34" rx="22" ry="12" /></g></svg>
        </div>
      ))}
      {Array.from({ length: Math.floor(height / 140) }, (_, i) => (
        <span key={i} className="absolute hsv-anim-twinkle text-white text-lg" style={{ top: `${(i * 29 + 7) % 94}%`, left: `${(i * 47 + 13) % 92}%`, animationDelay: `${-i * 0.7}s` }}>✦</span>
      ))}
      <div className="absolute top-3 right-4 text-4xl hsv-anim-bob" style={{ width }}>
        <span className="absolute right-0">☀️</span>
      </div>
    </div>
  );
};
