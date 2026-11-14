import React from 'react';

export interface Biome { name: string; sea: [string, string]; land: string; landDark: string; sand: string; deco: 'tree' | 'palm' | 'mushroom' | 'pine' | 'rocks' }

/** Five themed regions the map travels through (every 4 islands). */
export const BIOMES: Biome[] = [
  { name: 'Đồng Cỏ Xanh', sea: ['#7dd3fc', '#38bdf8'], land: '#4ade80', landDark: '#16a34a', sand: '#fde68a', deco: 'tree' },
  { name: 'Bãi Biển Vàng', sea: ['#67e8f9', '#22d3ee'], land: '#fcd34d', landDark: '#f59e0b', sand: '#fef3c7', deco: 'palm' },
  { name: 'Xứ Kẹo Ngọt', sea: ['#fbcfe8', '#f9a8d4'], land: '#f9a8d4', landDark: '#ec4899', sand: '#fff1f2', deco: 'mushroom' },
  { name: 'Núi Tuyết', sea: ['#bfdbfe', '#93c5fd'], land: '#f1f5f9', landDark: '#94a3b8', sand: '#ffffff', deco: 'pine' },
  { name: 'Đảo Lửa', sea: ['#fdba74', '#fb923c'], land: '#a8a29e', landDark: '#57534e', sand: '#fed7aa', deco: 'rocks' }
];
export const biomeFor = (index: number): Biome => BIOMES[Math.floor(index / 4) % BIOMES.length];

const Deco: React.FC<{ type: Biome['deco']; dark: string }> = ({ type, dark }) => {
  switch (type) {
    case 'tree': return (<g><rect x="47" y="44" width="6" height="16" rx="2" fill="#92400e" /><circle cx="50" cy="38" r="15" fill="#22c55e" /><circle cx="43" cy="42" r="9" fill="#4ade80" /><circle cx="58" cy="36" r="8" fill="#16a34a" opacity=".6" /></g>);
    case 'palm': return (<g><path d="M50 62 Q47 46 52 34" stroke="#92400e" strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M52 34 Q38 28 30 38 M52 34 Q62 24 74 32 M52 34 Q50 20 40 18 M52 34 Q66 36 72 46" stroke="#16a34a" strokeWidth="6" fill="none" strokeLinecap="round" /><circle cx="50" cy="36" r="3" fill="#92400e" /></g>);
    case 'mushroom': return (<g><rect x="46" y="48" width="8" height="14" rx="3" fill="#fff" /><path d="M32 50 Q50 24 68 50 Z" fill="#ef4444" /><circle cx="44" cy="42" r="3" fill="#fff" /><circle cx="56" cy="44" r="2.5" fill="#fff" /><circle cx="50" cy="36" r="2" fill="#fff" /></g>);
    case 'pine': return (<g><rect x="48" y="52" width="5" height="10" fill="#78350f" /><path d="M50 22 L66 46 L34 46 Z" fill="#16a34a" /><path d="M50 34 L70 56 L30 56 Z" fill="#15803d" /><path d="M50 22 L56 31 L44 31 Z" fill="#fff" /></g>);
    default: return (<g><path d="M30 62 L40 40 L52 62 Z" fill={dark} /><path d="M46 62 L58 34 L72 62 Z" fill="#78716c" /><path d="M58 34 L62 44 L54 44 Z" fill="#ef4444" /><circle cx="60" cy="28" r="3" fill="#fb923c" opacity=".8" /></g>);
  }
};

interface Props { biome: Biome; kind: 'normal' | 'mini_boss' | 'boss'; locked: boolean; cleared: boolean; className?: string }

/** Illustrated island: foam ring, sand, grass and a themed decoration (castle for boss, chest for mini-boss). */
export const IslandArt: React.FC<Props> = ({ biome, kind, locked, cleared, className }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden style={locked ? { filter: 'grayscale(1) brightness(1.05)' } : undefined}>
    <ellipse cx="50" cy="78" rx="46" ry="15" fill="#fff" opacity=".55" />
    <ellipse cx="50" cy="73" rx="41" ry="16" fill={biome.sand} />
    <ellipse cx="50" cy="68" rx="37" ry="14" fill={biome.land} />
    <ellipse cx="50" cy="72" rx="37" ry="10" fill={biome.landDark} opacity=".25" />
    {kind === 'boss' ? (
      <g>
        <rect x="30" y="38" width="40" height="26" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
        <rect x="26" y="28" width="14" height="36" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" /><path d="M24 28 L33 14 L42 28 Z" fill="#ef4444" />
        <rect x="60" y="28" width="14" height="36" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" /><path d="M58 28 L67 14 L76 28 Z" fill="#ef4444" />
        <path d="M43 64 L43 52 Q50 44 57 52 L57 64 Z" fill="#78350f" />
        <path d="M50 38 L50 22" stroke="#78350f" strokeWidth="2" /><path d="M50 22 L62 27 L50 32 Z" fill="#dc2626" />
      </g>
    ) : kind === 'mini_boss' ? (
      <g>
        <rect x="34" y="44" width="32" height="20" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        <path d="M34 48 Q50 28 66 48 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
        <rect x="46" y="46" width="8" height="9" rx="2" fill="#fde047" stroke="#78350f" strokeWidth="1" />
        <circle cx="76" cy="40" r="2.5" fill="#fde047" /><circle cx="24" cy="36" r="2" fill="#fde047" />
      </g>
    ) : (<Deco type={biome.deco} dark={biome.landDark} />)}
    {cleared && kind === 'normal' && (<g><path d="M70 62 L70 40" stroke="#78350f" strokeWidth="2.5" /><path d="M70 40 L84 45 L70 51 Z" fill="#22c55e" /></g>)}
  </svg>
);
