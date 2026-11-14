import React from 'react';
import { biomeFor } from './IslandArt';

interface Props { nodeCount: number; width: number; height: number; top: number; step: number }

const Ship = () => (
  <svg width="86" height="70" viewBox="0 0 86 70"><path d="M8 48 H78 L68 62 H18 Z" fill="#92400e" /><rect x="40" y="10" width="3" height="38" fill="#78350f" />
    <path d="M43 12 L72 40 H43 Z" fill="#fff" stroke="#e2e8f0" /><path d="M40 16 L16 40 H40 Z" fill="#fde68a" /><path d="M43 10 L55 14 L43 18 Z" fill="#ef4444" /></svg>
);
const Whale = () => (
  <svg width="110" height="64" viewBox="0 0 110 64"><g className="hsv-anim-spout" style={{ transformBox: 'fill-box' }}><path d="M62 22 Q58 4 52 2 M62 22 Q66 4 74 4" stroke="#bae6fd" strokeWidth="4" fill="none" strokeLinecap="round" /></g>
    <path d="M8 44 Q20 22 56 26 Q92 30 100 46 Q70 62 8 44 Z" fill="#3b82f6" /><path d="M8 44 Q2 34 4 26 Q14 30 14 40 Z" fill="#2563eb" /><path d="M30 50 Q60 58 92 46 Q70 62 30 50 Z" fill="#dbeafe" /><circle cx="86" cy="38" r="2.4" fill="#0f172a" /></svg>
);
const Gull = () => (
  <svg width="34" height="18" viewBox="0 0 34 18" className="hsv-anim-flap" style={{ transformOrigin: 'center' }}><path d="M1 12 Q9 0 17 11 Q25 0 33 12" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
);
const Dolphin = () => (
  <svg width="54" height="34" viewBox="0 0 54 34"><path d="M2 26 Q14 2 34 8 Q46 12 52 4 Q50 20 38 24 Q18 34 2 26 Z" fill="#38bdf8" /><path d="M20 12 L26 2 L28 12 Z" fill="#0ea5e9" /><circle cx="40" cy="12" r="1.6" fill="#0f172a" /></svg>
);
const Balloon = () => (
  <svg width="54" height="76" viewBox="0 0 54 76"><ellipse cx="27" cy="24" rx="22" ry="24" fill="#f43f5e" /><path d="M27 0 Q12 24 27 48 Q42 24 27 0Z" fill="#fbbf24" opacity=".85" /><path d="M16 44 L22 60 M38 44 L32 60" stroke="#78350f" strokeWidth="1.5" /><rect x="21" y="60" width="12" height="9" rx="2" fill="#92400e" /></svg>
);
const Lighthouse = () => (
  <svg width="64" height="100" viewBox="0 0 64 100"><g className="hsv-anim-beam" style={{ transformOrigin: '32px 24px' }}><path d="M32 24 L-40 12 L-40 36 Z" fill="#fef08a" opacity=".55" /></g>
    <path d="M22 96 L26 30 H38 L42 96 Z" fill="#f8fafc" stroke="#cbd5e1" /><rect x="24" y="48" width="16" height="9" fill="#ef4444" /><rect x="24" y="68" width="16" height="9" fill="#ef4444" />
    <rect x="24" y="22" width="16" height="10" fill="#fde047" /><path d="M20 22 L32 8 L44 22 Z" fill="#dc2626" /></svg>
);
const Rainbow = () => (
  <svg width="200" height="100" viewBox="0 0 200 100" opacity=".7">{['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'].map((c, i) => <path key={c} d={`M${10 + i * 6} 100 A${90 - i * 6} ${90 - i * 6} 0 0 1 ${190 - i * 6} 100`} fill="none" stroke={c} strokeWidth="6" />)}</svg>
);

/** Per-region animated scenery: every biome band gets its own living details. */
export const MapCritters: React.FC<Props> = ({ nodeCount, width, height, top, step }) => {
  const bands = Math.max(1, Math.ceil(nodeCount / 4));
  const yOf = (i: number) => ((top + i * step) / height) * 100;
  const items: React.ReactNode[] = [];
  for (let b = 0; b < bands; b++) {
    const biome = biomeFor(b * 4).deco;
    const y0 = yOf(b * 4), y1 = yOf(Math.min(b * 4 + 3, nodeCount - 1));
    const mid = (y0 + y1) / 2;
    const k = (n: string) => `${n}-${b}`;
    // universal: a gull flock and a ship or whale
    items.push(<div key={k('gull')} className="absolute hsv-anim-drift" style={{ top: `${y0 + 1}%`, left: '-10%', ['--d' as string]: `${26 + b * 5}s`, animationDelay: `${-b * 7}s` }}><div className="flex gap-3 items-end"><Gull /><span className="mt-3"><Gull /></span><Gull /></div></div>);
    if (b % 2 === 0) items.push(<div key={k('ship')} className="absolute hsv-anim-drift" style={{ top: `${y1 - 2}%`, left: '-20%', ['--d' as string]: `${60 + b * 8}s`, animationDelay: `${-b * 11}s` }}><div className="hsv-anim-bob"><Ship /></div></div>);
    else items.push(<div key={k('whale')} className="absolute hsv-anim-bob" style={{ top: `${mid + 3}%`, right: '2%' }}><Whale /></div>);
    items.push(<div key={k('dol')} className="absolute hsv-anim-jump" style={{ top: `${y0 + 8}%`, right: '12%', animationDelay: `${-b * 2}s` }}><Dolphin /></div>);
    if (biome === 'tree') items.push(<div key={k('bal')} className="absolute hsv-anim-float" style={{ top: `${y0 + 1}%`, right: '6%', ['--d' as string]: '9s' }}><Balloon /></div>, <div key={k('lh')} className="absolute" style={{ top: `${mid - 3}%`, right: '1%' }}><Lighthouse /></div>);
    if (biome === 'mushroom') items.push(<div key={k('rb')} className="absolute" style={{ top: `${y0 - 1}%`, left: '25%' }}><Rainbow /></div>);
    if (biome === 'pine') items.push(
      <div key={k('snow')} className="absolute left-0 w-full overflow-hidden" style={{ top: `${y0 - 4}%`, height: `${y1 - y0 + 10}%` }}>
        {Array.from({ length: 22 }, (_, i) => (
          <span key={i} className="absolute rounded-full bg-white hsv-anim-fall" style={{ top: 0, left: `${(i * 61 + 7) % 96}%`, width: 5 + (i % 3) * 2, height: 5 + (i % 3) * 2, ['--d' as string]: `${5 + (i % 5)}s`, animationDelay: `${-i * 0.8}s` }} />
        ))}
      </div>
    );
    if (biome === 'rocks') items.push(...Array.from({ length: 10 }, (_, i) => (
      <span key={`${k('em')}${i}`} className="absolute w-2.5 h-2.5 rounded-full bg-orange-500 hsv-anim-rise" style={{ top: `${mid + (i % 4) * 3}%`, left: `${(i * 37 + 11) % 90}%`, ['--d' as string]: `${2.5 + (i % 4)}s`, animationDelay: `${-i * 0.5}s`, boxShadow: '0 0 8px #fb923c' }} />
    )));
    if (biome === 'tree' || biome === 'palm') items.push(...Array.from({ length: 8 }, (_, i) => (
      <span key={`${k('ff')}${i}`} className="absolute w-1.5 h-1.5 rounded-full bg-yellow-200 hsv-anim-twinkle" style={{ top: `${y0 + (i % 5) * 4}%`, left: `${(i * 43 + 5) % 92}%`, animationDelay: `${-i * 0.5}s`, boxShadow: '0 0 6px #fde047' }} />
    )));
  }
  return <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: '100%' }} aria-hidden data-w={width}>{items}</div>;
};
